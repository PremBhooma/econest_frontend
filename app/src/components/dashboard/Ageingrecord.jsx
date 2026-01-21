import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconClock } from '@tabler/icons-react';
import Ageingrecordapi from '../api/Ageingrecordapi';

const Ageingrecord = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgeingRecords();
  }, []);

  const fetchAgeingRecords = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await Ageingrecordapi.get('get-ageing-records?limit=10');
      if (response.data.status === 'success') {
        setRecords(response.data.records || []);
      } else {
        setError(response.data.message || 'Failed to fetch records');
      }
    } catch (err) {
      console.error('Error fetching ageing records:', err);
      setError(err.message || 'Failed to fetch ageing records');
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerView = (uuid) => {
    if (uuid) navigate(`/customers/${uuid}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <IconClock className="text-amber-600" size={18} />
            Ageing Records
          </h4>
        </div>
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-neutral-400 text-sm">Loading records...</p>
        </div>
      </div>
    );
  }

  console.log("records", records);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
        <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
          <IconClock className="text-amber-600" size={18} />
          Ageing Records
        </h4>
        <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
          {records.length} Records
        </span>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        {records.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Flat Details</th>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Booking Date</th>
                <th className="px-6 py-3">Total Payment</th>
                <th className="px-6 py-3">Loan Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {records.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                        {record.customer?.first_name?.[0]}{record.customer?.last_name?.[0] || ''}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {record.customer?.first_name} {record.customer?.last_name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          +{record.customer?.phone_code} {record.customer?.phone_number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold border border-purple-100">
                        {record.flat?.flat_no || '-'}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-xs">
                          {record.flat?.block_name || 'N/A'}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Floor {record.flat?.floor_no || '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-neutral-700 text-xs">
                    {record.project?.project_name || '-'}
                  </td>
                  <td className="px-6 py-3.5 text-neutral-500 text-xs text-nowrap">
                    {formatDate(record.booking_date)}
                  </td>
                  <td className="px-6 py-3.5 text-neutral-500 text-xs text-nowrap">
                    {record.total_amount}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.loan_Status
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-orange-50 text-orange-700 border border-orange-100'
                      }`}>
                      {record.loan_Status === true ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => openCustomerView(record.customer?.uuid)}
                      className="p-1.5 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-all"
                    >
                      <IconEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-neutral-400 text-sm">
            No ageing records found
          </div>
        )}
      </div>
    </div>
  );
};

export default Ageingrecord;
