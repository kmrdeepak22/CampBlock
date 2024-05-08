package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Faculty struct {
	FacultyID    string `json:"facultyID"`
	FacultyName  string `json:"facultyName"`
	DepartmentID string `json:"department"`
}

var facultyMapping = make(map[string]Faculty)

// AddFaculty adds a new faculty to the ledger
func (s *StudentRecordContract) AddFaculty(ctx contractapi.TransactionContextInterface, facultyID string, facultyName string, departmentID string) error {
	// Check if the faculty already exists
	facultyKey := fmt.Sprintf("FACULTY-%s", facultyID)
	facultyJSON, err := ctx.GetStub().GetState(facultyKey)
	if err != nil {
		return err
	}
	if facultyJSON != nil {
		return fmt.Errorf("Faculty with ID %s already exists", facultyID)
	}

	// Check if the departmentID is valid
	_, departmentExists := departmentMapping[departmentID]
	if !departmentExists {
		return fmt.Errorf("Department ID %s is not valid", departmentID)
	}

	// Create a new faculty
	newFaculty := Faculty{
		FacultyID:    facultyID,
		FacultyName:  facultyName,
		DepartmentID: departmentID,
	}

	// Marshal and store the faculty in the ledger
	facultyJSON, err = json.Marshal(newFaculty)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(facultyKey, facultyJSON)
	if err != nil {
		return err
	}

	facultyMapping[newFaculty.FacultyID] = newFaculty

	// Record the ledger update
	entry := fmt.Sprintf("Added new faculty: %s", facultyID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// RemoveFaculty removes a faculty from the ledger
func (s *StudentRecordContract) RemoveFaculty(ctx contractapi.TransactionContextInterface, facultyID string) error {
	// Check if the faculty exists
	facultyKey := fmt.Sprintf("FACULTY-%s", facultyID)
	facultyJSON, err := ctx.GetStub().GetState(facultyKey)
	if err != nil {
		return err
	}
	if facultyJSON == nil {
		return fmt.Errorf("Faculty with ID %s does not exist", facultyID)
	}

	// Delete the faculty from the ledger
	err = ctx.GetStub().DelState(facultyKey)
	if err != nil {
		return err
	}

	delete(facultyMapping, facultyID)

	// Record the ledger update
	entry := fmt.Sprintf("Removed faculty: %s", facultyID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}


// GetFaculty retrieves faculty information by facultyID
func (s *StudentRecordContract) GetFaculty(ctx contractapi.TransactionContextInterface, facultyID string) (*Faculty, error) {
	faculty, exists := facultyMapping[facultyID]
	if !exists {
		return nil, fmt.Errorf("Faculty with ID %s does not exist", facultyID)
	}
	return &faculty, nil
}

// GetAllFaculties returns a list of all faculties
func (s *StudentRecordContract) GetAllFaculties(ctx contractapi.TransactionContextInterface) ([]Faculty, error) {
	faculties := make([]Faculty, 0)

	for _, faculty := range facultyMapping {
		faculties = append(faculties, faculty)
	}

	return faculties, nil
}

// GetCoursesByFacultyID retrieves all the courses associated with a facultyID
func (s *StudentRecordContract) GetCoursesByFacultyID(ctx contractapi.TransactionContextInterface, facultyID string) ([]Course, error) {
	// Get all courses
	allCourses, err := s.GetAllCourses(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed to get all courses: %v", err)
	}

	// Filter courses by facultyID
	var coursesByFaculty []Course
	for _, course := range allCourses {
		if course.FacultyID == facultyID {
			coursesByFaculty = append(coursesByFaculty, course)
		}
	}

	return coursesByFaculty, nil
}

// GetExtracurricularActivitiesByFacultyID retrieves all extracurricular activities associated with a facultyID
func (s *StudentRecordContract) GetExtracurricularActivitiesByFacultyID(ctx contractapi.TransactionContextInterface, facultyID string) ([]ExtracurricularActivity, error) {
	// Get all extracurricular activities
	allActivities, err := s.GetAllExtracurricularActivities(ctx)
	if err != nil {
		return nil, fmt.Errorf("Failed to get all extracurricular activities: %v", err)
	}

	// Filter activities by facultyID
	var activitiesByFaculty []ExtracurricularActivity
	for _, activity := range allActivities {
		if activity.FacultyID == facultyID {
			activitiesByFaculty = append(activitiesByFaculty, activity)
		}
	}

	return activitiesByFaculty, nil
}

// // GetExtracurricularActivitiesByFacultyID retrieves all the extracurricular activities associated with a facultyID
// func (s *StudentRecordContract) GetExtracurricularActivitiesByFacultyID(ctx contractapi.TransactionContextInterface, facultyID string) ([]ExtracurricularActivity, error) {
//     // Get all enrollments
//     allEnrollments, err := s.GetAllEnrollments(ctx)
//     if err != nil {
//         return nil, fmt.Errorf("Failed to get all enrollments: %v", err)
//     }

//     // Initialize a collection to hold extracurricular activities by facultyID
//     var activitiesByFaculty []ExtracurricularActivity

//     // Iterate through each enrollment to check for extracurricular activities associated with the facultyID
//     for _, enrollment := range allEnrollments {
//         for _, activity := range enrollment.Extracurricular {
//             if activity.FacultyID == facultyID {
//                 activitiesByFaculty = append(activitiesByFaculty, activity)
//             }
//         }
//     }

//     return activitiesByFaculty, nil
// }
