
/****Author- w1785478 *****/
import React, { useState, useContext, useEffect } from 'react';
import { FormGroup, Select, Button,H1, ErrorText,Panel } from 'govuk-react';
import $ from 'jquery';
import { useLocation } from 'react-router-dom';
import DoctorContext from './DoctorContext';
import { Link } from 'react-router-dom';

//The UpdateMedicalRecordComponent is a React functional component that allows doctors to update a patient's medical record, particularly with vaccination details. It manages several pieces of state to hold form values and also uses some hard-coded arrays to populate select dropdown menus. It uses jQuery AJAX to make an API request to update the patient's medical record in the backend.
const UpdateMedicalRecordComponent = () => {

//Initializes state variables for various form inputs and some control variables such as 'success' and 'errorMessage'.       
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Add state variables for each field
  const [doseNumber, setDoseNumber] = useState('');
  const [vaccineManufacturer, setVaccineManufacturer] = useState('');
  const [vaccineType, setVaccineType] = useState('');
  const [product, setProduct] = useState('');
  const [vaccineBatchNumber, setVaccineBatchNumber] = useState('');
  const [totalSeriesOfDosesOptions , setTotalSeriesOfDoses] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [snomedCode, setSnomedCode] = useState('');
 
  const [booster, setBooster] = useState('');
  const [success, setSuccess] = useState(false);
 
  //Gets the DoctorId from the DoctorContext and initializes the nhsNumber from the location state passed from the previous component
  const { DoctorId } = useContext(DoctorContext);
  const [nhsNumber, setNhsNumber] = useState('');
  const location = useLocation();

  
  //sets the nhsNumber from the location state.
  useEffect(() => {
    if (location.state && location.state.nhsNumber) {
      setNhsNumber(location.state.nhsNumber);
    }
  }, [location]);

  const nhsNumberInput = location.state?.nhsNumberInput;

  //formValues is an object containing all form values, which will be sent in the API request.
  const formValues = {
    DoseNumber: doseNumber,
    VaccineManufacturer: vaccineManufacturer,
    VaccineType: vaccineType,
    Product: product,
    VaccineBatchNumber: vaccineBatchNumber,
    TotalSeriesOfDoses: totalSeriesOfDosesOptions,
    DisplayName: displayName,
    SnomedCode: snomedCode,
    Booster: booster,
  };


    //date formatter
    const dateFormated = () => {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };
      
   
  // Function to handles form submission by validating inputs,   formatting date, and making an AJAX request to update the patient's medical record.
  const updatePatientMedicalRecords = () => {
    // Check if all fields are filled
    for (const key in formValues) {
      if (formValues[key] === '' && dateFormated()==='' ) {
          setErrorMessage('Please fill all fields');
        return;
      }
    }
  
    const  dateEntered  = dateFormated();

    $.ajax({
      url: 'http://localhost:8000/UpdatePatientMedicalRecord.php',
      method: 'POST',
      data: {  DoseNumber: formValues.DoseNumber,
          VaccineManufacturer: formValues.VaccineManufacturer,
          VaccineType: formValues.VaccineType,
          Product: formValues.Product,
          VaccineBatchNumber: formValues.VaccineBatchNumber,
          TotalSeriesOfDoses: formValues.TotalSeriesOfDoses,
          DisplayName: formValues.DisplayName,
          SnomedCode: formValues.SnomedCode,
          Booster: formValues.Booster, 
          NHSNumber:nhsNumberInput,
          DoctorId:DoctorId, 
          DateEntered:dateEntered },
      dataType: 'json',
      success: (response) => {
        if (response.success) {
          setSuccess(true);
          setErrorMessage(null);
        } else {
          setErrorMessage(response.message || 'Error updating patient medical record');
        }
      },
      error: (error) => {
          setErrorMessage('Updating patient medical record failed.Please try again later.' );
      },
    });
  };

        //Hard-coded arrays of vaccineManufacturers, vaccineTypes, products, vaccineBatchNumbers, totalSeriesOfDoses, displayNames, snomedCodes, and boosters are defined for populating select dropdown menus.
        const vaccineManufacturers = [
          {
            label: '(AstraZeneca AB, ORG-100001699)',
            value: '(AstraZeneca AB, ORG-100001699)',
          },
          {
            label: '(Janssen-Cilag International, ORG-100001417)',
            value: '(Janssen-Cilag International, ORG-100001417)',
        },
        {
        label: '(Moderna Biotech Spain S.L., ORG-100031184)',
        value: '(Moderna Biotech Spain S.L., ORG-100031184)',
        },
        {
        label: '(Biontech Manufacturing GmbH, ORG-100030215)',
        value: '(Biontech Manufacturing GmbH, ORG-100030215)',
        },
        {
        label: '(Novavax CZ a.s., ORG-100032020)',
        value: '(Novavax CZ a.s., ORG-100032020)',
        },
        ];
        
        const vaccineTypes = [
        { label: '(AstraZeneca, 39115011000001105)', value: '(AstraZeneca, 39115011000001105)' },
        { label: '(Janssen, 39230211000001104)', value: '(Janssen, 39230211000001104)' },
        { label: '(SpikevaxBivalent, 40801911000001102)', value: '(SpikevaxBivalent, 40801911000001102)' },
        { label: '(Pfizer, 39115711000001107)', value: '(Pfizer, 39115711000001107)' },
        { label: '(Novavax, 39473011000001103)', value: '(Novavax, 39473011000001103)' },
        ];
        
        const products = [
        { label: '(Vaxzevria, EU/1/21/1529)', value: '(Vaxzevria, EU/1/21/1529)' },
        { label: '(Jcovden, EU/1/20/1525)', value: '(Jcovden, EU/1/20/1525)' },
        { label: '(Spikevax, EU/1/20/1507)', value: '(Spikevax, EU/1/20/1507)' },
        { label: '(Comirnaty, EU/1/20/1528)', value: '(Comirnaty, EU/1/20/1528)' },
        { label: '(Nuvaxovid, EU/1/21/1618)', value: '(Nuvaxovid, EU/1/21/1618)' },
        ];
        
        const vaccineBatchNumbers = [
        { label: '346753P1', value: '346753P1' },
        { label: '347442P', value: '347442P' },
        { label: 'XE393', value: 'XE393' },
        { label: '202A21A', value: '202A21A' },
        { label: '039K20A', value: '039K20A' },
        ];
        
        const totalSeriesOfDoses = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        ];
        
        const displayNames = [
        { label: 'COVID-19 Vaccine AstraZeneca', value: 'COVID-19 Vaccine AstraZeneca' },
        { label: 'COVID-19 Vaccine Janssen', value: 'COVID-19 Vaccine Janssen' },
        { label: 'COVID-19 Vaccine Moderna', value: 'COVID-19 Vaccine Moderna' },
        { label: 'Pfizer/BioNTech COVID-19 vaccine', value: 'Pfizer/BioNTech COVID-19 vaccine' },
        { label: 'COVID-19 Vaccine Novavax', value: 'COVID-19 Vaccine Novavax' },
];

