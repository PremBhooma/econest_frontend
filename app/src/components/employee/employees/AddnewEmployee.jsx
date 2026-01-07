// import Employeeapi from '@/components/api/Employeeapi';
// import Errorpanel from '@/components/shared/Errorpanel';
// import { useEmployeDetails } from '../../zustand/useEmployeeDetails';
import {
  Textinput,
  Passwordinput,
  Button,
  Select,
  Card,
  Loadingoverlay,
} from "@nayeshdaggula/tailify";
import { IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Generalapi from "../../api/Generalapi";
import Employeeapi from "../../api/Employeeapi";
import { toast } from "react-toastify";
import Errorpanel from "../../shared/Errorpanel";

function AddnewEmployee({ closeAddnewmodal, refreshUserData }) {
  // const access_token = useEmployeDetails(state => state.access_token);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const upateName = (e) => {
    const value = e.target.value;
    const formattedName =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setName(formattedName);
    setNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const upateEmail = (e) => {
    const value = e.target.value;
    const formattedEmail = value.toLowerCase();
    setEmail(formattedEmail);
    setEmailError("");
  };

  const [phoneCode, setPhoneCode] = useState("91");
  const updatePhoneCode = (value) => {
    setPhoneCode(value);
    setPhoneError("");
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const upatePhone = (e) => {
    let value = e.target.value;
    if (isNaN(value)) {
      return false;
    }

    // remove non-digit characters
    value = value.replace(/\D/g, "");

    // if phoneCode is India (+91), restrict to 10 digits
    if (phoneCode === "91") {
      value = value.slice(0, 10);
    }
    setPhone(value);
    setPhoneError("");
  };

  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const updateRole = (value) => {
    setRole(value);
    setRoleError("");
  };

  const [reportinghead, setReportinghead] = useState("");
  const [reportingheadError, setReportingheadError] = useState("");
  const updateReportinghead = (value) => {
    setReportinghead(value);
    setReportingheadError("");
  };

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const upatePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const [repassword, setRepassword] = useState("");
  const [repasswordError, setRepasswordError] = useState("");
  const upateRepassword = (e) => {
    setRepassword(e.target.value);
    setRepasswordError("");
    setRepasswordError("");
  };

  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState("");
  const updateGender = (value) => {
    setGender(value);
    setGenderError("");
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  async function fetchCountryCodes() {
    setIsLoadingEffect(true);
    Generalapi.get("/getcountries")
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        setCountryCodes(data.countrydata);
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
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

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     setIsLoadingEffect(true);

  //     setTimeout(() => {
  //         setIsLoadingEffect(false);
  //     }, 5000);
  // };

  const handleSubmit = () => {
    setIsLoadingEffect(true);
    if (name === "") {
      setNameError("Name is required");
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

    if (phoneCode === "") {
      setPhoneError("Phone code is required");
      setIsLoadingEffect(false);
      return false;
    }
    if (phone === "") {
      setPhoneError("Phone number is required");
      setIsLoadingEffect(false);
      return false;
    }
    // Validate phone number
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError("Please enter a valid phone number");
      setIsLoadingEffect(false);
      return;
    }

    if (gender === "") {
      setGenderError("Gender is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (role === "") {
      setRoleError("Role is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (reportinghead === "") {
      setReportingheadError("Reporting Head is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      setIsLoadingEffect(false);
      return false;
    }

    if (repassword === "") {
      setRepasswordError("Re-enter password is required");
      setIsLoadingEffect(false);
      return false;
    } else if (password !== repassword) {
      setRepasswordError("Password does not match");
      setIsLoadingEffect(false);
      return false;
    }

    Employeeapi.post(
      "add-employee",
      {
        name: name,
        email: email,
        gender: gender,
        phone_code: phoneCode,
        phone_number: phone,
        role_id: role,
        reporting_head: reportinghead,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${access_token}`
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Successfully Employee added", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsLoadingEffect(false);
        closeAddnewmodal();
        refreshUserData();
        return false;
      })
      .catch((error) => {
        console.log(error);
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

  const [roleData, setRoleData] = useState([]);
  async function fetchRoleData() {
    await Employeeapi.get("get-roles", {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${access_token}`
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        setRoleData(data?.roledata || []);
        return false;
      })
      .catch((error) => {
        console.log(error);
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
        return false;
      });
  }

  useEffect(() => {
    fetchRoleData();
    fetchCountryCodes();
    fetchReportingData();
  }, []);

  const [reportingData, setReportingData] = useState([]);
  async function fetchReportingData() {
    await Employeeapi.get("get-reporting-heads", {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${access_token}`
      },
    })
      .then((res) => {
        let data = res.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          return false;
        }
        setReportingData(data?.reporting_heads || []);
        return false;
      })
      .catch((error) => {
        console.log("Error:", error);
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
        return false;
      });
  }

  return (
    <div className="relative">
      <Card
        padding="0"
        margin="0"
        className="w-[100%] max-sm:w-[100%] max-sm:rounded-none max-sm:!border-0 max-sm:shadow-none"
      >
        <Card.Section className="!px-4">
          <div className="flex justify-between items-center">
            <p className="text-[#0083bf] text-xl md:text-xl max-sm:text-[17px]">
              Add New Employee
            </p>
            <Button
              variant="default"
              onClick={closeAddnewmodal}
              className="!px-0 focus:outline-none border-none "
            >
              <IconX size={20} color="#0083bf" />
            </Button>
          </div>
        </Card.Section>
        <Card.Section className="!px-4 !border-b-1 ">
          <div className="grid grid-cols-2 gap-4 w-full py-2">
            <Textinput
              placeholder="Enter Name"
              label="Name"
              error={nameError}
              value={name}
              onChange={upateName}
              labelClassName="mb-[6px] text-sm font-medium font-sans"
              inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
            />
            <Textinput
              placeholder="Enter Email Address"
              label="Email Address"
              inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
              labelClassName="mb-[6px] text-sm font-medium font-sans"
              w="50%"
              error={emailError}
              value={email}
              onChange={upateEmail}
            />
            <div className="w-[100%]">
              <label className="block  text-sm font-medium font-sans pb-1">
                Phone Number
              </label>
              <div className="flex flex-row gap-x-2 w-full mt-1">
                <div className="w-[20%]">
                  <Select
                    data={countryCodes}
                    placeholder="Select Code"
                    value={phoneCode}
                    searchable
                    inputClassName="focus:ring-0 focus:border-[#E72D65] focus:outline-none !mt-0"
                    className="!m-0 !p-0 w-12"
                    dropdownClassName="option min-h-[100px] max-h-[200px] z-50 !px-0 overflow-y-auto"
                    onChange={updatePhoneCode}
                    selectWrapperClass="!shadow-none"
                    dropDownClass="!w-[100px]"
                  />
                </div>
                <div className="w-[80%]">
                  <Textinput
                    placeholder="Enter Phone Number"
                    inputClassName="focus:ring-0 focus:border-[#00AEEF] focus:outline-none"
                    value={phone}
                    type="text"
                    onChange={upatePhone}
                  />
                </div>
              </div>
              {phoneError !== "" && (
                <p className="mt-2 text-xs text-red-600">{phoneError}</p>
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
                error={genderError}
                value={gender}
                onChange={updateGender}
                labelClass="mb-[6px] font-medium font-sans text-[#000] text-sm"
                inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto"
                selectWrapperClass="!shadow-none"
              />
            </div>
            <div className="w-[100%]">
              <Select
                label="Role"
                labelClass="mb-[6px] text-sm font-medium font-sans"
                labe
                data={roleData}
                error={roleError}
                value={role}
                onChange={updateRole}
                inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                selectWrapperClass="!shadow-none"
              />
            </div>
            <div className="w-[100%]">
              <Select
                label="Reporting Head"
                data={reportingData}
                error={reportingheadError}
                value={reportinghead}
                onChange={updateReportinghead}
                searchable
                labelClass="mb-[6px] font-medium font-sans text-[#000] text-sm"
                inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                dropdownClassName="option min-h-[100px] max-h-[200px] z-50 overflow-y-auto focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                selectWrapperClass="!shadow-none"
              />
            </div>

            <div className="w-[100%]">
              <Passwordinput
                placeholder="Enter Password"
                w="50%"
                label="Password"
                labelClassName="text-sm font-medium font-sans"
                inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                type="password"
                error={passwordError}
                value={password}
                onChange={upatePassword}
              />
            </div>
            <div className="w-[100%]">
              <Passwordinput
                placeholder="Re-enter Password"
                w="50%"
                label="Re-enter Password"
                labelClassName="text-sm font-medium font-sans"
                inputClassName="focus:ring-0 focus:border-[#0083bf] focus:outline-none"
                type="password"
                error={repasswordError}
                value={repassword}
                onChange={upateRepassword}
              />
            </div>
          </div>
          {isLoadingEffect && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
              <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
            </div>
          )}
          {errorMessage !== null && (
            <Errorpanel
              errorMessages={errorMessage}
              setErrorMessages={setErrorMessage}
            />
          )}
        </Card.Section>
        <Button
          onClick={handleSubmit}
          disabled={isLoadingEffect}
          className="cursor-pointer !flex justify-end !p-4 !m-4 !ml-auto !text-[14px] !bg-[#0083bf] !text-white !py-2"
        >
          Add Employee
        </Button>
      </Card>
    </div>
  );
}

export default AddnewEmployee;
