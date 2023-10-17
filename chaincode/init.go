package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// InitLedger initializes the ledger with some initial data
func (s *StudentRecordContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Define and add some initial courses
	courses := []Course{
		{
			CourseID:     "CS101",
			CourseName:   "Introduction to Computer Science",
			Credits:      12,
			DepartmentID: "CSE",
			FacultyID:    "F1",
			Description:  "An introductory course on computer science.",
		},
		{
			CourseID:     "ME5691",
			CourseName:   "Mechanics",
			Credits:      15,
			DepartmentID: "ME",
			FacultyID:    "F2",
			Description:  "A first-semester Mechanics course.",
		},
		// Add more courses as needed
	}

	for _, course := range courses {
		courseJSON, err := json.Marshal(course)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(fmt.Sprintf("COURSE-%s", course.CourseID), courseJSON)
		if err != nil {
			return err
		}

		courseMapping[course.CourseID] = course
	}

	// Define and add some initial faculties
	faculties := []Faculty{
		{
			FacultyID:    "F1",
			FacultyName:  "Dr. John Smith",
			DepartmentID: "CSE",
		},
		{
			FacultyID:    "F2",
			FacultyName:  "Dr. Emily Johnson",
			DepartmentID: "MAT",
		},
		// Add more faculties as needed
	}

	for _, faculty := range faculties {
		facultyJSON, err := json.Marshal(faculty)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(fmt.Sprintf("FACULTY-%s", faculty.FacultyID), facultyJSON)
		if err != nil {
			return err
		}
		facultyMapping[faculty.FacultyID] = faculty
	}

	// Define and add some initial departments
	departments := []Department{
		{
			DepartmentID:   "CSE",
			DepartmentName: "Computer Science and Engineering",
		},
		{
			DepartmentID:   "MAT",
			DepartmentName: "Mathematics",
		},
		// Add more departments as needed
	}

	for _, department := range departments {
		departmentJSON, err := json.Marshal(department)
		if err != nil {
			return err
		}
		err = ctx.GetStub().PutState(fmt.Sprintf("DEPARTMENT-%s", department.DepartmentID), departmentJSON)
		if err != nil {
			return err
		}
		departmentMapping[department.DepartmentID] = department
	}

	// You can add more initial data such as programs, students, etc. as needed

	return nil
}
