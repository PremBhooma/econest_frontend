import React, { useEffect, useState } from 'react';
import Flatapi from '../api/Flatapi';
import Paymentapi from '../api/Paymentapi';
import photo from '../../../public/assets/photo.png';
import pdficon from '../../../public/assets/pdficon.png';
import Errorpanel from '@/components/shared/Errorpanel.jsx';
import noImageStaticImage from '../../../public/assets/no_image.png';
import { toast, ToastContainer } from 'react-toastify';
import { IconArrowLeft, IconX } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Textinput, Loadingoverlay, Select, Datepicker, Textarea, Fileinput } from '@nayeshdaggula/tailify';

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const getFileInfo = (url) => {
    if (!url) return { fileName: '', fileType: '' };
    const fileName = url.split('/').pop();
    const extension = fileName.split('.').pop().toLowerCase();
    const fileType = extension === 'pdf' ? 'pdf' : ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension) ? 'image' : 'unknown';
    return { fileName, fileType };
};

function Editpaymentwrapper() {
    const navigate = useNavigate();
    const { payment_uid } = useParams();
    const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
    const employeeId = employeeInfo?.id || null;

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const updateAmount = (e) => {
        const value = e.target.value;
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

    const [receipt, setReceipt] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [receiptError, setReceiptError] = useState('');
    const [receiptUpdated, setReceiptUpdated] = useState(false);
    const updateFeaturedImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            setReceipt(file);
            setReceiptUrl(URL.createObjectURL(file));
            setReceiptError('');
            setReceiptUpdated(true);
        }
    };
    const removeReceipt = () => {
        setReceipt(null);
        setReceiptUrl('');
        setReceiptUpdated(true);
    };

    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');
    const updateComment = (e) => {
        setComment(e.currentTarget.value);
        setCommentError('');
    };

    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);

    const [searchType, setSearchType] = useState('flatNo');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [selectedFlatError, setSelectedFlatError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery('');
        setResults([]);
        setShowDropdown(false);
        setSelectedFlatError('');
    };

    const updateSearchQuery = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (debounceTimer) clearTimeout(debounceTimer);

        const timer = setTimeout(() => {
            if (value.trim().length > 0) {
                getFlatsData(value);
                setShowDropdown(true);
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 500);
        setDebounceTimer(timer);
    };

    const handleSelectFlat = (flat) => {
        setSearchQuery(flat?.label);
        setSelectedFlat(flat);
        setShowDropdown(false);
        setSelectedFlatError('');
    };

    useEffect(() => {
        if (!searchQuery) {
            setResults([]);
            setShowDropdown(false);
        }
    }, [searchQuery]);

    async function getFlatsData(query) {
        try {
            setLoading(true);
            const params = searchType === 'flatNo' ? { flat_no: query } : { searchQuery: query };
            const response = await Flatapi.get(`search-sold-flats`, {
                params,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response?.data;
            if (data?.status === 'error') {
                setErrorMessage({ message: data.message, server_res: data });
                setResults([]);
                return false;
            }
            setResults(data?.data || []);
            return true;
        } catch (error) {
            console.log(error);
            setErrorMessage({ message: error.message, server_res: error.response?.data || null });
            return false;
        } finally {
            setLoading(false);
        }
    }

    async function getSinglePaymentData(payment_uid) {
        setIsLoadingEffect(true);
        try {
            const response = await Paymentapi.get('getsinglepayment', {
                params: { paymentuid: payment_uid },
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            if (data.status === 'error') {
                setErrorMessage({ message: data.message, server_res: data });
                setIsLoadingEffect(false);
                return false;
            }

            if (data.payment_details) {
                const payment = data.payment_details;
                setAmount(payment.amount ? payment.amount.toString() : '');
                setPaymentType(payment.payment_type || null);
                setPaymentTowards(payment?.payment_towards || null);
                setPaymentMethod(payment.payment_method || null);
                setBank(payment.bank || '');
                setPaymentDate(payment.payment_date ? new Date(payment.payment_date) : new Date());
                setTransactionId(payment.transaction_id || '');
                setReceiptUrl(payment.receipt_url || '');
                setComment(payment.comment || '');

                // Pre-fill flat/customer data
                if (payment.flat && payment.customer) {
                    setSelectedFlat({
                        value: payment.payment_id,
                        label: `${payment.flat.flat_no} - ${payment.customer.first_name} ${payment.customer.last_name}`,
                        flat_no: payment.flat.flat_no,
                        id: payment.flat.id,
                        block_name: payment.flat.block_name,
                        facing: payment.flat.facing,
                        floor_no: payment.flat.floor_no,
                        square_feet: payment.flat.square_feet,
                        type: payment.flat.type,
                        bedrooms: payment.flat.bedrooms,
                        bathrooms: payment.flat.bathrooms,
                        balconies: payment.flat.balconies,
                        parking: payment.flat.parking,
                        furnished_status: payment.flat.furnished_status,
                        customer: {
                            id: payment.customer.id,
                            first_name: payment.customer.first_name,
                            last_name: payment.customer.last_name,
                            email: payment.customer.email,
                            phone_code: payment.customer.phone_code,
                            phone_number: payment.customer.phone_number,
                            profile_pic_url: payment.customer.profile_pic_url,
                        },
                    });
                    setSearchQuery(`${payment.flat.flat_no} - ${payment.customer.first_name} ${payment.customer.last_name}`);
                }
            }
            setIsLoadingEffect(false);
            return true;
        } catch (error) {
            console.log('Fetch payment error:', error);
            setErrorMessage({ message: error.message, server_res: error.response?.data || null });
            setIsLoadingEffect(false);
            return false;
        }
    }

    useEffect(() => {
        if (payment_uid) {
            getSinglePaymentData(payment_uid);
        }
    }, [payment_uid]);

    const [receiptFileType, setReceiptFileType] = useState('');
    const [receiptFileName, setReceiptFileName] = useState('');

    useEffect(() => {
        if (receiptUrl) {
            const { fileName, fileType } = getFileInfo(receiptUrl);
            setReceiptFileType(fileType);
            setReceiptFileName(fileName);
        } else {
            setReceiptFileType('');
            setReceiptFileName('');
        }
    }, [receiptUrl]);

    const handleSubmit = async () => {
        setIsLoadingEffect(true);

        // Validation
        if (!selectedFlat) {
            setSelectedFlatError('Please select a flat/customer');
            setIsLoadingEffect(false);
            return false;
        }
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
        if (!paymentMethod) {
            setPaymentMethodError('Select payment method');
            setIsLoadingEffect(false);
            return false;
        }
        if ((paymentMethod === 'DD' || paymentMethod === 'Bank Deposit') && !bank) {
            setBankError('Enter the bank name');
            setIsLoadingEffect(false);
            return false;
        }
        if (!paymentDate) {
            setPaymentDateError('Select payment date');
            setIsLoadingEffect(false);
            return false;
        }
        if (!transactionId) {
            setTransactionIdError('Enter transaction id');
            setIsLoadingEffect(false);
            return false;
        }
        // if (!comment) {
        //     setCommentError('Enter comments');
        //     setIsLoadingEffect(false);
        //     return false;
        // }

        const formatDateOnly = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const formdata = new FormData();
        formdata.append('amount', amount);
        formdata.append('payment_type', paymentType);
        formdata.append('payment_towards', paymentTowards);
        formdata.append('payment_method', paymentMethod);
        formdata.append('bank', bank);
        formdata.append('paymentdate', formatDateOnly(paymentDate));
        formdata.append('transactionid', transactionId);
        formdata.append('receipt', receipt || '');
        formdata.append('comment', comment);
        formdata.append('customerFlatId', selectedFlat?.value || '');
        formdata.append('flat_id', selectedFlat?.id || '');
        formdata.append('customer_id', selectedFlat?.customer?.id || '');
        formdata.append('receipt_updated', receiptUpdated.toString());
        formdata.append('payment_uid', payment_uid);
        formdata.append("employee_id", employeeId);

        try {
            const res = await Paymentapi.post('/updatepayment', formdata, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = res.data;
            if (data.status === 'error') {
                setErrorMessage({ message: data.message, server_res: data });
                setIsLoadingEffect(false);
                return false;
            }
            setIsLoadingEffect(false);
            toast.success('Payment updated successfully');
            navigate('/payments');
        } catch (error) {
            console.log('Error:', error);
            setErrorMessage({
                message: error.message,
                server_res: error.response?.data || null,
            });
            setIsLoadingEffect(false);
            return false;
        }
    };

    const infoItems = selectedFlat?.customer
        ? [
            { label: 'Name', value: `${capitalize(selectedFlat.customer.first_name) || ''} ${capitalize(selectedFlat.customer.last_name) || ''}` },
            { label: 'Email', value: selectedFlat.customer.email || '-' },
            { label: 'Phone Number', value: `+${selectedFlat.customer.phone_code || ''} ${selectedFlat.customer.phone_number || ''}` },
        ]
        : [];

    return (
        <div className="w-full">
            <div className="border-b border-gray-200 pb-4 mb-2">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-800 text-lg font-semibold max-sm:text-xl">Edit Payment</h1>
                    <Link
                        to="/payments"
                        className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
                    >
                        <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
                        Back
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col gap-8 border border-[#ebecef] rounded-xl bg-white px-8 py-4 min-h-[65vh]">
                <div className="w-full flex flex-row gap-4">
                    {/* Payment Form Fields */}
                    <div className="w-1/2">
                        <div className='grid grid-cols-2 gap-2'>
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
                                label="Payment Method"
                                labelClass="text-sm font-medium text-gray-600 mb-1"
                                placeholder="Select Payment Method"
                                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200 placeholder-gray-400"
                                className="w-full"
                                dropdownClassName="max-h-48 border border-gray-300 rounded-md bg-white overflow-y-auto"
                                selectWrapperClass="!shadow-none"
                                error={paymentMethodError}
                                value={paymentMethod}
                                onChange={updatePaymentMethod}
                                data={[
                                    { value: 'DD', label: 'DD' },
                                    { value: 'UPI', label: 'UPI' },
                                    { value: 'Bank Deposit', label: 'Bank Deposit' },
                                    { value: 'Cheque', label: 'Cheque' },
                                    { value: 'Online Transfer (IMPS, NFT)', label: 'Online Transfer (IMPS, NFT)' },
                                ]}
                            />
                            {(paymentMethod === 'DD' || paymentMethod === 'Bank Deposit') && (
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
                                inputClassName="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#044093] focus:outline-none transition-colors duration-200"
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
                            {receiptUrl ? (
                                <div className="relative">
                                    <p className="text-sm font-semibold text-gray-600 mb-1">Receipt</p>
                                    <div className="relative flex items-center gap-2 justify-center border border-amber-50 rounded-md p-3 bg-gray-50">
                                        <img
                                            src={receiptFileType === 'pdf' ? pdficon : photo}
                                            className={receiptFileType === 'pdf' ? 'h-[50px] w-[50px]' : 'h-[40px] w-[40px]'}
                                            alt="Receipt"
                                        />
                                        <a
                                            href={receiptUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-sm font-medium truncate max-w-[200px]"
                                        >
                                            {receiptFileName || 'View Receipt'}
                                        </a>
                                        <div className="absolute right-2 top-2" onClick={removeReceipt}>
                                            <IconX size={18} color="red" className="cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Fileinput
                                    label="Receipt (optional)"
                                    accept="image/*,application/pdf"
                                    labelClassName="text-sm font-medium text-gray-600 mb-1"
                                    multiple={false}
                                    clearable
                                    value={receipt}
                                    error={receiptError}
                                    onChange={updateFeaturedImage}
                                />
                            )}
                            <div className='col-span-2'>
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
                        </div>
                    </div>

                    {/* Search and Selection Section */}
                    <div className="w-1/2 flex flex-col gap-4">
                        <div className="flex flex-col gap-4 w-full">
                            <h1 className="text-sm font-bold text-gray-700">Search by Flat No or Customer</h1>
                            <div className="flex gap-6 mb-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="flatNo"
                                        checked={searchType === 'flatNo'}
                                        onChange={handleSearchTypeChange}
                                        className="form-radio text-[#0083bf] focus:ring-[#0083bf]"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Search by Flat No</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="customer"
                                        checked={searchType === 'customer'}
                                        onChange={handleSearchTypeChange}
                                        className="form-radio text-[#0083bf] focus:ring-[#0083bf]"
                                    />
                                    <span className="text-sm font-medium text-gray-600">Search by Customer</span>
                                </label>
                            </div>
                            <div className="flex flex-col gap-2 relative w-full max-w-md">
                                <div className="text-sm font-medium text-gray-600">
                                    {searchType === 'flatNo' ? 'Search for Flat' : 'Search for Customer'}
                                </div>
                                <input
                                    placeholder={searchType === 'flatNo' ? 'Enter Flat No' : 'Enter Customer Name/Email'}
                                    value={searchQuery}
                                    onChange={updateSearchQuery}
                                    className="w-full border border-[#ced4da] px-3 py-2 rounded-md outline-none placeholder:text-[14px] placeholder:text-black/50 text-[14px] text-black/60"
                                />
                                {showDropdown && (
                                    <div className="absolute top-full left-0 w-full z-10 mt-1">
                                        <div className="bg-white border border-[#ced4da] rounded-md max-h-48 overflow-y-auto">
                                            {loading ? (
                                                <div className="p-3 text-sm text-gray-500">Loading...</div>
                                            ) : results.length > 0 ? (
                                                <ul>
                                                    {results.map((item) => (
                                                        <li
                                                            key={item.value}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-[14px] text-black/60"
                                                            onClick={() => handleSelectFlat(item)}
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
                                {selectedFlatError && (
                                    <p className="text-xs text-red-600 font-medium">{selectedFlatError}</p>
                                )}
                            </div>
                        </div>
                        {selectedFlat && (
                            <div className="flex flex-col gap-6 w-full">
                                <div className="bg-white border border-[#ced4da] rounded-md p-4">
                                    <div className="text-lg font-semibold text-gray-800 mb-2">
                                        Flat No: {selectedFlat?.flat_no}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                        <div><span className="font-medium">Block:</span> {selectedFlat?.block_name || 'N/A'}</div>
                                        <div><span className="font-medium">Facing:</span> {selectedFlat?.facing || '-'}</div>
                                        <div><span className="font-medium">Floor:</span> {selectedFlat?.floor_no || '-'}</div>
                                        <div><span className="font-medium">Size:</span> {selectedFlat?.square_feet ? `${selectedFlat.square_feet} sqft` : '-'}</div>
                                        <div><span className="font-medium">Furnished:</span> {selectedFlat?.furnished_status || '-'}</div>
                                        <div><span className="font-medium">Type:</span> {selectedFlat?.type || '-'}</div>
                                        <div><span className="font-medium">Bedrooms:</span> {selectedFlat?.bedrooms || '-'}</div>
                                        <div><span className="font-medium">Bathrooms:</span> {selectedFlat?.bathrooms || '-'}</div>
                                        <div><span className="font-medium">Balconies:</span> {selectedFlat?.balconies || '-'}</div>
                                        <div><span className="font-medium">Parking:</span> {selectedFlat?.parking ? 'Yes' : 'No'}</div>
                                    </div>
                                </div>
                                {selectedFlat.customer && (
                                    <div className="bg-white border border-[#ced4da] rounded-md p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="w-full md:w-[120px] flex justify-center items-center">
                                                <img
                                                    crossOrigin="anonymous"
                                                    src={selectedFlat.customer.profile_pic_url || noImageStaticImage}
                                                    alt="Profile"
                                                    className="w-full h-[130px] rounded-lg object-cover border border-gray-300"
                                                />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 gap-3">
                                                {infoItems.map(({ label, value }) => (
                                                    <div key={label} className="flex flex-col gap-y-1">
                                                        <p className="text-sm text-gray-600">{label}</p>
                                                        <p className="text-sm text-gray-900 font-semibold break-all">{value || '-'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoadingEffect}
                        className="cursor-pointer ml-[10px] text-xs text-white flex justify-center items-center px-4 py-[7px] rounded bg-[#0083bf] disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Update Payment
                    </button>
                </div>
                {isLoadingEffect && (
                    <div className="absolute top-0 left-0 w-full h-full bg-[#2b2b2bcc] flex flex-row justify-center items-center z-50">
                        <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
                    </div>
                )}
            </div>
            {errorMessage && (
                <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Editpaymentwrapper;