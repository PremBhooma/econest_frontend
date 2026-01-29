import React, { useEffect, useState } from 'react';
import { IconX, IconEdit, IconBuildingBank, IconUser, IconPhone, IconCash, IconCheck, IconLoader } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from '@nayeshdaggula/tailify';
import Ageingrecordapi from '../api/Ageingrecordapi';
import { toast } from 'react-toastify';
import { useEmployeeDetails } from '../zustand/useEmployeeDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Settingsapi from '../api/Settingsapi';

const Ageingrecorddetails = ({ open, onOpenChange, recordData, onRefresh, onRecordUpdate }) => {
  const permissions = useEmployeeDetails((state) => state.permissions);
  const [isLoading, setIsLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [localRecord, setLocalRecord] = useState(null);
  const [bankList, setBankList] = useState([]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await Settingsapi.get('/get-all-banks-list?limit=1000');
        if (response.data.status === 'success') {
          setBankList(response.data.data.map(b => b.name));
        }
      } catch (e) {
        console.error("Error fetching banks:", e);
      }
    };
    fetchBanks();
  }, []);

  // Form states for update
  const [loanStatus, setLoanStatus] = useState("NotApplied");
  const [registrationStatus, setRegistrationStatus] = useState("NotRegistered");
  const [bankName, setBankName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  // Error states
  const [bankNameError, setBankNameError] = useState('');
  const [agentNameError, setAgentNameError] = useState('');
  const [agentNumberError, setAgentNumberError] = useState('');
  const [loanAmountError, setLoanAmountError] = useState('');

  console.log("recordData___DD:", recordData)

  // Fetch fresh record details
  const fetchRecordDetails = async () => {
    if (!recordData?.id) return;

    try {
      const response = await Ageingrecordapi.get(`get-single-ageing-record?id=${recordData.id}`);
      if (response.data.status === 'success') {
        setLocalRecord(response.data.record);
      }
    } catch (error) {
      console.error('Error fetching single record:', error);
      // Fallback to recordData if fetch fails initially, but we usually want fresh data
    }
  };

  console.log("localRecord___DD:", localRecord)

  // Sync localRecord with recordData when drawer opens AND fetch fresh data
  useEffect(() => {
    if (open && recordData) {
      setLocalRecord(recordData); // Show passed data immediately for perceived speed
      fetchRecordDetails(); // Then fetch fresh data to update calculations/status
    }
  }, [open, recordData]);

  // Reset localRecord when drawer closes
  useEffect(() => {
    if (!open) {
      setLocalRecord(null);
    }
  }, [open]);

  // Reset form when modal opens
  useEffect(() => {
    if (updateModalOpen && localRecord) {
      // Map "Not Applied" (display) to "NotApplied" (enum)
      const currentStatus = localRecord?.loan_Status === "Not Applied" ? "NotApplied" : (localRecord?.loan_Status || "NotApplied");
      setLoanStatus(currentStatus);

      const currentRegStatus = localRecord?.registration_status === "Not Registered" ? "NotRegistered" : (localRecord?.registration_status || "NotRegistered");
      setRegistrationStatus(currentRegStatus);
      setBankName(localRecord?.bank_name || '');
      setAgentName(localRecord?.agent_name || '');
      setAgentNumber(localRecord?.agent_number || '');
      // Format initial loan amount
      setLoanAmount(localRecord?.loan_amount ? Number(localRecord?.loan_amount).toLocaleString('en-IN') : '');
      // Clear errors
      setBankNameError('');
      setAgentNameError('');
      setAgentNumberError('');
      setLoanAmountError('');
    }
  }, [updateModalOpen, localRecord]);


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '-';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setBankNameError('');
    setAgentNameError('');
    setAgentNumberError('');
    setLoanAmountError('');

    // Bank name validation
    if (!bankName.trim()) {
      setBankNameError('Bank name is required');
      isValid = false;
    }

    // Agent name validation
    if (!agentName.trim()) {
      setAgentNameError('Agent name is required');
      isValid = false;
    }

    // Agent number validation - must be exactly 10 digits
    if (!agentNumber.trim()) {
      setAgentNumberError('Agent number is required');
      isValid = false;
    } else if (!/^\d{10}$/.test(agentNumber.trim())) {
      setAgentNumberError('Phone number must be exactly 10 digits');
      isValid = false;
    }

    // Loan amount validation
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      setLoanAmountError('Loan amount must be greater than 0');
      isValid = false;
    }

    return isValid;
  };

  const handleUpdateLoanStatus = async () => {
    if (!localRecord?.id) {
      toast.error('Record ID is missing');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await Ageingrecordapi.post('update-loan-status', {
        id: localRecord.id,
        loan_Status: loanStatus,
        registration_status: registrationStatus,
        bank_name: bankName.trim(),
        agent_name: agentName.trim(),
        agent_number: agentNumber.trim(),
        loan_amount: loanAmount ? parseFloat(loanAmount.toString().replace(/,/g, '')) : null,
      });

      if (response.data.status === 'success') {
        toast.success('Loan status updated successfully');

        // Fetch fresh details to update the drawer with latest server state
        await fetchRecordDetails();

        // Close only the modal, keep drawer open
        setUpdateModalOpen(false);

        // Call parent update to refresh list silently
        if (onRecordUpdate) {
          onRecordUpdate();
        }
      } else {
        toast.error(response.data.message || 'Failed to update loan status');
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
      toast.error('Failed to update loan status');
    } finally {
      setIsLoading(false);
    }
  };

  const DetailRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-gray-600" />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={`h-screen fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => onOpenChange(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Ageing Record Details</h2>
                <p className="text-sm text-gray-500">
                  {localRecord?.customer?.full_name || 'Customer Details'}
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors group cursor-pointer"
              >
                <IconX size={20} className="text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
              {/* Customer Info Section */}
              {/* Customer Info - Always show */}
              <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center text-lg font-bold">
                    {localRecord?.customer?.first_name?.[0]}{localRecord?.customer?.last_name?.[0] || ''}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {localRecord?.customer?.first_name} {localRecord?.customer?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      +{localRecord?.customer?.phone_code} {localRecord?.customer?.phone_number}
                    </p>
                    <p className="text-xs text-gray-500">{localRecord?.customer?.email}</p>
                  </div>
                </div>
              </div>

              {/* Flat & Property Info - Always show */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Property Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Flat No</p>
                    <p className="font-semibold text-gray-900">{localRecord?.flat?.flat_no || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Floor</p>
                    <p className="font-semibold text-gray-900">{localRecord?.flat?.floor_no || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Block</p>
                    <p className="font-semibold text-gray-900">{localRecord?.flat?.block_name || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Project</p>
                    <p className="font-semibold text-gray-900">{localRecord?.project?.project_name || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Ageing Details */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Ageing Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(localRecord?.booking_date)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Ageing Days</p>
                    <p className="font-semibold text-gray-900">{localRecord?.ageing_days ?? '-'} days</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-900 text-lg">{formatAmount(localRecord?.total_amount)}</p>
                  </div>
                </div>
              </div>

              {/* Loan Status Section */}
              <div className="px-6 py-4 border-b border-gray-200">
                {permissions?.ageing_page?.includes("update_loan_details") && (
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Loan Details</h4>
                    <button
                      onClick={() => setUpdateModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <IconEdit size={14} />
                      Update
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Loan Status</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${localRecord?.loan_time_days ? 'bg-red-50 text-red-700 border border-red-100' :
                      localRecord?.loan_Status === 'Approved' ? 'bg-green-50 text-green-700 border border-green-100' :
                        localRecord?.loan_Status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                          localRecord?.loan_Status === 'Applied' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                      {localRecord?.loan_time_days ? 'Loan Delayed' : localRecord?.loan_Status || 'Not Applied'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Reg. Status</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${localRecord?.registration_status === 'Registered' ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                      {localRecord?.registration_status || 'Not Registered'}
                    </span>
                  </div>

                  <DetailRow label="Bank Name" value={localRecord?.bank_name} icon={IconBuildingBank} />
                  <DetailRow label="Agent Name" value={localRecord?.agent_name} icon={IconUser} />
                  <DetailRow label="Agent Number" value={localRecord?.agent_number} icon={IconPhone} />
                  <DetailRow label="Loan Amount" value={formatAmount(localRecord?.loan_amount)} icon={IconCash} />
                </div>
              </div>

              {/* Timestamps */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <p className="mb-0.5">Created At</p>
                    <p className="text-gray-700">{formatDate(localRecord?.created_at)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5">Updated At</p>
                    <p className="text-gray-700">{formatDate(localRecord?.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Update Modal */}
      <Modal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        size="md"
        zIndex={9999}
        withCloseButton={false}

      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Update Loan Details</h3>
            <button
              onClick={() => setUpdateModalOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <IconX size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {/* Loan Status Toggle */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Loan Status</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {['NotApplied', 'Applied', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setLoanStatus(status)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-2 focus:outline-none focus:ring-0 ${loanStatus === status
                      ? status === 'Approved' ? 'bg-green-100 text-green-700 border-green-300'
                        : status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300'
                          : status === 'Applied' ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                      }`}
                  >
                    {status === 'NotApplied' ? 'Not Applied' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Registration Status Toggle */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Registration Status</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {['NotRegistered', 'Registered'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setRegistrationStatus(status)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer border-2 focus:outline-none focus:ring-0 ${registrationStatus === status
                      ? status === 'Registered' ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'
                      }`}
                  >
                    {status === 'NotRegistered' ? 'Not Registered' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Bank Name <span className="text-red-500">*</span></Label>
              <Select
                value={bankName}
                onValueChange={(value) => {
                  setBankName(value);
                  if (bankNameError) setBankNameError('');
                }}
              >
                <SelectTrigger className={`mt-1 w-full bg-white border rounded-lg focus:outline-none focus:ring-0 ${bankNameError ? 'border-red-400' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select bank name" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] border border-gray-200 z-[9999]">
                  {bankList.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bankNameError && <p className="text-red-500 text-xs mt-1">{bankNameError}</p>}
            </div>

            {/* Agent Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Agent Name <span className="text-red-500">*</span></Label>
              <Input
                value={agentName}
                onChange={(e) => {
                  setAgentName(e.target.value);
                  if (agentNameError) setAgentNameError('');
                }}
                placeholder="Enter agent name"
                className={`mt-1 bg-white border rounded-lg focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${agentNameError ? 'border-red-400' : 'border-gray-300'}`}
              />
              {agentNameError && <p className="text-red-500 text-xs mt-1">{agentNameError}</p>}
            </div>

            {/* Agent Number */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Agent Number <span className="text-red-500">*</span></Label>
              <Input
                value={agentNumber}
                onChange={(e) => {
                  // Only allow digits and max 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setAgentNumber(value);
                  if (agentNumberError) setAgentNumberError('');
                }}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                className={`mt-1 bg-white border rounded-lg focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${agentNumberError ? 'border-red-400' : 'border-gray-300'}`}
              />
              {agentNumberError && <p className="text-red-500 text-xs mt-1">{agentNumberError}</p>}
            </div>

            {/* Loan Amount */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Loan Amount <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={loanAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value.replace(/,/g, '');

                  // Only allow numbers and one decimal point
                  if (value === '' || /^\d*\.?\d*$/.test(cleanValue)) {
                    if (cleanValue === '') {
                      setLoanAmount('');
                    } else {
                      const parts = cleanValue.split('.');
                      const integerPart = parts[0];
                      const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
                      const formattedValue = integerPart ? Number(integerPart).toLocaleString('en-IN') : '';
                      setLoanAmount(formattedValue + decimalPart);
                    }
                    if (loanAmountError) setLoanAmountError('');
                  }
                }}
                placeholder="Enter loan amount"
                className={`mt-1 bg-white border rounded-lg focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${loanAmountError ? 'border-red-400' : 'border-gray-300'}`}
              />
              {loanAmountError && <p className="text-red-500 text-xs mt-1">{loanAmountError}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setUpdateModalOpen(false)}
              className="px-4 py-2 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLoanStatus}
              disabled={isLoading}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <IconLoader size={16} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <IconCheck size={16} className="mr-2" />
                  Update
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal >
    </>
  );
};

export default Ageingrecorddetails;
