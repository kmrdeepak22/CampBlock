package web

import (
	"context"
	"log"
	"net/http"

	"github.com/hyperledger/fabric-gateway/pkg/client"

	"golang.ngrok.com/ngrok"
	"golang.ngrok.com/ngrok/config"
)

// OrgSetup contains organization's config to interact with the network.
type OrgSetup struct {
	OrgName      string
	MSPID        string
	CryptoPath   string
	CertPath     string
	KeyPath      string
	TLSCertPath  string
	PeerEndpoint string
	GatewayPeer  string
	Gateway      client.Gateway
}

var DOMAIN_NAME string = "measured-wasp-terminally.ngrok-free.app"

func run(ctx context.Context, mux *http.ServeMux) error {
	listener, err := ngrok.Listen(ctx,
		config.HTTPEndpoint(
			config.WithDomain(DOMAIN_NAME),
		),
		ngrok.WithAuthtokenFromEnv(),
	)
	if err != nil {
		return err
	}

	log.Println("Ingress established at:", listener.URL())

	return http.Serve(listener, mux)

}

// Serve starts http web server.
func Serve(setups OrgSetup) {

	mux := http.NewServeMux()
	//api endpoint
	mux.HandleFunc("/xyz", setups.Xyz)
	// mux.HandleFunc("/abc", setups.Invoke)
	mux.HandleFunc("/hi", setups.Hi)

	//smart contracts endpts for query
	mux.HandleFunc("/GetEnrollment", setups.GetEnrollment)
	mux.HandleFunc("/GetCourse", setups.GetCourse)
	mux.HandleFunc("/ViewResult", setups.GetResultsForAllSemesters)
	mux.HandleFunc("/GetCoursesByFacultyID", setups.GetCoursesByFacultyID)

	mux.HandleFunc("/CalculateCGPA", setups.CalculateCGPA)
	mux.HandleFunc("/CalculateSGPA", setups.CalculateSGPA)
	mux.HandleFunc("/GetStudentsByCourseIDInCoursesTaken", setups.GetStudentsByCourseIDInCoursesTaken)

	mux.HandleFunc("/GetAllLedgerUpdates", setups.GetAllLedgerUpdates)
	mux.HandleFunc("/GetAllEnrollments", setups.GetAllEnrollments)
	mux.HandleFunc("/GetAllCourses", setups.GetAllCourses)

		mux.HandleFunc("/GetCoursesByDepartment", setups.GetCoursesByDepartment)


	mux.HandleFunc("/GetAllFaculties", setups.GetAllFaculties)
	mux.HandleFunc("/GetAllPrograms", setups.GetAllPrograms)

	mux.HandleFunc("/GetAllDepartments", setups.GetAllDepartments)

	//smart contracts endpts for commit
	mux.HandleFunc("/InitialEnrollment", setups.InitialEnroll)
	mux.HandleFunc("/AddCoursesToCurrentSemester", setups.AddCoursesToCurrentSemester)
	mux.HandleFunc("/DropCoursesFromCurrentSemester", setups.DropCoursesFromCurrentSemester)

	mux.HandleFunc("/EnrollStudentIntoNextSemester", setups.EnrollStudentIntoNextSemester)

	//admin endpts
	mux.HandleFunc("/AddCourse", setups.AddCourse)
	mux.HandleFunc("/RemoveCourse", setups.RemoveCourse)
	mux.HandleFunc("/AddFaculty", setups.AddFaculty)
	mux.HandleFunc("/RemoveFaculty", setups.RemoveFaculty)
	mux.HandleFunc("/AddProgram", setups.AddProgram)
	mux.HandleFunc("/RemoveProgram", setups.RemoveProgram)
	mux.HandleFunc("/AddDepartment", setups.AddDepartment)
	mux.HandleFunc("/RemoveDepartment", setups.RemoveDepartment)

	mux.HandleFunc("/AddResultForCurrentSemester", setups.AddResultForCurrentSemester)

	//extracurricular
	mux.HandleFunc("/GetAllExtracurricularActivities", setups.GetAllExtracurricularActivities)
	mux.HandleFunc("/AddExtracurricularActivity", setups.AddExtracurricularActivity)
	mux.HandleFunc("/GetExtracurricularActivitiesByFacultyID", setups.GetExtracurricularActivitiesByFacultyID)
	mux.HandleFunc("/GetStudentsByActivityIDInExtracurricular", setups.GetStudentsByActivityIDInExtracurricular)
	mux.HandleFunc("/AddCertificateForStudent", setups.AddCertificateForStudent)
	mux.HandleFunc("/AddExtracurricularActivityForStudent", setups.AddExtracurricularActivityForStudent)

	mux.HandleFunc("/GetExtracurricularActivity", setups.GetExtracurricularActivity)

	mux.HandleFunc("/GetCertificateForActivityAndStudent", setups.GetCertificateForActivityAndStudent)

	// fmt.Println("Listening (http://localhost:3000/)...")
	// if err := http.ListenAndServe(":3000", nil); err != nil {
	// 	fmt.Println(err)
	// }
	if err := run(context.Background(), mux); err != nil {
		log.Fatal(err)
	}
}

// NGROK_AUTHTOKEN=2ex4e92vuEmTggNgFzNYtl4ekx5_231GCeQDevxyznD197a8Z go run main.go
