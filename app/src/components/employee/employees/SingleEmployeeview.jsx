import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconEdit, IconUser, IconMail, IconPhone, IconBriefcase, IconUserCheck, IconLock } from "@tabler/icons-react";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import { useParams, useNavigate, Link, NavLink } from "react-router-dom";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Changepassword from "./Changepassword";
import Employeeapi from "../../api/Employeeapi";
import Errorpanel from "../../shared/Errorpanel";
import Uploademployeeprofile from "../../shared/Uploademployeeprofile";
import profileStatic from "../../../../public/assets/customer_static_image.jpg";

function SingleEmployeeview() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const permissions = useEmployeeDetails((state) => state.permissions);

  const [userdata, setUserdata] = useState({});
  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal-info");

  const [uploadFileModal, setUploadFileModal] = useState(false);
  const closeUploadFileModal = () => {
    setUploadFileModal(false);
  };
  const openUploadFileModal = () => {
    setUploadFileModal(true);
  };

  async function getSingleEmployee(singleUserid) {
    setIsLoadingEffect(true);
    Employeeapi.get("/get-single-employee-data", {
      params: {
        single_user_id: singleUserid,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        setUserdata(data?.employee_data || {});
        setIsLoadingEffect(false);
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
        setIsLoadingEffect(false);
      });
  }

  const refreshUserDetails = () => {
    getSingleEmployee(userId); // This will re-fetch the details including the new image
  };

  useEffect(() => {
    getSingleEmployee(userId);
  }, [userId]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="text-[24px] font-semibold">View Employee</p>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex flex-col w-full mr-5">
              <div className="text-gray-600 shrink-0 text-[10px]">Status</div>
              <div className="text-gray-900 font-semibold break-all">
                {userdata?.status === "Inactive" ? (
                  <span className="text-red-500">Inactive</span>
                ) : userdata?.status === "Active" ? (
                  <span className="text-green-500">Active</span>
                ) : userdata?.status === "Suspended" ? (
                  <span className="text-gray-500">Suspended</span>
                ) : (
                  "---"
                )}
              </div>
            </div>

            <Link
              to={"/employees"}
              className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-2 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
            >
              <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
              Back
            </Link>
          </div>
        </div>

        <div className="">
          <div className="flex gap-4">
            {/* Left Profile Card */}
            <div className="w-[22%] min-h-fit bg-white rounded-xl shadow-xl">
              <div className="relative mb-4 flex flex-col justify-center items-center">
                <div className="w-full h-24 rounded-t-xl bg-gradient-to-br from-pink-500 via-pink-700 to-blue-800 flex items-center justify-center"></div>
                <div className="relative w-42 h-42 mt-[-65px]">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                    <img
                      crossOrigin="anonymous"
                      src={
                        userdata?.profile_pic_url?.trim()
                          ? userdata.profile_pic_url
                          : profileStatic
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-4 bg-white border border-gray-300 rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-100">
                    <IconEdit
                      onClick={openUploadFileModal}
                      className="size-4"
                    />
                  </div>

                  {/* )} */}
                </div>
              </div>

              <div className="px-5 pb-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1 break-all">
                    {userdata?.name || "---"}
                  </h2>
                  <p className="text-gray-600 break-all">
                    {userdata?.email || "---"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Name</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.name || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Email</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.email || "---"}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="text-gray-600 shrink-0">Phone Number</div>
                      <div className="text-gray-900 font-semibold break-all">
                        {userdata?.phone
                          ? `+${userdata?.phone_code} ${userdata?.phone}`
                          : "---"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="relative w-[78%]">
              {!isLoadingEffect &&
                <>
                  <div className="mb-3 p-1 grid grid-cols-2 gap-1 bg-gray-100/80 rounded-lg border border-gray-200">
                    <button
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300
                      ${activeTab === "personal-info"
                          ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        }`}
                      onClick={() => setActiveTab("personal-info")}
                    >
                      <IconUser size={18} />
                      Personal Info
                    </button>

                    {permissions?.employee_page?.includes(
                      "change_password_tab"
                    ) && (
                        <button
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all duration-300
                          ${activeTab === "change-password"
                              ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            }`}
                          onClick={() => setActiveTab("change-password")}
                        >
                          <IconLock size={18} />
                          Change Password
                        </button>
                      )}
                  </div>

                  <div className="flex-1 p-6 bg-white rounded-xl shadow-xl">
                    {activeTab === "personal-info" && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                          <div className="p-2 bg-blue-50 rounded-full">
                            <IconUser size={20} className="text-blue-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Employee Details
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconUser size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconMail size={20} stroke={1.5} />
                            </div>
                            <div className="w-full">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                              <NavLink to={`mailto:${userdata?.email}`} className="block">
                                <p className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                                  {userdata?.email || "---"}
                                </p>
                              </NavLink>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconBriefcase size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Designation / Role</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.role_name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-blue-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconUserCheck size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Reporting Manager</p>
                              <p className="text-sm font-semibold text-gray-900">{userdata?.reporting_head_name || "---"}</p>
                            </div>
                          </div>

                          <div className="flex group items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100 md:col-span-2">
                            <div className="p-2.5 bg-white text-gray-500 group-hover:text-green-600 rounded-lg shadow-sm ring-1 ring-gray-100">
                              <IconPhone size={20} stroke={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                              <NavLink
                                to={`https://wa.me/${userdata?.phone_code || "+91"}${userdata?.phone}?text=Hello!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 group/link"
                              >
                                <span className="text-sm font-semibold text-gray-900 group-hover/link:text-green-600 transition-colors">
                                  {userdata?.phone ? `+${userdata?.phone_code} ${userdata?.phone}` : "---"}
                                </span>
                                {/* {userdata?.phone && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium group-hover/link:bg-green-200">
                                    WhatsApp
                                  </span>
                                )} */}
                              </NavLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "change-password" && (
                      <div className="text-gray-500">
                        {permissions?.employee_page?.includes(
                          "change_password_tab"
                        ) && <Changepassword singleUserid={userdata?.id} />}
                      </div>
                    )}
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>





      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )
      }

      <Modal
        open={uploadFileModal}
        close={closeUploadFileModal}
        padding="px-5"
        withCloseButton={false}
        containerClassName="!max-w-[300px] xxm:!max-w-[350px] xs:!max-w-[390px] md:!max-w-[440px]"
      >
        {uploadFileModal && (
          <Uploademployeeprofile
            closeUploadFileModal={closeUploadFileModal}
            setIsLoadingEffect={setIsLoadingEffect}
            employee_id={userdata?.id}
            refreshUserDetails={refreshUserDetails}
          />
        )}
      </Modal>
    </>
  );
}

export default SingleEmployeeview;
