package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Student struct {
	StudentID    string `json:"studentID"`
	StudentName  string `json:"studentName"`
	ProgramType  string `json:"programType"`
	DepartmentID string `json:"department"`
	MaxSemesters int    `json:"maxSemesters"`
}

var studentMapping = make(map[string]Student)

// GetStudent retrieves a student by their ID from the ledger
func (s *StudentRecordContract) GetStudent(ctx contractapi.TransactionContextInterface, studentID string) (Student, error) {
	studentJSON, err := ctx.GetStub().GetState(fmt.Sprintf("STUDENT-%s", studentID))
	if err != nil {
		return Student{}, fmt.Errorf("Failed to read student with ID %s: %v", studentID, err)
	}
	if studentJSON == nil {
		return Student{}, fmt.Errorf("Student with ID %s does not exist", studentID)
	}

	var student Student
	err = json.Unmarshal(studentJSON, &student)
	if err != nil {
		return Student{}, err
	}

	return student, nil
}

// GetAllStudents returns a list of all students
func (s *StudentRecordContract) GetAllStudents(ctx contractapi.TransactionContextInterface) ([]Student, error) {
	students := make([]Student, 0)

	for _, student := range studentMapping {
		students = append(students, student)
	}

	return students, nil
}

// GetStudentsByCourseIDInCoursesTaken retrieves all students who have a particular course with courseID in their CoursesTaken map
func (s *StudentRecordContract) GetStudentsByCourseIDInCoursesTaken(ctx contractapi.TransactionContextInterface, courseID string) ([]string, error) {
	// Retrieve all enrollments from the enrollmentMapping
	enrollments, err := s.GetAllEnrollments(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve enrollments: %v", err)
	}

	// Initialize a collection to hold studentIDs who meet the criteria
	var studentsWithCourse []string

	// Iterate through each enrollment to check for the target courseID
	for _, enrollment := range enrollments {
		// Check each semester's CoursesTaken map for the target courseID
		for _, courseIDs := range enrollment.CoursesTaken {
			for _, enrolledCourseID := range courseIDs {
				if enrolledCourseID == courseID {
					// If the courseID matches, add the studentID to the result
					studentsWithCourse = append(studentsWithCourse, enrollment.StudentID)
					break // No need to check further courses for this semester
				}
			}
		}
	}

	return studentsWithCourse, nil
}

// GetStudentsByActivityIDInExtracurricular retrieves all students who have a particular extracurricular activity with ActivityID
func (s *StudentRecordContract) GetStudentsByActivityIDInExtracurricular(ctx contractapi.TransactionContextInterface, activityID string) ([]string, error) {
	// Retrieve all enrollments from the enrollmentMapping
	enrollments, err := s.GetAllEnrollments(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve enrollments: %v", err)
	}

	// Initialize a collection to hold studentIDs who meet the criteria
	var studentsWithActivity []string

	// Iterate through each enrollment to check for the target activityID
	for _, enrollment := range enrollments {
		// Check each student's extracurricular activities for the target activityID
		for _, extracurricularID := range enrollment.Extracurricular {
			if extracurricularID == activityID {
				// If the activityID matches, add the studentID to the result
				studentsWithActivity = append(studentsWithActivity, enrollment.StudentID)
				break // No need to check further activities for this student
			}
		}
	}

	return studentsWithActivity, nil
}
