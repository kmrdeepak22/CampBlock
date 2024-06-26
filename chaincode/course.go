package main

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Course represent all the information related to a course
type Course struct {
	CourseID     string `json:"courseID"`
	CourseName   string `json:"name"`
	Credits      int    `json:"credits"`
	DepartmentID string `json:"department"`
	FacultyID    string `json:"facultyID"`
	Description  string `json:"description"`
	AcademicYear int    `json:"academicYear"`
	Semester     int    `json:"semester"`
}

var courseMapping = make(map[string]Course)

// AddCoursesToCurrentSemester adds courses to the current semester's enrollment
func (s *StudentRecordContract) AddCoursesToCurrentSemester(ctx contractapi.TransactionContextInterface, studentID string, coursesToAddjson string) error {

	var coursesToAdd []string
	if err := json.Unmarshal([]byte(coursesToAddjson), &coursesToAdd); err != nil {
		return fmt.Errorf("unmarhsal error")
	}

	// Check if the caller is authorized (admin and faculty)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) && !s.isFaculty(ctx, caller) {
		return fmt.Errorf("Unauthorized: courses can only be added upon approval of admin and faculty both")
	}

	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Check if the current semester exists in the enrollment
	currentSemester := existingEnrollment.CurrentSemester

	// Check if the coursesToAdd already exist in any of the previous semesters
	for semester, coursesTaken := range existingEnrollment.CoursesTaken {
		if semester != currentSemester {
			for _, course := range coursesToAdd {
				if contains(coursesTaken, course) {
					return fmt.Errorf("Course %s has already been taken in semester %s", course, semester)
				}
			}
		}
	}

	// Check if the coursesToAdd already exist in the current semester's course list
	existingCourses := existingEnrollment.CoursesTaken[currentSemester]
	for _, course := range coursesToAdd {
		if contains(existingCourses, course) {
			return fmt.Errorf("Course %s is already in the current semester's course list", course)
		}
	}

	// Calculate the total credits for the courses to add
	totalCreditsToAdd := 0
	for _, courseID := range coursesToAdd {
		course, err := s.GetCourse(ctx, courseID)
		if err != nil {
			return err
		}
		totalCreditsToAdd += course.Credits
	}

	// Check if the total credits exceed the maximum allowed credits per semester
	maxCreditsPerSemester, err := s.GetProgramMaxCreditsPerSemester(existingEnrollment.ProgramType)
	if err != nil {
		return err
	}
	if existingEnrollment.CreditsThisSemester+totalCreditsToAdd > maxCreditsPerSemester {
		return fmt.Errorf("Total credits (%d) exceed the maximum allowed credits per semester (%d)", existingEnrollment.CreditsThisSemester+totalCreditsToAdd, maxCreditsPerSemester)
	}
	// Add the courses to the current semester's enrollment
	existingEnrollment.CoursesTaken[currentSemester] = append(existingEnrollment.CoursesTaken[currentSemester], coursesToAdd...)

	// Update the CreditsThisSemester with the totalCreditsToAdd
	existingEnrollment.CreditsThisSemester += totalCreditsToAdd

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment

	// Update the enrollment in the ledger
	enrollmentJSON, _ := json.Marshal(existingEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Added courses to current semester for student %s: %s", studentID, strings.Join(coursesToAdd, ", "))
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// DropCoursesFromCurrentSemester allows a student to drop courses from the current semester
func (s *StudentRecordContract) DropCoursesFromCurrentSemester(ctx contractapi.TransactionContextInterface, studentID string, coursesToDropjson string) error {

	var coursesToDrop []string
	if err := json.Unmarshal([]byte(coursesToDropjson), &coursesToDrop); err != nil {
		return fmt.Errorf("unmarhsal error")
	}

	// Check if the caller is authorized (admin and faculty)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) && !s.isFaculty(ctx, caller) {
		return fmt.Errorf("Unauthorized: courses can only be added upon approval of admin and faculty both")
	}

	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Check if the current semester exists in the enrollment
	currentSemester := existingEnrollment.CurrentSemester

	// Check if the courses to drop are valid courses that the student has taken
	for _, courseID := range coursesToDrop {
		// Check if the course exists
		_, err := s.GetCourse(ctx, courseID)
		if err != nil {
			return err
		}

		// Check if the student has taken the course in the current semester
		coursesTaken := existingEnrollment.CoursesTaken[currentSemester]
		if !contains(coursesTaken, courseID) {
			return fmt.Errorf("Student %s has not taken course %s in current semester", studentID, courseID)
		}
	}

	// Calculate the total credits for the courses to add
	totalCreditsToDrop := 0
	for _, courseID := range coursesToDrop {
		course, err := s.GetCourse(ctx, courseID)
		if err != nil {
			return err
		}
		totalCreditsToDrop += course.Credits
	}
	// Update the CreditsThisSemester with the totalCreditsToAdd
	existingEnrollment.CreditsThisSemester += totalCreditsToDrop

	// Remove the dropped courses from the current semester's enrollment
	existingCourses := existingEnrollment.CoursesTaken[currentSemester]
	remainingCourses := []string{}
	for _, courseID := range existingCourses {
		if !contains(coursesToDrop, courseID) {
			remainingCourses = append(remainingCourses, courseID)
		}
	}
	existingEnrollment.CoursesTaken[currentSemester] = remainingCourses

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment

	// Update the enrollment in the ledger
	enrollmentJSON, _ := json.Marshal(existingEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Dropped courses from current semester for student %s: %s", studentID, strings.Join(coursesToDrop, ", "))
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// AddCourse adds a new course to the list of available courses
// This AddCourseToAvailableCourses function performs the following steps:

//     Checks if the course with the provided courseID already exists in the ledger. If it does, it returns an error to prevent duplicate course additions.

//     Creates a new course object with the provided details.

//     Marshals the new course object to JSON and stores it in the ledger under the appropriate key.

//     Records the ledger update to keep track of the addition of the course.

// To use this function, you can invoke it using the peer CLI or through your application to add new courses to the list of available courses in your Hyperledger Fabric network.
func (s *StudentRecordContract) AddCourse(ctx contractapi.TransactionContextInterface, courseID string, courseName string, credits int, departmentID string, facultyID string, description string, academicYear int, semester int) error {
	// Check if the course already exists
	courseKey := fmt.Sprintf("COURSE-%s", courseID)
	courseJSON, err := ctx.GetStub().GetState(courseKey)
	if err != nil {
		return err
	}
	if courseJSON != nil {
		return fmt.Errorf("Course with ID %s already exists", courseID)
	}

	// Check if the departmentID is valid
	_, departmentExists := departmentMapping[departmentID]
	if !departmentExists {
		return fmt.Errorf("Department ID %s is not valid", departmentID)
	}

	// Check if the facultyID is valid
	faculty, facultyExists := facultyMapping[facultyID]
	if !facultyExists {
		return fmt.Errorf("Faculty ID %s is not valid", facultyID)
	}

	// Check if the faculty's department matches the input departmentID
	if faculty.DepartmentID != departmentID {
		return fmt.Errorf("Faculty with ID %s is not associated with department %s", facultyID, departmentID)
	}

	// Create a new course
	newCourse := Course{
		CourseID:     courseID,
		CourseName:   courseName,
		Credits:      credits,
		DepartmentID: departmentID,
		FacultyID:    facultyID,
		Description:  description,
		AcademicYear: academicYear,
		Semester:     semester,
	}

	// Marshal and store the course in the ledger
	courseJSON, err = json.Marshal(newCourse)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(courseKey, courseJSON)
	if err != nil {
		return err
	}

	courseMapping[newCourse.CourseID] = newCourse

	// Record the ledger update
	entry := fmt.Sprintf("Added new course: %s", courseID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// RemoveCourse removes a course from the ledger
func (s *StudentRecordContract) RemoveCourse(ctx contractapi.TransactionContextInterface, courseID string) error {
	// Check if the course exists
	courseKey := fmt.Sprintf("COURSE-%s", courseID)
	courseJSON, err := ctx.GetStub().GetState(courseKey)
	if err != nil {
		return err
	}
	if courseJSON == nil {
		return fmt.Errorf("Course with ID %s does not exist", courseID)
	}

	// Delete the course from the ledger
	err = ctx.GetStub().DelState(courseKey)
	if err != nil {
		return err
	}

	delete(courseMapping, courseID)

	// Record the ledger update
	entry := fmt.Sprintf("Removed course: %s", courseID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// GetCourse retrieves a course by its ID from the ledger
func (s *StudentRecordContract) GetCourse(ctx contractapi.TransactionContextInterface, courseID string) (Course, error) {
	courseJSON, err := ctx.GetStub().GetState(fmt.Sprintf("COURSE-%s", courseID))
	if err != nil {
		return Course{}, fmt.Errorf("Failed to read course with ID %s: %v", courseID, err)
	}
	if courseJSON == nil {
		return Course{}, fmt.Errorf("Course with ID %s does not exist", courseID)
	}

	var course Course
	err = json.Unmarshal(courseJSON, &course)
	if err != nil {
		return Course{}, err
	}

	return course, nil
}

// GetAllCourses returns a list of all courses
func (s *StudentRecordContract) GetAllCourses(ctx contractapi.TransactionContextInterface) ([]Course, error) {
	courses := make([]Course, 0)

	for _, course := range courseMapping {
		courses = append(courses, course)
	}

	return courses, nil
}

// GetCoursesByDepartment returns a list of courses filtered by department ID
func (s *StudentRecordContract) GetCoursesByDepartment(ctx contractapi.TransactionContextInterface, departmentID string) ([]Course, error) {
	courses := make([]Course, 0)

	for _, course := range courseMapping {
		if course.DepartmentID == departmentID {
			courses = append(courses, course)
		}
	}

	return courses, nil
}
