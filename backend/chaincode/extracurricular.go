package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ExtracurricularActivity represents information related to an extracurricular activity
type ExtracurricularActivity struct {
	ActivityID   string `json:"activityID"`
	ActivityName string `json:"name"`
	Description  string `json:"description"`
	Location     string `json:"location"`
	Date         string `json:"date"`
	MaxCount     int    `json:"maxCount"` // Maximum count of participants for the activity
	FacultyID    string `json:"facultyID"`
}

var activityMapping = make(map[string]ExtracurricularActivity)

// AddExtracurricularActivityForStudent adds an extracurricular activity for a given student ID
func (s *StudentRecordContract) AddExtracurricularActivityForStudent(ctx contractapi.TransactionContextInterface, studentID string, activityID string) error {
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

	// Check if the activityID already exists in the student's extracurricular activities
	for _, activity := range existingEnrollment.Extracurricular {
		if activity == activityID {
			return fmt.Errorf("Extracurricular activity with ID %s already exists for student %s", activityID, studentID)
		}
	}

	// Check if the maximum count for the activity has been reached
	activity, activityExists := activityMapping[activityID]
	if !activityExists {
		return fmt.Errorf("Extracurricular activity with ID %s does not exist", activityID)
	}

	// Count the number of students already registered for this activity
	registeredStudentsCount := 0
	for _, enrollment := range enrollmentMapping {
		for _, act := range enrollment.Extracurricular {
			if act == activityID {
				registeredStudentsCount++
			}
		}
	}

	if registeredStudentsCount >= activity.MaxCount {
		return fmt.Errorf("Maximum count reached for extracurricular activity %s", activityID)
	}

	// Add the activityID to the student's extracurricular activities
	existingEnrollment.Extracurricular = append(existingEnrollment.Extracurricular, activityID)

	// Update the enrollment mapping
	enrollmentMapping[studentID] = existingEnrollment

	// Update the enrollment in the ledger
	enrollmentJSON, _ := json.Marshal(existingEnrollment)
	err = ctx.GetStub().PutState(fmt.Sprintf("ENROLLMENT-%s", studentID), enrollmentJSON)
	if err != nil {
		return err
	}

	// Record the ledger update
	entry := fmt.Sprintf("Added extracurricular activity %s for student %s", activityID, studentID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// AddExtracurricularActivity adds a new extracurricular activity to the ledger
func (s *StudentRecordContract) AddExtracurricularActivity(ctx contractapi.TransactionContextInterface, activityID string, activityName string, description string, location string, date string, maxCount int, facultyID string) error {
	// Check if the activity already exists
	activityKey := fmt.Sprintf("EXTRACURRICULAR-%s", activityID)
	activityJSON, err := ctx.GetStub().GetState(activityKey)
	if err != nil {
		return err
	}
	if activityJSON != nil {
		return fmt.Errorf("Extracurricular activity with ID %s already exists", activityID)
	}

	// Check if the facultyID is valid
	_, facultyExists := facultyMapping[facultyID]
	if !facultyExists {
		return fmt.Errorf("Faculty ID %s is not valid", facultyID)
	}

	// Create a new extracurricular activity
	newActivity := ExtracurricularActivity{
		ActivityID:   activityID,
		ActivityName: activityName,
		Description:  description,
		Location:     location,
		Date:         date,
		MaxCount:     maxCount,
		FacultyID:    facultyID,
	}

	// Marshal and store the extracurricular activity in the ledger
	activityJSON, err = json.Marshal(newActivity)
	if err != nil {
		return err
	}
	err = ctx.GetStub().PutState(activityKey, activityJSON)
	if err != nil {
		return err
	}

	activityMapping[newActivity.ActivityID] = newActivity

	// Record the ledger update
	entry := fmt.Sprintf("Added new extracurricular activity: %s", activityID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// RemoveExtracurricularActivity removes an extracurricular activity from the ledger
func (s *StudentRecordContract) RemoveExtracurricularActivity(ctx contractapi.TransactionContextInterface, activityID string) error {
	// Check if the activity exists
	activityKey := fmt.Sprintf("EXTRACURRICULAR-%s", activityID)
	activityJSON, err := ctx.GetStub().GetState(activityKey)
	if err != nil {
		return err
	}
	if activityJSON == nil {
		return fmt.Errorf("Extracurricular activity with ID %s does not exist", activityID)
	}

	// Delete the activity from the ledger
	err = ctx.GetStub().DelState(activityKey)
	if err != nil {
		return err
	}

	delete(activityMapping, activityID)

	// Record the ledger update
	entry := fmt.Sprintf("Removed extracurricular activity: %s", activityID)
	err = s.recordLedgerUpdate(ctx, entry)
	if err != nil {
		return err
	}

	return nil
}

// GetExtracurricularActivity retrieves an extracurricular activity by its ID from the ledger
func (s *StudentRecordContract) GetExtracurricularActivity(ctx contractapi.TransactionContextInterface, activityID string) (ExtracurricularActivity, error) {
	activityJSON, err := ctx.GetStub().GetState(fmt.Sprintf("EXTRACURRICULAR-%s", activityID))
	if err != nil {
		return ExtracurricularActivity{}, fmt.Errorf("Failed to read extracurricular activity with ID %s: %v", activityID, err)
	}
	if activityJSON == nil {
		return ExtracurricularActivity{}, fmt.Errorf("Extracurricular activity with ID %s does not exist", activityID)
	}

	var activity ExtracurricularActivity
	err = json.Unmarshal(activityJSON, &activity)
	if err != nil {
		return ExtracurricularActivity{}, err
	}

	return activity, nil
}

// GetAllExtracurricularActivities returns a list of all extracurricular activities
func (s *StudentRecordContract) GetAllExtracurricularActivities(ctx contractapi.TransactionContextInterface) ([]ExtracurricularActivity, error) {
	activities := make([]ExtracurricularActivity, 0)

	for _, activity := range activityMapping {
		activities = append(activities, activity)
	}

	return activities, nil
}
