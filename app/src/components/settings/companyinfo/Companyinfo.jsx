import React, { useEffect, useState } from "react";
import Updateinfomodal from "./Updateinfomodal.jsx";
import { Loadingoverlay, Modal } from "@nayeshdaggula/tailify";
import Settingsapi from "../../api/Settingsapi.jsx";
import Errorpanel from "../../shared/Errorpanel.jsx";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails.jsx";
import { NavLink } from "react-router";
import { MapPin, Phone, Mail, Globe, Map, Building } from "lucide-react";


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
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            {/* Optional Header - keeping it simple if tabs already have it, but for context let's leave it clean */}
          </div>
          {permissions?.settings_page?.includes("update_company_info") && (
            <button
              onClick={openGeneralInfoModal}
              className="text-sm font-medium text-white bg-[#0083bf] hover:bg-[#0073a8] transition-colors rounded-lg px-4 py-2 shadow-sm"
            >
              Update Info
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Information Card */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building className="text-[#0083bf]" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">General Information</h3>
            </div>

            <div className="space-y-4">
              <div className="group">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Company Name</p>
                <p className="text-base font-medium text-neutral-900">{companyInfo?.name || "---"}</p>
              </div>

              <div className="flex flex-col gap-4 pt-2">
                <div className="group">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Email Address</p>
                  <NavLink to={`mailto:${companyInfo?.email}`} className="flex items-center gap-2 text-neutral-900 hover:text-[#0083bf] transition-colors">
                    <Mail size={16} className="text-neutral-400" />
                    {companyInfo?.email || "---"}
                  </NavLink>
                </div>

                <div className="group">
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Phone Number</p>
                  <NavLink to={`https://wa.me/${companyInfo?.phone_code || "+91"}${companyInfo?.phone_number}`} target="_blank" className="flex items-center gap-2 text-neutral-900 hover:text-[#0083bf] transition-colors">
                    <Phone size={16} className="text-neutral-400" />
                    {companyInfo?.phone_code || "+91"} {companyInfo?.phone_number || "---"}
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-50 rounded-lg">
                <MapPin className="text-orange-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Address Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="col-span-2">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Full Address</p>
                <div className="flex items-start gap-2">
                  <p className="text-base text-neutral-900">
                    {companyInfo?.address_line1 || "---"}
                    {companyInfo?.address_line2 && `, ${companyInfo?.address_line2}`}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">City</p>
                <p className="text-sm font-medium text-neutral-900">{companyInfo?.city || "---"}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">State</p>
                <p className="text-sm font-medium text-neutral-900">{companyInfo?.state || "---"}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Country</p>
                <p className="text-sm font-medium text-neutral-900">{companyInfo?.country || "---"}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Pincode</p>
                <p className="text-sm font-medium text-neutral-900">{companyInfo?.zip_code || "---"}</p>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm flex justify-center items-center z-50 rounded-xl">
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
