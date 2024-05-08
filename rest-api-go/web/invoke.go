package web

import (
	"fmt"
	"net/http"
	"strings"
)

func (setup *OrgSetup) InitialEnroll(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received InitialEnroll request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := r.FormValue("chaincodeid") // chaincode name -> basic
	fmt.Printf("Received chainCodeName: %s\n", chainCodeName)
	channelID := r.FormValue("channelid") // channel name -> mychannel
	function := r.FormValue("function")   // smart contract name
	argsArray := r.Form["args"]
	// Join the args slice into a single string using a comma separator
	argsString := strings.Join(argsArray, ",")
	fmt.Printf("Received argsString: %s\n", argsString)

	// Split the args string by commas to get individual arguments
	argsSplit := strings.Split(argsString, ",")
	fmt.Printf("Split argsSplit: %v\n", argsSplit)

	// Check if we have exactly four arguments (rollNo, name, program, department)
	if len(argsSplit) != 4 {
		fmt.Fprintf(w, "Invalid number of arguments")
		return
	}

	// Extract individual arguments
	rollNo := argsSplit[0]
	name := argsSplit[1]
	program := argsSplit[2]
	department := argsSplit[3]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction("InitialEnrollment", rollNo, name, program, department)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	// fmt.Printf("*** Transaction committed successfully\n")
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) AddCoursesToCurrentSemester(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddCoursesToCurrentSemester request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"                  // chaincode name -> basic
	channelID := "mychannel"                  // channel name -> mychannel
	function := "AddCoursesToCurrentSemester" // smart contract name

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) DropCoursesFromCurrentSemester(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received DropCoursesFromCurrentSemester request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"                     // chaincode name -> basic
	channelID := "mychannel"                     // channel name -> mychannel
	function := "DropCoursesFromCurrentSemester" // smart contract name

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}

// admin functions
func (setup *OrgSetup) AddCourse(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddCourse request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddCourse"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) RemoveCourse(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received RemoveCourse request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "RemoveCourse"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) AddFaculty(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddFaculty request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddFaculty"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) RemoveFaculty(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received RemoveFaculty request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "RemoveFaculty"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) AddProgram(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddProgram request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddProgram"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) RemoveProgram(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received RemoveProgram request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "RemoveProgram"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) AddDepartment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddDepartment request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddDepartment"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) RemoveDepartment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received RemoveDepartment request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "RemoveDepartment"

	argsArray := r.Form["args"]
	// fmt.Printf("argsArray[0]: %s\n", argsArray[0])
	// fmt.Printf("argsArray[1]: %s\n", argsArray[1])

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}
	fmt.Fprintf(w, "%s", submitResponse)
}

func (setup *OrgSetup) EnrollStudentIntoNextSemester(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received EnrollStudentIntoNextSemester request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "EnrollStudentIntoNextSemester"

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}

func (setup *OrgSetup) AddResultForCurrentSemester(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddResultForCurrentSemester request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddResultForCurrentSemester"

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}

// extra curricular
func (setup *OrgSetup) AddExtracurricularActivity(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddExtracurricularActivity request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddExtracurricularActivity"

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}

func (setup *OrgSetup) AddCertificateForStudent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddCertificateForStudent request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"
	channelID := "mychannel"
	function := "AddCertificateForStudent"

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}

func (setup *OrgSetup) AddExtracurricularActivityForStudent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received AddExtracurricularActivityForStudent request")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %s", err)
		return
	}
	chainCodeName := "basic"                           // chaincode name -> basic
	channelID := "mychannel"                           // channel name -> mychannel
	function := "AddExtracurricularActivityForStudent" // smart contract name

	argsArray := r.Form["args"]

	fmt.Printf("channel: %s, chaincode: %s, function: %s, args: %s\n", channelID, chainCodeName, function, argsArray)
	network := setup.Gateway.GetNetwork(channelID)
	contract := network.GetContract(chainCodeName)

	submitResponse, err := contract.SubmitTransaction(function, argsArray...)

	// fmt.Printf("Response data: %s", submitResponse)
	if err != nil {
		panic(fmt.Errorf("failed to submit transaction: %w", err))
	}

	fmt.Fprintf(w, "%s", submitResponse)

}
