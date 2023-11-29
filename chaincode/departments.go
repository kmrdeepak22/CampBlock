package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// AddDepartment adds a new department to the ledger
func (s *StudentRecordContract) AddDepartment(ctx contractapi.TransactionContextInterface, departmentID string, departmentName string) error {
	// Check if the caller is authorized (admin)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) {
		return fmt.Errorf("Unauthorized: Only Admin can add new Department")
	}
	
	// Check if the department already exists
	departmentKey := fmt.Sprintf("DEPARTMENT-%s", departmentID)
	departmentJSON, err := ctx.GetStub().GetState(departmentKey)
	if err != nil {
		return err
	}
	if departmentJSON != nil {
		return fmt.Errorf("Department with ID %s already exists", departmentID)
	}

	// Create a new department
	newDepartment := Department{
		DepartmentID:   departmentID,
		DepartmentName: departmentName,
	}

	// Marshal and store the department in the ledger
	departmentJSON, err = json.Marshal(newDepartment)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(departmentKey, departmentJSON)
	if err != nil {
		return err
	}

	departmentMapping[newDepartment.DepartmentID] = newDepartment

	// Record the ledger update
	entry := fmt.Sprintf("Added new department: %s", departmentID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// GetDepartment retrieves a department by its ID from the ledger
func (s *StudentRecordContract) GetDepartment(ctx contractapi.TransactionContextInterface, departmentID string) (Department, error) {
	departmentJSON, err := ctx.GetStub().GetState(fmt.Sprintf("DEPARTMENT-%s", departmentID))
	if err != nil {
		return Department{}, fmt.Errorf("Failed to read department with ID %s: %v", departmentID, err)
	}
	if departmentJSON == nil {
		return Department{}, fmt.Errorf("Department with ID %s does not exist", departmentID)
	}

	var department Department
	err = json.Unmarshal(departmentJSON, &department)
	if err != nil {
		return Department{}, err
	}

	return department, nil
}

// GetAllDepartments returns a list of all departments
func (s *StudentRecordContract) GetAllDepartments(ctx contractapi.TransactionContextInterface) ([]Department, error) {
	departments := make([]Department, 0)

	for _, department := range departmentMapping {
		departments = append(departments, department)
	}

	return departments, nil
}
