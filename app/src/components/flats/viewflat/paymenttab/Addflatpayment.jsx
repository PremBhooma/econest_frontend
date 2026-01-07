
import React, { useState } from 'react';
import Paymentapi from '../../../api/Paymentapi';
import Errorpanel from '@/components/shared/Errorpanel.jsx';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Textinput, Loadingoverlay, Select, Datepicker, Textarea, Fileinput } from '@nayeshdaggula/tailify';
import { useEmployeeDetails } from '../../../zustand/useEmployeeDetails';

function Addflatpayment({ flat_id, closeAddFlatPayment, refreshAllPayments, customerId }) {
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const updateAmount = (e) => {
        let value = e.target.value;
        if (isNaN(value)) return;
        setAmount(value);
        setAmountError('');
    };

    const [paymentType, setPaymentType] = useState(null);
    const [paymentTypeError, setPaymentTypeError] = useState('');
    const updatePaymentType = (value) => {
        setPaymentType(value);
        setPaymentTypeError('');
    };

    const [paymentTowards, setPaymentTowards] = useState(null);
    const [paymentTowardsError, setPaymentTowardsError] = useState('');
    const updatePaymentTowards = (value) => {
        setPaymentTowards(value);
        setPaymentTowardsError('');
    };

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentMethodError, setPaymentMethodError] = useState('');
    const updatePaymentMethod = (value) => {
        setPaymentMethod(value);
        setPaymentMethodError('');
        setBank('');
    };

    const [bank, setBank] = useState('');
    const [bankError, setBankError] = useState('');
    const updateBank = (e) => {
        setBank(e.target.value);
        setBankError('');
    };

    const [paymentDate, setPaymentDate] = useState("");
    const [paymentDateError, setPaymentDateError] = useState('');
    const updatePaymentDate = (value) => {
        setPaymentDate(value);
        setPaymentDateError('');
    };

    const [transactionId, setTransactionId] = useState('');
    const [transactionIdError, setTransactionIdError] = useState('');
    const updateTransactionId = (e) => {
        setTransactionId(e.currentTarget.value);
        setTransactionIdError('');
    };

    const [receipt, setReceipt] = useState("");
    const [receiptUrl, setReceiptUrl] = useState("");
    const [receiptError, setReceiptError] = useState("");
    const updateFeaturedImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setReceipt(file);
            setReceiptUrl(URL.createObjectURL(file));
            setReceiptError("");
        }
    };

    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const updateComment = (e) => {
        setComment(e.currentTarget.value);
        setCommentError('');
    };

    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        // Validation
        if (amount === '') {
            setAmountError('Amount is required');
            setIsLoadingEffect(false);
            return false;
        }
        if (!paymentType) {
            setPaymentTypeError('Select payment type');
            setIsLoadingEffect(false);
            return false;
        }
        if (!paymentTowards) {
            setPaymentTowardsError('Select payment towards');
            setIsLoadingEffect(false);
            return false;
        }
        if (paymentMethod === null) {
            setPaymentMethodError('Select payment method');
            setIsLoadingEffect(false);
            return false;
        }
        if (paymentMethod === "DD" || paymentMethod === "Bank Deposit") {
            if (bank === '') {
                setBankError('Enter the bank name');
                setIsLoadingEffect(false);
                return false;
            }
        }
        if (!paymentDate) {
            setPaymentDateError('Select payment date');
            setIsLoadingEffect(false);
            return false;
        }
        if (transactionId === "") {
            setTransactionIdError('Enter transaction id');
            setIsLoadingEffect(false);
            return false;
        }

        const formatDateOnly = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const formdata = new FormData();
        formdata.append("amount", amount);
        formdata.append('payment_type', paymentType);
        formdata.append('payment_towards', paymentTowards);
        formdata.append("payment_method", paymentMethod);
        formdata.append("bank", bank);
        formdata.append("paymentdate", formatDateOnly(paymentDate));
        formdata.append("transactionid", transactionId);
        formdata.append("receipt", receipt);
        formdata.append("comment", comment);
        formdata.append("flat_id", flat_id);
        formdata.append("customer_id", customerId);
        formdata.append("employee_id", employeeId);

        try {
            const res = await Paymentapi.post('/addpayment', formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const data = res.data;
            if (data.status === "error") {
                setErrorMessage({
                    message: data.message,
                    server_res: data,
                });
                setIsLoadingEffect(false);
                return false;
            }
            setIsLoadingEffect(false);
            toast.success("Payment added successfully");
            refreshAllPayments();
            closeAddFlatPayment();
            return;
        } catch (error) {
            console.log('Error:', error);
            const finalresponse = {
                message: error.message,
                server_res: error.response?.data || null,
            };
            setErrorMessage(finalresponse);
            setIsLoadingEffect(false);
            return false;
        }
    };



    return (
        <div className="flex flex-col gap-4 w-full px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-gray-800 text-lg font-semibold max-sm:text-xl">Add Flat Payment</h1>
                <div onClick={closeAddFlatPayment} className="cursor-pointer py-1 px-2 rounded-sm !bg-red-500 text-white font-semibold">
                    Close
                </div>
            </div>
            <hr className='border border-gray-200' />
            <div className='relative flex flex-col gap-4'>
                <div className='w-full grid grid-cols-2 gap-4'>
                    <Textinput
                        placeholder="Enter Amount"
                        label="Amount"
                        error={amountError}
                        value={amount}
                        onChange={updateAmount}
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                    />
                    <Select
                        label="Payment Type"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Type"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass="!shadow-none"
                        error={paymentTypeError}
                        value={paymentType}
                        onChange={updatePaymentType}
                        data={[
                            { value: 'Customer Pay', label: 'Customer Pay' },
                            { value: 'Loan Pay', label: 'Loan Pay' },
                        ]}
                    />
                    <Select
                        label="Payment Towards"
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Towards"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass="!shadow-none"
                        error={paymentTowardsError}
                        value={paymentTowards}
                        onChange={updatePaymentTowards}
                        data={[
                            { value: 'Flat', label: 'Flat' },
                            { value: 'GST', label: 'GST' },
                            { value: 'Corpus fund', label: 'Corpus fund' },
                            { value: 'Registration', label: 'Registration' },
                            { value: 'TDS', label: 'TDS' },
                            { value: 'Maintenance', label: 'Maintenance' },
                        ]}
                    />
                    <Select
                        label='Payment Method'
                        labelClass="text-sm font-medium text-gray-600 mb-1"
                        placeholder="Select Payment Method"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        className="w-full"
                        dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                        selectWrapperClass='!shadow-none'
                        error={paymentMethodError}
                        value={paymentMethod}
                        onChange={updatePaymentMethod}
                        data={[
                            { value: "DD", label: "DD" },
                            { value: "UPI", label: "UPI" },
                            { value: "Bank Deposit", label: "Bank Deposit" },
                            { value: "Cheque", label: "Cheque" },
                            { value: "Online Transfer (IMPS, NFT)", label: "Online Transfer (IMPS, NFT)" },
                        ]}
                    />
                    {(paymentMethod === "DD" || paymentMethod === "Bank Deposit") && (
                        <Textinput
                            placeholder="Enter bank name"
                            label="Bank"
                            error={bankError}
                            value={bank}
                            onChange={updateBank}
                            labelClassName="text-sm font-medium text-gray-600 mb-1"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                        />
                    )}
                    <Datepicker
                        label="Date of Payment"
                        value={paymentDate}
                        onChange={updatePaymentDate}
                        error={paymentDateError}
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        inputClassName="2xl:py-3 2xl:text-[20px]"
                    />
                    <Textinput
                        placeholder="Enter transaction id"
                        label="Transaction Id"
                        error={transactionIdError}
                        value={transactionId}
                        onChange={updateTransactionId}
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                    />
                    <Fileinput
                        label="Receipt(optional)"
                        accept="image/*,application/pdf"
                        labelClassName="text-sm font-medium text-gray-600 mb-1"
                        multiple={false}
                        clearable
                        value={receipt}
                        error={receiptError}
                        onChange={updateFeaturedImage}
                    />
                </div>
                <Textarea
                    placeholder="Enter comments"
                    label="Comments"
                    error={commentError}
                    value={comment}
                    onChange={updateComment}
                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                    inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                />
            </div>
            {isLoadingEffect ?
                isLoadingEffect && (
                    <div className='absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded'>
                        <Loadingoverlay visible={isLoadingEffect} overlayBg='' />
                    </div>
                )
                :
                <div className="flex justify-end mt-auto">
                    <Link
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="cursor-pointer ml-[10px] text-xs text-left text-white flex justify-center items-center relative px-4 py-[7px] rounded bg-[#0083bf]"
                    >
                        + Add Payment
                    </Link>
                </div>
            }

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Addflatpayment;