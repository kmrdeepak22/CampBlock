package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Result struct {
	CourseID string `json:"courseID"`
	Grade    string `json:"grade"`
}

var sgpaMapping = make(map[string]map[string]float64)

// AddResultForCurrentSemester allows a faculty member to add results for courses in the current semester
func (s *StudentRecordContract) AddResultForCurrentSemester(ctx contractapi.TransactionContextInterface, studentID string, resultsToAddjson string) error {

	var resultsToAdd []Result
	if err := json.Unmarshal([]byte(resultsToAddjson), &resultsToAdd); err != nil {
		return fmt.Errorf("unmarhsal error")
	}

	// Check if the caller is authorized (admin or faculty)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) && !s.isFaculty(ctx, caller) {
		return fmt.Errorf("Unauthorized: Only admin or faculty can add results")
	}

	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Check if the current semester exists in the enrollment
	currentSemester := existingEnrollment.CurrentSemester
	if currentSemester == "" {
		return fmt.Errorf("Current semester not found for student %s", studentID)
	}

	// Check if results for the same course already exist throughout all semesters till the current semester
	for _, result := range resultsToAdd {
		courseID := result.CourseID

		// Check if the course already exists in the previous semester results
		for semester, semesterResults := range existingEnrollment.SemesterResults {
			for _, previousResult := range semesterResults {
				if previousResult.CourseID == courseID {
					return fmt.Errorf("Result for course %s already exists in a previous semester: %s", courseID, semester)
				}
			}

			if semester == currentSemester {
				break // Stop checking once we reach the current semester
			}
		}
	}

	// Validate and add results for courses in the current semester
	totalCredits := 0
	for _, result := range resultsToAdd {
		courseID := result.CourseID

		// Check if the course is part of any previous semester's courses taken
		courseFound := false
		for semester, courses := range existingEnrollment.CoursesTaken {
			for _, course := range courses {
				if course == courseID {
					courseFound = true
					break
				}
			}
			if courseFound {
				break
			}
			if semester == currentSemester {
				break
			}
		}

		if !courseFound {
			return fmt.Errorf("Course %s is not part of any previous semester's courses taken", courseID)
		}

		// Add the result to the current semester
		existingEnrollment.SemesterResults[currentSemester] = append(existingEnrollment.SemesterResults[currentSemester], result)

		// Fetch the credits of the course
		course, err := s.GetCourse(ctx, courseID)
		if err != nil {
			return fmt.Errorf("Error fetching course %s: %s", courseID, err.Error())
		}

		// // Accumulate the credits
		// totalCredits += course.Credits
		// Accumulate the credits only if the grade is not "F"
		if result.Grade != "F" {
			totalCredits += course.Credits
		}
	}

	// Update the creditsCompleted with the total credits accumulated
	existingEnrollment.CreditsCompleted += totalCredits

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment
	// Update the enrollment in the ledger
	enrollmentJSON, _ := json.Marshal(existingEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Added results for current semester for student %s", studentID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// UpdateGradeForCourse updates the grade for a specific course in the current semester,
func (s *StudentRecordContract) UpdateGradeForCourse(ctx contractapi.TransactionContextInterface, studentID string, courseID string, newGrade string) error {
	// Get the student's enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Check if the current semester exists
	currentSemester := existingEnrollment.CurrentSemester
	if currentSemester == "" {
		return fmt.Errorf("Current semester not found for student %s", studentID)
	}

	// Check if the course has been taken in any previous semester and record the semester number
	courseTakenSemester := ""
	for semester, semesterResults := range existingEnrollment.SemesterResults {

		for _, result := range semesterResults {
			if result.CourseID == courseID {
				courseTakenSemester = semester
				break
			}
		}

		if courseTakenSemester != "" {
			break // Stop checking if the course is found in any previous semester
		}

		if semester == currentSemester {
			break // Stop checking once we reach the current semester
		}
	}

	if courseTakenSemester == "" {
		return fmt.Errorf("Course %s has not been taken in any previous semester", courseID)
	}

	// Update the grade for the specified course in the corresponding semester
	for index, result := range existingEnrollment.SemesterResults[courseTakenSemester] {
		if result.CourseID == courseID {
			existingEnrollment.SemesterResults[courseTakenSemester][index].Grade = newGrade
			break
		}
	}

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment
	// Update the enrollment in the ledger
	enrollmentJSON, err := json.Marshal(existingEnrollment)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	//it needs to be called after some time, otherwise might not really update the sgpa as the ledger state might not be updated by then
	//if grade is getting updated, recalculate sgpa and cgpa
	_, err1 := s.CalculateSGPA(ctx, studentID, courseTakenSemester)
	if err1 != nil {
		return err
	}
	_, err2 := s.CalculateCGPA(ctx, studentID)
	if err2 != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Updated grade for course %s in the current semester for student %s to %s", courseID, studentID, newGrade)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// query function
// CalculateSGPA calculates the SGPA for a specific semester
func (s *StudentRecordContract) CalculateSGPA(ctx contractapi.TransactionContextInterface, studentID string, semester string) (float64, error) {
	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return 0, err
	}

	// Check if the semester exists in the enrollment
	_, semesterExists := existingEnrollment.SemesterResults[semester]
	if !semesterExists {
		return 0, fmt.Errorf("Result of %s does not exist in the enrollment for student %s", semester, studentID)
	}

	// Calculate the SGPA for the semester
	totalGradePoints := 0.0
	totalCredits := 0

	// Helper function to calculate grade points based on grades
	calculateGradePoints := func(grade string) float64 {
		// Define grade points for different grades (customize as needed)
		gradePoints := map[string]float64{
			"S": 10.0,
			"A": 9.0,
			"B": 8.0,
			"C": 7.0,
			"D": 6.0,
			"E": 4.0,
			"F": 0.0,
		}

		grade = strings.ToUpper(grade)
		gradePoint, exists := gradePoints[grade]
		if !exists {
			// Invalid grade
			return 0.0
		}
		return gradePoint
	}

	// Calculate SGPA for the semester
	for _, result := range existingEnrollment.SemesterResults[semester] {
		// Get the course for the result
		course, err := s.GetCourse(ctx, result.CourseID)
		if err != nil {
			return 0, err
		}

		// Calculate grade points for the grade
		gradePoint := calculateGradePoints(result.Grade)

		// Calculate weighted grade points based on course credits
		weightedGradePoints := gradePoint * float64(course.Credits)

		// Update the total grade points and total credits
		totalGradePoints += weightedGradePoints
		totalCredits += course.Credits
	}

	// Calculate SGPA
	if totalCredits == 0 {
		return 0, nil // Avoid division by zero
	}
	sgpa := totalGradePoints / float64(totalCredits)

	// Format the SGPA with two digits after the floating point
	formattedSGPA := fmt.Sprintf("%.2f", sgpa)

	// Parse the formatted SGPA back to a float64
	parsedSGPA, _ := strconv.ParseFloat(formattedSGPA, 64)

	// Store the SGPA in the mapping
	if sgpaMapping == nil {
		sgpaMapping = make(map[string]map[string]float64)
	}
	if sgpaMapping[studentID] == nil {
		sgpaMapping[studentID] = make(map[string]float64)
	}
	sgpaMapping[studentID][semester] = parsedSGPA

	return parsedSGPA, nil
}

// query function
// CalculateCGPA calculates the CGPA for a student
func (s *StudentRecordContract) CalculateCGPA(ctx contractapi.TransactionContextInterface, studentID string) (float64, error) {
	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return 0, err
	}

	// Calculate CGPA based on SGPA values stored in the mapping
	if sgpaMapping == nil {
		return 0, fmt.Errorf("SGPA data not found for student %s", studentID)
	}

	totalSemesters := 0

	// Iterate through all the semesters
	totalGradePoints := 0.0
	totalCredits := 0

	// Helper function to calculate grade points based on grades
	calculateGradePoints := func(grade string) float64 {
		// Define grade points for different grades (customize as needed)
		gradePoints := map[string]float64{
			"S": 10.0,
			"A": 9.0,
			"B": 8.0,
			"C": 7.0,
			"D": 6.0,
			"E": 4.0,
			"F": 0.0,
		}

		grade = strings.ToUpper(grade)
		gradePoint, exists := gradePoints[grade]
		if !exists {
			// Invalid grade
			return 0.0
		}
		return gradePoint
	}

	// Check if the current semester exists
	currentSemester := existingEnrollment.CurrentSemester
	if currentSemester == "" {
		return 0.0, fmt.Errorf("Current semester not found for student %s", studentID)
	}

	// Iterate through previous semester and record the totalGradePoints and totalCredits
	for semester, semesterResults := range existingEnrollment.SemesterResults {

		for _, result := range semesterResults {
			// Get the course for the result
			course, err := s.GetCourse(ctx, result.CourseID)
			if err != nil {
				return 0, err
			}

			// Calculate grade points for the grade
			gradePoint := calculateGradePoints(result.Grade)

			// Calculate weighted grade points based on course credits
			weightedGradePoints := gradePoint * float64(course.Credits)

			// Update the total grade points and total credits
			totalGradePoints += weightedGradePoints
			totalCredits += course.Credits
		}

		totalSemesters++

		if semester == currentSemester {
			break // Stop checking once we reach the current semester
		}
	}

	cgpa := totalGradePoints / float64(totalCredits)

	// Calculate CGPA
	if totalSemesters == 0 {
		return 0, nil // Avoid division by zero
	}

	// Format the CGPA with two digits after the floating point
	formattedCGPA := fmt.Sprintf("%.2f", cgpa)

	// Parse the formatted CGPA back to a float64
	parsedCGPA, _ := strconv.ParseFloat(formattedCGPA, 64)

	return parsedCGPA, nil
}

