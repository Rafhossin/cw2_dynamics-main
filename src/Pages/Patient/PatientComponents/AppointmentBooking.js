import React, { useState, useContext, useEffect } from 'react';
import { Select, Radio, Button, ErrorText, Panel,Label, H3, H2, H1 } from 'govuk-react';
import $ from 'jquery';
import PatientContext from '.././PatientComponents/PatientContext'; // Import PatientContext
import { Link } from 'react-router-dom';

const AppointmentBooking = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [dateConfirmed, setDateConfirmed] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { NHSNumber } = useContext(PatientContext); // Get NHSNumber from PatientContext
  const [hasAppointment, setHasAppointment] = useState(false);


useEffect(() => {
  checkForExistingAppointments(NHSNumber);
}, [NHSNumber]);

// ajax query to check for existing appointments
const checkForExistingAppointments = (NHSNumber) => {
  $.ajax({
    url: 'http://localhost:8000/get_appointments.php',
    method: 'POST',
    dataType: 'json',
    data: {
      'NHSNumber': NHSNumber,
    },
    success: (jsonResponse) => {
      if (jsonResponse.appointments && jsonResponse.appointments.length > 0) {
        setHasAppointment(true);
      } else {
        setHasAppointment(false);
      }
    },
    error: (error) => {
      console.error('API Error:', error);
    },
  });
};
// validation and format of date and time

  const isValidDate = () => {
    return year && month && day;
  };

  const formatDate = () => {
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  const formatTime = () => {
    return time;
  };

  const handleDateConfirmation = (event) => {
    event.preventDefault();
    if (isValidDate()) {
      setDateConfirmed(true);
    }
  };

  const handleBooking = (event) => {
    event.preventDefault();
    if (!isValidDate() || !time) {
      return;
    }
    const appointmentDate = formatDate();
    const appointmentTime = formatTime();
    // const NHSNumber = '92233359811'; //  NHS Number for testing
    const DoctorId = parseInt(time.split(':')[0]) < 12 ? (Math.floor(Math.random() * 3) + 1).toString() : (Math.floor(Math.random() * 3) + 4).toString();

    // Ajax query to book appoinment
    $.ajax({
      url: 'http://localhost:8000/book_appointment.php',
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        'NHSNumber': NHSNumber,
        'AppointmentDate': appointmentDate,
        'AppointmentTime': appointmentTime,
        'DoctorId': DoctorId,
      }),
      success: (response) => {
        if (response.message === "Appointment was booked successfully.") {
          console.log('Booking successful:', response);
          setBookingConfirmed(true);
        } else {
          console.error('Booking failed:', response.message);
        }
      },
    });
  };
  const renderDays = () => {
    let days = [];
    const daysInMonth = new Date(year, month, 0).getDate();
  
    for (let i = 1; i <= daysInMonth; i++) {
      const dayValue = i < 10 ? `0${i}` : i;
      days.push(
        <option key={i} value={i}>
          {dayValue}
        </option>
      );
    }
  
    return days;
  };
  
//Format time slots
  const renderTimeSlots = () => {
    const timeSlots = [];
    const startHour = 9;
    const endHour = 16;

    for (let i = startHour; i < endHour; i++) {
      for (let j = 0; j < 2; j++) {
        const timeValue = (i < 10 ? '0' + i : i) + ':' + (j === 0 ? '00' : '30');
        timeSlots.push(
          <Radio
            key={timeValue}
            name="timeSlot"
            value={timeValue}
            onChange={(e) => setTime(e.target.value)}
          >
            {timeValue}
          </Radio>
        );
      }
    }

    return timeSlots;
  };
  return (
    <div>
      {hasAppointment ? (
        <>
          <Label><H3>Existing Appointment</H3></Label>
          <ErrorText>
            You already have an appointment. Please cancel your existing appointment before booking a new one.
          </ErrorText>
          <H1></H1>
              <H2></H2>
           <ErrorText>
           <H1></H1>
          </ErrorText>
          <ErrorText>
           <H2></H2>
          </ErrorText>
         
          <Button as={Link} to='/patientdashboard/patient-cancel-appointment'>
            Cancel Appointment
          </Button>
          <H1></H1>
              <H2></H2>
        
        </>
      ) : (
        <>
          {!bookingConfirmed && (
            <>
            <H3>Please select date and time</H3>
            <H1></H1>
              <Select
                hint="Please select the year of your booking"
                input={{ name: 'year', onChange: (e) => setYear(e.target.value) }}
                label="Year"
              >
                <option value="">Select year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Select>
              <h3></h3>
              <Select
                hint="Please select the month of your booking"
                input={{ name: 'month', onChange: (e) => setMonth(e.target.value) }}
                label="Month"
              >
                <option value="">Select month</option>
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </option>
                ))}
              </Select>
              <H3></H3>
              <Select
                hint="Please select the day of your booking"
                input={{ name: 'day', onChange: (e) => setDay(e.target.value) }}
                label="Day"
              >
                <option value="">Select day</option>
                {renderDays()}
              </Select>
              <H1></H1>
              <H2></H2>
              <Button onClick={handleDateConfirmation}>Confirm date</Button>
              <H1></H1>
              <H2></H2>
              {dateConfirmed && (
                <>
                  <h3>Select a time slot</h3>
                  {renderTimeSlots()}
                  <H1></H1>
              <H2></H2>
                  <Button onClick={handleBooking}>Book appointment</Button>
                  <H1></H1>
              <H2></H2>
                </>
              )}
            </>
          )}
  
          {bookingConfirmed && (
            <>
            <Panel title="Booking Confirmed">
              <p>Your appointment has been booked successfully.</p>
            </Panel>
            <H1></H1>
            <Button as={Link} to='/patientdashboard/patient-view-appointment'>View Appointments</Button> 
        </>
          )}
          <H1></H1>
              <H2></H2></>
      )}
    </div>
  );
  
  
};

export default AppointmentBooking;