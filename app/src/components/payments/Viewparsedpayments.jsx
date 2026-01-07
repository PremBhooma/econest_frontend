import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import Flatapi from '../api/Flatapi';
import Paymentapi from '../api/Paymentapi';
import Deletepaymentrecord from './Deletepaymentrecord.jsx';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowLeft, IconTrash, IconTrashFilled, IconX } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Textinput, Select, Datepicker, Textarea, Fileinput, Modal } from '@nayeshdaggula/tailify';


function Viewparsedpayments() {
    const navigate = useNavigate();
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);

    const [deleteRowData, setDeleteRowData] = useState(null);
    const [deletePaymentRecord, setDeletePaymentRecord] = useState(false)
    const openDeletePaymentRecord = (rowData) => {
        setDeleteRowData(rowData);
        setDeletePaymentRecord(true)
    }
    const closeDeletePaymentRecord = () => {
        setDeleteRowData(null);
        setDeletePaymentRecord(false)
    }

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const rowRefs = useRef([]);

    const [bulkUpload, setBulkUpload] = useState([{
        amount: '',
        payment_type: '',
        payment_towards: '',
        payment_method: '',
        bank: '',
        payment_date: null,
        transaction_id: '',
        receipt: '',
        comment: '',
        flat_id: '',
        customer_id: '',
        searchType: '',
        searchQuery: '',
        selectedFlat: null,
        results: [],
        loading: false,
        showDropdown: false,
        error: {
            flat_id: '',
            customer_id: '',
        }
    }]);

    useEffect(() => {
        rowRefs.current = bulkUpload.map((_, i) => rowRefs.current[i] ?? React.createRef());
    }, [bulkUpload]);


    async function getAllParsedPayments() {
        try {
            setIsLoadingEffect(true);

            const response = await Paymentapi.get('get-all-parsed-payments', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (data.status === 'error') {
                setErrorMessage({
                    message: data.message,
                    server_res: data,
                });
                setIsLoadingEffect(false);
                return;
            }

            if (Array.isArray(data?.data) && data.data.length > 0) {
                const formattedBulkUpload = await Promise.all(
                    data.data.map(async (item) => {
                        let selectedFlat = null;
                        let flatId = '';
                        let customerId = '';
                        let searchQuery = '';

                        if (item.flat && item.block) {
                            const flats = await getFlatsData(item.flat, 'flatNo');
                            const match = flats.find(
                                (f) =>
                                    String(f.flat_no).trim() === String(item.flat).trim() &&
                                    String(f.block_name).trim().toLowerCase() === String(item.block).trim().toLowerCase()
                            );

                            if (match) {
                                selectedFlat = match;
                                flatId = match.id || '';
                                customerId = match.customer?.id || '';
                                searchQuery = `${match.flat_no} - ${match.block_name || ''}`;
                            }
                        }

                        return {
                            ...item,
                            payment_date: item?.payment_date ? new Date(item.payment_date) : null,
                            searchType: 'flatNo',
                            searchQuery,
                            selectedFlat,
                            flat_id: flatId,
                            customer_id: customerId,
                            results: [],
                            loading: false,
                            showDropdown: false,
                            error: {
                                flat_id: '',
                                customer_id: '',
                                payment_date: '',
                            }
                        };
                    })
                );

                setBulkUpload(formattedBulkUpload);
            } else {
                setBulkUpload([{
                    amount: '',
                    payment_type: '',
                    payment_towards: '',
                    payment_method: '',
                    bank: '',
                    payment_date: null,
                    transaction_id: '',
                    receipt: '',
                    comment: '',
                    flat_id: '',
                    customer_id: '',
                    searchType: '',
                    searchQuery: '',
                    results: [],
                    error: {
                        flat_id: '',
                        customer_id: '',
                    }
                }]);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
        } finally {
            setIsLoadingEffect(false);
        }
    }


    useEffect(() => {
        getAllParsedPayments();
    }, []);

    const refreshAllParsedPayments = () => {
        getAllParsedPayments();
    };

    const updateAmount = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].amount = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.amount = e.target.value ? '' : 'Amount is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentType = (index, option) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_type = option;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_type = option ? '' : 'Payment Type is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentTowards = (index, option) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_towards = option;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_towards = option ? '' : 'Payment Towards is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentMethod = (index, option) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_method = option;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_method = option ? '' : 'Payment Method is required';
            setBulkUpload(newBulk);
        }
    };

    const updateBank = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].bank = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.bank = e.target.value ? '' : 'Bank is required';
            setBulkUpload(newBulk);
        }
    };

    const updatePaymentDate = (index, option) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].payment_date = option;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.payment_date = option ? '' : 'Payment Date is required';
            setBulkUpload(newBulk);
        }
    };

    const updateTransactionId = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].transaction_id = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.transaction_id = e.target.value ? '' : 'Transaction is required';
            setBulkUpload(newBulk);
        }
    };

    const updateReceipt = (index, e) => {
        if (index >= 0 && index < bulkUpload.length) {
            const newBulk = [...bulkUpload];
            const file = e.target.files?.[0] || null;
            newBulk[index].receipt = file;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.receipt = file ? '' : 'Receipt is required';
            setBulkUpload(newBulk);
        }
    };

    const updateComment = (index, e) => {
        if (index >= 0 && index < bulkUpload?.length) {
            const newBulk = [...bulkUpload];
            newBulk[index].comment = e.target.value;
            newBulk[index].error = newBulk[index].error || {};
            newBulk[index].error.comment = e.target.value ? '' : 'Comment is required';
            setBulkUpload(newBulk);
        }
    };

    const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1) || '';

    const handleSearchTypeChange = (index, value) => {
        const updated = [...bulkUpload];
        updated[index].searchType = value;
        updated[index].searchQuery = '';
        updated[index].results = [];
        updated[index].selectedFlat = null;
        updated[index].flat_id = '';
        updated[index].customer_id = '';
        updated[index].showDropdown = false;
        setBulkUpload(updated);
    };

    const searchTimeout = useRef([]);

    // ✅ Update search query for a row
    const updateSearchQueryForRow = (index, query) => {
        const newBulk = [...bulkUpload];
        newBulk[index].searchQuery = query;

        if (!query.trim()) {
            newBulk[index].results = [];
            newBulk[index].showDropdown = false;
            newBulk[index].selectedFlat = null;
            newBulk[index].flat_id = '';
            newBulk[index].customer_id = '';
            setBulkUpload(newBulk);

            if (searchTimeout.current[index]) {
                clearTimeout(searchTimeout.current[index]);
            }
            return;
        }

        newBulk[index].showDropdown = true;
        setBulkUpload(newBulk);

        if (searchTimeout.current[index]) {
            clearTimeout(searchTimeout.current[index]);
        }

        searchTimeout.current[index] = setTimeout(async () => {
            const currentSearchType = newBulk[index].searchType;
            const flats = await getFlatsData(query, currentSearchType);

            const updated = [...bulkUpload];
            updated[index].results = flats;
            updated[index].showDropdown = true;
            setBulkUpload(updated);
        }, 300);
    };


    // ✅ Select a flat for a specific row
    const handleSelectFlatForRow = (index, flat) => {
        const updated = [...bulkUpload];
        updated[index].flat_id = flat.id || '';
        updated[index].customer_id = flat.customer?.id || '';
        updated[index].selectedFlat = flat;
        updated[index].searchQuery = flat.label;
        updated[index].results = [];
        updated[index].showDropdown = false;

        updated[index].error.flat_id = '';
        updated[index].error.customer_id = '';
        setBulkUpload(updated);
    };

    // ✅ Fetch flats from API
    const getFlatsData = async (query, searchType) => {
        try {
            const params = searchType === 'flatNo'
                ? { flat_no: query }
                : { searchQuery: query };

            const response = await Flatapi.get(`search-sold-flats`, {
                params,
                headers: { 'Content-Type': 'application/json' },
            });

            return (response?.data?.data || []).map(flat => ({
                ...flat,
                label: searchType === 'flatNo'
                    ? `${flat.flat_no} - ${flat.block_name || ''}`
                    : `${flat.customer?.first_name || ''} ${flat.customer?.last_name || ''} - ${flat.flat_no}`,
                value: flat.id,
            }));
        } catch (error) {
            console.error('API error:', error);
            return [];
        }
    };


    const handleSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);
        setIsLoadingEffect(true);

        let hasError = false;
        let firstErrorIndex = null;

        // Validate all rows
        const validatedData = bulkUpload.map((row, index) => {
            const errors = {
                flat_id: !row.flat_id ? 'Flat or Customer is required' : '',
                customer_id: !row.customer_id ? 'Customer or Flat is required' : '',
                amount: !row.amount ? 'Amount is required' : '',
                payment_type: !row.payment_type ? 'Payment Type is required' : '',
                payment_towards: !row.payment_towards ? 'Payment Towards is required' : '',
                payment_method: !row.payment_method ? 'Payment Method is required' : '',
                payment_date: !row.payment_date ? 'Payment Date is required' : '',
                transaction_id: !row.transaction_id ? 'Transaction Id is required' : '',
            };

            const hasRowError =
                errors.flat_id ||
                errors.customer_id ||
                errors.amount ||
                errors.payment_type ||
                errors.payment_towards ||
                errors.payment_method ||
                errors.payment_date ||
                errors.transaction_id;

            if (hasRowError && firstErrorIndex === null) {
                firstErrorIndex = index;
                hasError = true;
            }

            return {
                ...row,
                error: errors
            };
        });

        setBulkUpload(validatedData);

        // Scroll to first error if exists
        if (hasError && firstErrorIndex !== null) {
            const errorRow = rowRefs.current[firstErrorIndex];
            if (errorRow?.scrollIntoView) {
                errorRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            setIsSubmitting(false);
            setIsLoadingEffect(false);
            return;
        }

        try {
            // Build ONE FormData for all rows
            const formData = new FormData();

            validatedData.forEach((row, i) => {
                formData.append(`rows[${i}][amount]`, row?.amount);
                formData.append(`rows[${i}][payment_type]`, row?.payment_type);
                formData.append(`rows[${i}][payment_towards]`, row?.payment_towards);
                formData.append(`rows[${i}][payment_method]`, row?.payment_method);
                formData.append(`rows[${i}][bank]`, row?.bank || '');
                formData.append(`rows[${i}][paymentdate]`, row?.payment_date ? new Date(row?.payment_date).toISOString() : '');
                formData.append(`rows[${i}][transactionid]`, row?.transaction_id);
                formData.append(`rows[${i}][comment]`, row?.comment || '');
                formData.append(`rows[${i}][flat_id]`, row?.flat_id);
                formData.append(`rows[${i}][customer_id]`, row?.customer_id);
                formData.append(`rows[${i}][employee_id]`, employeeInfo?.id);

                // If file exists, append it
                if (row?.receipt) {
                    formData.append(`rows[${i}][receipt]`, row.receipt);
                }
            });

            // Send single request
            const res = await Paymentapi.post('/add-bulk-payment', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = res.data;

            if (data.status === "error" && Array.isArray(data.errors)) {
                // Map backend errors to rows
                const updatedRows = validatedData.map((row) => {
                    const backendError = data.errors.find(err => String(err.flat_id) === String(row.flat_id));
                    return {
                        ...row,
                        error: {
                            ...row.error,
                            backend: backendError ? backendError.message : ''
                        }
                    };
                });

                setBulkUpload(updatedRows);

                // Scroll to the first backend error row
                const firstBackendError = data.errors[0];
                if (firstBackendError) {
                    const firstErrorIndex = updatedRows.findIndex(r => String(r.flat_id) === String(firstBackendError.flat_id));
                    if (firstErrorIndex !== -1) {
                        const errorRow = rowRefs.current[firstErrorIndex];
                        if (errorRow?.scrollIntoView) {
                            errorRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                }

                setIsSubmitting(false);
                setIsLoadingEffect(false);
                return;
            }


            // Reset form
            setBulkUpload([{
                amount: '',
                payment_type: '',
                payment_towards: '',
                payment_method: '',
                bank: '',
                payment_date: null,
                transaction_id: '',
                receipt: '',
                comment: '',
                flat_id: '',
                customer_id: '',
                searchType: '',
                searchQuery: '',
                selectedFlat: null,
                results: [],
                loading: false,
                showDropdown: false,
                error: {
                    flat_id: '',
                    customer_id: '',
                    backend: '',
                }
            }]);

            // toast.success("Payment(s) added successfully");
            navigate('/payments');

        } catch (error) {
            console.error('Error:', error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
        } finally {
            setIsLoadingEffect(false);
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 text-[24px] font-semibold">Bulk Payments</h1>
                    <Link to={'/payments'} className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200">
                        <IconArrowLeft className='mt-0.5' size={18} color="#0083bf" />Back
                    </Link>
                </div>
                <hr className='border border-[#ebecef]' />
                {bulkUpload?.map((row, index) => (
                    <div key={index} ref={el => rowRefs.current[index] = el} className="relative flex flex-col gap-2 border border-[#ebecef] rounded-xl bg-white px-8 py-6">
                        <div className="w-full flex flex-row gap-4">
                            <div className="w-1/2 flex flex-col gap-2">
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                    <div className='flex flex-col gap-2'>
                                        <Textinput
                                            placeholder="Enter Amount"
                                            label="Amount"
                                            value={row.amount || ''}
                                            onChange={(e) => updateAmount(index, e)}
                                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                        />
                                        {row?.error.amount && <p className="text-xs text-red-600 font-medium">{row?.error.amount}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Select
                                            label="Payment Type"
                                            labelClass="text-sm font-medium text-gray-600 mb-1"
                                            placeholder="Select Payment Type"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                            className="w-full"
                                            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                                            selectWrapperClass="!shadow-none"
                                            data={[
                                                { value: 'Customer Pay', label: 'Customer Pay' },
                                                { value: 'Loan Pay', label: 'Loan Pay' },
                                            ]}
                                            value={row.payment_type}
                                            onChange={(option) => updatePaymentType(index, option)}
                                        />
                                        {row?.error.payment_type && <p className="text-xs text-red-600 font-medium">{row?.error.payment_type}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Select
                                            label="Payment Towards"
                                            labelClass="text-sm font-medium text-gray-600 mb-1"
                                            placeholder="Select Payment Towards"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                            className="w-full"
                                            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                                            selectWrapperClass="!shadow-none"
                                            data={[
                                                { value: 'Flat', label: 'Flat' },
                                                { value: 'GST', label: 'GST' },
                                                { value: 'Corpus fund', label: 'Corpus fund' },
                                                { value: 'Registration', label: 'Registration' },
                                                { value: 'TDS', label: 'TDS' },
                                                { value: 'Maintenance', label: 'Maintenance' },
                                            ]}
                                            value={row.payment_towards}
                                            onChange={(option) => updatePaymentTowards(index, option)}
                                        />
                                        {row?.error.payment_towards && <p className="text-xs text-red-600 font-medium">{row?.error.payment_towards}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Select
                                            label="Payment Method"
                                            labelClass="text-sm font-medium text-gray-600 mb-1"
                                            placeholder="Select Payment Method"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                            className="w-full"
                                            dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                                            selectWrapperClass="!shadow-none"
                                            data={[
                                                { value: 'DD', label: 'DD' },
                                                { value: 'UPI', label: 'UPI' },
                                                { value: 'Bank Deposit', label: 'Bank Deposit' },
                                                { value: 'Cheque', label: 'Cheque' },
                                                { value: 'Online Transfer (IMPS, NFT)', label: 'Online Transfer (IMPS, NFT)' },
                                            ]}
                                            value={row.payment_method}
                                            onChange={(option) => updatePaymentMethod(index, option)}
                                        />
                                        {row?.error.payment_method && <p className="text-xs text-red-600 font-medium">{row?.error.payment_method}</p>}
                                    </div>
                                    {(row?.payment_method === 'DD' || row?.payment_method === 'Bank Deposit') && (
                                        <Textinput
                                            placeholder="Enter bank name"
                                            label="Bank"
                                            value={row.bank || ''}
                                            onChange={(e) => updateBank(index, e)}
                                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                        />
                                    )}
                                    <div className='flex flex-col gap-2'>
                                        <Datepicker
                                            label="Date of Payment"
                                            value={row?.payment_date || null}
                                            onChange={(option) => updatePaymentDate(index, option)}
                                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200"
                                        />
                                        {row?.error.payment_date && <p className="text-xs text-red-600 font-medium">{row?.error.payment_date}</p>}
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <Textinput
                                            placeholder="Enter transaction id"
                                            label="Transaction Id"
                                            value={row.transaction_id || ''}
                                            onChange={(e) => updateTransactionId(index, e)}
                                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                        />
                                        {row?.error.transaction_id && <p className="text-xs text-red-600 font-medium">{row?.error.transaction_id}</p>}
                                    </div>
                                    <Fileinput
                                        label="Receipt(optional)"
                                        accept="image/*,application/pdf"
                                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                                        multiple={false}
                                        clearable
                                        value={row?.receipt || null}
                                        onChange={(e) => updateReceipt(index, e)}
                                    />
                                </div>
                                <Textarea
                                    placeholder="Enter comments"
                                    label="Comments"
                                    value={row.comment || ''}
                                    onChange={(e) => updateComment(index, e)}
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                />
                            </div>


                            {/* Search and Selection Section */}
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-col gap-2 relative w-full">

                                    <div className='flex items-center justify-between'>
                                        <h1 className='text-sm font-bold text-gray-700 '>Search by Flat No or Customer</h1>
                                        <div onClick={() => openDeletePaymentRecord(row)}><IconTrash className='text-red-500 hover:text-red-600 cursor-pointer' size={18} /></div>
                                    </div>


                                    <div className="flex gap-6 mb-2">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="flatNo"
                                                checked={row.searchType === 'flatNo'}
                                                onChange={() => handleSearchTypeChange(index, 'flatNo')}
                                                className="form-radio text-[#0083bf] focus:ring-[#0083bf] !border !border-[#ced4da]"
                                            />
                                            <span className="text-sm font-medium text-gray-600">Search by Flat No</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="customer"
                                                checked={row.searchType === 'customer'}
                                                onChange={() => handleSearchTypeChange(index, 'customer')}
                                                className="form-radio text-[#0083bf] focus:ring-[#0083bf] !border !border-[#ced4da]"
                                            />
                                            <span className="text-sm font-medium text-gray-600">Search by Customer</span>
                                        </label>
                                    </div>

                                    <div className="flex flex-col gap-2 relative w-full">
                                        <div className="text-sm font-medium text-gray-600">
                                            {row.searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                        </div>

                                        <input
                                            type='text'
                                            value={row.searchQuery}
                                            onChange={(e) => updateSearchQueryForRow(index, e.target.value)}
                                            placeholder={row.searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                            className="w-full px-3 py-2 text-sm rounded-md focus:outline-none !border !border-[#ced4da]"
                                        />

                                        {row.showDropdown && (
                                            <div className="absolute top-full left-0 w-full z-10 mt-1">
                                                <div className="bg-white border border-[#ced4da] rounded-md max-h-48 overflow-y-auto">
                                                    {row?.loading ? (
                                                        <div className="p-3 text-sm text-gray-500">Loading...</div>
                                                    ) : row?.results?.length > 0 ? (
                                                        <ul>
                                                            {row?.results.map((item) => (
                                                                <li
                                                                    key={item.value}
                                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                                    onClick={() => handleSelectFlatForRow(index, item)}
                                                                >
                                                                    {item.label}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <div className="p-3 text-sm text-gray-500">No Result</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {(row?.error.flat_id || row?.error.customer_id) && (
                                            <p className="text-xs text-red-600 font-medium">
                                                {row?.error.flat_id || row?.error.customer_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Flat Info */}
                                {row?.selectedFlat && (
                                    <div className="flex flex-col gap-2 w-full border border-[#ced4da] rounded-md p-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className='flex-1'>
                                                <div className="text-lg font-semibold text-gray-800">Flat No: {row?.selectedFlat?.flat_no || '---'}</div>
                                            </div>
                                            <div className='flex-1'>
                                                <div className="w-full text-lg font-semibold text-gray-900 break-all">
                                                    {`${capitalize(row?.selectedFlat.customer.first_name)} ${capitalize(row?.selectedFlat.customer.last_name)}`}
                                                </div>
                                            </div>
                                        </div>
                                        <hr className='w-full border border-[#ced4da]' />
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className='w-1/2'>
                                                <div className="flex flex-col gap-2 text-sm text-gray-700">
                                                    <div className="text-sm text-gray-600">Block: <span className="text-sm text-gray-900 font-semibold break-all capitalize">{row?.selectedFlat?.block_name || '---'}</span></div>
                                                    <div className="text-sm text-gray-600">Facing: <span className="text-sm text-gray-900 font-semibold break-all capitalize">{row?.selectedFlat?.facing || '---'}</span></div>
                                                    <div className="text-sm text-gray-600">Floor: <span className="text-sm text-gray-900 font-semibold break-all capitalize">{row?.selectedFlat?.floor_no || '---'}</span></div>
                                                </div>
                                            </div>
                                            {row?.selectedFlat.customer && (
                                                <div className="flex-1 flex flex-col gap-2">
                                                    <div className="flex flex-col gap-y-1">
                                                        <p className="text-sm text-gray-600 break-all">Email: <span className="text-sm text-gray-900 font-semibold">{row?.selectedFlat.customer.email || '---'}</span></p>
                                                    </div>

                                                    <div className="flex flex-col gap-y-1">
                                                        <p className="text-sm text-gray-600 break-all">Phone Number: <span className="text-sm text-gray-900 font-semibold capitalize">{`+${row?.selectedFlat.customer.phone_code} ${row?.selectedFlat.customer.phone_number}`}</span></p>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {row?.error.backend && <p className="text-xs text-red-600 font-medium">{row?.error.backend}</p>}
                    </div>
                ))}
                <div className="sticky bottom-0 border border-[#ced4da] bg-white rounded-xl p-4 z-50 shadow-md flex justify-between items-center">
                    <div className='font-semibold text-sm text-gray-900'>
                        <span className='text-red-500'>Note: </span>Please complete all necessary fields before submitting.
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isLoadingEffect}
                        className="!bg-[#0083bf] hover:!bg-[#0083bf]/90 !text-white !py-2 !px-3 !rounded-sm cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </div >

            <Modal
                open={deletePaymentRecord}
                close={closeDeletePaymentRecord}
                // padding="px-5"
                withCloseButton={false}
                containerClassName="!w-[300px] xxm:!w-[350px] xs:!w-[390px] md:!w-[440px]"
            >
                {deletePaymentRecord && (
                    <Deletepaymentrecord
                        deleteRowData={deleteRowData}
                        closeDeletePaymentRecord={closeDeletePaymentRecord}
                        refreshAllParsedPayments={refreshAllParsedPayments}
                        setErrorMessage={setErrorMessage}
                    />
                )}
            </Modal>
            <ToastContainer position="top-right" autoClose={1000} />
        </>

    );
}

export default Viewparsedpayments;