// QuerySGPAMapping retrieves the SGPA mapping for a student
func (s *StudentRecordContract) GetSGPA(ctx contractapi.TransactionContextInterface, studentID string) (map[string]float64, error) {
	sgpaMapping, exists := sgpaMapping[studentID]
	if !exists {
		return nil, fmt.Errorf("SGPA data not found for student %s", studentID)
	}
	return sgpaMapping, nil
}

// GetResultForCourse retrieves the result (grade) for a specific course in all semesters up to the current semester for a student
func (s *StudentRecordContract) GetResultForCourse(ctx contractapi.TransactionContextInterface, studentID string, courseID string) (map[string]string, error) {
	// Check if the student's enrollment record exists
	enrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return nil, err
	}

	results := make(map[string]string)

	// Iterate through all semesters in the enrollment record
	for semester, semesterResults := range enrollment.SemesterResults {
		// Check if the course result exists for the specified course in the current semester
		for _, result := range semesterResults {
			if result.CourseID == courseID {
				// Add the result to the map with the semester as the key
				results[semester] = result.Grade
			}
		}
	}

	return results, nil
}

// GetResultForSemester retrieves the results (grades) for all courses taken by a student in a specific semester
func (s *StudentRecordContract) GetResultForSemester(ctx contractapi.TransactionContextInterface, studentID string, semester string) ([]Result, error) {
	// Check if the student's enrollment record exists
	enrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return nil, err
	}

	// Check if the specified semester exists in the enrollment record
	_, semesterExists := enrollment.SemesterResults[semester]
	if !semesterExists {
		return nil, fmt.Errorf("semester %s does not exist for student %s", semester, studentID)
	}

	return enrollment.SemesterResults[semester], nil
}

// GetResultsForAllSemesters retrieves the results (grades) for all courses taken by a student in all semesters up to the current semester
func (s *StudentRecordContract) GetResultsForAllSemesters(ctx contractapi.TransactionContextInterface, studentID string) (map[string][]Result, error) {
	// Check if the student's enrollment record exists
	enrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return nil, err
	}

	return enrollment.SemesterResults, nil
}
