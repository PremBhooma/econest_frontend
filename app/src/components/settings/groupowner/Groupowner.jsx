import React, { useCallback, useEffect, useState } from "react";
import Addgroupowner from "./Addgroupowner.jsx";
import Groupownerapi from "../../api/Groupownerapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import Updategroupowner from "./Updategroupowner.jsx";
import DeleteModal from "../../shared/DeleteModal.jsx";
import TableLoadingEffect from "../../shared/Tableloadingeffect.jsx";
import { toast } from "react-toastify";
import { Loadingoverlay, Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";

const Groupowner = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0)

    const permissions = useEmployeeDetails((state) => state.permissions);

    const [groupOwnerData, setGroupOwnerData] = useState([]);
    const [updateGroupOwnerModal, setUpdateGroupOwnerModal] = useState(false);
    const [singleGroupOwnerData, setSingleGroupOwnerData] = useState('')
    const [groupOwnerId, setGroupOwnerId] = useState('')

    const openUpdateGroupOwnerModal = (data) => {
        setSingleGroupOwnerData(data)
        setUpdateGroupOwnerModal(true)
    }
    const closeUpdateGroupOwnerModal = () => {
        setSingleGroupOwnerData('')
        setUpdateGroupOwnerModal(false)
    }

    const [groupOwnerDeleteModal, setGroupOwnerDeleteModal] = useState(false);
    const openGroupOwnerDeleteModal = (id) => {
        setGroupOwnerDeleteModal(true);
        setGroupOwnerId(id);
    };
    const closeGroupOwnerDeleteModal = () => {
        setGroupOwnerDeleteModal(false);
    };


    async function getGroupOwnerData(newPage, newLimit) {
        setIsLoading(true);

        Groupownerapi.get("get-group-owner", {
            params: {
                page: newPage,
                limit: newLimit,
            },
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
                    setGroupOwnerData(null);
                } else {
                    setGroupOwnerData(data?.data || []);
                    setTotalPages(data?.totalPages);
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
                setGroupOwnerData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getGroupOwnerData(page, limit);
    }, []);

    const refreshGroupOwner = () => {
        getGroupOwnerData(page, limit);
    };

    const handlePageChange = useCallback((value) => {
        setPage(value);
        getGroupOwnerData(value, limit);
        setIsLoading(true);
    }, []);

    const handleDeleteGroupOwner = async (groupOwnerId) => {
        setIsLoading(true);
        await Groupownerapi.post("delete-group-owner",
            {
                groupOwnerId: groupOwnerId,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                let data = res.data;
                if (data.status === "error") {
                    let finalResponse;
                    finalResponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalResponse);
                    setIsLoading(false);
                    return false;
                }
                toast.success("Group/Owner deleted successfully", {
                    position: "top-right",
                    autoClose: 2000,
                });
                closeGroupOwnerDeleteModal();
                setGroupOwnerId("");
                refreshGroupOwner();
                setIsLoading(false);
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
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            });
    };

    return (
        <>
            <div className="flex flex-col gap-4 border border-[#ebecef] rounded-md bg-white p-8">
                <div className="flex justify-between items-center">
                    <p className="text-[18px] font-semibold">Group/Owner</p>
                </div>
                <hr className="text-[#ebecef]" />
                <div className="flex flex-col md:flex-row gap-4">
                    {permissions?.settings_page?.includes("add_group_owner") && (
                        <div className="max-sm:basis-[100%] basis-[25%] w-full">
                            <Addgroupowner refreshGroupOwner={refreshGroupOwner} />
                        </div>
                    )}

                    <div
                        className={`${permissions?.settings_page?.includes("add_group_owner")
                            ? "basis-[75%]"
                            : "basis-[100%]"
                            } bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md`}
                    >
                        <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead className="border-b-[0.6px] border-b-[#ebecef]">
                                    <tr className="w-full">
                                        <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky left-0 z-20 bg-white rounded-md border-r border-[#ebecef]">
                                            Ref Id
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
                                            Name
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
                                            Default
                                        </th>
                                        <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white rounded-md border-l border-[#ebecef]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading === false ? (
                                        groupOwnerData?.length > 0 ? (
                                            groupOwnerData?.map((ele, index) => (
                                                <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top">
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
                                                        <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                                            {ele.uuid}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                                                        <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
                                                            {ele.name}
                                                        </p>
                                                    </td>


                                                    <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                                                        {ele.isDefault === true ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-white bg-[#0083bf] rounded-full">
                                                                <span className="w-2 h-2 bg-white rounded-full mr-1.5"></span>
                                                                Yes
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                                                                <span className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></span>
                                                                No
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                                                        <div className="flex items-center gap-3">
                                                            {permissions?.settings_page?.includes("edit_group_owner") && (
                                                                <div className="cursor-pointer">
                                                                    <IconEdit size={20} className='' onClick={() => openUpdateGroupOwnerModal(ele)} />
                                                                </div>
                                                            )}

                                                            {/* {permissions?.settings_page?.includes("delete_group_owner") && (
                                                                <div className="cursor-pointer">
                                                                    <IconTrash size={20} className='text-[#F44336]' onClick={() => openGroupOwnerDeleteModal(ele?.id)} />
                                                                </div>
                                                            )} */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4">
                                                    <p className="text-[#4A4D53CC] text-[14px] font-[400]">No data found</p>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <TableLoadingEffect colspan={3} tr={4} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 0 &&
                            <div className="flex justify-end items-end">
                                <Pagination
                                    totalpages={totalPages}
                                    value={page}
                                    onChange={handlePageChange}
                                    color="#0083bf"
                                    activePageClass='!bg-[#0083bf] text-white prem'
                                />
                            </div>
                        }
                    </div>
                </div>


            </div>
            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={updateGroupOwnerModal}
                onClose={updateGroupOwnerModal}
                size="md"
                withCloseButton={false}
                centered
                containerClassName='addnewmodal'
            >
                {
                    updateGroupOwnerModal &&
                    <Updategroupowner
                        closeUpdateGroupOwnerModal={closeUpdateGroupOwnerModal}
                        refreshGroupOwner={refreshGroupOwner}
                        singleGroupOwnerData={singleGroupOwnerData}
                    />
                }
            </Modal>

            <DeleteModal
                title='Delete Group/Owner'
                message='Are you sure you want to delete this Group/Owner?'
                open={groupOwnerDeleteModal}
                onClose={closeGroupOwnerDeleteModal}
                onConfirm={() => handleDeleteGroupOwner(groupOwnerId)}
            />
        </>
    );
};

export default Groupowner;
