// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './LoginScreen';
import StudentScreen from './StudentLoginScreen';
import FacultyScreen from './FacultyLoginScreen';
import AdminScreen from './AdminScreen';


import LedgerUpdateScreen from './LedgerUpdateScreen';


import StudentDashboardScreen from './student/StudentDashboardScreen';
import FacultyDashboardScreen from './faculty/FacultyDashboardScreen';
import AdminDashboardScreen from './admin/AdminDashboardScreen';
import StudentAcademicDashboardScreen from './student/StudentAcademicDashboard';

import StudentViewProfileScreen from './student/StudentViewProfileScreen';
import StudentViewGradesScreen from './student/StudentViewGradesScreen';
import StudentCurrentSemesterScreen from './student/StudentCurrentSemesterScreen';
import StudentViewCoursesCurrSemScreen from './student/StudentViewCoursesCurrSemScreen';
import StudentAddCourseScreen from './student/StudentAddCourseScreen';
import StudentDropCourseScreen from './student/StudentDropCourseScreen';
import StudentPreviousSemesterScreen from './student/StudentPreviousSemesterScreen';

import ViewExtraCurricularForStudentScreen from './student/ExtraCurricular/ViewExtraCurricularForStudentScreen';


import ManageEntitiesScreen from './admin/ManageEntitiesScreen';


import ViewCoursesFacultyScreen from './faculty/ViewCoursesFacultyScreen';
import ViewEnrolledStudentsScreen from './faculty/ViewEnrolledStudentScreen';


import ExistingStudentsScreen from './admin/students/ExistingStudentsScreen';
import ManageStudentsScreen from './admin/students/ManageStudentsScreen';
import InitialEnrollmentScreen from './admin/students/InitialEnrollmentScreen';


import ManageCoursesScreen from './admin/courses/ManageCoursesScreen';
import NewCourseRegistrationScreen from './admin/courses/NewCourseRegistrationScreen';
import ExistingCoursesScreen from './admin/courses/ExistingCoursesScreen';


import ManageFacultiesScreen from './admin/faculty/ManageFacultiesScreen';
import NewFacultyRegistrationScreen from './admin/faculty/NewFacultyRegistrationScreen';
import ExistingFacultiesScreen from './admin/faculty/ExistingFacultiesScreen';
import AddCertificatesScreen from './aws s3/AddCertificatesScreen';

import ManageProgramsScreen from './admin/programs/ManageProgramsScreen';
import NewProgramRegistrationScreen from './admin/programs/NewProgramRegistrationScreen';
import ExistingProgramsScreen from './admin/programs/ExistingProgramsScreen';


import ManageDepartmentsScreen from './admin/departments/ManageDepartmentsScreen';
import NewDepartmentRegistrationScreen from './admin/departments/NewDepartmentRegistrationScreen';
import ExistingDepartmentsScreen from './admin/departments/ExistingDepartmentsScreen';



import ManageExtraCurricularEntitiesScreen from './admin/extracurricular/ManageExtraCurricularEntitiesScreen';
import NewActivityRegistrationScreen from './admin/extracurricular/NewActivityRegistrationScreen';
import ExistingActivitiesScreen from './admin/extracurricular/ExistingActivitiesScreen';
import ViewActivitiesFacultyScreen from './faculty/Extracurricular/ViewActivitiesFacultyScreen';
import ViewRegisteredStudentsScreen from './faculty/Extracurricular/ViewRegisteredStudentScreen';



import ViewAllActivitiesScreen from './student/ExtraCurricular/ViewAllActivitiesScreen';
import ViewMyActivitiesScreen from './student/ExtraCurricular/ViewMyActivitiesScreen';


const Stack = createStackNavigator();


const MainStack = () => (
    // <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Student" component={StudentScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Faculty" component={FacultyScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="LedgerUpdate" component={LedgerUpdateScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="StudentAcademicDashboard" component={StudentAcademicDashboardScreen} options={{ headerShown: false }} />

        <Stack.Screen name="FacultyDashboard" component={FacultyDashboardScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageEntities" component={ManageEntitiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentViewProfile" component={StudentViewProfileScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentViewGrades" component={StudentViewGradesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentCurrentSemester" component={StudentCurrentSemesterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentViewCoursesCurrSem" component={StudentViewCoursesCurrSemScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentAddCourse" component={StudentAddCourseScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentDropCourse" component={StudentDropCourseScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentPreviousSemester" component={StudentPreviousSemesterScreen} options={{ headerShown: false }}/>


        <Stack.Screen name="ViewExtraCurricularForStudent" component={ViewExtraCurricularForStudentScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewAllActivities" component={ViewAllActivitiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewMyActivities" component={ViewMyActivitiesScreen} options={{ headerShown: false }}/>



        <Stack.Screen name="ViewCoursesFaculty" component={ViewCoursesFacultyScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="ViewEnrolledStudents" component={ViewEnrolledStudentsScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="ExistingStudents" component={ExistingStudentsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageStudents" component={ManageStudentsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NewEnrollment" component={InitialEnrollmentScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="ManageCourses" component={ManageCoursesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NewCourseRegistration" component={NewCourseRegistrationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ExistingCourses" component={ExistingCoursesScreen} options={{ headerShown: false }}/>


        <Stack.Screen name="ManageFaculties" component={ManageFacultiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NewFacultyRegistration" component={NewFacultyRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExistingFaculties" component={ExistingFacultiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddCertificates" component={AddCertificatesScreen} options={{ headerShown: false }} />


        <Stack.Screen name="ManagePrograms" component={ManageProgramsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewProgramRegistration" component={NewProgramRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExistingPrograms" component={ExistingProgramsScreen} options={{ headerShown: false }}/>


        <Stack.Screen name="ManageDepartments" component={ManageDepartmentsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NewDepartmentRegistration" component={NewDepartmentRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExistingDepartments" component={ExistingDepartmentsScreen} options={{ headerShown: false }}/>


        <Stack.Screen name="ManageExtraCurricularEntities" component={ManageExtraCurricularEntitiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="NewActivityRegistration" component={NewActivityRegistrationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExistingActivities" component={ExistingActivitiesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewActivitiesFaculty" component={ViewActivitiesFacultyScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewRegisteredStudents" component={ViewRegisteredStudentsScreen} options={{ headerShown: false }}/>


    </Stack.Navigator>
);


const Navigation = () => {
    return (
        <NavigationContainer> 
            <MainStack />
        </NavigationContainer>
    );
};

export default Navigation;
