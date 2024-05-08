import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import UserContext from '../UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon library
import { Button, Card, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const StudentViewGradesScreen = () => {
    const { userData } = useContext(UserContext);
    const [semesterResults, setSemesterResults] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCourses, setExpandedCourses] = useState([]);
    const [coursesInfo, setCoursesInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [expandedSemesters, setExpandedSemesters] = useState([]);
    const [cgpa, setCGPA] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSemesterResults = async () => {
            try {
                const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
                const chaincodeid = 'basic';
                const channelid = 'mychannel';
                const getResultsFunction = 'GetResultsForAllSemesters';
                const args = userData.rollNo;
                const apiResultURL = `${baseURL}/ViewResult?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getResultsFunction}&args=${args}`;

                const response = await axios.get(apiResultURL);
                console.log('API Response for viewResult:', response.data);

                setSemesterResults(response.data);
                setIsLoading(false);
            } catch (error) {
                // console.error('Error fetching semester results:', error);
                setIsLoading(false);
            }
        };

        const fetchCGPA = async () => {
            try {
                const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
                const chaincodeid = 'basic';
                const channelid = 'mychannel';
                const calculateCGPAFunction = 'CalculateCGPA';
                const args = userData.rollNo;
                const apiCGPAURL = `${baseURL}/CalculateCGPA?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${calculateCGPAFunction}&args=${args}`;

                const response = await axios.get(apiCGPAURL);
                console.log('API Response for CGPA:', response.data);

                setCGPA(response.data);
            } catch (error) {
                // console.error('Error fetching CGPA:', error);
            }
        };

        fetchSemesterResults();
        fetchCGPA();
    }, [userData.rollNo]);

    const fetchCourseDetails = async (courseID) => {
        try {
            const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
            const chaincodeid = 'basic';
            const channelid = 'mychannel';
            const getCourseFunction = 'GetCourse';
            const apiCourseURL = `${baseURL}/GetCourse?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getCourseFunction}&args=${courseID}`;

            const response = await axios.get(apiCourseURL);
            console.log('API Response for course info:', response.data);

            return response.data;
        } catch (error) {
            // console.error(`Error fetching course ${courseID} info:`, error);
            return null;
        }
    };

    const handleSemesterClick = (semester) => {
        if (expandedSemesters.includes(semester)) {
            setExpandedSemesters((prevSemesters) => prevSemesters.filter((sem) => sem !== semester));
        } else {
            setExpandedSemesters((prevSemesters) => [...prevSemesters, semester]);
        }
    };

    const handleCourseClick = async (courseID) => {
        if (expandedCourses.includes(courseID)) {
            setExpandedCourses((prevCourses) => prevCourses.filter((id) => id !== courseID));
        } else {
            setExpandedCourses((prevCourses) => [...prevCourses, courseID]);

            if (!coursesInfo[courseID]) {
                const courseDetails = await fetchCourseDetails(courseID);
                setCoursesInfo((prevInfo) => ({
                    ...prevInfo,
                    [courseID]: courseDetails,
                }));
            }
        }
    };

    const renderCourseItem = ({ item }) => {
        const { courseID, grade } = item;
        const isExpanded = expandedCourses.includes(courseID);
        const courseInfo = coursesInfo[courseID];

        return (
            <TouchableOpacity style={styles.courseItem} onPress={() => handleCourseClick(courseID)}>
                <Text style={styles.courseName}>{courseInfo?.name}</Text>
                <Text style={styles.courseGrade}>Course ID: {courseID}</Text>
                <Text style={styles.courseGrade}>Grade: {grade}</Text>
                {isExpanded && courseInfo && (
                    <View style={styles.additionalDetails}>
                        <Text>Credits: {courseInfo?.credits}</Text>
                        <Text>Department ID: {courseInfo?.department}</Text>
                        <Text>Faculty ID: {courseInfo?.facultyID}</Text>
                        <Text>Academic Year: {courseInfo?.semester === 1 ? 'JAN-MAY' : 'JULY-NOV'}</Text>
                        <Text>Description: {courseInfo?.description}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderSemesterCourses = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#7E57C2" style={styles.loader} />;
        }

        const filteredSemesters = Object.keys(semesterResults).filter((semester) => {
            const courses = semesterResults[semester];
            return courses.some((course) => course.courseID.toLowerCase().includes(searchQuery.toLowerCase()));
        });

        return (
            <View style={styles.container}>
                <Text style={styles.cgpaText}>CGPA: {cgpa}</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by course ID..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
                <ScrollView>
                    {filteredSemesters.map((semester) => (
                        <View key={semester} style={styles.semesterContainer}>
                            <TouchableOpacity onPress={() => handleSemesterClick(semester)}>
                                <Text style={styles.semesterText}>{semester}</Text>
                            </TouchableOpacity>
                            {expandedSemesters.includes(semester) && (
                                <FlatList
                                    data={semesterResults[semester].filter((course) =>
                                        course.courseID.toLowerCase().includes(searchQuery.toLowerCase())
                                    )}
                                    renderItem={renderCourseItem}
                                    keyExtractor={(item) => item.courseID}
                                />
                            )}
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.bottomBar}>
                    <Button
                        style={styles.bottomBarButton}
                        onPress={() => navigation.navigate('StudentAcademicDashboard')}
                        icon={() => (
                            <>
                                <Icon name="arrow-left" size={40} color="#7E57C2" />
                                {/* <Text style={styles.bottomBarText}>Home</Text> */}
                            </>
                        )}
                    />

                </View>
            </View>
        );
    };

    return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{renderSemesterCourses()}</ScrollView>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#7E57C2',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    semesterContainer: {
        marginBottom: 20,
    },
    semesterText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7E57C2',
        marginBottom: 10,
    },
    courseItem: {
        backgroundColor: '#7E57C2',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    courseName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    courseGrade: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 5,
    },
    additionalDetails: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
    },
    sortButton: {
        backgroundColor: '#7E57C2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    sortButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cgpaText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7E57C2',
        marginBottom: 10,
    },
    bottomBar: {
        bottom: 0,
        flexDirection: 'row',
        width: '100%',
        height: 56,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF', // White background color
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0', // Light gray border color
    },
    bottomBarButton: {
        backgroundColor: 'transparent', // Make the button background transparent
        // borderColor: '#7E57C2',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5,
        // width: '50%',
    },
    bottomBarText: {
        color: '#7E57C2', // Blue text color
        marginTop: 4,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StudentViewGradesScreen;









// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import UserContext from '../UserContext';

// const StudentViewGradesScreen = () => {
//     const { userData } = useContext(UserContext);
//     const [semesterResults, setSemesterResults] = useState({});
//     const [isLoading, setIsLoading] = useState(true);
//     const [expandedCourses, setExpandedCourses] = useState([]);
//     const [coursesInfo, setCoursesInfo] = useState({});
//     const [searchQuery, setSearchQuery] = useState('');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const [expandedSemesters, setExpandedSemesters] = useState([]);

//     useEffect(() => {
//         const fetchSemesterResults = async () => {
//             try {
//                 const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
//                 const chaincodeid = 'basic';
//                 const channelid = 'mychannel';
//                 const getResultsFunction = 'GetResultsForAllSemesters';
//                 const args = userData.rollNo;
//                 const apiResultURL = `${baseURL}/ViewResult?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getResultsFunction}&args=${args}`;

//                 const response = await axios.get(apiResultURL);
//                 console.log('API Response for viewResult:', response.data);

//                 setSemesterResults(response.data);
//                 setIsLoading(false);
//             } catch (error) {
//                 console.error('Error fetching semester results:', error);
//                 setIsLoading(false);
//             }
//         };

//         fetchSemesterResults();
//     }, [userData.rollNo]);

//     const fetchCourseDetails = async (courseID) => {
//         try {
//             const baseURL = 'https://measured-wasp-terminally.ngrok-free.app';
//             const chaincodeid = 'basic';
//             const channelid = 'mychannel';
//             const getCourseFunction = 'GetCourse';
//             const apiCourseURL = `${baseURL}/GetCourse?chaincodeid=${chaincodeid}&channelid=${channelid}&function=${getCourseFunction}&args=${courseID}`;

//             const response = await axios.get(apiCourseURL);
//             console.log('API Response for course info:', response.data);

//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching course ${courseID} info:`, error);
//             return null;
//         }
//     };

//     const handleSemesterClick = (semester) => {
//         if (expandedSemesters.includes(semester)) {
//             setExpandedSemesters((prevSemesters) => prevSemesters.filter((sem) => sem !== semester));
//         } else {
//             setExpandedSemesters((prevSemesters) => [...prevSemesters, semester]);
//         }
//     };

//     const handleCourseClick = async (courseID) => {
//         if (expandedCourses.includes(courseID)) {
//             setExpandedCourses((prevCourses) => prevCourses.filter((id) => id !== courseID));
//         } else {
//             setExpandedCourses((prevCourses) => [...prevCourses, courseID]);

//             if (!coursesInfo[courseID]) {
//                 const courseDetails = await fetchCourseDetails(courseID);
//                 setCoursesInfo((prevInfo) => ({
//                     ...prevInfo,
//                     [courseID]: courseDetails,
//                 }));
//             }
//         }
//     };

//     const renderCourseItem = ({ item }) => {
//         const { courseID, grade } = item;
//         const isExpanded = expandedCourses.includes(courseID);
//         const courseInfo = coursesInfo[courseID];

//         return (
//             <TouchableOpacity style={styles.courseItem} onPress={() => handleCourseClick(courseID)}>
//                 <Text style={styles.courseName}>{courseInfo?.name}</Text>
//                 <Text style={styles.courseGrade}>Course ID: {courseID}</Text>
//                 <Text style={styles.courseGrade}>Grade: {grade}</Text>
//                 {isExpanded && courseInfo && (
//                     <View style={styles.additionalDetails}>
//                         <Text>Credits: {courseInfo?.credits}</Text>
//                         <Text>Department ID: {courseInfo?.department}</Text>
//                         <Text>Faculty ID: {courseInfo?.facultyID}</Text>
//                         <Text>Academic Year: {courseInfo?.semester === 1 ? 'JAN-MAY' : 'JULY-NOV'}</Text>
//                         <Text>Description: {courseInfo?.description}</Text>
//                     </View>
//                 )}
//             </TouchableOpacity>
//         );
//     };

//     const renderSemesterCourses = () => {
//         if (isLoading) {
//             return <ActivityIndicator size="large" color="#7E57C2" style={styles.loader} />;
//         }

//         const filteredSemesters = Object.keys(semesterResults).filter((semester) => {
//             const courses = semesterResults[semester];
//             return courses.some((course) => course.courseID.toLowerCase().includes(searchQuery.toLowerCase()));
//         });

//         return (
//             <View style={styles.container}>
//                 <View style={styles.searchContainer}>
//                     <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search by course ID..."
//                         value={searchQuery}
//                         onChangeText={(text) => setSearchQuery(text)}
//                     />
//                 </View>
//                 <ScrollView>
//                     {filteredSemesters.map((semester) => (
//                         <View key={semester} style={styles.semesterContainer}>
//                             <TouchableOpacity onPress={() => handleSemesterClick(semester)}>
//                                 <Text style={styles.semesterText}>{semester}</Text>
//                             </TouchableOpacity>
//                             {expandedSemesters.includes(semester) && (
//                                 <FlatList
//                                     data={semesterResults[semester].filter((course) =>
//                                         course.courseID.toLowerCase().includes(searchQuery.toLowerCase())
//                                     )}
//                                     renderItem={renderCourseItem}
//                                     keyExtractor={(item) => item.courseID}
//                                 />
//                             )}
//                         </View>
//                     ))}
//                 </ScrollView>
//             </View>
//         );
//     };

//     return <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{renderSemesterCourses()}</ScrollView>;
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FFFFFF',
//         paddingHorizontal: 20,
//         paddingTop: 20,
//     },
//     loader: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     searchInput: {
//         flex: 1,
//         height: 40,
//         borderColor: '#7E57C2',
//         borderWidth: 1,
//         borderRadius: 5,
//         paddingHorizontal: 10,
//         marginRight: 10,
//     },
//     semesterContainer: {
//         marginBottom: 20,
//     },
//     semesterText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#7E57C2',
//         marginBottom: 10,
//     },
//     courseItem: {
//         backgroundColor: '#7E57C2',
//         padding: 15,
//         marginBottom: 15,
//         borderRadius: 10,
//     },
//     courseName: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 5,
//     },
//     courseGrade: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     additionalDetails: {
//         backgroundColor: '#FFFFFF',
//         padding: 10,
//         borderRadius: 5,
//     },
//     sortButton: {
//         backgroundColor: '#7E57C2',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 5,
//     },
//     sortButtonText: {
//         color: '#FFFFFF',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
// });

// export default StudentViewGradesScreen;










