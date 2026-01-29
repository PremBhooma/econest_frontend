import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Paymentapi from "../api/Paymentapi";
import Generalapi from "../api/Generalapi"
import Customerapi from "../api/Customerapi";
import Datefilter from "../shared/Datefilter";
import Errorpanel from "../shared/Errorpanel";
import DeleteModal from "../shared/DeleteModal";
import AssignProject from "../shared/AssignProject";
import Uploadpaymentsexcel from "./Uploadpaymentexcel";
import TableLoadingEffect from "../shared/Tableloadingeffect";
import ExcelPaymentTemplate from "../shared/ExcelPaymentTemplate";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";
import { useProjectDetails } from "../zustand/useProjectDetails";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Button, Modal, Pagination } from "@nayeshdaggula/tailify";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { IconDownload, IconEdit, IconEye, IconSearch, IconTrash } from "@tabler/icons-react";
import Flatapi from "../api/Flatapi";
import { Funnel, PrinterIcon } from "lucide-react";
import { useColumnStore } from "../zustand/useColumnStore";

function Allpaymentswrapper() {
    const permissions = useEmployeeDetails((state) => state.permissions);
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const { storedColumns, fetchColumns, handleColumnStore } = useColumnStore();

    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [filterKey, setFilterKey] = useState(0);

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

    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [limit, setLimit] = useState("10");
    // const [dateRange, setDateRange] = useState({
    //     startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    //     endDate: new Date().toISOString().split('T')[0],
    // });

    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null,
    });


    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [flats, setFlats] = useState([]);
    const [selectedFlats, setSelectedFlats] = useState(null);

    const [blocks, setBlocks] = useState([])
    const [selectedBlock, setSelectedBlock] = useState(null)
    const handleSelectBlock = (value) => {
        setSelectedBlock(value)
    }

    const [visibleColumns, setVisibleColumns] = useState({
        reference: true,
        transactionId: true,
        flat: true,
        block: true,
        customer: true,
        amount: true,
        date: true,
        paymentType: true,
        paymentTowards: true,
        paymentMethod: true,
        bank: true,
    });
    const [showColumnToggle, setShowColumnToggle] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowColumnToggle(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleColumn = (colKey) => {
        setVisibleColumns((prev) => {
            const updated = { ...prev, [colKey]: !prev[colKey] };
            handleColumnStore(updated, employeeInfo?.id, "payments");
            return updated;
        });
    };

    useEffect(() => {
        if (employeeInfo?.id) {
            fetchColumns(employeeInfo.id, 'payments');
        }
    }, [employeeInfo?.id]);

    useEffect(() => {
        if (storedColumns && Array.isArray(storedColumns)) {
            let updatedColumns;

            if (storedColumns.length === 0) {
                updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                }, {});
            } else {
                updatedColumns = Object.keys(visibleColumns).reduce((acc, key) => {
                    acc[key] = storedColumns.includes(key);
                    return acc;
                }, {});
            }

            setVisibleColumns(updatedColumns);
        }
    }, [storedColumns]);

    useEffect(() => {
        fetchFlats(selectedCustomer, selectedBlock);
    }, [selectedCustomer, selectedBlock])

    useEffect(() => {
        fetchCustomers(selectedFlats, selectedBlock);
    }, [selectedFlats, selectedBlock])

    const [singlePaymentId, setSinglePaymentId] = useState(null);
    const [paymentsData, setPaymentsData] = useState([]);

    async function GetAllPayments(newPage, newLimit, newSearchQuery, customerid, flatid, selectedblock) {
        const params = {
            page: newPage,
            limit: newLimit,
            searchQuery: newSearchQuery,
            customer_id: customerid,
            flat_id: flatid,
            selected_block_id: selectedblock
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        await Paymentapi.get("/getallpayments", {
            params,
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${access_token}`,
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
                    setIsLoading(false);
                    return false;
                }
                setPaymentsData(data?.allpayments || []);
                setTotalPages(data?.totalPages);
                setIsLoading(false);
                return false;
            })
            .catch((error) => {
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
        GetAllPayments(value, limit, searchQuery, selectedCustomer, selectedFlats, selectedBlock);
        setIsLoading(true);
    }, [limit, searchQuery, selectedCustomer, selectedFlats, selectedBlock]);

    const updateSearchQuery = useCallback(
        (e) => {
            setSearchQuery(e.target.value);
            GetAllPayments(page, limit, e.target.value, selectedCustomer, selectedFlats, selectedBlock);
        },
        [page, limit, selectedCustomer, selectedFlats, selectedBlock]
    );

    const updateLimit = useCallback(
        (data) => {
            let newpage = 1;
            setLimit(data);
            setPage(newpage);
            GetAllPayments(newpage, data, searchQuery, selectedCustomer, selectedFlats, selectedBlock);
        },
        [page, searchQuery, selectedCustomer, selectedFlats, selectedBlock]
    );

    useEffect(() => {
        setIsLoading(true);
        GetAllPayments(page, limit, searchQuery, selectedCustomer, selectedFlats, selectedBlock);
    }, [page, limit, searchQuery, dateRange, selectedCustomer, selectedFlats, selectedBlock]);

    const refreshAllPayments = () => {
        GetAllPayments(page, limit, searchQuery, selectedCustomer, selectedFlats, selectedBlock)
    }

    const clearFilters = () => {
        setSearchQuery('');
        setLimit('10')
        setPage(1)
        setDateRange({ startDate: null, endDate: null });
        setSelectedCustomer(null);
        setSelectedFlats(null);
        setSelectedBlock(null)
        setFilterKey(prev => prev + 1);
    };

    const isFilterApplied =
        searchQuery !== '' ||
        limit !== '10' ||
        dateRange.startDate !== null ||
        dateRange.endDate !== null ||
        selectedCustomer !== null ||
        selectedFlats !== null ||
        selectedBlock !== null;

    const [deletePayment, setDeletePayment] = useState(false)
    const openDeletePayment = (paymentid) => {
        setDeletePayment(true)
        setSinglePaymentId(paymentid)
    }
    const closeDeletePayment = () => {
        setDeletePayment(false)
    }


    async function handleDeletePayment() {
        await Paymentapi.post('/deletepayment', {
            payment_id: singlePaymentId,
            employee_id: employeeInfo?.id,
        },
            {
                headers: {
                    "Content-Type": "application/json",
                    // 'Authorization': `Bearer ${access_token}`
                }
            })
            .then((res) => {
                let data = res.data
                if (data.status === "error") {
                    setIsLoading(false)
                    setErrorMessage({
                        message: data.message,
                        server_res: data
                    })
                }
                setIsLoading(false)
                toast.success("Payment deleted successfully")
                refreshAllPayments();
                closeDeletePayment();
            })
            .catch((error) => {
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        'message': error.message,
                        'server_res': error.response.data
                    };
                } else {
                    finalresponse = {
                        'message': error.message,
                        'server_res': null
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            })
    }

    const [downloadTemplate, setDownloadTemplate] = useState(false)
    const openDownloadTemplate = () => {
        setDownloadTemplate(true)
    }
    const closeDownloadTemplate = () => {
        setDownloadTemplate(false)
    }
    const [uploadPaymentExcel, setUploadPaymentExcel] = useState(false)
    const openUploadPaymentExcel = () => {
        setUploadPaymentExcel(true)
    }
    const closeUploadPaymentExcel = () => {
        setUploadPaymentExcel(false)
    }

    const handleDateFilterChange = (newDateRange) => {
        setDateRange(newDateRange);
        setPage(1);
        setIsLoading(true);
        GetAllPayments(page, limit, searchQuery, selectedCustomer, selectedBlock);
    };


    const handleDownload = async (searchQuery, selectedCustomer, selectedFlats, dateRange) => {
        setIsLoading(true);
        try {
            const params = {
                searchQuery: searchQuery,
                customer_id: selectedCustomer,
                flat_id: selectedFlats,
            };

            if (dateRange.startDate) params.startDate = dateRange.startDate;
            if (dateRange.endDate) params.endDate = dateRange.endDate;

            const response = await Paymentapi.get("get-payments-for-excel", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: 'blob'
            })

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Dashboard Stats.xlsx'); // Filename for download
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success({ title: 'Export Successful', message: 'Dashboard stats downloaded successfully.', color: 'green' });
            } else {
                toast.error({ title: 'Export Failed', message: 'No data received for export.', color: 'red' });
            }

            setIsLoading(false);
        } catch (error) {
            console.error("Error Downloading Flat payments Data");
            const finalResonse = error.response?.data?.message || "An error occurred during download";
            setErrorMessage(finalResonse);
            setIsLoading(false);
        }
    }

    const handleDownloadFunction = () => {
        handleDownload(searchQuery, selectedCustomer, selectedFlats, dateRange);
    }

    async function fetchCustomers(flatid, blockid) {
        try {
            const params = {
                flat_id: flatid,
                block_id: blockid
            }
            const response = await Customerapi.get("/getcustomerslist", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data = response.data;
            if (data.status === "error") {
                let finalresponse = {
                    message: data.message || "Failed to fetch customers",
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
            }
            setCustomers(data.data || []);
            return false;
        } catch (error) {
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
            return false;
        }
    }

    async function fetchBlocks(flatid, customerid) {
        try {
            const response = await Generalapi.get("/getblockslist", {
                params: {
                    flat_id: flatid,
                    customer_id: customerid
                },
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data = response.data;
            if (data.status === "error") {
                let finalresponse = {
                    message: data.message || "Failed to fetch blocks",
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
            }
            setBlocks(data?.blocks || []);
            return false;
        } catch (error) {
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
            return false;
        }
    }

    async function fetchFlats(customerid, blockid) {
        try {
            const params = {
                customer_id: customerid,
                block_id: blockid
            }
            const response = await Flatapi.get("/get-flat-lists", {
                params,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data = response.data;
            if (data.status === "error") {
                let finalresponse = {
                    message: data.message || "Failed to fetch customers",
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                return false;
            }
            setFlats(data?.data || []);
            return false;
        } catch (error) {
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
            return false;
        }
    }

    const handleCustomerChange = (value) => {
        setSelectedCustomer(value);
    }

    const handleFlatsChange = (value) => {
        setSelectedFlats(value);
    }

    useEffect(() => {
        fetchBlocks(selectedFlats, selectedCustomer)
    }, [selectedFlats, selectedCustomer]);

    const handlePrint = async (newSearchQuery, customerid, flatid, selectedblock) => {
        const params = {
            searchQuery: newSearchQuery,
            customer_id: customerid,
            flat_id: flatid,
            selected_block_id: selectedblock
        }

        if (dateRange.startDate) params.startDate = dateRange.startDate;
        if (dateRange.endDate) params.endDate = dateRange.endDate;

        Paymentapi.get("/getallprintpayments", {
            params,
            headers: {
                "Content-Type": "application/json",
                // Authorization: `Bearer ${access_token}`,
            },
        }).then((response) => {
            let data = response.data;
            if (data.status === "error") {
                let finalresponse = {
                    message: data.message,
                    server_res: data,
                };
                setErrorMessage(finalresponse);
                setIsLoading(false);
                return false;
            }
            const enabledCount = Object.values(visibleColumns).filter(Boolean).length;
            const isLandscape = enabledCount > 5;
            const paymentsData = data?.allpayments || [];
            const printContent = `
                <html>
                    <head>
                        <title>Payments Report</title>
                        <style>
                            @page {
                                size: ${isLandscape ? "landscape" : "portrait"};
                            }
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            table {
                                width: 100%;
                                border-collapse: collapse;
                                font-size: 12px;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            th {
                                background: #f4f4f4;
                            }
                        </style>
                    </head>
                    <body>
                        <h2>Payments Report</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    ${visibleColumns.transactionId ? (`<th>Transaction Id</th>`) : ''}
                                    ${visibleColumns.flat ? (`<th>Flat</th>`) : ''}
                                    ${visibleColumns.block ? (`<th>Block</th>`) : ''}
                                    ${visibleColumns.customer ? (`<th>Customer</th>`) : ''}
                                    ${visibleColumns.amount ? (`<th>Amount</th>`) : ''}
                                    ${visibleColumns.date ? (`<th>Date of Payment</th>`) : ''}
                                    ${visibleColumns.paymentType ? (`<th>Payment Type</th>`) : ''}
                                    ${visibleColumns.paymentTowards ? (`<th>Payment Towards</th>`) : ''}
                                    ${visibleColumns.paymentMethod ? (`<th>Payment Method</th>`) : ''}
                                    ${visibleColumns.bank ? (`<th>Bank</th>`) : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${paymentsData.map((payment, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    ${visibleColumns.transactionId ? `
                                        <td>${payment?.transaction_id || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.flat ? `
                                        <td>${payment?.flat_number || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.block ? `
                                        <td style="text-overflow: ellipsis; white-space: nowrap;">${payment?.block_name || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.customer ? `
                                        <td>${(payment?.customer_first_name || "") + " " + (payment?.customer_last_name || "")}</td>
                                    ` : ''}
                                    ${visibleColumns.amount ? `
                                        <td>${payment?.amount ? "₹ " + parseFloat(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.date ? `
                                        <td>${payment?.payment_date ? dayjs(payment?.payment_date).format("DD/MM/YYYY") : "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentType ? `
                                        <td>${payment?.payment_type || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentTowards ? `
                                        <td>${payment?.payment_towards || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.paymentMethod ? `
                                        <td>${payment?.payment_method || "----"}</td>
                                    ` : ''}
                                    ${visibleColumns.bank ? `
                                        <td>${payment?.bank || "----"}</td>
                                    ` : ''}
                                </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const printWindow = window.open("", "", isLandscape ? "width=1200,height=800" : "width=800,height=1200");
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
            setIsLoading(false);
            return false;
        }).catch((error) => {
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
    };

    const handleSinglePrint = (payment) => {
        const printWindow = window.open("", "", "width=800,height=1000");
        printWindow.document.write(`
            <html>
            <head>
                <title>Payment Receipt</title>
                <style>
                @page { size: portrait; }
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    line-height: 1.6;
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .field {
                    margin: 8px 0;
                    display: flex;
                    justify-content: space-between;
                }
                .label {
                    font-weight: bold;
                    color: #444;
                    width: 200px;
                }
                .value {
                    flex: 1;
                    text-align: left;
                }
                .container {
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    padding: 20px;
                }
                </style>
            </head>
            <body>
                <h2>Payment Receipt</h2>
                <div class="container">
                    <div class="field"><div class="label">Transaction Id:</div><div class="value">${payment.transaction_id || "---"}</div></div>
                    <div class="field"><div class="label">Amount:</div><div class="value">₹ ${(parseInt(payment.amount) || 0).toFixed(2)}</div></div>
                    <div class="field"><div class="label">Date of Payment:</div><div class="value">${payment.paymet_date ? dayjs(payment.paymet_date).format("DD/MM/YYYY") : "---"}</div></div>
                    <div class="field"><div class="label">Payment Type:</div><div class="value">${payment.payment_type || "---"}</div></div>
                    <div class="field"><div class="label">Payment Towards:</div><div class="value">${payment.payment_towards || "---"}</div></div>
                    <div class="field"><div class="label">Payment Method:</div><div class="value">${payment.payment_method || "---"}</div></div>
                    <div class="field"><div class="label">Bank:</div><div class="value">${payment.bank || "---"}</div></div>
                </div>
                <h2>Customer Details</h2>
                <div class="container">
                    <div class="field"><div class="label">Name:</div><div class="value">${payment.customer_first_name || "---"} ${payment.customer_last_name || ""}</div></div>
                    <div class="field"><div class="label">Email:</div><div class="value">${payment.customer_email || "---"}</div></div>
                    <div class="field"><div class="label">Phone:</div><div class="value">${payment.customer_mobile_number || "---"}</div></div>
                </div>
                <h2>Flat Details</h2>
                <div class="container">
                    <div class="field"><div class="label">Flat:</div><div class="value">${payment.flat_number || "---"}</div></div>
                    <div class="field"><div class="label">Block:</div><div class="value">${payment.block_name || "---"}</div></div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-[22px] font-semibold">
                        All Payments
                    </p>
                    <div className="flex justify-end items-center gap-2">
                        {permissions?.payments_page?.includes("print_all_payments") && (
                            <button
                                disabled={paymentsData.length > 0 ? false : true}
                                onClick={() => handlePrint(searchQuery, selectedCustomer, selectedFlats, selectedBlock)}
                                className={`cursor-pointer flex items-center gap-x-1 text-[14px] text-white px-4 py-[7px] rounded bg-[#e0589c] ${paymentsData.length > 0 ? 'hover:bg-pink-600' : 'bg-gray-400 !cursor-not-allowed'}`}
                            >
                                <PrinterIcon size={14} /> Print
                            </button>
                        )}
                        {permissions?.payments_page?.includes("add_payment") && (
                            <Link to={'/payments/addnew'} className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-black">
                                + Add Payment
                            </Link>
                        )}
                        {permissions?.payments_page?.includes("download_payment_excel") && (
                            <button onClick={openDownloadTemplate} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded !bg-[#0083bf]">
                                Download Payment Template
                            </button>
                        )}
                        {permissions?.payments_page?.includes("export_payment_to_excel") && (
                            <button
                                onClick={handleDownloadFunction}
                                className="cursor-pointer text-[14px] text-white px-4 py-[7px] rounded bg-[#931f42] flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            // disabled={isLoading}
                            >
                                <IconDownload size={16} />
                                Export to Excel
                            </button>
                        )}
                        {permissions?.payments_page?.includes("upload_payment_excel") && (
                            <button onClick={openUploadPaymentExcel} className="cursor-pointer text-[14px] text-white px-4 !py-[7px] !rounded bg-emerald-500">
                                Upload Bulk Payment
                            </button>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-4 bg-white rounded-md'>
                    <div className='flex justify-between px-4 pt-4 items-center'>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Payments"
                                className="focus:outline-none text-[14px] pl-6 py-2 rounded-md"
                                onChange={updateSearchQuery}
                                value={searchQuery}
                            />
                            <div className="absolute left-0 top-3 px-1">
                                <IconSearch size={16} color="#e5e2e2" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isFilterApplied && (
                                <div onClick={clearFilters} className={`flex items-center gap-2 cursor-pointer px-2 !py-[7px] !rounded-md !border !border-[#ebecef] ${isFilterApplied ? '!bg-red-400 !text-white hover:!bg-red-500' : '!bg-white hover:!bg-gray-50'} !font-normal !text-[14px] !text-[#6b7178]`}>
                                    <Funnel className="!w-4 !h-4" /> <p>Clear Filters</p>
                                </div>
                            )}

                            <div className='w-[160px]'>
                                <Select key={filterKey} value={selectedCustomer || undefined} onValueChange={handleCustomerChange}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="Customers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers?.map((customer) => (
                                            <SelectItem key={customer.value} value={customer.value}>
                                                {customer.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[150px]'>
                                <Select key={filterKey} value={selectedBlock || undefined} onValueChange={handleSelectBlock}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="Blocks" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {blocks?.map((block) => (
                                            <SelectItem key={block.value} value={block.value}>
                                                {block.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[160px]'>
                                <Select key={filterKey} value={selectedFlats || undefined} onValueChange={handleFlatsChange}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="Flats" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {flats?.map((flat) => (
                                            <SelectItem key={flat.value} value={flat.value}>
                                                {flat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-[60px]'>
                                <Select value={limit.toString()} onValueChange={updateLimit}>
                                    <SelectTrigger className="w-full h-9 bg-white border-[#ebecef] focus:ring-0 focus:ring-offset-0 shadow-none">
                                        <SelectValue placeholder="10" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="40">40</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <Datefilter
                                onFilterChange={handleDateFilterChange}
                                onClearFilter={handleDateFilterChange}
                            /> */}

                            <div ref={containerRef} className="relative">
                                <button
                                    onClick={() => setShowColumnToggle(!showColumnToggle)}
                                    className="cursor-pointer flex items-center gap-1 px-2 py-2 text-sm border border-[#ebecef] rounded-sm bg-white hover:bg-gray-50"
                                >
                                    ⚙️ Columns
                                </button>

                                {showColumnToggle && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#ebecef] rounded-md shadow z-50">
                                        <div className="p-2">
                                            {Object.keys(visibleColumns).map((colKey) => (
                                                <label
                                                    key={colKey}
                                                    className="flex items-center gap-2 py-1 text-sm cursor-pointer capitalize"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={visibleColumns[colKey]}
                                                        onChange={() => toggleColumn(colKey)}
                                                    />
                                                    {colKey}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Table Section  */}
                    <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg z-0">
                        <table className="w-full table-fixed text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-neutral-200">
                                <tr className="w-full">
                                    {/* {visibleColumns.reference && (
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                                        Ref ID
                                    </th>
                                )} */}
                                    {visibleColumns.transactionId && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Transaction Id
                                        </th>
                                    )}
                                    {visibleColumns.flat && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px]">
                                            Flat
                                        </th>
                                    )}
                                    {visibleColumns.block && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px]">
                                            Block
                                        </th>
                                    )}
                                    {visibleColumns.customer && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Customer
                                        </th>
                                    )}
                                    {visibleColumns.amount && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[140px]">
                                            Amount
                                        </th>
                                    )}
                                    {visibleColumns.date && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Date of Payment
                                        </th>
                                    )}
                                    {visibleColumns.paymentType && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Payment Type
                                        </th>
                                    )}
                                    {visibleColumns.paymentTowards && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Payment Towards
                                        </th>
                                    )}
                                    {visibleColumns.paymentMethod && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Payment Method
                                        </th>
                                    )}
                                    {visibleColumns.bank && (
                                        <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[160px]">
                                            Bank
                                        </th>
                                    )}
                                    <th className="px-4 py-3 text-neutral-700 uppercase tracking-wider text-sm font-bold leading-[18px] w-[120px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200">
                                {isLoading === false ? (
                                    paymentsData.length > 0 ? (
                                        paymentsData.map((payment, index) => (
                                            <tr key={index} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                                {/* {visibleColumns.reference && (
                                                <td className="px-4 py-3 whitespace-normal break-words w-[140px] sticky left-0 z-10 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                                    <NavLink to={`/singlepaymentview/${payment.uuid}`}>
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">{payment?.uuid}</p>
                                                    </NavLink>
                                                </td>
                                            )} */}
                                                {visibleColumns.transactionId && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <NavLink to={`/singlepaymentview/${payment.uuid}`}>
                                                            <p className="text-neutral-600 text-xs font-medium leading-[18px] hover:text-[#0083bf]">
                                                                {payment?.transaction_id}
                                                            </p>
                                                        </NavLink>
                                                    </td>
                                                )}
                                                {visibleColumns.flat && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[120px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {permissions?.flats_page?.includes("view_flat") ? (
                                                                <NavLink to={`/flats/view-flat/${payment?.flat_uuid}`} className="hover:text-[#0083bf]">
                                                                    {payment?.flat_number || "----"}
                                                                </NavLink>
                                                            ) : (
                                                                payment?.flat_number || "----"
                                                            )}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.block && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[120px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.block_name || "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.customer && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {(payment?.customer_prefixes || "") + " " + (payment?.customer_first_name || "") + " " + (payment?.customer_last_name || "")}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.amount && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[140px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.amount ? "₹ " + parseFloat(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.date && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.paymet_date ? dayjs(payment?.paymet_date).format("DD/MM/YYYY") : "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.paymentType && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.payment_type || "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.paymentTowards && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.payment_towards || "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.paymentMethod && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.payment_method || "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                {visibleColumns.bank && (
                                                    <td className="px-4 py-3 whitespace-normal break-words w-[160px]">
                                                        <p className="text-neutral-600 text-xs font-medium leading-[18px]">
                                                            {payment?.bank || "----"}
                                                        </p>
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 text-center whitespace-normal break-words w-[120px] sticky right-0 z-10 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                                    <div className="flex flex-row items-center justify-center gap-2">
                                                        {permissions?.payments_page?.includes("view_payment") && (
                                                            <Link
                                                                to={`/singlepaymentview/${payment.uuid}`}
                                                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                                            >
                                                                <IconEye size={18} />
                                                            </Link>
                                                        )}

                                                        {permissions?.payments_page?.includes("edit_payment") && (
                                                            <Link
                                                                to={`/payments/edit/${payment.uuid}`}
                                                                className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600"
                                                            >
                                                                <IconEdit size={18} />
                                                            </Link>
                                                        )}

                                                        {permissions?.payments_page?.includes("delete_payment") && (
                                                            <div
                                                                onClick={() => openDeletePayment(payment.payment_id)}
                                                                className="p-1 hover:bg-red-50 rounded-md transition-colors text-neutral-500 hover:text-red-600 cursor-pointer"
                                                            >
                                                                <IconTrash size={18} />
                                                            </div>
                                                        )}

                                                        {permissions?.payments_page?.includes("print_single_payment") && (
                                                            <PrinterIcon size={20} strokeWidth={2.5} color="#e0589c" className="cursor-pointer" onClick={() => handleSinglePrint(payment)} />
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={13} className="text-center py-8">
                                                <p className="text-neutral-500 text-sm">
                                                    No payments found
                                                </p>
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan={13}>
                                            <TableLoadingEffect />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {paymentsData?.length > 0 && (
                        <div className="flex flex-row-reverse p-4">
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
                {errorMessage !== "" && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            </div >

            <DeleteModal
                title="Delete Payment"
                message="Are you sure you want to delete this payment?"
                open={deletePayment}
                onClose={closeDeletePayment}
                onConfirm={handleDeletePayment}
            />
            <Modal
                open={downloadTemplate}
                close={closeDownloadTemplate}
                padding="px-5"
                withCloseButton={false}
                containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
            >
                {downloadTemplate && (
                    <ExcelPaymentTemplate
                        closeDownloadTemplate={closeDownloadTemplate}
                    />
                )}
            </Modal>
            <Modal
                open={uploadPaymentExcel}
                close={closeUploadPaymentExcel}
                padding="px-5"
                withCloseButton={false}
                containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
            >
                {uploadPaymentExcel && (
                    <Uploadpaymentsexcel
                        closeUploadPaymentExcel={closeUploadPaymentExcel}
                        refreshAllPayments={refreshAllPayments}
                        setErrorMessage={setErrorMessage}
                    />
                )}
            </Modal>

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

export default Allpaymentswrapper;
