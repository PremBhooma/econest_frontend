import { useState } from "react";
import { Link } from "react-router-dom";
import Flatcostupdate from "./Flatcostupdate";

import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

function Flatinformation({ flatDetails, customerFlatDetails, refreshUserDetails, flatCostUpdate, openFlatCostUpdate, closeFlatCostUpdate }) {
  if (!flatDetails) return null;

  const typeToLabelMap = {
    Studio: "Studio",
    OneBHK: "1 BHK",
    OnePointFiveBHK: "1.5 BHK",
    TwoBHK: "2 BHK",
    TwoPointFiveBHK: "2.5 BHK",
    ThreeBHK: "3 BHK",
    ThreePointFiveBHK: "3.5 BHK",
    FourBHK: "4 BHK",
    FourPointFiveBHK: "4.5 BHK",
    FiveBHK: "5 BHK",
    Penthouse: "Penthouse",
    Duplex: "Duplex",
  };

  const basicInfoItems = [
    {
      label: "Owner Name",
      value: flatDetails?.customer?.first_name ? `${flatDetails?.customer?.prefixes || ''} ${flatDetails?.customer?.first_name}` : "---",
      isLink: true,
      linkType: "customer",
    },
    {
      label: "Email",
      value: flatDetails?.customer?.email ? flatDetails?.customer?.email : "---",
      isLink: true,
      linkType: "email",
    },
    {
      label: "Phone Number",
      value: flatDetails?.customer?.phone_number ? `+${flatDetails?.customer?.phone_code} ${flatDetails?.customer?.phone_number}` : "---",
      isLink: true,
      linkType: "phone",
    },
    { label: "Group/Owner", value: flatDetails?.group_owner?.name ? flatDetails?.group_owner?.name : "---" },
    { label: "UDL Number", value: flatDetails?.udl ? flatDetails?.udl : "---" },
    { label: "Deed Number", value: flatDetails?.deed_number ? flatDetails?.deed_number : "---" },
    { label: "Block", value: flatDetails?.block?.block_name ? flatDetails?.block?.block_name : "---" },
    { label: "Area", value: flatDetails?.square_feet ? `${flatDetails?.square_feet} sq.ft` : "---" },
    { label: "Type", value: typeToLabelMap[flatDetails?.type] || "---" },
    { label: "Bedrooms", value: flatDetails?.bedrooms ? flatDetails?.bedrooms : "---" },
    { label: "Bathrooms", value: flatDetails?.bathrooms ? flatDetails?.bathrooms : "---" },
    { label: "Balconies", value: flatDetails?.balconies ? flatDetails?.balconies : "---" },
    { label: "Furnished Status", value: flatDetails?.furnished_status ? flatDetails?.furnished_status : "---" },
    { label: "Parking Area", value: flatDetails?.parking ? `${flatDetails?.parking} sq.ft` : "---" },
    { label: "Mortgage", value: flatDetails?.mortgage == true ? "Yes" : "No" },
    { label: "Corner", value: flatDetails?.corner == true ? "Yes" : "No" },
    { label: "East Facing", value: flatDetails?.east_face ? flatDetails?.east_face : "---" },
    { label: "West Facing", value: flatDetails?.west_face ? flatDetails?.west_face : "---" },
    { label: "North Facing", value: flatDetails?.north_face ? flatDetails?.north_face : "---" },
    { label: "South Facing", value: flatDetails?.south_face ? flatDetails?.south_face : "---" },
    { label: "Main-Door Facing", value: flatDetails?.facing ? flatDetails?.facing : "---" },
    {
      label: "Google Map Link",
      value: flatDetails?.google_map_link ? flatDetails?.google_map_link : "---",
      isLink: true,
      linkType: "map"
    },
    { label: "Status", value: flatDetails?.status, isStatus: true },
    // {
    //   label: "Application Date",
    //   value: customerFlatDetails?.application_date
    //     ? new Date(customerFlatDetails.application_date).toLocaleDateString("en-IN", {
    //       day: "2-digit",
    //       month: "short",
    //       year: "numeric",
    //     })
    //     : "---"
    // }
  ];

  console.log("customerFlatDetails", customerFlatDetails);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="w-full grid grid-cols-3 gap-4">
          {basicInfoItems.map(({ label, value, isStatus, isLink, linkType }) => {
            let content = value || "---";
            const hasValue = value && value !== "---";

            if (isLink && hasValue) {
              if (linkType === "customer") {
                content = (
                  <Link
                    to={`/customers/${flatDetails?.customer?.uuid}`}
                    className="text-blue-500 hover:underline"
                  >
                    {value}
                  </Link>
                );
              } else if (linkType === "email") {
                content = (
                  <a
                    href={`mailto:${value}`}
                    className="text-blue-500 hover:underline"
                  >
                    {value}
                  </a>
                );
              } else if (linkType === "phone") {
                content = (
                  <a
                    href={`https://wa.me/${flatDetails?.customer?.phone_code}${flatDetails?.customer?.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {value}
                  </a>
                );
              } else if (linkType === "map") {
                content = (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Click Me
                  </a>
                );
              }
            }

            return (
              <div key={label} className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">{label}</p>
                {isStatus ? (
                  <p
                    className={`text-sm font-medium w-fit py-0.5 px-2 rounded-sm ${value === "Sold"
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                      }`}
                  >
                    {value || "-"}
                  </p>
                ) : (
                  <p
                    className={`text-sm font-semibold ${hasValue && isLink ? "text-blue-500" : "text-gray-900"
                      }`}
                  >
                    {content}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex flex-col gap-y-1 col-span-3">
            <p className="text-sm text-gray-600">Description</p>
            <p className="text-sm text-gray-900 font-semibold">{flatDetails?.description ? flatDetails?.description : "---"}</p>
          </div>
        </div>
        {customerFlatDetails && (
          <>
            <hr className="border !border-[#ebecef]" />
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Flat Cost Details :</p>
              <button onClick={openFlatCostUpdate} className="text-[14px] text-white px-5 py-1.5 cursor-pointer !rounded-sm !bg-[#0083bf] hover:!bg-[#0083bf]/90">Update</button>
            </div>

            <div className="w-full grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Application Date</p>
                <p className='text-sm font-semibold text-gray-900'> {customerFlatDetails?.application_date
                  ? new Date(customerFlatDetails.application_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "---" || '---'}</p>
              </div>
              {customerFlatDetails?.floor_rise_per_sq_ft && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">Foor Rise Charge Per (sq.ft.)</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.floor_rise_per_sq_ft ? parseFloat(customerFlatDetails.floor_rise_per_sq_ft).toFixed(2) : '---'}</p>
                </div>
              )}
              {customerFlatDetails?.total_floor_rise && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">Total Foor Rise</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.total_floor_rise ? parseFloat(customerFlatDetails.total_floor_rise).toFixed(2) : '---'}</p>
                </div>
              )}
              {customerFlatDetails?.east_facing_per_sq_ft && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">East Facing Charge Per (sq.ft.)</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.east_facing_per_sq_ft ? parseFloat(customerFlatDetails.east_facing_per_sq_ft).toFixed(2) : '---'}</p>
                </div>
              )}
              {customerFlatDetails?.total_east_facing && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">Total East Facing</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.total_east_facing ? parseFloat(customerFlatDetails.total_east_facing).toFixed(2) : '---'}</p>
                </div>
              )}
              {customerFlatDetails?.corner_per_sq_ft && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">Corner Charge Per (sq.ft.)</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.corner_per_sq_ft ? parseFloat(customerFlatDetails.corner_per_sq_ft).toFixed(2) : '---'}</p>
                </div>
              )}
              {customerFlatDetails?.total_corner && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-sm text-gray-600">Total Corner</p>
                  <p className="text-sm font-semibold text-gray-900">₹ {customerFlatDetails?.total_corner ? parseFloat(customerFlatDetails.total_corner).toFixed(2) : '---'}</p>
                </div>
              )}
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Amenities (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.amenities).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">GST (5%)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.gst).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Cost of Unit with Tax (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.costofunitwithtax).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Registration (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.registrationcharge).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Maintenance (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.maintenancecharge).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Documentation Fee (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.documentaionfee).toFixed(2) || '---'}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <p className="text-sm text-gray-600">Corpus Fund (₹)</p>
                <p className='text-sm font-semibold text-gray-900'> ₹ {parseFloat(customerFlatDetails?.corpusfund).toFixed(2) || '---'}</p>
              </div>

            </div>
          </>
        )}
      </div >

      {/* <Drawer
        padding="5%"
        size={'80%'}
        position="right"
        overlayProps={{ backgroundOpacity: 0.2 }}
        bg={"transparent"}
        zIndex={100}
        open={flatCostUpdate}
        onClose={closeFlatCostUpdate}
        withCloseButton={false}
      > */}

      <Drawer
        open={flatCostUpdate}
        onClose={closeFlatCostUpdate}
        direction='right'
        className='h-screen overflow-y-auto'
        size='80vw'
        zIndex={100}
        lockBackgroundScroll={true}
      // duration={300}
      >
        {flatCostUpdate && (
          <Flatcostupdate
            closeFlatCostUpdate={closeFlatCostUpdate}
            refreshUserDetails={refreshUserDetails}
            customerFlatDetails={customerFlatDetails}
            flatDetails={flatDetails}
          />
        )}
      </Drawer>
    </>
  );
}

export default Flatinformation;
