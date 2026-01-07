import React, { useEffect, useState } from "react";
import Updateinfomodal from "./Updateinfomodal.jsx";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import Settingsapi from "../../api/Settingsapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { NavLink } from "react-router";

const Companyinfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [generalInfoModal, setGeneralInfoModal] = useState(false);

  const permissions = useEmployeeDetails((state) => state.permissions);

  const openGeneralInfoModal = () => setGeneralInfoModal(true);
  const closeGeneralInfoModal = () => setGeneralInfoModal(false);

  async function getCompanyInfo() {
    setIsLoading(true);

    Settingsapi.get("get-company-info", {
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
          setCompanyInfo(null);
        } else {
          setCompanyInfo(data?.data || {});
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
        setCompanyInfo(null);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getCompanyInfo();
  }, []);

  const reloadCompanyDetails = () => {
    getCompanyInfo();
  };

  return (
    <>
      <div className="flex flex-col gap-4 border border-[#ebecef] rounded-xl bg-white p-8 min-h-[65vh]">
        <div className="flex justify-between items-center">
          <p className="text-[18px] font-semibold">Company Info</p>
          {permissions?.settings_page?.includes("update_company_info") && (
            <button
              onClick={openGeneralInfoModal}
              className="text-[14px] font-semibold text-black bg-[#f3f4f6] hover:bg-gray-200 cursor-pointer rounded-md px-4 py-2"
            >
              Update Info
            </button>
          )}
        </div>
        <hr className="text-[#ebecef]" />
        <div className="relative space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Company Name</p>
              <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">
                {companyInfo?.name || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Email</p>
              <NavLink to={`mailto:${companyInfo?.email}`}>
                <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">
                  {companyInfo?.email || "---"}
                </p>
              </NavLink>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Phone Number</p>
              <NavLink
                to={`https://wa.me/${companyInfo?.phone_code || "+91"}${
                  companyInfo?.phone_number
                }?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="text-sm text-gray-500 font-normal">
                  {companyInfo?.phone_code || "+91"}{" "}
                  {companyInfo?.phone_number || "---"}
                </p>
              </NavLink>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Address Line 1</p>
              <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">
                {companyInfo?.address_line1 || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Address Line 2</p>
              <p className="text-sm text-gray-500 font-normal overflow-hidden break-words">
                {companyInfo?.address_line2 || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">City</p>
              <p className="text-sm text-gray-500 font-normal">
                {companyInfo?.city || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">State</p>
              <p className="text-sm text-gray-500 font-normal">
                {companyInfo?.state || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Country</p>
              <p className="text-sm text-gray-500 font-normal">
                {companyInfo?.country || "---"}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-semibold">Pincode</p>
              <p className="text-sm text-gray-500 font-normal">
                {companyInfo?.zip_code || "---"}
              </p>
            </div>
          </div>
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
              <Loadingoverlay visible={isLoading} overlayBg="" />
            </div>
          )}
        </div>
      </div>
      {errorMessage && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}

      <Modal
        open={generalInfoModal}
        onClose={generalInfoModal}
        size="lg"
        withCloseButton={false}
        centered
        containerClassName="addnewmodal"
      >
        {generalInfoModal && (
          <Updateinfomodal
            closeGeneralInfoModal={closeGeneralInfoModal}
            companyInfo={companyInfo}
            reloadCompanyDetails={reloadCompanyDetails}
          />
        )}
      </Modal>
    </>
  );
};

export default Companyinfo;
