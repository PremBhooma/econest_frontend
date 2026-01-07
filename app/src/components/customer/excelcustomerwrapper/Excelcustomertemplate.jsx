import React from 'react'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Button } from '@nayeshdaggula/tailify';

function Excelcustomertemplate({ closeDownloadTemplate }) {

    const downloadCustomerTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Customer Upload Template");

        const headers = [
            "Prefixes", // NEW
            "First Name",
            "Last Name",
            "Email Address",
            "Alternate Email Address",
            "Phone Number",
            "Gender", // NEW
            "Date of Birth",
            "Father Name",
            "Spouse Prefixes", // NEW
            "Spouse Name",
            "Marital Status",
            "Number of Children",
            "Wedding Aniversary",
            "Spouse DOB",
            "Pan Card No",
            "Aadhar Card No",
            "Country of Citizenship",
            "Country of Residence",
            "Mother Tongue",
            "Name of Power of Attorney (POA) Holder",
            "If POA Holder is Indian, specify status",
            "Number of years residing at correspondence address",
            "Number of years residing at city",
            "Have you ever owned a Abode home / property?",
            "If Yes, Project Name",
            "Address of Correspondence, Country",
            "Address of Correspondence, State",
            "Address of Correspondence, City",
            "Address of Correspondence, Address",
            "Address of Correspondence, Pincode",
            "Permanent Address, Country",
            "Permanent Address, State",
            "Permanent Address, City",
            "Permanent Address, Address",
            "Permanent Address, Pincode",
            "Current Designation",
            "Current Organization",
            "Organization Address",
            "Work Experience",
            "Annual Income",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        // Dropdown values
        const prefixes = ["Mr", "Mrs", "Miss", "Mx"];
        const gender = ["Male", "Female"];
        const maritalStatus = ["Single", "Married"];
        const ifPOAHolderIsIndian = ["Resident", "NRI"];
        const haveYouEverOwnedAbode = ["Yes", "No"];

        // Example row
        worksheet.addRow([
            "Mr",
            "ABC",
            "XYZ",
            "abcd@gmail.com",
            "wxyz@gmail.com",
            1234567890,
            "Male",
            "19-10-1997",
            "ABC",
            "Mrs",
            "XYZ",
            "Married",
            1,
            "19-10-2024",
            "20-10-1998",
            "XXXXX3456X",
            123456781234,
            "India",
            "India",
            "Telugu",
            "XYZ",
            "Resident",
            5,
            5,
            "Yes",
            "Abode Developers",
            "India",
            "Telangana",
            "Hyderabad",
            "Madhapur",
            500032,
            "India",
            "Telangana",
            "Hyderabad",
            "Madhapur",
            500032,
            "Software Engineer",
            "Abode Groups",
            "Abode Groups, Madhapur, Hyderabad",
            3,
            600000
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // Prefixes → column A
            worksheet.getCell(`A${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx",
            };

            // Gender → column G
            worksheet.getCell(`G${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${gender.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Gender",
                error: "Please select Male or Female",
            };

            // Spouse Prefixes → column J
            worksheet.getCell(`J${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${prefixes.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Spouse Prefix",
                error: "Please select Mr, Mrs, Miss, or Mx",
            };

            // Marital Status → column L
            worksheet.getCell(`L${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${maritalStatus.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Marital Status",
                error: "Please select Single or Married",
            };

            // POA Holder Status → column V
            worksheet.getCell(`V${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${ifPOAHolderIsIndian.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid POA Holder Status",
                error: "Please select Resident or NRI",
            };

            // Owned Abode Property → column Y
            worksheet.getCell(`Y${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${haveYouEverOwnedAbode.join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Owned Property Option",
                error: "Please select Yes or No",
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "customer_upload_template.xlsx");
        closeDownloadTemplate();
    };


    return (
        <div className="text-sm space-y-2 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>
            <ul className="list-decimal ml-5 space-y-1">
                <li><strong>Prefixes:</strong> Select from dropdown → Mr, Mrs, Miss, Mx.</li>
                <li><strong>Gender:</strong> Select from dropdown → Male, Female.</li>
                <li><strong>Spouse Prefixes:</strong> Select from dropdown → Mr, Mrs, Miss, Mx.</li>
                <li><strong>Marital Status:</strong> Select from dropdown → Single, Married.</li>
                <li><strong>If POA Holder is Indian, specify status:</strong> Select from dropdown → Resident, NRI.</li>
                <li><strong>Have you ever owned a Abode home / property?:</strong> Select from dropdown → Yes, No.</li>
                <li><strong>Date Fields (Date of Birth, Wedding Anniversary, Spouse DOB):</strong> Enter in
                    <code> DD-MM-YYYY</code> format (e.g., 12-08-2025).
                </li>
            </ul>

            <button
                className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadCustomerTemplate}
            >
                Download Customer Template
            </button>
        </div>
    );
}

export default Excelcustomertemplate;
