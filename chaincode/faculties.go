package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// AddFaculty adds a new faculty to the ledger
func (s *StudentRecordContract) AddFaculty(ctx contractapi.TransactionContextInterface, facultyID string, facultyName string, departmentID string) error {
	// Check if the caller is authorized (admin)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) {
		return fmt.Errorf("Unauthorized: Only Admin can add new faculty")
	}	
	
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
