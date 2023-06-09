import React, { useState, useContext, useEffect } from 'react';
import { Table, ErrorText, H3, H2,H1 } from 'govuk-react';
import PatientContext from './PatientContext';
import $ from 'jquery'; 

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const { NHSNumber } = useContext(PatientContext);

  useEffect(() => {
    fetchAppointments(NHSNumber);
  }, [NHSNumber]);
//ajax query to display appointments
  const fetchAppointments = (NHSNumber) => {
    $.ajax({
      url: 'http://localhost:8000/get_appointments.php',
      method: 'POST',
      dataType: 'json',
      data: {
        'NHSNumber': NHSNumber,
      },
      success: (jsonResponse) => {
        console.log('API Data:', jsonResponse); // Add this line
        if (jsonResponse.appointments) {
          setAppointments(jsonResponse.appointments);
          setError(null);
        } else {
          setError(jsonResponse.message || 'Empty response from the server');
        }
      },
      error: (error) => {
        console.error('API Error:', error); // Add this line
        setError('Fetching appointments failed: ' + error.statusText);
      },
    });
  };
  
//table of coming appointments
  return (
    <>
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : appointments.length ? (
        <Table caption="Your coming appointments" >
        <Table.Row>   </Table.Row>
        <Table.Row>   </Table.Row>
          <Table.Row>
            <Table.CellHeader>Date</Table.CellHeader>
            <Table.CellHeader>Time</Table.CellHeader>
          </Table.Row>
          {appointments.map((appointment, index) => (
            <Table.Row key={index}>
              <Table.Cell>{appointment.AppointmentDate}</Table.Cell>
              <Table.Cell>{appointment.AppointmentTime}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      ) : (
        <H3>No appointments booked</H3>
        
       
      )}
      <H1></H1>
      <H2></H2>
      <H3></H3>
    </>
  );
};

export default AppointmentList;