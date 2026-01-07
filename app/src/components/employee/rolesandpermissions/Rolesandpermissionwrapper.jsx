import React, { useCallback, useEffect, useState } from "react";
import Editrole from "./Editrole";
import Addnewform from "./Addnewform";
import Permissionpopup from "./Permissionpopup";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import DeleteModal from "../../shared/DeleteModal";
import { Modal, Pagination } from "@nayeshdaggula/tailify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Projectapi from "../../api/Projectapi";
import AssignProject from "../../shared/AssignProject";
import { useProjectDetails } from "../../zustand/useProjectDetails";

function Rolesandpermissionwrapper() {
  const userInfo = useEmployeeDetails((state) => state.employeeInfo);
  const access_token = useEmployeeDetails((state) => state.access_token);
  let user_id = userInfo?.id;

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [roledata, setRoledata] = useState([]);

  async function getClinetroledata(newPage, newlimit) {
    await Employeeapi.get(
      "/getallroledata",
      {
        params: {
          page: newPage,
          limit: newlimit,
          user_id: user_id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => {
        let data = response.data;
        if (data?.status === "error") {
          let finalresponse = {
            message: data?.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoading(false);
          return false;
        }
        setRoledata(data?.roledata);
        setTotalCount(data?.totalrolescount);
        setTotalPages(data?.totalpages);
        setIsLoading(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
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
  }

  const handlePageChange = useCallback((value) => {
    setPage(value);
    getClinetroledata(value, limit);
    setIsLoading(true);
  }, []);

  const reloadGetroledata = useCallback(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, [page, limit]);

  useEffect(() => {
    setIsLoading(true);
    getClinetroledata(page, limit);
  }, []);

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

  const [permissionModal, setPermissionModal] = useState(false);

  const [roleId, setRoleId] = useState("");
  const openPermisissionsModal = useCallback(
    (id) => {
      setRoleId(id);
      setPermissionModal(true);
    },
    [roleId]
  );

  const closePermissionsModal = () => {
    setPermissionModal(false);
    setRoleId("");
  };

  const [roleDetails, setRoleDetails] = useState(null);
  const [roleEditModel, setRoleEditModel] = useState(false);
  const openEditRoleEditModel = useCallback(
    (id, role_details) => {
      setRoleEditModel(true);
      setRoleDetails(role_details);
      setRoleId(id);
    },
    [roleDetails, roleId]
  );

  const closeEditRoleEditModel = () => {
    setRoleEditModel(false);
    setRoleDetails(null);
    setRoleId("");
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const openRoleDeleteModal = (id) => {
    setDeleteUserId(id);
    setOpenDeleteModal(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-[22px] font-semibold">
            Roles & Permissions
          </p>
        </div>
        <div className="flex gap-4">
          <div className="basis-[25%] w-full bg-white  p-4 rounded-md">
            <Addnewform reloadGetroledata={reloadGetroledata} />
          </div>
          <div className="basis-[75%] bg-white p-4 flex flex-col gap-4 w-full border border-[#ebecef] rounded-md">
            <div className="w-full relative overflow-x-auto border border-[#ebecef] rounded-md">
              <table className="w-full table-fixed text-left border-collapse">
                <thead className="border-b-[0.6px] border-b-[#ebecef]">
                  <tr className="w-full">
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky left-0 z-20 bg-white rounded-md border-r border-[#ebecef]">
                      SL#
                    </th>
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[180px]">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Permissions
                    </th>
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[160px]">
                      Default
                    </th>
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] sticky right-[120px] z-10 w-[120px] bg-white border-l border-[#ebecef]">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-[#2B2B2B] text-[16px] font-[500] leading-[18px] w-[120px] sticky right-0 z-20 bg-white rounded-md border-l border-[#ebecef]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading === false ? (
                    roledata?.length > 0 ? (
                      roledata?.map((roledata, index) => (
                        <tr key={index} className="border-b-[0.6px] border-b-[#ebecef] align-top">
                          <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white border-r border-[#ebecef]">
                            <p className="text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {index + 1}
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                            <p className=" text-[#4b5563] text-[13px] font-normal leading-[18px]">
                              {roledata.role_name}
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <button
                              className="cursor-pointer px-2 py-1 bg-[#0083bf] text-white rounded-md text-[11px]"
                              onClick={() =>
                                openPermisissionsModal(roledata.role_id)
                              }
                            >
                              Update Permission
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            {roledata.default_role === "Yes" ? (
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
                          <td className="px-4 py-3 whitespace-normal break-words sticky right-[120px] z-10 w-[120px] bg-white border-l border-[#ebecef]">
                            {roledata.status === "Inactive" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#fdecec] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#EC0606"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#ec0606]">
                                  Inactive
                                </p>
                              </div>
                            ) : roledata.status === "Active" ? (
                              <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#ecfdf3] w-fit">
                                <svg
                                  width={9}
                                  height={8}
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                  preserveAspectRatio="xMidYMid meet"
                                >
                                  <circle
                                    cx="4.42871"
                                    cy={4}
                                    r={3}
                                    fill="#14BA6D"
                                  />
                                </svg>
                                <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#037847]">
                                  Active
                                </p>
                              </div>
                            ) : (
                              roledata.status === "Suspended" && (
                                <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-1.5 px-5 py-1 rounded-2xl bg-[#D6D6D6] w-fit">
                                  <svg
                                    width={9}
                                    height={8}
                                    viewBox="0 0 9 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="flex-grow-0 flex-shrink-0 w-2 h-2 relative"
                                    preserveAspectRatio="xMidYMid meet"
                                  >
                                    <circle
                                      cx="4.42871"
                                      cy={4}
                                      r={3}
                                      fill="#434343"
                                    />
                                  </svg>
                                  <p className="flex-grow-0 flex-shrink-0 text-xs font-medium text-center text-[#434343]">
                                    Suspended
                                  </p>
                                </div>
                              )
                            )}
                          </td>
                          {roledata.role_name !== "Super Admin" && (
                            <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white border-l border-[#ebecef]">
                              <div className="flex flex-row items-center gap-1">
                                <div
                                  onClick={() =>
                                    openEditRoleEditModel(
                                      roledata.role_id,
                                      roledata
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <IconEdit size={20} color="#4b5563" />
                                </div>
                                <div
                                  onClick={() =>
                                    openRoleDeleteModal(roledata.role_id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <IconTrash color="red" size={20} strokeWidth={1.5} />
                                </div>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                            No data found
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        <p className="text-[#4b5563] text-[13px] not-italic font-normal leading-[18px]">
                          Loading...
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {roledata?.length > 0 && (
              <div className="flex flex-row-reverse">
                <Pagination
                  totalpages={totalPages}
                  value={page}
                  siblings={1}
                  onChange={handlePageChange}
                  color="#0083bf"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

      <Modal
        open={permissionModal}
        onClose={closePermissionsModal}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {permissionModal === true && (
          <Permissionpopup
            closePermissionsModel={closePermissionsModal}
            roleId={roleId}
          />
        )}
      </Modal>

      <Modal
        open={roleEditModel}
        onClose={closeEditRoleEditModel}
        size="md"
        zIndex={9999}
        withCloseButton={false}
      >
        {roleEditModel === true && (
          <Editrole
            closeEditRoleEditModel={closeEditRoleEditModel}
            roleId={roleId}
            roleDetails={roleDetails}
            reloadGetroledata={reloadGetroledata}
          />
        )}
      </Modal>

      <DeleteModal
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => {
          Employeeapi.post(
            "/deleterole",
            {
              role_id: deleteUserId,
            },
            {}
          )
            .then((response) => {
              let data = response.data;
              if (data.status === "error") {
                let finalresponse = {
                  message: data.message,
                  server_res: data,
                };
                setIsLoading(false);
                return false;
              }

              setOpenDeleteModal(false);
              setIsLoading(false);
              reloadGetroledata();
              return false;
            })
            .catch((error) => {
              console.log(error);
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
              setIsLoading(false);
              return false;
            });
        }}
      />

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

export default Rolesandpermissionwrapper;
