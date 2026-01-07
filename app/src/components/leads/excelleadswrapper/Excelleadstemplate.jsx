// import React from 'react'
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import { Button } from '@nayeshdaggula/tailify';
// import Employeeapi from '../../api/Employeeapi';
// import { useState, useEffect } from 'react';

// function Excelleadstemplate({ closeDownloadTemplate }) {

//     const [isLoadingEffect, setIsLoadingEffect] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     const [employeeData, setEmployeeData] = useState([]);
//     async function getEmployees() {
//         await Employeeapi.get("/get-all-employees-list")
//             .then((response) => {
//                 const data = response?.data;
//                 if (data?.status === "error") {
//                     let finalResponse;
//                     finalResponse = {
//                         message: data?.message,
//                         server_res: data,
//                     };
//                     setErrorMessage(finalResponse);
//                     setIsLoadingEffect(false);
//                     return;
//                 }
//                 setEmployeeData(data?.employees || []);
//                 setIsLoadingEffect(false);
//             })
//             .catch((error) => {
//                 console.log("Error:", error);
//                 let finalresponse;
//                 if (error?.response !== undefined) {
//                     finalresponse = {
//                         message: error.message,
//                         server_res: error.response.data,
//                     };
//                 } else {
//                     finalresponse = {
//                         message: error.message,
//                         server_res: null,
//                     };
//                 }
//                 setErrorMessage(finalresponse);
//                 setIsLoadingEffect(false);
//             });
//     }

//     console.log("Employees Data", employeeData)

//     const downloadLeadTemplate = async () => {

//         setErrorMessage("");
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet("Lead Upload Template");

//         const headers = [
//             "Prefixes", // NEW
//             "Full Name",
//             "Email Address",
//             "Phone Number",
//             "Assign to Employee",
//             "Source of lead",
//             "Country",
//             "State",
//             "City",
//             "Address",
//             "Pincode",
//         ];

//         worksheet.addRow(headers);
//         worksheet.getRow(1).font = { bold: true };
//         worksheet.columns.forEach((col) => {
//             col.width = 25;
//         });

//         // Dropdown values
//         const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
//         const sourceOfLead = ["Instagram", "Facebook", "Referral", "Friend", "Others"]

//         const employeeSheet = workbook.addWorksheet('EmployeeList');
//         employeeData.forEach((ele, index) => {
//             employeeSheet.getCell(`A${index + 1}`).value = ele.label;
//         });
//         employeeSheet.state = 'veryHidden';

//         // Example row
//         worksheet.addRow([
//             "Mr",
//             "ABC",
//             "abcd@gmail.com",
//             1234567890,
//             employeeData[0]?.label || "",
//             sourceOfLead[0],
//             "India",
//             "Telangana",
//             "Hyderabad",
//             "Madhapur",
//             500032,
//         ]);

//         const rowCount = 5000;

//         for (let i = 2; i <= rowCount; i++) {
//             // Prefixes → column A
//             worksheet.getCell(`A${i}`).dataValidation = {
//                 type: "list",
//                 allowBlank: true,
//                 formulae: [`"${prefixes.join(",")}"`],
//                 showErrorMessage: true,
//                 errorStyle: "error",
//                 errorTitle: "Invalid Prefix",
//                 error: "Please select Mr, Mrs, Miss, or Mx",
//             };

//             worksheet.getCell(`E${i}`).dataValidation = {
//                 type: "list",
//                 allowBlank: true,
//                 formulae: [`EmployeeList!$A$1:$A$${employeeData?.length}`],
//                 showErrorMessage: true,
//                 errorStyle: "error",
//                 errorTitle: "Invalid Employee",
//                 error: "Please select Employee",
//             };

//             worksheet.getCell(`F${i}`).dataValidation = {
//                 type: "list",
//                 allowBlank: true,
//                 formulae: [`"${sourceOfLead.join(",")}"`],
//                 showErrorMessage: true,
//                 errorStyle: "error",
//                 errorTitle: "Invalid Source of lead",
//                 error: "Please select source of lead",
//             };
//         }

//         const buffer = await workbook.xlsx.writeBuffer();
//         const fileBlob = new Blob([buffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });
//         saveAs(fileBlob, "lead_upload_template.xlsx");
//         closeDownloadTemplate();
//     };

//     useEffect(() => {
//         getEmployees()
//     }, []);

