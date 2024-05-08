package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Program represents program information including maximum allowed semesters
type Program struct {
	Name                 string `json:"name"`
	MaxSemesters         int    `json:"maxSemesters"`
	RequiredCredits      int    `json:"requiredCredits"`
	MaxCreditPerSemester int    `json:"maxCreditPerCredits"`
	MinCreditPerSemester int    `json:"minCreditPerCredits"`
}

// var programMapping = make(map[string]Program)

// Define the programs with their maximum allowed semesters
var programMapping = map[string]Program{
	"BTECH": {
		Name:                 "BTECH",
		MaxSemesters:         8,
		RequiredCredits:      150, // Update with actual required credits
		MaxCreditPerSemester: 75,
		MinCreditPerSemester: 36,
	},
}

func GetProgramMaxSemesters(programType string) (int, error) {
	program, exists := programMapping[programType]
	if !exists {
		return 0, fmt.Errorf("Program type %s not found", programType)
	}
	return program.MaxSemesters, nil
}

// GetProgramMaxCreditsPerSemester retrieves the maximum allowed credits per semester for a program
func (s *StudentRecordContract) GetProgramMaxCreditsPerSemester(programType string) (int, error) {
	program, exists := programMapping[programType]
	if !exists {
		return 0, fmt.Errorf("Program type %s is not valid", programType)
	}
	// return 48, nil
	return program.MaxCreditPerSemester, nil
}

// GetProgramMinCreditsPerSemester retrieves the maximum allowed credits per semester for a program
func (s *StudentRecordContract) GetProgramMinCreditsPerSemester(programType string) (int, error) {
	program, exists := programMapping[programType]
	if !exists {
		return 0, fmt.Errorf("Program type %s is not valid", programType)
	}
	// return 48, nil
	return program.MinCreditPerSemester, nil
}

// AddProgram adds a new program to the ledger
func (s *StudentRecordContract) AddProgram(ctx contractapi.TransactionContextInterface, programName string, maxSemesters int, requiredCredits int, maxCreditPerSemester int, minCreditPerSemester int) error {
	// Check if the program already exists
	_, programExists := programMapping[programName]
	if programExists {
		return fmt.Errorf("Program %s already exists", programName)
	}

	// Create a new program
	newProgram := Program{
		Name:                 programName,
		MaxSemesters:         maxSemesters,
		RequiredCredits:      requiredCredits,
		MaxCreditPerSemester: maxCreditPerSemester,
		MinCreditPerSemester: minCreditPerSemester,
	}

	// Add the new program to the programs map
	programMapping[programName] = newProgram

	// Record the ledger update
	entry := fmt.Sprintf("Added new program: %s", programName)
	err := s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// RemoveProgram removes a program from the ledger
func (s *StudentRecordContract) RemoveProgram(ctx contractapi.TransactionContextInterface, programName string) error {
	// Check if the program exists
	_, programExists := programMapping[programName]
	if !programExists {
		return fmt.Errorf("Program %s does not exist", programName)
	}

	// Delete the program from the programs map
	delete(programMapping, programName)

	// Record the ledger update
	entry := fmt.Sprintf("Removed program: %s", programName)
	err := s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// GetProgram retrieves program information by programName
func (s *StudentRecordContract) GetProgram(ctx contractapi.TransactionContextInterface, programName string) (*Program, error) {
	program, exists := programMapping[programName]
	if !exists {
		return nil, fmt.Errorf("Program with name %s does not exist", programName)
	}
	return &program, nil
}

// GetAllPrograms returns a list of all programs
func (s *StudentRecordContract) GetAllPrograms(ctx contractapi.TransactionContextInterface) ([]Program, error) {
	programs := make([]Program, 0)

	for _, program := range programMapping {
		programs = append(programs, program)
	}

	return programs, nil
}
