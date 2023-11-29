# CampBlock
CampBlock: a student record management application built on the top of hyperledger fabric.
(***Currently in the development stage.***)

-Developing a secure, decentralized network on Hyperledger Fabric for safeguarding student records.

-Leveraging blockchain for secure and transparent student data ledger, ensuring data integrity and accessibility for authorized users.

-Integrating a student rating system based on various factors

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**to run the chaincode, execute the following commands in the CampBlock/chaincode/go dir using the relative path:**

1. go mod init CampBlock
2. go mod tidy

**Note---> inside *go.mod* file, change the go version from 1.2x.x to 1.2x**

This will also help eliminate possible chaincode errors due to the unavailability of some libraries.

//now, inside the test-network dir, run the following commands to create a channel



./network.sh down



./network.sh up createChannel


-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**to deploy the chaincode onto the peers**


./network.sh deployCC -ccn basic -ccp ../student-record-curr/chaincode -ccl go


*set PATH before going further*
export PATH=${PWD}/../bin:$PATH && export FABRIC_CFG_PATH=$PWD/../config/ && export CORE_PEER_TLS_ENABLED=true && export CORE_PEER_LOCALMSPID="Org1MSP" && export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt && export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp && export CORE_PEER_ADDRESS=localhost:7051



-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


**use the following commands in the terminal to interact with the ledger**

0. InitLedger *(to initialize the ledger)*

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'


1.InitialEnrollment *(create initial enrollment for a student)*

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitialEnrollment","Args":["CS22M037","DEEPAK KUMAR","MTech","CSE"]}'


2. AddCoursesFromCurrentSemester

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"AddCoursesToCurrentSemester","Args":["CS22M037","[\"CS5691\"]"]}'

3. DropCoursesFromCurrentSemester

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"DropCoursesFromCurrentSemester","Args":["CS22M037","[\"CSE101\"]"]}'


4. AddResultForCurrentSemester

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"AddResultForCurrentSemester","Args":["CS22M037","[{\"CourseID\":\"CSE101\",\"Grade\":\"A\"},{\"CourseID\":\"ME5691\",\"Grade\":\"B\"}]"]}'

5. UpdateGradeForCourse

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"UpdateGradeForCourse","Args":["CS22M037","CS5691","S"]}'

6. CalculateSGPA

peer chaincode query -C mychannel -n basic -c '{"Args":["CalculateSGPA","CS22M037","Semester1"]}'

7. CalculateCGPA

peer chaincode query -C mychannel -n basic -c '{"Args":["CalculateCGPA","CS22M037"]}'

8. EnrollStudentIntoNextSemester

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"EnrollStudentIntoNextSemester","Args":["CS22M037"]}'

9. AddCourse

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"AddCourse","Args":["CS5691","PRML","15","CSE","F1","Entry level machine learning course offered by department of CSE"]}'

10. AddDepartment

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"AddDepartment","Args":["CSE","Computer Science and Engineering"]}'

11. AddFaculty

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"AddFaculty","Args":["F3","Mithesh Khapra","CSE"]}'



-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


**use the following commands in the terminal for querying the ledger**

1. GetEnrollment

peer chaincode query -C mychannel -n basic -c '{"Args":["GetEnrollment","CS22M037"]}'

2. GetCourse *(get a course by courseId)*

peer chaincode query -C mychannel -n basic -c '{"Args":["GetCourse","MAT101"]}'

3. GetStudent *(get a student by studentId)*

peer chaincode query -C mychannel -n basic -c '{"Args":["GetStudent","CS22M037"]}'

4. GetAllStudents *(get all the student records)*

peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllStudents",""]}'

5. GetAllDepartments

peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllDepartments",""]}'

6. GetAllCourses

peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllCourses"]}'

7. GetAllPrograms

9. GetProgram

10. AddProgram

11. GetSGPA

peer chaincode query -C mychannel -n basic -c '{"Args":["GetSGPA", "CS22M037"]}'

12. GetAllLedgerUpdates

peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllLedgerUpdates"]}'


13. GetResultForCourse

peer chaincode query -C mychannel -n basic -c '{"Args":["GetResultForCourse", "CS22M037", "CS5691"]}'

14. GetResultForSemester

peer chaincode query -C mychannel -n basic -c '{"Args":["GetResultForSemester", "CS22M037", "Semester1"]}'

15. GetResultsForAllSemesters

peer chaincode query -C mychannel -n basic -c '{"Args":["GetResultsForAllSemesters", "CS22M037"]}'



-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


**use the following commands in the terminal for querying the ledger update logs**

1. ledger height

peer channel getinfo -c mychannel

2. fetch block

peer channel fetch 2 -c mychannel

3. decode fetched block into json

configtxlator proto_decode --input mychannel_2.block --type common.Block --output decoded_block2.json

4. show this file in terminal

less decoded_block2.json

or

cat decoded_block2.json


