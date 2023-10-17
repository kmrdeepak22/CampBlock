package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

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
	program, programExists := programs[programType]
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

	// Update the student mapping
	studentMapping[studentID] = student

	// Enroll the student into the first semester with empty courses and results
	initialSemester := "Semester1"
	initialEnrollment := Enrollment{
		StudentID:        studentID,
		Name:             name,
		ProgramType:      programType,
		DepartmentID:     departmentID,
		CreditsCompleted: 0,
		CurrentSemester:  initialSemester,
		SemesterResults:  make(map[string][]Result),
		CoursesTaken:     make(map[string][]string),
	}

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

	program, _ := programs[existingEnrollment.ProgramType]
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
		StudentID:        studentID,
		Name:             existingEnrollment.Name,
		ProgramType:      existingEnrollment.ProgramType,
		DepartmentID:     existingEnrollment.DepartmentID,
		CreditsCompleted: existingEnrollment.CreditsCompleted,
		CurrentSemester:  nextSemester,
		SemesterResults:  existingEnrollment.SemesterResults,
		CoursesTaken:     existingEnrollment.CoursesTaken,
	}

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
