package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type StudentRecordContract struct {
	contractapi.Contract
}

// Main function to run the contract
func main() {
	studentRecordContract := new(StudentRecordContract)
	cc, err := contractapi.NewChaincode(studentRecordContract)
	if err != nil {
		fmt.Printf("Error creating Student Record Chaincode: %s", err.Error())
		return
	}

	if err := cc.Start(); err != nil {
		fmt.Printf("Error starting Student Record Chaincode: %s", err.Error())
	}
}
