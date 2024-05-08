package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// InitLedger initializes the ledger with some initial data
func (s *StudentRecordContract) InitLedger(ctx contractapi.TransactionContextInterface) error {

	// You can add more initial data such as programs, students, etc. as needed

	return nil
}
