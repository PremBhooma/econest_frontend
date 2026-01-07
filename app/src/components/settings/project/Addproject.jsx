import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Loadingoverlay, Textinput } from '@nayeshdaggula/tailify';
import Projectapi from '../../api/Projectapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';

function Addproject({ refreshProject }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectNameError, setProjectNameError] = useState('');
    
    const [projectAddress, setProjectAddress] = useState('');
    const [projectAddressError, setProjectAddressError] = useState('');

    const handleSubmit = async () => {
        let hasError = false;
        if (!projectName) {
            setProjectNameError("Enter project name");
            hasError = true;
        }
        if (!projectAddress) {
            setProjectAddressError("Enter project address");
            hasError = true;
        }
        if (hasError) return;

        setIsLoading(true);
        Projectapi.post('/add-project', {
            project_name: projectName,
            project_address: projectAddress
        })
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                } else {
                    toast.success("Project created successfully");
                    setProjectName('');
                    setProjectAddress('');
                    refreshProject();
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error adding project:", error);
                setErrorMessage({ 
                    message: error?.message || "Unknown error", 
                    server_res: error?.response?.data || null 
                });
                setIsLoading(false);
            });
    }

    return (
        <div className="px-3 rounded-md bg-transparent border border-[#ebecef] relative">
            <div className="py-2">
                <div className="flex flex-col gap-4">
                    <Textinput
                        label='Add Project'
                        labelClassName='!font-medium !text-[16px]'
                        placeholder="Enter Project Name"
                        inputClassName='!bg-white !border-[#ebecef]'
                        value={projectName}
                        onChange={(e) => {
                            setProjectName(e.target.value);
                            setProjectNameError('');
                        }}
                        error={projectNameError}
                    />
                    <Textinput
                        placeholder="Enter Project Address"
                        inputClassName='!bg-white !border-[#ebecef]'
                        value={projectAddress}
                        onChange={(e) => {
                            setProjectAddress(e.target.value);
                            setProjectAddressError('');
                        }}
                        error={projectAddressError}
                    />
                </div>
            </div>

            <div className="py-2 mt-2">
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
                <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50 rounded-md'>
                    <Loadingoverlay visible={true} overlayBg='' />
                </div>
            }
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

        </div>
    );
}

export default Addproject;