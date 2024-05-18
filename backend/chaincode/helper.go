package main

// Helper function to check if an item exists in a slice
func contains(slice []string, item string) bool {
	for _, element := range slice {
		if element == item {
			return true
		}
	}
	return false
}

// // UpdateCourse updates the information of a course in the ledger and the course mapping
// func (s *StudentRecordContract) UpdateCourse(ctx contractapi.TransactionContextInterface, course Course) error {
// 	// Marshal and store the course in the ledger
// 	courseJSON, err := json.Marshal(course)
// 	if err != nil {
// 		return err
// 	}

// 	// Put the updated course data into the ledger
// 	err = ctx.GetStub().PutState(course.CourseID, courseJSON)
// 	if err != nil {
// 		return err
// 	}

// 	// Update the course in the course mapping
// 	courseMapping[course.CourseID] = course

// 	return nil
// }
