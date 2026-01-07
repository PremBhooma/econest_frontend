import React, { useEffect, useState } from "react";
// import Settingsapi from '@/components/api/Settingsapi';
// import Errorpanel from '@/components/shared/Errorpanel';
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Group,
  Loadingoverlay,
  NumberInput,
  Text,
  Textinput,
} from "@nayeshdaggula/tailify";
import Settingsapi from "../../api/Settingsapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";

function Updateinfomodal({
  closeGeneralInfoModal,
  companyInfo,
  reloadCompanyDetails,
}) {
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const updateCompanyName = (e) => {
    const value = e.currentTarget.value.toUpperCase(); // convert all to uppercase
    setCompanyName(value);
    setCompanyNameError("");
  };

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    let value = e.currentTarget.value;
    const formattedEmail = value.toLowerCase();
    setEmail(formattedEmail);
    setEmailError("");
  };

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const upatePhone = (e) => {
    let value = e.currentTarget.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setPhone(value);
    setPhoneError("");
  };

  const [addressone, setAddressone] = useState("");
  const [addressoneError, setAddressoneError] = useState("");
  const updateAddressone = (e) => {
    setAddressone(e.currentTarget.value);
    setAddressoneError("");
  };

  const [addresstwo, setAddresstwo] = useState("");
  const [addresstwoError, setAddresstwoError] = useState("");
  const updateAddresstwo = (e) => {
    setAddresstwo(e.currentTarget.value);
    setAddresstwoError("");
  };

  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const updateCity = (e) => {
    setCity(e.currentTarget.value);
    setCityError("");
  };

  const [state, setState] = useState("");
  const [stateError, setStateError] = useState("");
  const updateState = (e) => {
    setState(e.currentTarget.value);
    setStateError("");
  };

  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState("");
  const updateCountry = (e) => {
    setCountry(e.currentTarget.value);
    setCountryError("");
  };

  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const updatePincode = (value) => {
    setPincode(value);
    setPincodeError("");
  };

  const handleSubmit = () => {
    setIsLoadingEffect(true);
    if (companyName === "") {
      setIsLoadingEffect(false);
      setCompanyNameError("Enter company name");
      return false;
    }
    if (email === "") {
      setIsLoadingEffect(false);
      setEmailError("Enter email");
      return false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Invalid email address");
      setIsLoadingEffect(false);
      return false;
    }

    if (phone === "") {
      setIsLoadingEffect(false);
      setPhoneError("Enter phone number");
      return false;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setIsLoadingEffect(false);
      setPhoneError("Phone number must be 10 digits");
      return false;
    }

    if (addressone === "") {
      setIsLoadingEffect(false);
      setAddressoneError("Enter address");
      return false;
    }

    if (city === "") {
      setIsLoadingEffect(false);
      setCityError("Enter city");
      return false;
    }

    if (state === "") {
      setIsLoadingEffect(false);
      setStateError("Enter state");
      return false;
    }

    if (country === "") {
      setIsLoadingEffect(false);
      setCountryError("Enter country");
      return false;
    }

    if (pincode === "") {
      setIsLoadingEffect(false);
      setPincodeError("Enter pincode");
      return false;
    }

    Settingsapi.post("update-company-info", {
      company_name: companyName,
      email: email,
      phone_number: phone,
      addressone: addressone,
      addresstwo: addresstwo,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          toast.error(data.message);
          setIsLoadingEffect(false);
          return false;
        }
        toast.success("Company information Updated Successfully");
        setIsLoadingEffect(false);
        reloadCompanyDetails();
        closeGeneralInfoModal();
        return false;
      })
      .catch((error) => {
        setErrorMessage(error);
        setIsLoadingEffect(false);
        return false;
      });
  };

  useEffect(() => {
    if (companyInfo) {
      setCompanyName(companyInfo.name);
      setEmail(companyInfo.email);
      setPhone(companyInfo.phone_number);
      setAddressone(companyInfo.address_line1);
      setAddresstwo(companyInfo.address_line2);
      setCity(companyInfo.city);
      setState(companyInfo.state);
      setCountry(companyInfo.country);
      setPincode(companyInfo.zip_code);
    }
  }, [companyInfo]);

  return (
    <>
      {isLoadingEffect && (
        <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
          <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
        </div>
      )}

      <Card withBorder={false} className="!shadow-none" padding="0">
        <Card.Section padding="0">
          <Group
            justify="space-between"
            align="center"
            className="pb-3 items-center px-2"
          >
            <Text
              color="#2b2b2b"
              c={"#000000"}
              className="!font-semibold text-[18px]"
            >
              Update Information
            </Text>

            <Button
              onClick={closeGeneralInfoModal}
              size="sm"
              variant="default"
              className="!px-2 !py-1.5 !text-red-500 hover:!border-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 13L7 7L13 13M13 1L6.99886 7L1 1"
                  stroke="#FF0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </Group>
        </Card.Section>
        <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
          <div className="mb-3 grid grid-cols-1">
            <Textinput
              placeholder="Enter Company Name"
              labelClassName="!font-semibold"
              label="Company Name"
              w={"100%"}
              value={companyName}
              error={companyNameError}
              onChange={updateCompanyName}
            />
          </div>
          <div className="md:flex-row mb-3 gap-10 grid grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">Phone Number</div>
              <div className="flex flex-row gap-2">
                <Textinput
                  labelClassName="font-sm !font-semibold"
                  value={"+91"}
                  inputClassName="!w-12"
                  disabled
                  inputProps={{ readOnly: true }}
                  opacity={1}
                />
                <div className="!w-full">
                  <Textinput
                    placeholder="Enter Phone Number"
                    type="number"
                    value={phone}
                    onChange={upatePhone}
                  />
                </div>
              </div>
              {phoneError !== "" && (
                <Text color="red" size="xs" mt={2}>
                  {phoneError}
                </Text>
              )}
            </div>
            <Textinput
              placeholder="Enter Email"
              labelClassName="!font-semibold"
              label="Email"
              w={"100%"}
              value={email}
              error={emailError}
              onChange={updateEmail}
            />
          </div>
          <div className="flex-col md:flex-row mb-3 gap-10 grid grid-cols-2">
            <Textinput
              placeholder="Enter Address"
              label="Address Line 1"
              labelClassName="!font-semibold"
              w={"100%"}
              value={addressone}
              error={addressoneError}
              onChange={updateAddressone}
            />
            <Textinput
              placeholder="Enter Address"
              label="Address Line 2"
              labelClassName="!font-semibold"
              w={"100%"}
              value={addresstwo}
              error={addresstwoError}
              onChange={updateAddresstwo}
            />
          </div>
          <div className="flex-col md:flex-row mb-3 gap-10 grid grid-cols-2">
            <Textinput
              placeholder="Enter City"
              labelClassName="!font-semibold"
              label="City"
              w={"100%"}
              value={city}
              error={cityError}
              onChange={updateCity}
            />
            <Textinput
              placeholder="Enter State"
              labelClassName="!font-semibold"
              label="State"
              w={"100%"}
              value={state}
              error={stateError}
              onChange={updateState}
            />
          </div>
          <div className="flex-col md:flex-row mb-3 gap-10 grid grid-cols-2">
            <Textinput
              placeholder="Enter Country"
              labelClassName="!font-semibold"
              label="Country"
              w={"100%"}
              value={country}
              error={countryError}
              onChange={updateCountry}
            />
            <NumberInput
              placeholder="Enter Zip Code"
              labelClassName="!font-semibold"
              label="Zip Code"
              w={"100%"}
              value={pincode}
              error={pincodeError}
              onChange={updatePincode}
              hideControls
              inputClassName="focus:outline-none focus:ring-0"
            />
          </div>
        </Card.Section>
        <Card.Section className="flex justify-end mt-2 !p-0">
          <button
            onClick={handleSubmit}
            disabled={isLoadingEffect}
            className="px-3 text-[14px] bg-[#0083bf] hover:bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer"
          >
            Submit
          </button>
        </Card.Section>
      </Card>
      {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
    </>
  );
}

export default Updateinfomodal;
