import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import React, { useEffect, useState } from 'react'
import { Button } from '@nayeshdaggula/tailify';
import Projectapi from "../../api/Projectapi.jsx";
import GroupOwnerapi from "../../api/Groupownerapi.jsx";

function Excelflattemplate({ closeDownloadTemplate }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blocksData, setBlocksData] = useState([]);
    const [groupOwnerData, setGroupOwnerData] = useState([]);

    async function getBlocksData() {
        setIsLoading(true);

        Projectapi.get("get-blocks-names", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setBlocksData(null);
                } else {
                    setBlocksData(data?.blocks || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setBlocksData(null);
                setIsLoading(false);
            });
    }

    async function getGroupOwnerData() {
        setIsLoading(true);

        GroupOwnerapi.get("get-group-owners-names", {
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => {
                const data = response.data;
                if (data.status === "error") {
                    setErrorMessage({ message: data.message, server_res: data });
                    setGroupOwnerData(null);
                } else {
                    setGroupOwnerData(data?.data || []);
                    setErrorMessage("");
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: error?.message || "Unknown error",
                    server_res: error?.response?.data || null,
                });
                setGroupOwnerData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBlocksData();
        getGroupOwnerData();
    }, []);

    console.log("Blocks Data", blocksData)

    const downloadFlatTemplate = async () => {

        if (!blocksData || blocksData.length === 0) {
            setErrorMessage("No Blocks available. Please add blocks before downloading.");
            return;
        }

        setErrorMessage("");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Flat Upload Template");

        const headers = [
            "Flat No",
            "Floor No",
            "Block",
            "Group/Owner",
            "Mortgage",
            "Area(Sq.ft.)",
            "UDL",
            "Deed No",
            "Flat Type",
            "Bedrooms",
            "Bathrooms",
            "Balconies",
            "Parking Area(Sq.ft.)",
            "Facing",
            "East Facing View",
            "West Facing View",
            "North Facing View",
            "South Facing View",
            "Corner",
            // "Floor Rise",
            "Furnishing Status",
            "Google Map Link",
            "Description",
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => { col.width = 25 });

        // Dropdown options
        const flatTypes = [
            { value: "Studio", label: "Studio" },
            { value: "OneBHK", label: "1 BHK" },
            { value: "OnePointFiveBHK", label: "1.5 BHK" },
            { value: "TwoBHK", label: "2 BHK" },
            { value: "TwoPointFiveBHK", label: "2.5 BHK" },
            { value: "ThreeBHK", label: "3 BHK" },
            { value: "ThreePointFiveBHK", label: "3.5 BHK" },
            { value: "FourBHK", label: "4 BHK" },
            { value: "FourPointFiveBHK", label: "4.5 BHK" },
            { value: "FiveBHK", label: "5 BHK" },
            { value: "Penthouse", label: "Penthouse" },
            { value: "Duplex", label: "Duplex" },
        ];

        const mortgageOptions = [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ];

        const facingOptions = [
            { value: "North", label: "North" },
            { value: "South", label: "South" },
            { value: "East", label: "East" },
            { value: "West", label: "West" },
            { value: "NorthEast", label: "NorthEast" },
            { value: "NorthWest", label: "NorthWest" },
            { value: "SouthEast", label: "SouthEast" },
            { value: "SouthWest", label: "SouthWest" },
        ];

        const yesNoOptions = [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ];

        const furnishingOptions = [
            { value: "Furnished", label: "Furnished" },
            { value: "SemiFurnished", label: "SemiFurnished" },
            { value: "Unfurnished", label: "Unfurnished" },
        ];

        // Hidden Block sheet
        const blockSheet = workbook.addWorksheet('BlockList');
        blocksData.forEach((ele, index) => {
            blockSheet.getCell(`A${index + 1}`).value = ele.name;
        });
        blockSheet.state = 'veryHidden';

        // Hidden Group Owner sheet
        const groupOwnerSheet = workbook.addWorksheet('GroupOwnerList');
        groupOwnerData.forEach((ele, index) => {
            groupOwnerSheet.getCell(`A${index + 1}`).value = ele.name;
        });
        groupOwnerSheet.state = 'veryHidden';

        // Hidden Floor No sheet (1–100)
        const floorNoSheet = workbook.addWorksheet('FloorNoList');
        for (let i = 1; i <= 100; i++) {
            floorNoSheet.getCell(`A${i}`).value = i;
        }
        floorNoSheet.state = 'veryHidden';

        // Sample row
        worksheet.addRow([
            "101",                        // Flat No (dummy)
            { formula: "FloorNoList!A1" },                          // Floor No (dummy)
            blocksData[0]?.name || "",    // Block
            groupOwnerData[0]?.name || "",// Group/Owner
            mortgageOptions[0].label,     // Mortgage (Yes)
            "1200",                       // Area
            "UDL001",                     // UDL
            "Deed001",                    // Deed No
            flatTypes[0].label,           // Flat Type
            "2",                          // Bedrooms
            "2",                          // Bathrooms
            "1",                          // Balconies
            "100",                        // Parking Area
            facingOptions[0].label,       // Facing
            "Park View",                  // East Facing View
            "City View",                  // West Facing View
            "Garden View",                // North Facing View
            "Road View",                  // South Facing View
            yesNoOptions[0].label,        // Corner
            // yesNoOptions[0].label,        // Floor Rise
            furnishingOptions[0].label,   // Furnishing
            "Map Link",
            "Sample flat description",    // Description
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            // ✅ Floor No (Column B)
            worksheet.getCell(`B${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`FloorNoList!$A$1:$A$100`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Floor No',
                error: 'Please select a valid Floor No (1-100).',
            };

            // ✅ Block (Column C)
            worksheet.getCell(`C${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Block',
                error: 'Please select a valid Block from the dropdown list.',
            };

            // ✅ Group/Owner (Column D)
            worksheet.getCell(`D${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`GroupOwnerList!$A$1:$A$${groupOwnerData.length}`],
            };

            // ✅ Mortgage (Column E)
            worksheet.getCell(`E${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${mortgageOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Mortgage Option",
                error: "Please select Yes or No.",
            };

            // ✅ Flat Type (Column I)
            worksheet.getCell(`I${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${flatTypes.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Flat Type",
                error: "Please select a valid flat type.",
            };

            // ✅ Facing (Column N)
            worksheet.getCell(`N${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${facingOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Facing Option",
                error: "Please select a valid facing option.",
            };

            // ✅ Corner (Column S)
            worksheet.getCell(`S${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${yesNoOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Corner Option",
                error: "Please select Yes or No.",
            };

            // ✅ Floor Rise (Column T)
            worksheet.getCell(`T${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${yesNoOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Floor Rise Option",
                error: "Please select Yes or No.",
            };

            // ✅ Furnishing Status (Column U)
            worksheet.getCell(`U${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`"${furnishingOptions.map((o) => o.label).join(",")}"`],
                showErrorMessage: true,
                errorStyle: "error",
                errorTitle: "Invalid Furnishing Status",
                error: "Please select Furnished, SemiFurnished, or Unfurnished.",
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(fileBlob, "flat_Upload_Template.xlsx");
        closeDownloadTemplate();
    };

    return (
        <div className="text-sm space-y-2 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>
            <ul className="list-decimal ml-5 space-y-1">
                <li>Block: Select from dropdown.</li>
                <li>Group/Owner: Select from dropdown.</li>
                <li>Floor No: Select between <strong>1–100</strong>.</li>
                <li>Flat Type: Studio, 1 BHK, 2 BHK, etc.</li>
                <li>Facing: East, West, North, South, etc.</li>
                <li>Mortgage: Yes/No.</li>
                <li>Corner: Yes/No.</li>
                {/* <li>Floor Rise: Yes/No.</li> */}
                <li>Furnishing: Furnished, SemiFurnished, Unfurnished.</li>
            </ul>

            <button
                className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadFlatTemplate}
            >
                Download Flat Template
            </button>

            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
    );
}

export default Excelflattemplate;
