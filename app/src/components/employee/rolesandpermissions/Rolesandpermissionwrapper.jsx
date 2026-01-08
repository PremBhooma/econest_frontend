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
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-[300px] flex-none">
            <Addnewform reloadGetroledata={reloadGetroledata} />
          </div>
          <div className="flex-1 w-full bg-white p-5 border border-neutral-200 shadow-sm rounded-xl overflow-hidden">
            <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
              <table className="w-full table-fixed text-left border-collapse">
                <thead className="bg-gray-50 border-b border-neutral-200">
                  <tr className="w-full">
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                      SL#
                    </th>
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[180px]">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                      Permissions
                    </th>
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                      Default
                    </th>
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] sticky right-[120px] z-10 w-[120px] bg-gray-50 border-l border-neutral-200">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 rounded-tr-lg border-l border-neutral-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {isLoading === false ? (
                    roledata?.length > 0 ? (
                      roledata?.map((roledata, index) => (
                        <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                          <td className="px-4 py-3 whitespace-normal break-words w-[120px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                            <p className="text-neutral-600 text-sm font-medium">
                              {index + 1}
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[180px]">
                            <p className="text-neutral-900 text-sm font-semibold">
                              {roledata.role_name}
                            </p>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            <button
                              className="cursor-pointer px-3 py-1.5 bg-white border border-[#0083bf] text-[#0083bf] hover:bg-[#0083bf] hover:text-white transition-colors rounded-md text-xs font-medium"
                              onClick={() =>
                                openPermisissionsModal(roledata.role_id)
                              }
                            >
                              Update Permission
                            </button>
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                            {roledata.default_role === "Yes" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-normal break-words sticky right-[120px] z-10 w-[120px] bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                            {roledata.status === "Inactive" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            ) : roledata.status === "Active" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              roledata.status === "Suspended" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Suspended
                                </span>
                              )
                            )}
                          </td>
                          {roledata.role_name !== "Super Admin" && (
                            <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                              <div className="flex flex-row items-center justify-center gap-3">
                                <button
                                  onClick={() =>
                                    openEditRoleEditModel(
                                      roledata.role_id,
                                      roledata
                                    )
                                  }
                                  className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                >
                                  <IconEdit size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    openRoleDeleteModal(roledata.role_id)
                                  }
                                  className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600"
                                >
                                  <IconTrash size={18} />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8">
                          <p className="text-neutral-500 text-sm">
                            No roles found
                          </p>
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0083bf] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-neutral-500 text-sm">Loading roles...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {roledata?.length > 0 && (
              <div className="flex flex-row-reverse border-t border-neutral-100 pt-4">
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
