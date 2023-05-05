import React from "react";
import {
    Button,
    Main,
    H1
} from "govuk-react";
import { Link } from 'react-router-dom';

import Header from "./ReceptionistHeader";
import Footer from "../../Components/Footer";


function Dashboard() {
    return (
        <div>
            <Header />

            <Main>
            <H1>Receptionist Dashboard</H1>
                
                <Link to="view-doctor-list">
                    <Button>View Doctor List</Button>
                </Link>
            </Main>

            <Footer />
        </div>
    );
}

export default Dashboard;