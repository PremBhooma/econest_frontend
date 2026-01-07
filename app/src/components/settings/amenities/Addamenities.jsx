'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loadingoverlay, Select, Textinput } from '@nayeshdaggula/tailify';
import Settingsapi from '../../api/Settingsapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';

function Addamenities({ refreshAmenities }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [amountType, setAmountType] = useState('')
    const [amountTypeError, setAmountTypeError] = useState('')
    const updateAmountType = (e) => {
        setAmountType(e.target.value)
        setAmountTypeError('')
    }

    const [flatType, setFlatType] = useState('')
    const [flatTypeError, setFlatTypeError] = useState('')
    const updateFlatType = (value) => {
        setFlatType(value)
        setFlatTypeError('')
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        if (amountType === "") {
            setIsLoading(false)
            setAmountTypeError("Please enter an amount")
            return false
        }

        if (flatType === "") {
            setIsLoading(false)
            setFlatTypeError("Please enter a flat type")
            return false
        }

        await Settingsapi.post('/add-amenities', {
            amount: amountType,
            flat_type: flatType,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    let finalResponse;
                    finalResponse = {
                        "message": data.message,
                        "server_res": data
                    }
                    setErrorMessage(finalResponse)
                    setIsLoading(false)
                    return false
                }
                setAmountType('')
                setFlatType('')
                toast.success("Amenities created successfully", {
                    position: "top-right",
                    autoClose: 2000,
                })
                refreshAmenities()
                setIsLoading(false)
                return false
            })
            .catch((error) => {
                console.log('Error:', error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false
            })
    }

    return (
        <div className="px-3 rounded-md bg-transparent border border-[#ebecef] relative">
            <div className="py-2">
                <div className="flex flex-col gap-4">
                    <Select
                        data={[
                            { value: "Studio", label: "Studio" },
                            { value: "1 BHK", label: "1 BHK" },
                            { value: "1.5 BHK", label: "1.5 BHK" },
                            { value: "2 BHK", label: "2 BHK" },
                            { value: "2.5 BHK", label: "2.5 BHK" },
                            { value: "3 BHK", label: "3 BHK" },
                            { value: "3.5 BHK", label: "3.5 BHK" },
                            { value: "4 BHK", label: "4 BHK" },
                            { value: "4.5 BHK", label: "4.5 BHK" },
                            { value: "5 BHK", label: "5 BHK" },
                            { value: "Penthouse", label: "Penthouse" },
                            { value: "Duplex", label: "Duplex" },
                        ]}
                        placeholder="Select flat type"
                        labelClass='!font-semibold !text-[14px]'
                        value={flatType}
                        label="Flat Type"
                        error={flatTypeError}
                        onChange={updateFlatType}
                        selectWrapperClass="!shadow-none !bg-white !border-[#ebecef]"
                    />
                    <Textinput
                        label='Amount'
                        labelClassName='!font-semibold !text-[14px]'
                        placeholder="Enter Amount"
                        inputClassName='!bg-white !border-[#ebecef]'
                        type='number'
                        value={amountType}
                        onChange={updateAmountType}
                        error={amountTypeError}
                    />
                </div>
            </div>

            <div className="py-2">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="cursor-pointer flex justify-center w-full items-center gap-2 px-4 py-2.5 rounded-md hover:bg-[#0083bf] hover:text-white text-[#0083bf] border-[0.8px] border-[#0083bf]"
                >
                    <p className="text-sm font-medium">Submit</p>
                </button>
            </div>
            {
                isLoading &&
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                    <Loadingoverlay visible={true} overlayBg='' />
                </div>
            }
            {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        </div>
    );
}

export default Addamenities;
