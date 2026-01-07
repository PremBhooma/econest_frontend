import React, { useEffect, useState } from "react";
import Backup from "./backup/Backup";
import Blocks from "./blocks/Blocks.jsx";
import Project from "./project/Project.jsx";
import Amenities from "./amenities/Amenities.jsx";
import Groupowner from "./groupowner/Groupowner.jsx";
import Companyinfo from "./companyinfo/Companyinfo.jsx";
import BulkUploads from "./bulkuploads/Bulkuploads.jsx";
import AssignProject from "../shared/AssignProject.jsx";
import { Modal } from "@nayeshdaggula/tailify";
import { IconChartFunnel, IconDatabase, IconRestore, IconTemplate } from "@tabler/icons-react";
import { useProjectDetails } from "../zustand/useProjectDetails.jsx";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails.jsx";
import { BlocksIcon, Building2, GroupIcon, NotepadText, SquareChartGantt } from "lucide-react";
import Leadstageswrapper from "./leadstages/Leadstageswrapper.jsx";
import Templates from "./templates/Templates.jsx"

function Settingswrapper() {

    const [activeTaskTab, setActiveTaskTab] = useState('company_info');
    const tabChange = (tab) => {
        setActiveTaskTab(tab);
    }

    const permissions = useEmployeeDetails((state) => state.permissions);

    const { projectData, hasFetched, fetchProjectData } = useProjectDetails();

    const [projectModel, setProjectModel] = useState(false);
    const openProjectModel = () => {
        setProjectModel(true);
    };
    const closeProjectModel = () => {
        setProjectModel(false);
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {
        if (hasFetched) {
            if (!projectData || (typeof projectData === 'object' && Object.keys(projectData).length === 0)) {
                openProjectModel();
            }
        }
    }, [hasFetched, projectData]);


    return (
        <>
            <div className='flex md:flex-row flex-col justify-between'>
                <div className="text-[24px] font-semibold">
                    Settings
                </div>


                <div className="flex justify-start items-center gap-1">
                    {permissions?.settings_page?.includes("company_info_tab") && (
                        <div onClick={() => tabChange('company_info')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'company_info' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <Building2 className="!w-4 !h-4" />
                            <p>Company Info</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("project_tab") && (
                        <div onClick={() => tabChange('project')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'project' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <SquareChartGantt className="!w-4 !h-4" />
                            <p>Project</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("blocks_tab") && (
                        <div onClick={() => tabChange('blocks')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'blocks' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <BlocksIcon className="!w-4 !h-4" />
                            <p>Blocks</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("amenities_tab") && (
                        <div onClick={() => tabChange('amenities')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'amenities' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <NotepadText className="!w-4 !h-4" />
                            <p>Amenities Prices</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("group_owner_tab") && (
                        <div onClick={() => tabChange('group_owner')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'group_owner' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <GroupIcon className="!w-4 !h-4" />
                            <p>Group/Owner</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("global_tab") && (
                        <div onClick={() => tabChange('bulk_uploads_tab')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'bulk_uploads_tab' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <IconDatabase className="!w-4 !h-4" />
                            <p>Global Upload</p>
                        </div>
                    )}
                    {permissions?.settings_page?.includes("backup_tab") && (
                        <div onClick={() => tabChange('backup')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'backup' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                            <IconRestore className="!w-4 !h-4" />
                            <p>Backup</p>
                        </div>
                    )}
                    <div onClick={() => tabChange('lead_stages')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'lead_stages' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                        <IconChartFunnel className="!w-4 !h-4" />
                        <p>Lead stages</p>
                    </div>
                    <div onClick={() => tabChange('templates')} className={`flex items-center gap-2 cursor-pointer font-semibold text-sm px-3 py-1.5 rounded-sm transition-colors duration-200 ${activeTaskTab === 'templates' ? 'text-[#0083bf] bg-[#dbeafe] hover:text-white hover:bg-[#0083bf]/90' : 'text-[#2b2b2b] hover:bg-[#0083bf]/10'}`}>
                        <IconTemplate className="!w-4 !h-4" />
                        <p>Templates</p>
                    </div>
                </div>
            </div>
            <div className="mt-3 full">
                {activeTaskTab === 'company_info' &&
                    <>
                        {permissions?.settings_page?.includes("company_info_tab") && (
                            <Companyinfo />
                        )}
                    </>
                }
                {activeTaskTab === 'project' &&
                    <>
                        {permissions?.settings_page?.includes("project_tab") && (
                            <Project />
                        )}
                    </>
                }
                {activeTaskTab === 'blocks' &&
                    <>
                        {permissions?.settings_page?.includes("blocks_tab") && (
                            <Blocks />
                        )}
                    </>
                }
                {activeTaskTab === 'amenities' &&
                    <>
                        {permissions?.settings_page?.includes("amenities_tab") && (
                            <Amenities />
                        )}
                    </>
                }
                {activeTaskTab === 'group_owner' &&
                    <>
                        {permissions?.settings_page?.includes("group_owner_tab") && (
                            <Groupowner />
                        )}
                    </>
                }
                {activeTaskTab === 'backup' &&
                    <>
                        {permissions?.settings_page?.includes("backup_tab") && (
                            <Backup />
                        )}
                    </>
                }
                {activeTaskTab === 'bulk_uploads_tab' &&
                    <>
                        {permissions?.settings_page?.includes("global_tab") && (
                            <BulkUploads />
                        )}
                    </>
                }
                {activeTaskTab === 'lead_stages' &&
                    <>
                            <Leadstageswrapper />
                    </>
                }
                {activeTaskTab === 'templates' &&
                    <>
                            <Templates/>
                    </>
                }
            </div>

            <Modal
                open={projectModel}
                onClose={closeProjectModel}
                size="lg"
                zIndex={9999}
                withCloseButton={false}
            >
                {projectModel === true && (
                    <AssignProject
                        closeProjectModel={closeProjectModel}
                    />
                )}
            </Modal>
        </>
    );
}

export default Settingswrapper;