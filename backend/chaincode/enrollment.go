package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Enrollment represents details required during initial enrollment
type Enrollment struct {
	StudentID           string              `json:"studentID"`
	Name                string              `json:"name"`
	ProgramType         string              `json:"programType"`
	DepartmentID        string              `json:"department"`
	CreditsCompleted    int                 `json:"creditsCompleted"`
	CreditsThisSemester int                 `json:"creditsThisSemester"`
	CurrentSemester     string              `json:"currentSemester"` // Current semester for the student
	SemesterResults     map[string][]Result `json:"semesterResults"` // Map of sem to list of Result
	CoursesTaken        map[string][]string `json:"coursesTaken"`    // Map of semester to list of course IDs
	Extracurricular     []string            `json:"extracurricular"` // List of extracurricular activity IDs
	Certificates        []Certificate       `json:"certificates"`    // List of certificates associated with the enrollment
}

var enrollmentMapping = make(map[string]Enrollment)

// InitialEnrollment enrolls a new student into the first semester with basic details
func (s *StudentRecordContract) InitialEnrollment(ctx contractapi.TransactionContextInterface, studentID string, name string, programType string, departmentID string) error {
	// Check if the student already exists
	_, err := s.GetStudent(ctx, studentID)
	if err == nil {
		return fmt.Errorf("Student with ID %s already exists", studentID)
	}

	// Check if the departmentID is valid
	_, departmentExists := departmentMapping[departmentID]
	if !departmentExists {
		return fmt.Errorf("Department ID %s is not valid", departmentID)
	}

	// Check if the program type is valid
	program, programExists := programMapping[programType]
	if !programExists {
		return fmt.Errorf("Invalid program type: %s", programType)
	}
	maxSemesters := program.MaxSemesters

	// Create a new student record with basic details
	student := Student{
		StudentID:    studentID,
		StudentName:  name,
		ProgramType:  programType,
		DepartmentID: departmentID,
		MaxSemesters: maxSemesters,
	}

	// Store the student record in the ledger
	studentJSON, _ := json.Marshal(student)
	err = ctx.GetStub().PutState(fmt.Sprintf("STUDENT-%s", studentID), studentJSON)
	if err != nil {
		return err
	}
	// Enroll the student into the first semester with empty courses and results
	initialSemester := "Semester1"
	initialEnrollment := Enrollment{
		StudentID:           studentID,
		Name:                name,
		ProgramType:         programType,
		DepartmentID:        departmentID,
		CreditsCompleted:    0,
		CreditsThisSemester: 0,
		CurrentSemester:     initialSemester,
		SemesterResults:     make(map[string][]Result),
		CoursesTaken:        make(map[string][]string),
		Extracurricular:     []string{}, // Initialize extracurricular activities as an empty list
		Certificates:        []Certificate{},
	}

	// Update the student mapping
	studentMapping[studentID] = student

	// Update the enrollment mapping
	enrollmentMapping[studentID] = initialEnrollment

	// Store the initial enrollment in the ledger
	initialEnrollmentJSON, _ := json.Marshal(initialEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), initialEnrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Enrolled student %s into %s", studentID, initialSemester)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// EnrollStudentIntoNextSemester enrolls a student into the next semester
func (s *StudentRecordContract) EnrollStudentIntoNextSemester(ctx contractapi.TransactionContextInterface, studentID string) error {
	// Check if the student exists
	_, err := s.GetStudent(ctx, studentID)
	if err != nil {
		return err
	}

	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Validate if results are present for all courses in the current semester
	currentSemester := existingEnrollment.CurrentSemester
	if currentSemester == "" {
		return fmt.Errorf("Current semester not found for student %s", studentID)
	}

	// Check if creditsThis semester is at least equal to min credit required per semester
	minCreditsRequired, _ := s.GetProgramMinCreditsPerSemester(existingEnrollment.ProgramType)
	if existingEnrollment.CreditsThisSemester < minCreditsRequired {
		return fmt.Errorf("Credits for this semester are less than the minimum required, Can't enroll in next semester.")
	}
	// Check if results are present for all courses in the current semester
	currentSemesterCourses := existingEnrollment.CoursesTaken[currentSemester]
	currentSemesterResults := existingEnrollment.SemesterResults[currentSemester]

	if len(currentSemesterCourses) != len(currentSemesterResults) {
		return fmt.Errorf("Results are missing for courses in current semester for student %s", studentID)
	}

	// Check if current semester courses list is emptys
	currentSemesterCourses, ok := existingEnrollment.CoursesTaken[currentSemester]
	if !ok || len(currentSemesterCourses) == 0 {
		return fmt.Errorf("current semester courses list is empty for student %s", studentID)
	}

	program, _ := programMapping[existingEnrollment.ProgramType]
	// Check if the student has reached the maximum allowed semesters
	if existingEnrollment.CurrentSemester == fmt.Sprintf("Semester%d", program.MaxSemesters) {
		return fmt.Errorf("Student %s has reached the maximum allowed semesters", studentID)
	}

	// Increment the current semester
	currentSemesterNumber := extractSemesterNumber(existingEnrollment.CurrentSemester)
	nextSemesterNumber := currentSemesterNumber + 1
	nextSemester := fmt.Sprintf("Semester%d", nextSemesterNumber)

	// Create an enrollment for the next semester with empty courses and results
	nextEnrollment := Enrollment{
		StudentID:           studentID,
		Name:                existingEnrollment.Name,
		ProgramType:         existingEnrollment.ProgramType,
		DepartmentID:        existingEnrollment.DepartmentID,
		CreditsCompleted:    existingEnrollment.CreditsCompleted,
		CreditsThisSemester: 0,
		CurrentSemester:     nextSemester,
		SemesterResults:     existingEnrollment.SemesterResults,
		CoursesTaken:        existingEnrollment.CoursesTaken,
		Extracurricular:     existingEnrollment.Extracurricular, // Retain extracurricular activities from existing enrollment
		Certificates:        existingEnrollment.Certificates,
	}

	// Update the enrollment mapping
	enrollmentMapping[studentID] = nextEnrollment

	// Store the updated enrollment in the ledger
	nextEnrollmentJSON, _ := json.Marshal(nextEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), nextEnrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Enrolled student %s into %s", studentID, nextSemester)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// Helper function to extract the semester number from the semester name
func extractSemesterNumber(semester string) int {
	var semesterNumber int
	_, err := fmt.Sscanf(semester, "Semester%d", &semesterNumber)
	if err != nil {
		return 0
	}
	return semesterNumber
}

// GetEnrollment retrieves a student's enrollment by their ID from the ledger
func (s *StudentRecordContract) GetEnrollment(ctx contractapi.TransactionContextInterface, studentID string) (Enrollment, error) {
	enrollmentJSON, err := ctx.GetStub().GetState(fmt.Sprintf("ENROLLMENT-%s", studentID))
	if err != nil {
		return Enrollment{}, fmt.Errorf("Failed to read enrollment for student with ID %s: %v", studentID, err)
	}
	if enrollmentJSON == nil {
		return Enrollment{}, fmt.Errorf("Enrollment for student with ID %s does not exist", studentID)
	}

	var enrollment Enrollment
	err = json.Unmarshal(enrollmentJSON, &enrollment)
	if err != nil {
		return Enrollment{}, err
	}

	return enrollment, nil
}

// GetAllEnrollment retrieves all the enrollments so far from the ledger
func (s *StudentRecordContract) GetAllEnrollments(ctx contractapi.TransactionContextInterface) ([]Enrollment, error) {
	enrollments := make([]Enrollment, 0)

	for _, enrollment := range enrollmentMapping {
		enrollments = append(enrollments, enrollment)
	}

	return enrollments, nil
}
