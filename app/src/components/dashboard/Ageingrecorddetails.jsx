import React, { useEffect, useState } from 'react';
import { IconX, IconEdit, IconBuildingBank, IconUser, IconPhone, IconCash, IconCheck, IconLoader } from '@tabler/icons-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from '@nayeshdaggula/tailify';
import Ageingrecordapi from '../api/Ageingrecordapi';
import { toast } from 'react-toastify';

const Ageingrecorddetails = ({ open, onOpenChange, recordData, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Form states for update
  const [loanStatus, setLoanStatus] = useState(false);
  const [bankName, setBankName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentNumber, setAgentNumber] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  // Error states
  const [bankNameError, setBankNameError] = useState('');
  const [agentNameError, setAgentNameError] = useState('');
  const [agentNumberError, setAgentNumberError] = useState('');
  const [loanAmountError, setLoanAmountError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (updateModalOpen && recordData) {
      setLoanStatus(recordData?.loan_Status || false);
      setBankName(recordData?.bank_name || '');
      setAgentName(recordData?.agent_name || '');
      setAgentNumber(recordData?.agent_number || '');
      setLoanAmount(recordData?.loan_amount || '');
      // Clear errors
      setBankNameError('');
      setAgentNameError('');
      setAgentNumberError('');
      setLoanAmountError('');
    }
  }, [updateModalOpen, recordData]);

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
    if (!recordData?.id) {
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
        id: recordData.id,
        loan_Status: loanStatus,
        bank_name: bankName.trim(),
        agent_name: agentName.trim(),
        agent_number: agentNumber.trim(),
        loan_amount: loanAmount ? parseFloat(loanAmount) : null,
      });

      if (response.data.status === 'success') {
        toast.success('Loan status updated successfully');
        setUpdateModalOpen(false);
        if (onRefresh) onRefresh();
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
                  {recordData?.customer?.full_name || 'Customer Details'}
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
                    {recordData?.customer?.first_name?.[0]}{recordData?.customer?.last_name?.[0] || ''}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {recordData?.customer?.first_name} {recordData?.customer?.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      +{recordData?.customer?.phone_code} {recordData?.customer?.phone_number}
                    </p>
                    <p className="text-xs text-gray-500">{recordData?.customer?.email}</p>
                  </div>
                </div>
              </div>

              {/* Flat & Property Info - Always show */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Property Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Flat No</p>
                    <p className="font-semibold text-gray-900">{recordData?.flat?.flat_no || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Floor</p>
                    <p className="font-semibold text-gray-900">{recordData?.flat?.floor_no || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Block</p>
                    <p className="font-semibold text-gray-900">{recordData?.flat?.block_name || '-'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Project</p>
                    <p className="font-semibold text-gray-900">{recordData?.project?.project_name || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Ageing Details */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Ageing Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(recordData?.booking_date)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Ageing Days</p>
                    <p className="font-semibold text-gray-900">{recordData?.ageing_days ?? '-'} days</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-gray-900 text-lg">{formatAmount(recordData?.total_amount)}</p>
                  </div>
                </div>
              </div>

              {/* Loan Status Section */}
              <div className="px-6 py-4 border-b border-gray-200">
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

                <div className="space-y-1">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Loan Status</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${recordData?.loan_time_days
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : recordData?.loan_Status
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                      {recordData?.loan_time_days ? 'Loan Delayed' : recordData?.loan_Status ? 'Approved' : 'Pending'}
                    </span>
                  </div>

                  <DetailRow label="Bank Name" value={recordData?.bank_name} icon={IconBuildingBank} />
                  <DetailRow label="Agent Name" value={recordData?.agent_name} icon={IconUser} />
                  <DetailRow label="Agent Number" value={recordData?.agent_number} icon={IconPhone} />
                  <DetailRow label="Loan Amount" value={formatAmount(recordData?.loan_amount)} icon={IconCash} />
                </div>
              </div>

              {/* Timestamps */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <p className="mb-0.5">Created At</p>
                    <p className="text-gray-700">{formatDate(recordData?.created_at)}</p>
                  </div>
                  <div>
                    <p className="mb-0.5">Updated At</p>
                    <p className="text-gray-700">{formatDate(recordData?.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Modal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        size="md"
        zIndex={9999}
      >
        <div className="p-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Loan Details</h3>

          <div className="space-y-4">
            {/* Loan Status Toggle */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Loan Status</Label>
              <div className="mt-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setLoanStatus(false)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${!loanStatus
                    ? 'bg-orange-100 text-orange-700 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setLoanStatus(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${loanStatus
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                >
                  Approved
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Bank Name <span className="text-red-500">*</span></Label>
              <Input
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  if (bankNameError) setBankNameError('');
                }}
                placeholder="Enter bank name"
                className={`mt-1 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${bankNameError ? 'border-red-400' : 'border-gray-300'}`}
              />
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
                className={`mt-1 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${agentNameError ? 'border-red-400' : 'border-gray-300'}`}
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
                className={`mt-1 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${agentNumberError ? 'border-red-400' : 'border-gray-300'}`}
              />
              {agentNumberError && <p className="text-red-500 text-xs mt-1">{agentNumberError}</p>}
            </div>

            {/* Loan Amount */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Loan Amount <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => {
                  setLoanAmount(e.target.value);
                  if (loanAmountError) setLoanAmountError('');
                }}
                placeholder="Enter loan amount"
                min="0"
                className={`mt-1 bg-white border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${loanAmountError ? 'border-red-400' : 'border-gray-300'}`}
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
      </Modal>
    </>
  );
};

export default Ageingrecorddetails;
