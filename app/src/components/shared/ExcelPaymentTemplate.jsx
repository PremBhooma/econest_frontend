import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import React, { useEffect, useState } from 'react'
import { Button } from '@nayeshdaggula/tailify';
import Projectapi from "../api/Projectapi.jsx";
import dayjs from 'dayjs';

function ExcelPaymentTemplate({ closeDownloadTemplate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [blocksData, setBlocksData] = useState([]);

    console.log("BlocksDAT:", blocksData)

    async function getBlocksData() {
        setIsLoading(true);

        Projectapi.get("get-blocks-names", {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response.data;

                if (data.status === "error") {
                    setErrorMessage({
                        message: data.message,
                        server_res: data,
                    });
                    setBlocksData(null);
                } else {
                    setBlocksData(data?.blocks || []);
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
                setBlocksData(null);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getBlocksData();
    }, []);


    const downloadPaymentTemplate = async () => {

        if (!blocksData || blocksData.length === 0) {
            setErrorMessage("No Blocks available. Please add blocks before downloading.");
            return;
        }

        setErrorMessage("");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Payment Upload Template');

        const headers = [
            'Amount',
            'Payment Type',
            'Payment Towards',
            'Payment Method',
            'Bank',
            'Date of Payment',
            'Transaction Id',
            'Flat',
            'Block',
            'Comment'
        ];

        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns.forEach((col) => {
            col.width = 25;
        });

        const paymentTypes = ['Customer Pay', 'Loan Pay'];
        const paymentTowards = ['Flat', 'GST', 'Corpus fund', 'Registration', 'TDS' ,'Maintenance'];
        const paymentMethods = ['DD', 'UPI', 'Bank Deposit', 'Cheque', 'Online Transfer (IMPS, NFT)'];

        const blockSheet = workbook.addWorksheet('BlockList');
        blocksData.forEach((block, index) => {
            blockSheet.getCell(`A${index + 1}`).value = block.name;
        });
        blockSheet.state = 'veryHidden'; // hides sheet in Excel

        worksheet.addRow([
            "10000",
            paymentTypes[0] || "",
            paymentTowards[0] || "",
            paymentMethods[0] || "",
            "SBI",
            dayjs(new Date()).format('DD-MM-YYYY'),
            "ABCDEFGH123456",
            "101",
            blocksData[0]?.name || "",
            "abcdefgh"
        ]);

        const rowCount = 5000;

        for (let i = 2; i <= rowCount; i++) {
            worksheet.getCell(`B${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentTypes.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Type',
                error: 'Please select a valid payment type from the dropdown list.',
            };

            worksheet.getCell(`C${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentTowards.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Towards',
                error: 'Please select a valid payment towards from the dropdown list.',
            };

            worksheet.getCell(`D${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`"${paymentMethods.join(',')}"`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Payment Method',
                error: 'Please select a valid payment method from the dropdown list.',
            };

            // ✅ Reference hidden BlockList sheet
            worksheet.getCell(`I${i}`).dataValidation = {
                type: 'list',
                allowBlank: false,
                formulae: [`BlockList!$A$1:$A$${blocksData.length}`],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Invalid Block',
                error: 'Please select a valid Block from the dropdown list.',
            };
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileBlob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(fileBlob, 'Payment_Upload_Template.xlsx');
        closeDownloadTemplate();
    };



    return (
        <div className="text-sm space-y-2 p-4">
            <div className='w-full flex justify-between items-center'>
                <div className='font-semibold'>Guidelines:</div>
                <Button onClick={closeDownloadTemplate} size="sm" variant="default">Close</Button>
            </div>
            <ul className="list-decimal ml-5 space-y-1">
                <li>
                    Date of Payment Format: <strong>DD-MM-YYYY</strong>. Example: <code>27-07-2025</code>
                </li>
                <li>
                    Payment Type: Valid options: <strong>Customer Pay, Loan Pay</strong> (Enter only one)
                </li>
                <li>
                    Payment Towards: Valid options: <strong>Flat, GST, Corpus fund, Registration, TDS, Maintenance</strong> (Enter only one)
                </li>
                <li>
                    Payment Method: Valid options: <strong>DD, UPI, Bank Deposit, Cheque, Online Transfer (IMPS, NFT)</strong> (Enter only one)
                </li>
                <li>
                    Block Type: Select the Valid options in block column.
                </li>
            </ul>

            <button
                className="mt-3 ml-auto items-end justify-end flex px-5 py-2 text-white text-xs bg-[#0083bf] rounded shadow cursor-pointer"
                onClick={downloadPaymentTemplate}
            >
                Download Payment Template
            </button>

            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
    );
}

export default ExcelPaymentTemplate