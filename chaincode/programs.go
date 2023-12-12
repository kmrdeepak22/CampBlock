package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// AddProgram adds a new program to the ledger
func (s *StudentRecordContract) AddProgram(ctx contractapi.TransactionContextInterface, programName string, maxSemesters int, requiredCredits int, maxCreditPerSemester int) error {
	// Check if the caller is authorized (admin)
	caller := ctx.GetClientIdentity()
	if !s.isAdmin(ctx, caller) {
		return fmt.Errorf("Unauthorized: Only Admin can add new program")
	}
	
	// Check if the program already exists
	_, programExists := programs[programName]
	if programExists {
		return fmt.Errorf("Program %s already exists", programName)
	}

	// Create a new program
	newProgram := Program{
		Name:                 programName,
		MaxSemesters:         maxSemesters,
		RequiredCredits:      requiredCredits,
		MaxCreditPerSemester: maxCreditPerSemester,
	}

	// Add the new program to the programs map
	programs[programName] = newProgram

	// Record the ledger update
	entry := fmt.Sprintf("Added new program: %s", programName)
	err := s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// GetProgram retrieves program information by programName
func (s *StudentRecordContract) GetProgram(ctx contractapi.TransactionContextInterface, programName string) (*Program, error) {
	program, exists := programs[programName]
	if !exists {
		return nil, fmt.Errorf("Program with name %s does not exist", programName)
	}
	return &program, nil
}

// GetAllPrograms returns a list of all programs
func (s *StudentRecordContract) GetAllPrograms(ctx contractapi.TransactionContextInterface) ([]Program, error) {
	allPrograms := make([]Program, 0)

	for _, program := range programs {
		allPrograms = append(allPrograms, program)
	}

	return allPrograms, nil
}
