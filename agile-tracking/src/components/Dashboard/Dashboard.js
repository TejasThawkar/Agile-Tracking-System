import React from 'react';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserProvider } from '../../context/UserContext';

const Dashboard = () => {
    return (
        <UserProvider>
        <div>
            <ScrumDetails />
        </div>
    </UserProvider>
    );
};

export default Dashboard;
