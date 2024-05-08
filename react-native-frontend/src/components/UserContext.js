import React, { createContext, useState } from 'react';

// Create a new context for user data
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        rollNo: '', // Initialize rollNo with an empty string
        dept: '',
        facultyID: '',
    });

    // Function to update the rollNo in the context
    const updateRollNo = (newRollNo) => {
        console.log('rollNo during update:', newRollNo);
        setUserData({ ...userData, rollNo: newRollNo });
        console.log('rollNo after update:', userData.rollNo);
    };
    const updateDept = (newDept) => {
        console.log('dept during update:', newDept);
        setUserData({ ...userData, dept: newDept });
        console.log('dept after update:', userData.dept);
    };
    // Function to update the facultyID in the context
    const updateFacultyID = (newFacultyID) => {
        console.log('facultyID during update:', newFacultyID);
        setUserData({ ...userData, facultyID: newFacultyID });
        console.log('facultyID after update:', userData.facultyID);
    };

    return (
        <UserContext.Provider value={{ userData, setUserData, updateRollNo, updateDept, updateFacultyID }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
