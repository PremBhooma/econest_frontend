import React, { useState } from "react";
import { Button, Loadingoverlay, Passwordinput } from "@nayeshdaggula/tailify";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import { toast } from "react-toastify";

function Changepassword({ singleUserid }) {
    const [newpassword, setNewPassword] = useState("");
    const [newpassworderror, setNewpassworderror] = useState("");
    const updateNewPassword = (e) => {
        setNewPassword(e.target.value);
        setNewpassworderror("");
    };

    const [confirmpassword, setConfirmpassword] = useState("");
    const [confirmpassworderror, setConfirmpassworderror] = useState("");
    const updateConfirmPassword = (e) => {
        setConfirmpassword(e.target.value);
        setConfirmpassworderror("");
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const submitpassword = () => {
        setIsLoadingEffect(true);

        if (!newpassword) {
            setNewpassworderror("New Password is required");
            setIsLoadingEffect(false);
            return;
        }

        if (newpassword !== confirmpassword) {
            setConfirmpassworderror("Password does not match");
            setIsLoadingEffect(false);
            return;
        }

        Employeeapi.post(
            "/update-user-password",
            {
                singleuser_password: newpassword,
                singleuser_id: singleUserid,
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
                    setErrorMessage(data.message);
                    setIsLoadingEffect(false);
                    return;
                }
                setConfirmpassword("");
                setNewPassword("");
                toast.success("Updated password successfully");
                setIsLoadingEffect(false);

            })
            .catch((error) => {
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

    return (
        <div className="p-5 px-20 space-y-4 relative">
            <Passwordinput
                label="New Password"
                placeholder="Enter New Password"
                value={newpassword}
                onChange={updateNewPassword}
                error={newpassworderror}
                className="mb-3"
                labelClassName='!font-medium !text-left'
            />
            <Passwordinput
                label="Confirm Password"
                placeholder="Confirm New Password"
                value={confirmpassword}
                onChange={updateConfirmPassword}
                error={confirmpassworderror}
                className="mb-5"
                labelClassName='!font-medium !text-left'
            />
            <Button onClick={submitpassword} className="!flex justify-center items-center !ml-auto !px-5 !py-1.5 mt-2 rounded !bg-[#0083bf] !max-md:w-full">
                Change Password
            </Button>
            {isLoadingEffect && (
                <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
                    <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                </div>
            )}
            {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </div>
    );
}

export default Changepassword;
