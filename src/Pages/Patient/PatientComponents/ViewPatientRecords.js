import React, { useState, useContext,useEffect } from 'react';
import { Table, ErrorText, H3, H2, H1 } from 'govuk-react';
import $ from 'jquery';
import PatientContext from '.././PatientComponents/PatientContext'; 

const ViewPatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const { NHSNumber } = useContext(PatientContext); // Get NHSNumber from PatientContext
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    // const NHSNumber = '92233359811'; // NHS Number for testing
  
//Ajax to display patient records
    $.ajax({
      url: 'http://localhost:8000/view_patient_records.php',
      method: 'GET',
      data: { NHSNumber },
      dataType: 'json',
      success: (response) => {
        try {
          if (response.patients) {
            setPatients(response.patients);
            setError(null);
          } else {
            setError(response.message || 'Empty response from the server');
          }
        } catch (error) {
          setError('No patients found');
        }
      },
      error: (error) => {
        setError('Fetching patients failed: ' + error.statusText);
      },
    });
  };

  const getGender = (genderCode) => {
    return genderCode === '1' ? 'Male' : genderCode === '2' ? 'Female' : '-';
  };
//table with the Patient records
  return (
    <> 
      {error ? (
        <ErrorText>{error}</ErrorText>
      ) : patients.length ? (
        <Table caption="Your Patient Records">
          <Table.Row>
            <Table.CellHeader>NHS Number</Table.CellHeader>
            <Table.CellHeader>Forename</Table.CellHeader>
            <Table.CellHeader>Surname</Table.CellHeader>
            <Table.CellHeader>DOB</Table.CellHeader>
            <Table.CellHeader>Gender</Table.CellHeader>
            <Table.CellHeader>Postcode</Table.CellHeader>
            <Table.CellHeader>Email</Table.CellHeader>
          </Table.Row>
          {patients.map((patient, index) => (
            <Table.Row key={index}>
              <Table.Cell>{patient.NHSNumber}</Table.Cell>
              <Table.Cell>{patient.Forename}</Table.Cell>
              <Table.Cell>{patient.Surname}</Table.Cell>
              <Table.Cell>{patient.PersonDOB}</Table.Cell>
              <Table.Cell>{getGender(patient.GenderCode)}</Table.Cell>
              <Table.Cell>{patient.Postcode}</Table.Cell>
              <Table.Cell>{patient.PatientEmail}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      ) : ( //error message
        <H3>No patients found</H3>
      )}
      <H1></H1>
      <H2></H2>
      <H3></H3>
    </>
  );
};

export default ViewPatientRecords;
