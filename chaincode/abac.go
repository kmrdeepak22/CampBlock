package main

import (
	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// func isAdmin(caller cid.ClientIdentity) bool {
// 	// Implement logic to check if the client identity is an admin
// 	return true
// }

// func isFaculty(caller cid.ClientIdentity) bool {
// 	// Implement logic to check if the client identity is a faculty
// 	return true
// }

// isAdmin checks if the client identity has the "admin" role.
func (s *StudentRecordContract) isAdmin(ctx contractapi.TransactionContextInterface, clientID cid.ClientIdentity) bool {
	// Get the client identity
	// clientID := ctx.GetClientIdentity()

	// Get the attribute named "role" from the client's certificate
	roleAttribute, found, _ := clientID.GetAttributeValue("role")

	// Check if the "role" attribute is present and set to "admin"
	return found && roleAttribute == "admin"
}

func (s *StudentRecordContract) isFaculty(ctx contractapi.TransactionContextInterface, clientID cid.ClientIdentity) bool {
	// Get the attribute named "role" from the client's certificate
	roleAttribute, found, _ := clientID.GetAttributeValue("role")

	// Check if the "role" attribute is present and set to "faculty"
	return found && roleAttribute == "faculty"
}

// // isFacultyOfCourse checks if the client identity matches the faculty ID of the given course.
// func (s *StudentRecordContract) isFacultyOfCourse(ctx contractapi.TransactionContextInterface, clientID cid.ClientIdentity, courseID string) bool {
// 	// Get the attribute named "facultyID" from the client's certificate
// 	facultyIDAttribute, found, _ := clientID.GetAttributeValue("facultyID")

// 	// Check if the "facultyID" attribute is present and matches the course's faculty ID
// 	return found && facultyIDAttribute == courseMapping[courseID].FacultyID
// }
