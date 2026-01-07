import React, { useEffect, useState } from "react";
import Projectapi from "../../api/Projectapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import Updateprojectmodal from "./Updateprojectmodal";
import Addproject from "./Addproject";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { toast } from "react-toastify";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { IconEdit, IconTrash } from "@tabler/icons-react";

const Project = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectList, setProjectList] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [updateProjectModal, setUpdateProjectModal] = useState(false);
    
    // Pagination (Placeholder for now as controller supports it but frontend didn't have it fully wired)
    // const [page, setPage] = useState(1);
    // const [limit, setLimit] = useState(10);
    // const [totalPages, setTotalPages] = useState(0);

    const openUpdateProjectModal = (project) => {
        setSelectedProject(project);
        setUpdateProjectModal(true);
    };

    const closeUpdateProjectModal = () => setUpdateProjectModal(false);

    const permissions = useEmployeeDetails((state) => state.permissions);

    async function getProjectData() {
        setIsLoading(true);

        Projectapi.get("get-all-projects", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setProjectList([]);
                } else {
                    setProjectList(data?.data || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching project info:", error);
                const finalResponse = {
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                };
                setErrorMessage(finalResponse);
                setProjectList([]);
                setIsLoading(false);
            });
    }

    const handleDeleteProject = async (uuid) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        setIsLoading(true);
        Projectapi.post("delete-project", { uuid })
            .then((response) => {
                const data = response.data;
                if (data.status === "success") {
                    toast.success("Project deleted successfully");
                    getProjectData();
                } else {
                    toast.error(data.message);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error deleting project:", error);
                toast.error("Failed to delete project");
                setIsLoading(false);
            });
    };

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
                    <p className="text-[18px] font-semibold">Projects</p>
                </div>
                <hr className="text-[#ebecef]" />
                
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Add Project Form - Left Column */}
                    {permissions?.settings_page?.includes("create_project") && (
                        <div className="max-sm:basis-[100%] basis-[25%] w-full">
                            <Addproject refreshProject={refreshProject} />
                        </div>
                    )}

                    {/* Project List - Right Column */}
                    <div className="basis-[75%] bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
                        <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="border-b-[0.6px] border-b-[#ebecef]">
                                    <tr className="w-full">
                                        <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] w-[80px] border-r border-[#ebecef]">S.No</th>
                                        <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500]">Project Name</th>
                                        <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500]">Address</th>
                                        <th className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] w-[120px] text-center border-l border-[#ebecef]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <TableLoadingEffect colspan={4} tr={4} />
                                    ) : (
                                        projectList.length > 0 ? (
                                            projectList.map((project, index) => (
                                                <tr key={project.uuid} className="border-b-[0.6px] border-b-[#ebecef] align-top">
                                                    <td className="px-4 py-3 border-r border-[#ebecef] text-[#4b5563] text-[13px]">{index + 1}</td>
                                                    <td className="px-4 py-3 text-[#4b5563] text-[13px]">{project.project_name}</td>
                                                    <td className="px-4 py-3 text-[#4b5563] text-[13px]">{project.project_address}</td>
                                                    <td className="px-4 py-3 border-l border-[#ebecef]">
                                                        <div className="flex items-center justify-center gap-3">
                                                            {permissions?.settings_page?.includes("update_project_info") && (
                                                                <IconEdit size={20} className='cursor-pointer text-gray-600 hover:text-blue-600' onClick={() => openUpdateProjectModal(project)} />
                                                            )}
                                                            {permissions?.settings_page?.includes("delete_project") && (
                                                                <IconTrash size={20} className='cursor-pointer text-gray-600 hover:text-red-600' onClick={() => handleDeleteProject(project.uuid)} />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-gray-500">No projects found</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={updateProjectModal}
                onClose={closeUpdateProjectModal}
                size="lg"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateProjectModal &&
                    <Updateprojectmodal
                        closeUpdateProjectModal={closeUpdateProjectModal}
                        projectData={selectedProject}
                        refreshProject={refreshProject}
                        isEdit={true}
                    />
                }
            </Modal>
        </>
    );
};

export default Project;
