import React, { useEffect } from 'react'
import Authapi from '../api/Authapi';
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import { useEmployeeDetails } from "../zustand/useEmployeeDetails"
import { Button, Loadingoverlay, Passwordinput, Textinput } from "@nayeshdaggula/tailify";
import Errorpanel from '../shared/Errorpanel'
function Loginwrapprer() {
  const updateEmployeeAuthDetails = useEmployeeDetails((state) => state.updateEmployeeAuthDetails);
  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);


  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const updateEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  }

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const updatePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  }

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }


  const Loginaccess = async (e) => {
    e.preventDefault();
    setIsLoadingEffect(true);
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    if (!email.trim()) {
      setEmailError("Please enter your email address");
      setIsLoadingEffect(false);
      return;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setIsLoadingEffect(false);
      return;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password");
      setIsLoadingEffect(false);
      return;
    }

    await Authapi.post("admin/login", {
      email: email.trim(),
      password: password.trim(),
    })
      .then((response) => {
        let data = response?.data;

        if (data?.status === "error") {
          setErrorMessage({
            message: data?.message,
          });
          setIsLoadingEffect(false);
          return false;
        }

        setErrorMessage('');
        setIsLoadingEffect(false);

        const responseData = response?.data;
        updateEmployeeAuthDetails(responseData?.employeeData, responseData?.access_token, responseData?.permissions);
        navigate("/dashboard");
        toast.success("Login Successfully")
      })
  }

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 dark:text-white min-h-screen flex flex-wrap">
      {/* Left Side Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <img src="https://wowdash.pixcelsthemes.com/wowdash-tailwind/WowDash/wowdash/assets/images/auth/auth-img.png" alt="Auth visual" />
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 px-6 py-8 flex flex-col justify-center relative">
        <div className="max-w-[464px] mx-auto w-full">
          <div className="mb-6 ">
            <img crossOrigin="anonymous" src="./assets/login/Abode_Developers_Logo.png" alt="Logo" className="mb-4 max-w-[150px] " />
            <h4 className="text-xl font-semibold mb-2">Sign In to your Account</h4>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className='flex flex-col gap-3' onSubmit={Loginaccess}>

            <Textinput
              placeholder="Enter Your Email"
              value={email}
              onChange={updateEmail}
              inputClassName="h-[56px] ps-4 border border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl focus:outline-none"
              error={emailError}
            />

            <Passwordinput
              placeholder="Enter Your Password"
              value={password}
              onChange={updatePassword}
              inputClassName="mb-4 h-[56px] ps-4 border border-neutral-300 bg-neutral-50 dark:bg-dark-2 rounded-xl focus:outline-none"
              labelClassName="!text-[14px] !text-[#ffffff] !font-[400]"
              error={passwordError}
            />

            <Button
              type="submit"
              onClick={Loginaccess}
              variant="filled"
              size="md"
              className={`w-full bg-[#486CEA] hover:bg-primary-700 text-white py-3 rounded-xl text-sm font-semibold ${isLoadingEffect ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoadingEffect}
            >
              {isLoadingEffect ? "Signing In..." : "Sign-In"}
            </Button>

            {/* {errorMessage && <p className='text-red-500 mt-2 '>{errorMessage.message}</p>} */}
            {errorMessage && (
              <Errorpanel
                errorMessages={errorMessage}
                setErrorMessages={setErrorMessage}
              />
            )}
          </form>
        </div>
        {
          isLoadingEffect &&
          <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
            <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
          </div>
        }
      </div>
    </div>
  )
}

export default Loginwrapprer