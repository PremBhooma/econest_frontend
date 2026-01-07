import React, { useEffect, useState } from 'react'
import Projectapi from '../../api/Projectapi.jsx';
import Errorpanel from '../../shared/Errorpanel.jsx';
import { toast } from 'react-toastify';
import { Button, Card, Group, Loadingoverlay, NumberInput, Text, Textinput } from '@nayeshdaggula/tailify';

function Updateprojectmodal({ closeUpdateProjectModal, projectData, refreshProject }) {

    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [projectName, setProjectName] = useState('');
    const [projectNameError, setProjectNameError] = useState('')
    const updateProjectName = (e) => {
        setProjectName(e.target.value)
        setProjectNameError('')
    }

    const [projectAddress, setProjectAddress] = useState('');
    const [projectAddressError, setProjectAddressError] = useState('')
    const updateProjectAddress = (e) => {
        setProjectAddress(e.currentTarget.value)
        setProjectAddressError('')
    }

    const handleSubmit = () => {
        setIsLoadingEffect(true);
        if (projectName === '') {
            setIsLoadingEffect(false);
            setProjectNameError('Enter project name');
            return false;
        }
        if (projectAddress === '') {
            setIsLoadingEffect(false);
            setProjectAddressError('Enter project address');
            return false;
        }

        Projectapi.post('update-project', {
            project_name: projectName,
            project_address: projectAddress,
            uuid: projectData.uuid ? projectData.uuid : null,
        })
            .then((response) => {
                let data = response.data;
                if (data.status === 'error') {
                    toast.error(data.message);
                    setIsLoadingEffect(false);
                    return false;
                }
                toast.success("Project information Updated Successfully");
                setIsLoadingEffect(false);
                refreshProject();
                closeUpdateProjectModal();
                return false;
            })
            .catch((error) => {
                setErrorMessage(error);
                setIsLoadingEffect(false);
                return false;
            });
    }

    useEffect(() => {
        if (projectData) {
            setProjectName(projectData.project_name);
            setProjectAddress(projectData.project_address);
        }
    }, [projectData])

    return (
        <>
            {isLoadingEffect && <Loadingoverlay visible={isLoadingEffect} />}

            <Card withBorder={false} className='!shadow-none' padding='0'>
                <Card.Section padding='0'>
                    <Group justify="space-between" align="center" className='pb-3 items-center px-2'>
                        <Text color='#2b2b2b' c={"#000000"} className="!font-semibold text-[18px]">Update Information</Text>

                        <Button onClick={closeUpdateProjectModal} size="sm" variant="default" className='!px-2 !py-1.5 !text-red-500 hover:!border-red-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 13L7 7L13 13M13 1L6.99886 7L1 1" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Button>
                    </Group>
                </Card.Section>
                <Card.Section className="h-fit max-h-[80vh] overflow-auto !p-2">
                    <div className='mb-3 grid grid-cols-1 gap-3'>
                        <Textinput
                            placeholder='Enter Company Name'
                            labelClassName='!font-semibold'
                            label="Project Name"
                            w={"100%"}
                            value={projectName}
                            error={projectNameError}
                            onChange={updateProjectName}
                        />
                        <Textinput
                            placeholder='Enter project address'
                            labelClassName='!font-semibold'
                            label="Project Address"
                            w={'100%'}
                            value={projectAddress}
                            error={projectAddressError}
                            onChange={updateProjectAddress}
                        />
                    </div>
                </Card.Section>
                <Card.Section className='flex justify-end mt-2 !p-0'>
                    <button onClick={handleSubmit} disabled={isLoadingEffect} className="px-3 text-[14px] bg-[#0083bf] hover:!bg-[#0083bf]/90 text-white py-2 rounded cursor-pointer">Submit</button>
                </Card.Section>
            </Card>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
        </>
    )
}

export default Updateprojectmodal