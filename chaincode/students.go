package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


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
