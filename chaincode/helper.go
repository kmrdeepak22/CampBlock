package main

import "fmt"

// Helper function to check if an item exists in a slice
func contains(slice []string, item string) bool {
	for _, element := range slice {
		if element == item {
			return true
		}
	}
	return false
}

// Helper function to extract the semester number from the semester name
func extractSemesterNumber(semester string) int {
	var semesterNumber int
	_, err := fmt.Sscanf(semester, "Semester%d", &semesterNumber)
	if err != nil {
		return 0
	}
	return semesterNumber
}

func GetProgramMaxSemesters(programType string) (int, error) {
	program, exists := programs[programType]
	if !exists {
		return 0, fmt.Errorf("Program type %s not found", programType)
	}
	return program.MaxSemesters, nil
}

// GetProgramMaxCreditsPerSemester retrieves the maximum allowed credits per semester for a program
func (s *StudentRecordContract) GetProgramMaxCreditsPerSemester(programType string) (int, error) {
	program, exists := programs[programType]
	if !exists {
		return 0, fmt.Errorf("Program type %s is not valid", programType)
	}
	// return 48, nil
	return program.MaxCreditPerSemester, nil
}
