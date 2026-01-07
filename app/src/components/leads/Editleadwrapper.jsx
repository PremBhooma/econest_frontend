import React, { use, useEffect, useState } from "react";
import Settingsapi from "../api/Settingsapi";
import Generalapi from "@/components/api/Generalapi";
import Leadapi from "@/components/api/Leadapi";
import Employeeapi from "../api/Employeeapi";

import Errorpanel from "@/components/shared/Errorpanel";
import { IconArrowLeft } from "@tabler/icons-react";
import { toast, ToastContainer } from "react-toastify";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Textinput,
  Select,
  Loadingoverlay,
  Datepicker,
} from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";

function Editleadwrapper() {
  const navigate = useNavigate();

  const params = useParams();
  const leadUuid = params?.single_lead_id;

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employeeId = employeeInfo?.id || null;

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);

  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const updateFullName = (e) => {
    const value = e.target.value;
    const formatted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setFullName(formatted);
    setFullNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    setEmailError("");
  };

  const [email2, setEmail2] = useState("");
  const [emailError2, setEmailError2] = useState("");
  const updateEmail2 = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail2(value);
    setEmailError2("");
  };

  const [phoneCode, setPhoneCode] = useState("91");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const updatePhoneCode = (value) => {
    setPhoneCode(value);
    setPhoneCodeError("");
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const updatePhoneNumber = (e) => {
    let value = e.target.value;

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // if phoneCode is India (+91), restrict to 10 digits
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhoneNumber(value);
    setPhoneNumberError("");
  };


  const [employee, setEmployee] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const updateEmployee = (value) => {
    setEmployee(value);
    setEmployeeError("");
  }

  const [sourseOfLead, setSourseOfLead] = useState("");
  const [sourseOfLeadError, setSourseOfLeadError] = useState("");
  const updateSourseOfLead = (value) => {
    setSourseOfLead(value);
    setSourseOfLeadError("");
  };

  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
  };

  const [prefixes, setPrefixes] = useState("");
  const [prefixError, setPrefixError] = useState("");
  const updatePrefix = (value) => {
    setPrefixes(value);
    setPrefixError("");

    if (value === "Mr") {
      setGender("Male");
    } else if (["Mrs", "Miss"].includes(value)) {
      setGender("Female");
    } else {
      setGender("");
    }
  }

  const [landlineCountryCode, setLandlineCountryCode] = useState("91");
  const [landlineCountryCodeError, setLandlineCountryCodeError] = useState("");
  const updateLandlineCountryCode = (value) => {
    setLandlineCountryCode(value);
    setLandlineCountryCodeError("");
  };

  const [landlineCityCode, setLandlineCityCode] = useState("");
  const [landlineCityCodeError, setLandlineCityCodeError] = useState("");
  const updateLandlineCityCode = (e) => {
    setLandlineCityCode(e.target.value);
    setLandlineCityCodeError("");
  };

  const [landlineNumber, setLandlineNumber] = useState("");
  const [landlineNumberError, setLandlineNumberError] = useState("");
  const updateLandlineNumber = (e) => {
    setLandlineNumber(e.target.value);
    setLandlineNumberError("");
  };

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");
  const updateDateOfBirth = (value) => {
    setDateOfBirth(value);
    setDateOfBirthError("");
  };

  const [fatherName, setFatherName] = useState("");
  const [fatherNameError, setFatherNameError] = useState("");
  const updateFatherName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setFatherName(formatted);
    setFatherNameError("");
  };

  const [spousePrefix, setSpousePrefix] = useState("");
  const [spousePrefixError, setSpousePrefixError] = useState("");
  const updateSpousePrefix = (value) => {
    setSpousePrefix(value);
    setSpousePrefixError("");
  };

  const [spouseName, setSpouseName] = useState("");
  const [spouseNameError, setSpouseNameError] = useState("");
  const updateSpouseName = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setSpouseName(formatted);
    setSpouseNameError("");
  };

  const [maritalStatus, setMaritalStatus] = useState("");
  const [maritalStatusError, setMaritalStatusError] = useState("");
  const updateMaritalStatus = (value) => {
    setMaritalStatus(value);
    setMaritalStatusError("");
  };

  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [numberOfChildrenError, setNumberOfChildrenError] = useState("");
  const updateNumberOfChildren = (e) => {
    setNumberOfChildren(e.target.value);
    setNumberOfChildrenError("");
  };

  const [weddingAniversary, setWeddingAniversary] = useState("");
  const [weddingAniversaryError, setWeddingAniversaryError] = useState("");
  const updateWeddingAniversary = (value) => {
    setWeddingAniversary(value);
    setWeddingAniversaryError("");
  };

  const [spouseDob, setSpouseDob] = useState("");
  const [spouseDobError, setSpouseDobError] = useState("");
  const updateSpouseDob = (value) => {
    setSpouseDob(value);
    setSpouseDobError("");
  };

  const [panCardNo, setPanCardNo] = useState("");
  const [panCardNoError, setPanCardNoError] = useState("");
  const updatePanCardNo = (e) => {
    // setPanCardNo(e.target.value);
    // setPanCardNoError("");

    const value = e.target.value.toUpperCase();
    setPanCardNo(value);
    setPanCardNoError("");
  };

  const [aadharCardNo, setAadharCardNo] = useState("");
  const [aadharCardNoError, setAadharCardNoError] = useState("");
  const updateAadharCardNo = (e) => {
    setAadharCardNo(e.target.value);
    setAadharCardNoError("");
  };

  const [countryOfCitizenship, setCountryOfCitizenship] = useState("");
  const [countryOfCitizenshipError, setCountryOfCitizenshipError] =
    useState("");
  const updateCountryOfCitizenship = (value) => {
    setCountryOfCitizenship(value);
    setCountryOfCitizenshipError("");
  };

  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [countryOfResidenceError, setCountryOfResidenceError] = useState("");
  const updateCountryOfResidence = (value) => {
    setCountryOfResidence(value);
    setCountryOfResidenceError("");
  };

  const [motherTongue, setMotherTongue] = useState("");
  const [motherTongueError, setMotherTongueError] = useState("");
  const updateMotherTongue = (e) => {
    setMotherTongue(e.target.value);
    setMotherTongueError("");
  };

  const [nameOfPoa, setNameOfPoa] = useState("");
  const [nameOfPoaError, setNameOfPoaError] = useState("");
  const updateNameOfPoa = (e) => {
    const value = e.target.value;
    const formatted =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setNameOfPoa(formatted);
    setNameOfPoaError("");
  };

  const [holderPoa, setHolderPoa] = useState("");
  const [holderPoaError, setHolderPoaError] = useState("");
  const updateHolderPoa = (value) => {
    setHolderPoa(value);
    setHolderPoaError("");
  };

  const [noOfYearsCorrespondenceAddress, setNoOfYearsCorrespondenceAddress] =
    useState("");
  const [
    noOfYearsCorrespondenceAddressError,
    setNoOfYearsCorrespondenceAddressError,
  ] = useState("");
  const updateNoOfYearsCorrespondenceAddress = (e) => {
    setNoOfYearsCorrespondenceAddress(e.target.value);
    setNoOfYearsCorrespondenceAddressError("");
  };

  const [noOfYearsCity, setNoOfYearsCity] = useState("");
  const [noOfYearsCityError, setNoOfYearsCityError] = useState("");
  const updateNoOfYearsCity = (e) => {
    setNoOfYearsCity(e.target.value);
    setNoOfYearsCityError("");
  };

  const [haveYouOwnedAbode, setHaveYouOwnedAbode] = useState("");
  const [haveYouOwnedAbodeError, setHaveYouOwnedAbodeError] = useState("");
  const updateHaveYouOwnedAbode = (value) => {
    setHaveYouOwnedAbode(value);
    setHaveYouOwnedAbodeError("");
  };

  const [ifOwnedProjectName, setIfOwnedProjectName] = useState("");
  const [ifOwnedProjectNameError, setIfOwnedProjectNameError] = useState("");
  const updateIfOwnedProjectName = (e) => {
    setIfOwnedProjectName(e.target.value);
    setIfOwnedProjectNameError("");
  };

  const [stateData, setStateData] = useState([]);
  const [correspondenceCityData, setCorrespondenceCityData] = useState([]);
  const [permanentCityData, setPermanentCityData] = useState([]);

  const [correspondenceCountry, setCorrespondenceCountry] = useState("101");
  const [correspondenceCountryError, setCorrespondenceCountryError] =
    useState("");
  const updateCorrespondenceCountry = (value) => {
    setCorrespondenceCountry(value);
    getStates(value)
    setCorrespondenceCountryError("");

  };


  const [correspondenceState, setCorrespondenceState] = useState("");
  const [correspondenceStateError, setCorrespondenceStateError] = useState("");
  const updateCorrespondenceState = (value) => {
    setCorrespondenceState(value);
    setCorrespondenceStateError("");
  };

  console.log("Correspondence State", correspondenceState);


  const [correspondenceCity, setCorrespondenceCity] = useState("");
  const [correspondenceCityError, setCorrespondenceCityError] = useState("");
  const updateCorrespondenceCity = (value) => {
    setCorrespondenceCity(value);
    setCorrespondenceCityError("");
  };

  const [correspondencePincode, setCorrespondencePincode] = useState("");
  const [correspondencePincodeError, setCorrespondencePincodeError] =
    useState("");
  const updateCorrespondencePincode = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setCorrespondencePincode(value);
    setCorrespondencePincodeError("");
  };

  const [correspondenceAddress, setCorrespondenceAddress] = useState("");
  const [correspondenceAddressError, setCorrespondenceAddressError] =
    useState("");
  const updateCorrespondenceAddress = (e) => {
    setCorrespondenceAddress(e.target.value);
    setCorrespondenceAddressError("");
  };

  const [permanentCountry, setPermanentCountry] = useState("101");
  const [permanentCountryError, setPermanentCountryError] = useState("");
  const updatePermanentCountry = (value) => {
    setPermanentCountry(value);
    setPermanentCountryError("");
  };

  const [permanentState, setPermanentState] = useState("");
  const [permanentStateError, setPermanentStateError] = useState("");
  const updatePermanentState = (value) => {
    setPermanentState(value);
    setPermanentStateError("");
  };

  const [permanentCity, setPermanentCity] = useState("");
  const [permanentCityError, setPermanentCityError] = useState("");
  const updatePermanentCity = (value) => {
    setPermanentCity(value);
    setPermanentCityError("");
  };

  const [permanentPincode, setPermanentPincode] = useState("");
  const [permanentPincodeError, setPermanentPincodeError] = useState("");
  const updatePermanentPincode = (e) => {
    setPermanentPincode(e.target.value);
    setPermanentPincodeError("");
  };

  const [permanentAddress, setPermanentAddress] = useState("");
  const [permanentAddressError, setPermanentAddressError] = useState("");
  const updatePermanentAddress = (e) => {
    setPermanentAddress(e.target.value);
    setPermanentAddressError("");
  };

  const [isSameAddress, setIsSameAddress] = useState(false);

  const handleIsSameAddress = (checked) => {
    setIsSameAddress(checked);

    if (checked) {
      setPermanentCountry(correspondenceCountry);
      setPermanentState(correspondenceState);
      setPermanentCity(correspondenceCity);
      setPermanentAddress(correspondenceAddress);
      setPermanentPincode(correspondencePincode);
    }
    if (!checked) {
      setPermanentCountry("");
      setPermanentState("");
      setPermanentCity("");
      setPermanentAddress("");
      setPermanentPincode("");
    }
  };

  const [currentDesignation, setCurrentDesignation] = useState("");
  const [currentDesignationError, setCurrentDesignationError] = useState("");
  const updateCurrentDesignation = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setCurrentDesignation(formatted);
    setCurrentDesignationError("");
  };

  const [currentOrganization, setCurrentOrganization] = useState("");
  const [currentOrganizationError, setCurrentOrganizationError] = useState("");
  const updateCurrentOrganization = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setCurrentOrganization(formatted);
    setCurrentOrganizationError("");
  };

  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationAddressError, setOrganizationAddressError] = useState("");
  const updateOrganizationAddress = (e) => {
    const value = e.target.value;
    const formatted = value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    setOrganizationAddress(formatted);
    setOrganizationAddressError("");
  };

  const [workExperience, setWorkExperience] = useState("");
  const [workExperienceError, setWorkExperienceError] = useState("");
  const updateWorkExperience = (e) => {
    setWorkExperience(e.target.value);
    setWorkExperienceError("");
  };

  const [annualIncome, setAnnualIncome] = useState("");
  const [annualIncomeError, setAnnualIncomeError] = useState("");
  const updateAnnualIncome = (e) => {
    setAnnualIncome(e.target.value);
    setAnnualIncomeError("");
  };


  async function getStates(country) {
    await Settingsapi.get("/get-states", {
      params: {
        country_id: country,
      },
    })
      .then((response) => {
        const data = response?.data;
        if (data?.status === "error") {
          let finalResponse;
          finalResponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalResponse);
          setIsLoadingEffect(false);
          return;
        }
        setStateData(data?.data || []);
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        let finalresponse;
        if (error?.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
      });
  }

  async function getCities(stateId) {
    return await Settingsapi.get("/get-cities", {
      params: {
        state_id: stateId,
      },
    });
  }

  const [employeeData, setEmployeeData] = useState([]);

  async function getEmployees() {
    await Employeeapi.get("/get-all-employees-list")
      .then((response) => {
        const data = response?.data;
        if (data?.status === "error") {
          let finalResponse;
          finalResponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalResponse);
          setIsLoadingEffect(false);
          return;
        }
        setEmployeeData(data?.employees || []);
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        let finalresponse;
        if (error?.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
      });
  }

  useEffect(() => {
    if (correspondenceState) {
      getCities(correspondenceState)
        .then((res) => {
          if (res?.data?.status === "error") {
            setErrorMessage(res?.data?.message || "");
          }

          setCorrespondenceCityData(res?.data?.data || []);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setCorrespondenceCityData([]);
    }
  }, [correspondenceState]);

  useEffect(() => {
    if (permanentState) {
      getCities(permanentState)
        .then((res) => {
          if (res?.data?.status === "error") {
            setErrorMessage(res?.data?.message || "");
          }
          setPermanentCityData(res?.data?.data || []);
        })
        .catch((err) => setErrorMessage(err.message));
    } else {
      setPermanentCityData([]);
    }
  }, [permanentState]);

  const [countryCodes, setCountryCodes] = useState([]);
  const [countryNames, setCountryNames] = useState([]);

  async function fetchCountryCodes() {
    setIsLoadingEffect(true);
    try {
      const response = await Generalapi.get("/getcountries");
      const data = response.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setCountryCodes(data.countrydata || []);
      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchCountryCodes error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch country codes",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  async function fetchCountryNames() {
    setIsLoadingEffect(true);
    try {
      const response = await Generalapi.get("/getcountriesnames");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setCountryNames(data?.countryNames || []);
      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchCountryNames error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch country codes",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  async function getSingleLeadData(leadUuid) {
    if (leadUuid === null) {
      setErrorMessage({
        message: "Customer ID is missing wowo",
        server_res: null,
      });
      setIsLoadingEffect(false);
      return false;
    }

    setIsLoadingEffect(true);
    await Leadapi.get("get-single-lead", {
      params: {
        leadUuid: leadUuid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        console.log("Data single", data)
        if (data !== null) {
          setPrefixes(data?.data?.prefixes || "");
          setFullName(data?.data?.full_name || "");
          setEmail(data?.data?.email || "");
          setEmail2(data?.data?.email_2 || "");
          setPhoneCode(`${data?.data?.phone_code || "91"}`);
          setPhoneNumber(data?.data?.phone_number || "");
          setEmployee(data?.data?.assigned_to_employee_id || "");
          setSourseOfLead(data?.data?.source_of_lead || "");
          setGender(data?.data?.gender || "");
          setLandlineCountryCode(data?.data?.landline_country_code || "91");
          setLandlineCityCode(data?.data?.landline_city_code || "");
          setLandlineNumber(data?.data?.landline_number || "");
          setDateOfBirth(new Date(data?.data?.date_of_birth) || "");
          setFatherName(data?.data?.father_name || "");
          setSpousePrefix(data?.data?.spouse_prefixes || "");
          setSpouseName(data?.data?.spouse_name || "");
          setMaritalStatus(data?.data?.marital_status || "");
          setNumberOfChildren(data?.data?.number_of_children || "");
          setWeddingAniversary(
            data?.data?.wedding_aniversary !== null
              ? new Date(data?.data?.wedding_aniversary)
              : ""
          );
          setSpouseDob(
            data?.data?.spouse_dob !== null
              ? new Date(data?.data?.spouse_dob)
              : ""
          );
          setPanCardNo(data?.data?.pan_card_no || "");
          setAadharCardNo(data?.data?.aadhar_card_no || "");
          setCountryOfCitizenship(data?.data?.country_of_citizenship || "");
          setCountryOfResidence(data?.data?.country_of_residence || "");
          setMotherTongue(data?.data?.mother_tongue || "");
          setNameOfPoa(data?.data?.name_of_poa || "");
          setHolderPoa(data?.data?.holder_poa || "");
          setNoOfYearsCorrespondenceAddress(
            data?.data?.no_of_years_correspondence_address || ""
          );
          setNoOfYearsCity(data?.data?.no_of_years_city || "");
          setHaveYouOwnedAbode(data?.data?.have_you_owned_abode || "");
          setIfOwnedProjectName(data?.data?.if_owned_project_name || "");
          setCorrespondenceCountry(
            data?.data?.correspondenceCountryId || "101"
          );
          setCorrespondenceState(data?.data?.correspondenceStateId || "");
          setCorrespondenceCity(data?.data?.correspondenceCityId || "");
          setCorrespondenceAddress(data?.data?.correspondenceAddress || "");
          setCorrespondencePincode(data?.data?.correspondencePincode || "");
          setPermanentCountry(data?.data?.permanentCountryId || "101");
          setPermanentState(data?.data?.permanentStateId || "");
          setPermanentCity(data?.data?.permanentCityId || "");
          setPermanentAddress(data?.data?.permanentAddress || "");
          setPermanentPincode(data?.data?.permanentPincode || "");
          setCurrentDesignation(data?.data?.current_designation || "");
          setCurrentOrganization(data?.data?.name_of_current_organization || "");
          setOrganizationAddress(data?.data?.address_of_current_organization || "");
          setWorkExperience(data?.data?.no_of_years_work_experience || "");
          setAnnualIncome(data?.data?.current_annual_income || "");
        }
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Fetch customer error:", error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });
  }

  const handleSubmit = () => {
    setIsLoadingEffect(true);

    if (prefixes === "") {
      setPrefixError("Prefix is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (fullName === "") {
      setFullNameError("Full name is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (email === "") {
      setEmailError("Email is required");
      setIsLoadingEffect(false);
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      setIsLoadingEffect(false);
      return false;
    }

    // if (!emailPattern.test(email2)) {
    //     setEmailError2("Invalid email address 2");
    //     setIsLoadingEffect(false);
    //     return false;
    // }

    if (phoneCode === "") {
      setPhoneCodeError("Phone code is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (phoneNumber === "") {
      setPhoneNumberError("Phone number is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Please enter a valid 10-digit phone number");
      setIsLoadingEffect(false);
      return false;
    }

    // if (dateOfBirth === "") {
    //   setDateOfBirthError("Date of Birth is required");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (gender === "") {
    //   setGenderError("Gender is required");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (prefixes === "Mr" && gender === "Female") {
    //   setGenderError("Gender does not match selected prefix");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if ((prefixes === "Mrs" || prefixes === "Miss") && gender === "Male") {
    //   setGenderError("Gender does not match selected prefix");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (aadharCardNo && aadharCardNo.toString().length !== 12) {
    //   setAadharCardNoError("Aadhar Card is invalid");
    //   setIsLoadingEffect(false);
    //   return false;
    // }

    // if (panCardNo) {
    //   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    //   if (!panRegex.test(panCardNo)) {
    //     setPanCardNoError("PAN Card is invalid");
    //     setIsLoadingEffect(false);
    //     return false;
    //   }
    // }

    Leadapi.post("edit-lead", {
      leadUuid: leadUuid,
      prefixes: prefixes,
      full_name: fullName,
      email: email,
      email_2: email2,
      phone_code: phoneCode,
      phone_number: phoneNumber,
      employee_id: employee,
      sourse_of_lead: sourseOfLead,
      gender: gender,
      landline_country_code: landlineCountryCode,
      landline_city_code: landlineCityCode,
      landline_number: landlineNumber,
      date_of_birth: dateOfBirth,
      father_name: fatherName,
      spouse_prefixes: spousePrefix,
      spouse_name: spouseName,
      marital_status: maritalStatus,
      number_of_children: Number(numberOfChildren),
      wedding_aniversary: weddingAniversary,
      spouse_dob: spouseDob,
      pan_card_no: panCardNo,
      aadhar_card_no: aadharCardNo,
      country_of_citizenship: countryOfCitizenship,
      country_of_residence: countryOfResidence,
      mother_tongue: motherTongue,
      name_of_poa: nameOfPoa,
      holder_poa: holderPoa,
      no_of_years_correspondence_address: Number(noOfYearsCorrespondenceAddress),
      no_of_years_city: Number(noOfYearsCity),
      have_you_owned_abode: haveYouOwnedAbode,
      if_owned_project_name: ifOwnedProjectName,
      correspondence_country: correspondenceCountry,
      correspondence_state: correspondenceState,
      correspondence_city: correspondenceCity,
      correspondence_address: correspondenceAddress,
      correspondence_pincode: correspondencePincode,
      permanent_country: permanentCountry,
      permanent_state: permanentState,
      permanent_city: permanentCity,
      permanent_address: permanentAddress,
      permanent_pincode: permanentPincode,
      employeeId: employeeId,
      current_designation: currentDesignation,
      name_of_current_organization: currentOrganization,
      address_of_current_organization: organizationAddress,
      no_of_years_work_experience: parseFloat(workExperience),
      current_annual_income: parseFloat(annualIncome),
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          const finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Lead updated successfully");
        navigate("/leads");

        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log("Update lead error:", error);
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            message: error.message,
            server_res: error.response.data,
          };
        } else {
          finalresponse = {
            message: error.message,
            server_res: null,
          };
        }
        setErrorMessage(finalresponse);
        setIsLoadingEffect(false);
        return false;
      });
  };

  useEffect(() => {
    setIsLoadingEffect(true);
    fetchCountryCodes();
    fetchCountryNames();
    getEmployees();
    getStates(101);
  }, []);

  useEffect(() => {
    setIsLoadingEffect(true);
    if (leadUuid) getSingleLeadData(leadUuid);
  }, [leadUuid]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-semibold">Update Lead</h1>
        <Link
          to={"/leads"}
          className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
        >
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </Link>
      </div>
      <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8">
        <div className="grid grid-cols-3 gap-4">

          <div className="w-[100%]">
            <Select
              label="Prefix"
              data={[
                { value: "Mr", label: "Mr" },
                { value: "Mrs", label: "Mrs" },
                { value: "Miss", label: "Miss" },
                { value: "Mx", label: "Mx" },
              ]}
              withAsterisk
              searchable
              error={prefixError}
              value={prefixes}
              onChange={updatePrefix}
              labelClass="mb-[6px] font-medium font-sans text-[#000] text-sm"
              inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            />
          </div>

          <Textinput
            placeholder="Enter Full Name"
            label="Full Name"
            withAsterisk
            value={fullName}
            error={fullNameError}
            onChange={updateFullName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />

          <Textinput
            placeholder="Enter Email Address"
            label="Email Address"
            withAsterisk
            value={email}
            error={emailError}
            onChange={updateEmail}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          {/* <Textinput
            placeholder="Enter Alternate Email Address"
            label="Alternate Email Address"
            value={email2}
            error={emailError2}
            onChange={updateEmail2}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          /> */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-row gap-x-4 w-full">
              <div className="w-20">
                <Select
                  data={countryCodes}
                  placeholder="Code"
                  searchable
                  value={phoneCode}
                  // error={phoneCodeError}
                  onChange={updatePhoneCode}
                  selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                  className="w-full"
                  dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                />
              </div>
              <div className="flex-1">
                <Textinput
                  placeholder="Enter Phone Number"
                  type="text"
                  value={phoneNumber}
                  // error={phoneNumberError}
                  onChange={updatePhoneNumber}
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>
            {phoneCodeError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {phoneCodeError}
              </p>
            )}
            {phoneNumberError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {phoneNumberError}
              </p>
            )}
          </div>

          {/* <Select
            data={employeeData}
            placeholder="Employee"
            label="Assign to Employee"
            searchable
            value={employee}
            error={employeeError}
            onChange={updateEmployee}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            className="w-full"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          /> */}

          <Select
            label="Sourse of lead"
            data={[
              { value: "Instagram", label: "Instagram" },
              { value: "Facebook", label: "Facebook" },
              { value: "Referral", label: "Referral" },
              { value: "Friend", label: "Friend" },
              { value: "Already own flat", label: "Already own flat" },
              { value: "Others", label: "Others" },

            ]}
            searchable
            withAsterisk
            error={sourseOfLeadError}
            value={sourseOfLead}
            onChange={updateSourseOfLead}
            labelClass="font-medium font-sans text-[#000] text-sm"
            inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
            dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto"
            selectWrapperClass="!shadow-none"
          />

          <Select
            label="Country"
            placeholder="Select Country"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropDownClass="overflow-y-hidden"
            selectWrapperClass="bg-white"
            searchable={true}
            data={[{ label: "India", value: "101" }]}
            // data={countryNames}
            value={correspondenceCountry}
            onChange={updateCorrespondenceCountry}
            error={correspondenceCountryError}
          />

          <Select
            label="State"
            placeholder="Select State"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropDownClass="overflow-y-hidden"
            selectWrapperClass="bg-white"
            searchable={true}
            data={stateData}
            value={correspondenceState}
            onChange={updateCorrespondenceState}
            error={correspondenceStateError}
          />

          {correspondenceState && (
            <Select
              label="City"
              placeholder="Select City"
              labelClass="text-sm font-medium text-gray-600 mb-1"
              dropDownClass="overflow-y-hidden"
              selectWrapperClass="bg-white"
              searchable={true}
              data={correspondenceCityData}
              value={correspondenceCity}
              onChange={updateCorrespondenceCity}
              error={correspondenceCityError}
            />
          )}
          {correspondenceCity && (
            <Textinput
              label="Address"
              placeholder="Enter your Address"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm !bg-white"
              value={correspondenceAddress}
              onChange={updateCorrespondenceAddress}
              error={correspondenceAddressError}
            />
          )}
          {correspondenceAddress && (
            <Textinput
              label="Pin Code"
              labelClassName="text-sm font-medium text-gray-600 !mb-1"
              inputClassName="shadow-sm bg-white"
              placeholder="Enter your pincode"
              value={correspondencePincode}
              onChange={updateCorrespondencePincode}
              error={correspondencePincodeError}
            />
          )}

          {/* <div className="w-full">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Landline Number
            </label>
            <div className="flex flex-row gap-x-4 w-full">
              <div className="w-20">
                <Select
                  data={countryCodes}
                  placeholder="Code"
                  searchable
                  value={landlineCountryCode}
                  // error={landlineCountryCodeError}
                  onChange={updateLandlineCountryCode}
                  selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
                  className="w-full"
                  dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                />
              </div>
              <div className="w-30">
                <Textinput
                  placeholder="Enter City Code"
                  value={landlineCityCode}
                  // error={landlineCityCodeError}
                  onChange={updateLandlineCityCode}
                  type="number"
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
              </div>
              <div className="flex-1">
                <Textinput
                  placeholder="Enter Phone Number"
                  type="text"
                  value={landlineNumber}
                  // error={landlineNumberError}
                  onChange={updateLandlineNumber}
                  inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
              </div>
            </div>
            {landlineCountryCodeError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {landlineCountryCodeError}
              </p>
            )}
            {landlineCityCodeError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {landlineCityCodeError}
              </p>
            )}
            {landlineNumberError !== "" && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {landlineNumberError}
              </p>
            )}
          </div>
          <div className="w-[100%]">
            <Select
              label="Gender"
              data={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
              searchable
              withAsterisk
              error={genderError}
              value={gender}
              onChange={updateGender}
              labelClass="mb-[6px] font-medium font-sans text-[#000] text-sm"
              inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
              dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto"
              selectWrapperClass="!shadow-none"
            />
          </div>
          <Datepicker
            label="Date of Birth"
            withAsterisk
            value={dateOfBirth}
            error={dateOfBirthError}
            onChange={updateDateOfBirth}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Father Name"
            label="Father Name"
            value={fatherName}
            error={fatherNameError}
            onChange={updateFatherName}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Select
            data={[
              { label: "Single", value: "Single" },
              { label: "Married", value: "Married" },
            ]}
            label="Marital Status"
            value={maritalStatus}
            error={maritalStatusError}
            onChange={updateMaritalStatus}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          {maritalStatus === "Married" && (
            <>
              <div className="w-[100%]">
                <Select
                  label="Spouse Prefix"
                  data={[
                    { value: "Mr", label: "Mr" },
                    { value: "Mrs", label: "Mrs" },
                    { value: "Miss", label: "Miss" },
                    { value: "Mx", label: "Mx" },
                  ]}
                  searchable
                  error={spousePrefixError}
                  value={spousePrefix}
                  onChange={updateSpousePrefix}
                  labelClass="mb-[6px] font-medium font-sans text-[#000] text-sm"
                  inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                  dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto"
                  selectWrapperClass="!shadow-none"
                />
              </div>
              <Textinput
                placeholder="Enter Spouse Name"
                label="Spouse Name"
                value={spouseName}
                error={spouseNameError}
                onChange={updateSpouseName}
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              />
              <Datepicker
                label="Spouse DOB"
                value={spouseDob}
                error={spouseDobError}
                onChange={updateSpouseDob}
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              />
              <Textinput
                placeholder="Enter No of Children"
                label="Number of Children"
                value={numberOfChildren}
                error={numberOfChildrenError}
                onChange={updateNumberOfChildren}
                type="number"
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              />
              <Datepicker
                label="Wedding Aniversary"
                value={weddingAniversary}
                error={weddingAniversaryError}
                onChange={updateWeddingAniversary}
                labelClassName="text-sm font-medium text-gray-600 mb-1"
                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
              />
            </>
          )}
          <Textinput
            placeholder="Enter Pan Card No"
            label="Pan Card No (e.g., XXXXX1234X)"
            value={panCardNo}
            error={panCardNoError}
            onChange={updatePanCardNo}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Aadhar Card No"
            label="Aadhar Card No (e.g., XXXX XXXX XXXX)"
            value={aadharCardNo}
            error={aadharCardNoError}
            onChange={updateAadharCardNo}
            type="number"
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Select
            data={countryNames}
            label="Country of Citizenship"
            searchable
            value={countryOfCitizenship}
            error={countryOfCitizenshipError}
            onChange={updateCountryOfCitizenship}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          <Select
            data={countryNames}
            label="Country of Residence"
            searchable
            value={countryOfResidence}
            error={countryOfResidenceError}
            onChange={updateCountryOfResidence}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          <Textinput
            placeholder="Enter Mother Tongue"
            label="Mother Tongue"
            value={motherTongue}
            error={motherTongueError}
            onChange={updateMotherTongue}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Name of Power of Attorney"
            label="Name of Power of Attorney (POA) Holder"
            value={nameOfPoa}
            error={nameOfPoaError}
            onChange={updateNameOfPoa}
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Select
            data={[
              { label: "Resident", value: "Resident" },
              { label: "NRI", value: "NRI" },
            ]}
            label="If POA Holder is Indian, specify status"
            value={holderPoa}
            error={holderPoaError}
            onChange={updateHolderPoa}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          <Textinput
            placeholder="Enter Number of Years of Residing at Correspondence Address"
            label="Number of years residing at correspondence address"
            value={noOfYearsCorrespondenceAddress}
            error={noOfYearsCorrespondenceAddressError}
            onChange={updateNoOfYearsCorrespondenceAddress}
            type="number"
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Textinput
            placeholder="Enter Number of Years of Residing at City"
            label="Number of years residing at city"
            value={noOfYearsCity}
            error={noOfYearsCityError}
            onChange={updateNoOfYearsCity}
            type="number"
            labelClassName="text-sm font-medium text-gray-600 mb-1"
            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
          />
          <Select
            data={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            label="Have you ever owned a Abode home / property?"
            value={haveYouOwnedAbode}
            error={haveYouOwnedAbodeError}
            onChange={updateHaveYouOwnedAbode}
            selectWrapperClass="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400 !shadow-none"
            labelClass="text-sm font-medium text-gray-600 mb-1"
            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
          />
          {haveYouOwnedAbode === "true" && (
            <Textinput
              placeholder="Enter Project Name"
              label="If Yes, Project Name"
              value={ifOwnedProjectName}
              error={ifOwnedProjectNameError}
              onChange={updateIfOwnedProjectName}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
          )} */}
        </div>
        {/* <hr className="border border-[#ebecef]" />
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-[16px] text-gray-700">
            Professional Details
          </p>
          <div className="grid grid-cols-3 gap-4">
            <Textinput
              placeholder="Enter Current Designation"
              label="Current Designation"
              value={currentDesignation}
              error={currentDesignationError}
              onChange={updateCurrentDesignation}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Textinput
              placeholder="Enter Current Organization"
              label="Current Organization"
              value={currentOrganization}
              error={currentOrganizationError}
              onChange={updateCurrentOrganization}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Textinput
              placeholder="Enter Organization Address"
              label="Organization Address"
              value={organizationAddress}
              error={organizationAddressError}
              onChange={updateOrganizationAddress}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Textinput
              placeholder="Enter Work Experience"
              label="Work Experience"
              type="number"
              value={workExperience}
              error={workExperienceError}
              onChange={updateWorkExperience}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
            <Textinput
              placeholder="Enter Annual Income"
              label="Annual Income"
              type="number"
              value={annualIncome}
              error={annualIncomeError}
              onChange={updateAnnualIncome}
              labelClassName="text-sm font-medium text-gray-600 mb-1"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
            />
          </div>
        </div>
        <hr className="border border-[#ebecef]" />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-gray-700">
              Address of Correspondence
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Select
                label="Country"
                placeholder="Select Country"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={[{ label: "India", value: "101" }]}
                value={correspondenceCountry}
                onChange={updateCorrespondenceCountry}
                error={correspondenceCountryError}
              />
              <Select
                label="State"
                placeholder="Select State"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={stateData}
                value={correspondenceState}
                onChange={updateCorrespondenceState}
                error={correspondenceStateError}
              />
              <Select
                label="City"
                placeholder="Select City"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={correspondenceCityData}
                value={correspondenceCity}
                onChange={updateCorrespondenceCity}
                error={correspondenceCityError}
              />
              <Textinput
                label="Address"
                placeholder="Enter your Address"
                labelClassName="text-sm font-medium text-gray-600 !mb-1"
                // inputClassName="shadow-sm !bg-white"
                value={correspondenceAddress}
                onChange={updateCorrespondenceAddress}
                error={correspondenceAddressError}
              />
              <Textinput
                label="Pin Code"
                labelClassName="text-sm font-medium text-gray-600 !mb-1"
                // inputClassName="shadow-sm bg-white"
                placeholder="Enter your pincode"
                value={correspondencePincode}
                onChange={updateCorrespondencePincode}
                error={correspondencePincodeError}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="sameAddress"
                className="w-4 h-4"
                checked={isSameAddress}
                onChange={(e) => handleIsSameAddress(e.target.checked)}
              />
              <label htmlFor="sameAddress" className="text-sm text-gray-700">
                Is your present address also your permanent address?
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-[16px] text-gray-700">
              Permanent Address
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Select
                label="Country"
                placeholder="Select Country"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={[{ label: "India", value: "101" }]}
                value={permanentCountry}
                onChange={updatePermanentCountry}
                error={permanentCountryError}
              />
              <Select
                label="State"
                placeholder="Select State"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={stateData}
                value={permanentState}
                onChange={updatePermanentState}
                error={permanentStateError}
              />
              <Select
                label="City"
                placeholder="Select City"
                labelClass="text-sm font-medium text-gray-600 mb-1"
                dropDownClass="overflow-y-hidden"
                selectWrapperClass="!shadow-none"
                searchable={true}
                data={permanentCityData}
                value={permanentCity}
                onChange={updatePermanentCity}
                error={permanentCityError}
              />
              <Textinput
                label="Address"
                placeholder="Enter your Address"
                labelClassName="text-sm font-medium text-gray-600 !mb-1"
                // inputClassName="shadow-sm !bg-white"
                value={permanentAddress}
                onChange={updatePermanentAddress}
                error={permanentAddressError}
              />
              <Textinput
                label="Pin Code"
                labelClassName="text-sm font-medium text-gray-600 !mb-1"
                // inputClassName="shadow-sm bg-white"
                placeholder="Enter your pincode"
                value={permanentPincode}
                onChange={updatePermanentPincode}
                error={permanentPincodeError}
              />
            </div>
          </div>
        </div> */}
        <div className="flex justify-end mt-auto">
          <Link
            onClick={handleSubmit}
            disabled={isLoadingEffect}
            className="px-4 py-2 text-[14px] font-semibold text-white bg-[#0083bf] rounded cursor-pointer"
          >
            Submit
          </Link>
        </div>
      </div>

      {isLoadingEffect && (
        <div className="fixed inset-0 bg-[#2b2b2bcc]  flex justify-center items-center">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}

      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Editleadwrapper;