//     return (
//         <div className="text-sm space-y-2 p-4">
//             <div className='w-full flex justify-between items-center'>
//                 <div className='font-semibold'>Guidelines:</div>
//                 <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
//             </div>
//             <ul className="list-decimal ml-5 space-y-1">
//                 <li><strong>Prefixes:</strong> Select from dropdown → Mr, Mrs, Miss, Mx.</li>
//                 <li><strong>Employee:</strong> Select from dropdown → Employee to assign the lead.</li>
//                 <li><strong>Sourse of lead:</strong> Select from dropdown → Source of lead.</li>
//             </ul>

//             <button
//                 className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
//                 onClick={downloadLeadTemplate}
//             >
//                 Download Lead Template
//             </button>
//         </div>
//     );
// }

// export default Excelleadstemplate;

import React from 'react'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Button } from '@nayeshdaggula/tailify';
import Employeeapi from '../../api/Employeeapi';
import { useState, useEffect } from 'react';

function Excelleadstemplate({ closeDownloadTemplate }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [employeeData, setEmployeeData] = useState([]);

    async function getEmployees() {
        setIsLoading(true);
        
        Employeeapi.get("/get-all-employees-list", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response?.data;
                if (data?.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setEmployeeData([]);
                } else {
                    setEmployeeData(data?.employees || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setEmployeeData([]);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getEmployees();
    }, []);

    console.log("Employees Data", employeeData);

    const downloadLeadTemplate = async () => {

        if (!employeeData || employeeData.length === 0) {
            setErrorMessage("No employees available. Please add employees before downloading.");
            return;
        }

        setErrorMessage("");
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Lead Upload Template");

        const headers = [
            "Prefixes",
            "Full Name",
            "Email Address",
            "Phone Number",
            "Assign to Employee",
            "Source of lead",
            "Country",
            "State",
            "City",
            "Address",
            "Pincode",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        // Dropdown options
        const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
        const sourceOfLead = ["Instagram", "Facebook", "Referral", "Friend", "Others"];

        // Hidden Employee sheet
        const employeeSheet = workbook.addWorksheet('EmployeeList');
        employeeData.forEach((ele, index) => {
            employeeSheet.getCell(`A${index + 1}`).value = ele.label;
        });
        employeeSheet.state = 'veryHidden';

        // Sample row
        worksheet.addRow([
            prefixes[0],                    // Prefixes
            "John Doe",                     // Full Name
            "john.doe@example.com",         // Email Address
            "9876543210",                   // Phone Number (10 digits)
            employeeData[0]?.label || "",   // Employee
            sourceOfLead[0],                // Source of lead
            "India",                        // Country
            "Telangana",                    // State
            "Hyderabad",                    // City
            "Madhapur, Hi-Tech City",       // Address
            "500081",                       // Pincode
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // ✅ Prefixes (Column A)
            worksheet.getCell(`A${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx.",
            };

            // ✅ Assign to Employee (Column E)
            worksheet.getCell(`E${i}`).dataValidation = {
                type: "list",
                allowBlank: false,
                formulae: [`EmployeeList!$A$1:$A$${employeeData.length}`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Employee",
                error: "Please select a valid employee from the dropdown list.",
            };

            // ✅ Source of lead (Column F)
            worksheet.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${sourceOfLead.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Source of lead",
                error: "Please select a valid source of lead.",
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "lead_upload_template.xlsx");
        closeDownloadTemplate();
    };

    return (
        <div className="text-sm space-y-2 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>
            <ul className="list-decimal ml-5 space-y-1">
                <li><strong>Prefixes:</strong> Select from dropdown (Mr, Mrs, Miss, Mx).</li>
                <li><strong>Full Name:</strong> Required field - Enter complete name.</li>
                <li><strong>Email Address:</strong> Required field - Must be valid email format.</li>
                <li><strong>Phone Number:</strong> Required field - Must be exactly 10 digits.</li>
                <li><strong>Assign to Employee:</strong> Select from dropdown - Required field.</li>
                <li><strong>Source of lead:</strong> Select from dropdown (Instagram, Facebook, etc.).</li>
                <li><strong>Country/State/City:</strong> Must match existing records in database.</li>
                <li><strong>Pincode:</strong> Optional - Enter valid postal code.</li>
            </ul>

            <button
                className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadLeadTemplate}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Download Lead Template"}
            </button>

            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage.message || errorMessage}</p>}
        </div>
    );
}

export default Excelleadstemplate;