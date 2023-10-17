package main

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)


// Define the Indian time zone
var indianTimeZone *time.Location

func init() {
	// Set the Indian time zone (IST)
	var err error
	indianTimeZone, err = time.LoadLocation("Asia/Kolkata")
	if err != nil {
		// Handle the error if the time zone cannot be loaded
		panic(err)
	}
}

// func (s *StudentRecordContract) recordLedgerUpdate(ctx contractapi.TransactionContextInterface, entry string) error {
// 	// Implement ledger update recording logic here
// 	return nil
// }

// recordLedgerUpdate records a ledger update with an incremental index
func (s *StudentRecordContract) recordLedgerUpdate(ctx contractapi.TransactionContextInterface, entry string) error {
	// timestamp, _ := ctx.GetStub().GetTxTimestamp()

	// Get the current time as a timestamp
	// Get the current time in the Indian time zone
	currentTime := time.Now().In(indianTimeZone)

	// Format the timestamp as a string
	timestamp := currentTime.Format(time.RFC3339)

	// Get the client identity
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}

	ledgerUpdate := LedgerUpdate{
		Timestamp: timestamp,
		Entry:     entry,
		UpdatedBy: clientID, // Use the client ID obtained above
	}

	// Get the current ledger update count
	count, err := ctx.GetStub().GetState("LEDGERUPDATE_COUNT")
	if err != nil {
		return err
	}

	// Convert the count to an integer
	updateCount := 0
	if count != nil {
		updateCount, _ = strconv.Atoi(string(count))
	}

	// Save the new ledger update with an incremental index
	updateJSON, _ := json.Marshal(ledgerUpdate)
	err = ctx.GetStub().PutState(fmt.Sprintf("LEDGERUPDATE-%d", updateCount), updateJSON)
	if err != nil {
		return err
	}

	// Increment the ledger update count
	updateCount++
	err = ctx.GetStub().PutState("LEDGERUPDATE_COUNT", []byte(strconv.Itoa(updateCount)))
	if err != nil {
		return err
	}

	return nil
}

// GetAllLedgerUpdates retrieves and returns all ledger update histories
func (s *StudentRecordContract) GetAllLedgerUpdates(ctx contractapi.TransactionContextInterface) ([]LedgerUpdate, error) {
	count, err := ctx.GetStub().GetState("LEDGERUPDATE_COUNT")
	if err != nil {
		return nil, err
	}

	updateCount := 0
	if count != nil {
		updateCount, _ = strconv.Atoi(string(count))
	}

	var ledgerUpdates []LedgerUpdate

	for i := 0; i < updateCount; i++ {
		updateJSON, err := ctx.GetStub().GetState(fmt.Sprintf("LEDGERUPDATE-%d", i))
		if err != nil {
			return nil, err
		}

		var update LedgerUpdate
		err = json.Unmarshal(updateJSON, &update)
		if err != nil {
			return nil, err
		}

		ledgerUpdates = append(ledgerUpdates, update)
	}

	return ledgerUpdates, nil
}
