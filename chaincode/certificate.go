package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// Certificate represents a certificate associated with an extracurricular activity
type Certificate struct {
	ActivityID string `json:"activityID"` // ID of the extracurricular activity
	Key        string `json:"key"`        // Key associated with the certificate
}

// AddCertificateForStudent adds a certificate for a given student ID
func (s *StudentRecordContract) AddCertificateForStudent(ctx contractapi.TransactionContextInterface, studentID string, activityID string, key string) error {
	// Check if the student exists
	studentKey := fmt.Sprintf("STUDENT-%s", studentID)
	studentJSON, err := ctx.GetStub().GetState(studentKey)
	if err != nil {
		return err
	}
	if studentJSON == nil {
		return fmt.Errorf("Student with ID %s does not exist", studentID)
	}

	// Fetch the student's existing enrollment
	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return err
	}

	// Find if the activityID exists in the student's extracurricular activities
	var activityIndex int
	activityFound := false
	for i, activity := range existingEnrollment.Certificates {
		if activity.ActivityID == activityID {
			activityFound = true
			activityIndex = i
			break
		}
	}

	// If activityID exists, update the key; otherwise, add a new certificate
	if activityFound {
		existingEnrollment.Certificates[activityIndex].Key = key
	} else {
		// Create a new certificate
		newCertificate := Certificate{
			ActivityID: activityID,
			Key:        key,
		}

		// Add the certificate to the student's enrollment
		existingEnrollment.Certificates = append(existingEnrollment.Certificates, newCertificate)
	}

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment

	// Update the enrollment in the ledger
	enrollmentJSON, _ := json.Marshal(existingEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Added new certificate %s for student %s", key, studentID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// // AddCertificateForStudent adds a certificate for a given student ID
// func (s *StudentRecordContract) AddCertificateForStudent(ctx contractapi.TransactionContextInterface, studentID string, activityID string, key string) error {
// 	// Check if the student exists
// 	studentKey := fmt.Sprintf("STUDENT-%s", studentID)
// 	studentJSON, err := ctx.GetStub().GetState(studentKey)
// 	if err != nil {
// 		return err
// 	}
// 	if studentJSON == nil {
// 		return fmt.Errorf("Student with ID %s does not exist", studentID)
// 	}

// 	// Fetch the student's existing enrollment
// 	existingEnrollment, err := s.GetEnrollment(ctx, studentID)
// 	if err != nil {
// 		return err
// 	}

// 	// Check if the activityID exists in the student's extracurricular activities
// 	var activityExists bool
// 	for _, activity := range existingEnrollment.Extracurricular {
// 		if activity == activityID {
// 			activityExists = true
// 			break
// 		}
// 	}
// 	if !activityExists {
// 		return fmt.Errorf("Extracurricular activity with ID %s does not exist for student %s", activityID, studentID)
// 	}

// 	// Create a new certificate
// 	newCertificate := Certificate{
// 		ActivityID: activityID,
// 		Key:        key,
// 	}

// 	// Add the certificate to the student's enrollment
// 	existingEnrollment.Certificates = append(existingEnrollment.Certificates, newCertificate)

// 	// Update the enrollment mapping
// 	enrollmentMapping[studentID] = existingEnrollment

// 	// Update the enrollment in the ledger
// 	enrollmentJSON, _ := json.Marshal(existingEnrollment)
// 	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
// 	if err != nil {
// 		return err
// 	}

// 	// Record the ledger update
// 	entry := fmt.Sprintf("Added new certificate %s for student %s", key, studentID)
// 	err = s.recordLedgerUpdate(ctx, entry)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// GetCertificateForActivityAndStudent retrieves the certificate for a specific activity and student
func (s *StudentRecordContract) GetCertificateForActivityAndStudent(ctx contractapi.TransactionContextInterface, studentID string, activityID string) (*Certificate, error) {
	// Check if the student's enrollment record exists
	enrollment, err := s.GetEnrollment(ctx, studentID)
	if err != nil {
		return nil, err
	}

	// Iterate through certificates in the enrollment record
	for _, certificate := range enrollment.Certificates {
		if certificate.ActivityID == activityID {
			return &certificate, nil
		}
	}

	// If no certificate is found for the specified activity ID, return an error
	return nil, fmt.Errorf("Certificate not found for student %s and activity %s", studentID, activityID)
}
