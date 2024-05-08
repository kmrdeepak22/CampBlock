package main

var enrollmentMapping = make(map[string]Enrollment)

var studentMapping = make(map[string]Student)

var departmentMapping = make(map[string]Department)

var facultyMapping = make(map[string]Faculty)

var courseMapping = make(map[string]Course)

var sgpaMapping = make(map[string]map[string]float64)

// Define the programs with their maximum allowed semesters
var programs = map[string]Program{
	"BTech": {
		Name:                 "BTech",
		MaxSemesters:         8,
		RequiredCredits:      150, // Update with actual required credits
		MaxCreditPerSemester: 48,
	},
	"DualDegree": {
		Name:                 "DualDegree",
		MaxSemesters:         10,
		RequiredCredits:      148, // Update with actual required credits
		MaxCreditPerSemester: 48,
	},
	"MTech": {
		Name:                 "MTech",
		MaxSemesters:         4,
		RequiredCredits:      148, // Update with actual required credits
		MaxCreditPerSemester: 48,
	},
	"MS": {
		Name:                 "MS",
		MaxSemesters:         5,
		RequiredCredits:      200, // Update with actual required credits
		MaxCreditPerSemester: 48,
	},
	"PhD": {
		Name:                 "PhD",
		MaxSemesters:         10,
		RequiredCredits:      500, // Update with actual required credits
		MaxCreditPerSemester: 48,
	},
}
