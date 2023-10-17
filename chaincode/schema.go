package main

type Enrollment struct {
	StudentID        string              `json:"studentID"`
	Name             string              `json:"name"`
	ProgramType      string              `json:"programType"`
	DepartmentID     string              `json:"department"`
	CreditsCompleted int                 `json:"creditsCompleted"`
	CurrentSemester  string              `json:"currentSemester"` // Current semester for the student
	SemesterResults  map[string][]Result `json:"semesterResults"`
	CoursesTaken     map[string][]string `json:"coursesTaken"` // Map of semester to list of course IDs
}

type Student struct {
	StudentID    string `json:"studentID"`
	StudentName  string `json:"studentName"`
	ProgramType  string `json:"programType"`
	DepartmentID string `json:"department"`
	MaxSemesters int    `json:"maxSemesters"`
}

// Program represents program information including maximum allowed semesters
type Program struct {
	Name                 string `json:"name"`
	MaxSemesters         int    `json:"maxSemesters"`
	RequiredCredits      int    `json:"requiredCredits"`
	MaxCreditPerSemester int    `json:"maxCreditPerCredits"`
}

type Department struct {
	DepartmentID   string `json:"departmentID"`
	DepartmentName string `json:"departmentName"`
}

type Faculty struct {
	FacultyID    string `json:"facultyID"`
	FacultyName  string `json:"facultyName"`
	DepartmentID string `json:"department"`
}

type Course struct {
	CourseID     string `json:"courseID"`
	CourseName   string `json:"name"`
	Credits      int    `json:"credits"`
	DepartmentID string `json:"department"`
	FacultyID    string `json:"facultyID"`
	Description  string `json:"description"`
}

type Result struct {
	CourseID string `json:"courseID"`
	Grade    string `json:"grade"`
}

// LedgerUpdate represents a ledger update entry
type LedgerUpdate struct {
	Timestamp string `json:"timestamp"`
	Entry     string `json:"entry"`
	UpdatedBy string `json:"updatedBy"`
}
