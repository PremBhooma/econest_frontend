import React, { useEffect, useState } from "react";
import Projectapi from "../../api/Projectapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import Updateprojectmodal from "./Updateprojectmodal";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";

const Project = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectData, setProjectData] = useState(null);
    const [updateProjectModal, setUpdateProjectModal] = useState(false);

    const openUpdateProjectModal = () => setUpdateProjectModal(true);
    const closeUpdateProjectModal = () => setUpdateProjectModal(false);

    const permissions = useEmployeeDetails((state) => state.permissions);

    async function getProjectData() {
        setIsLoading(true);

        Projectapi.get("get-project", {
            headers: {
                "Content-Type": "application/json",
                // 'Authorization': `Bearer ${access_token}`
            },
        })
            .then((response) => {
                const data = response.data;

                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setProjectData(null);
                } else {
                    setProjectData(data?.data || {});
                    setErrorMessage("");
                }

                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching company info:", error);

                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };

                setErrorMessage(finalResponse);
                setProjectData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getProjectData();
    }, []);

    const refreshProject = () => {
        getProjectData();
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Project</p>
                    {permissions?.settings_page?.includes("update_project_info") && (
                        <button onClick={openUpdateProjectModal} className="text-[14px] font-semibold text-black bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md px-4 py-2">
                            Update Info
                        </button>
                    )}

                </div>
                <hr className="text-[#ebecef]" />
                <div className="grid grid-cols-3 gap-2 relative">
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-semibold">Project Name</p>
                        <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">{projectData?.project_name || "---"}</p>
                    </div>
                    <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-semibold">Project Address</p>
                        <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">{projectData?.project_address || "---"}</p>
                    </div>
                    {isLoading && (
                        <div className='absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50'>
                            <Loadingoverlay visible={isLoading} overlayBg='' />
                        </div>                        
                    )}
                </div>
            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={updateProjectModal}
                onClose={updateProjectModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateProjectModal &&
                    <Updateprojectmodal
                        closeUpdateProjectModal={closeUpdateProjectModal}
                        projectData={projectData}
                        refreshProject={refreshProject}
                    />
                }
            </Modal>
        </>
    );
};

export default Project;