const snomedCodes = [
{ label: '39114900000000000', value: 39114900000000000 },
{ label: '39233900000000000', value: 39233900000000000 },
{ label: '39326800000000000', value: 39326800000000000 },
{ label: '39116100000000000', value: 39116100000000000 },
{ label: '999001000000000000', value: 999001000000000000 },
];

const boosters = [
{ label: '0', value: 0 },
{ label: '1', value: 1 },
];

//helper functions for rendering select dropdown menu options.
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

 //helper functions for rendering select dropdown menu options.
  const doseNumbers = Array.from({ length: 10 }, (_, i) => ({ label: i + 1, value: i + 1 }));

  //helper functions for rendering select dropdown menu options.
  const renderSelectOptions = (options) => {
          if (Array.isArray(options)) {
            return options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ));
          } else {
            return options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ));
          }
        };
        
return (
  <div>
 {success ? (
      <>
        
        <Panel title="Medical Record Update Confirmed">
          <p> Patient [NHS no:{nhsNumberInput}] Medical Record Has Been Updated Successfully.</p>
        </Panel>
        <H1></H1>
        <Button as={Link} to="/doctor-dashboard/appointments">View Appointment</Button>
      </>
    ) : (
       <>
   

   
    {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
    
     <FormGroup>
      <label htmlFor="doseNumber">Dose Number</label>
      <Select
        id="doseNumber"
        name="doseNumber"
        value={doseNumber}
        onChange={(e) => setDoseNumber(e.target.value)}
      >
        <option value="">Select dose number</option>
        {renderSelectOptions(doseNumbers)}
      </Select>
      </FormGroup>
      <FormGroup>
          <Select
            label="Vaccine Manufacturer"
            value={vaccineManufacturer}
            onChange={(e) => setVaccineManufacturer(e.target.value)}
            required
          >
            <option value="">Choose Vaccine Manufacturer</option>
            {renderSelectOptions(vaccineManufacturers)}
          </Select>
        </FormGroup>
  
        <FormGroup>
          <Select
            label="Vaccine Type"
            value={vaccineType}
            onChange={(e) => setVaccineType(e.target.value)}
            required
          >
            <option value="">Choose Vaccine Type</option>
            {renderSelectOptions(vaccineTypes)}
          </Select>
        </FormGroup>
  
        <FormGroup>
          <Select
            label="Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          >
            <option value="">Choose Product</option>
            {renderSelectOptions(products)}
          </Select>
        </FormGroup>
  
        <FormGroup>
          <Select
            label="Vaccine Batch Number"
            value={vaccineBatchNumber}
            onChange={(e) => setVaccineBatchNumber(e.target.value)}
            required
            >
            <option value="">Choose Vaccine Batch Number</option>
            {renderSelectOptions(vaccineBatchNumbers)}
            </Select>
          </FormGroup>
  
          <FormGroup>
          <Select
          label="Total Series Of Doses"
          value={totalSeriesOfDoses}
          onChange={(e) => setTotalSeriesOfDoses(e.target.value)}
          required
          >
          <option value="">Choose Total Series Of Doses</option>
          {renderSelectOptions(totalSeriesOfDoses)}
          </Select>
          </FormGroup>

          <FormGroup>
          <Select
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          >
          <option value="">Choose Display Name</option>
          {renderSelectOptions(displayNames)}
          </Select>
          </FormGroup>

          <FormGroup>
          <Select
          label="Snomed Code"
          value={snomedCode}
          onChange={(e) => setSnomedCode(e.target.value)}
          required
          >
          <option value="">Choose Snomed Code</option>
          {renderSelectOptions(snomedCodes)}
          </Select>
          </FormGroup>

          <FormGroup>
          
          <Select
          label = "Booster"
          name="booster"
          value={booster}
          onChange={(e) => setBooster(e.target.value)}
          >
          <option value="">Select Booster</option>
          {renderSelectOptions(boosters)}
         
          </Select>
          </FormGroup>
          
            <Select
                hint="Please select the year you want to enter the data for"
                input={{ name: 'year', onChange: (e) => setYear(e.target.value) }}
                label="Date Entered - Year"
              >
                <option value="">Choose Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </Select>

          
              <Select
                hint="Please select the month you want to enter the data for"
                input={{ name: 'month', onChange: (e) => setMonth(e.target.value) }}
                label="Date Entered - Month"
              >
                <option value="">Choose Month</option>
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </option>
                ))}
              </Select>
             
              
              <Select
                hint="Please select the day you want to enter the medical data for"
                input={{ name: 'day', onChange: (e) => setDay(e.target.value) }}
                label="Date Entered - Day"
              >
                <option value="">Choose Day</option>
                {renderDays()}
              </Select>
    
          
    <Button onClick={updatePatientMedicalRecords}>Update Patient Medical Record</Button>
    </>
    )}
    </div>
  );
  }
export default UpdateMedicalRecordComponent;
