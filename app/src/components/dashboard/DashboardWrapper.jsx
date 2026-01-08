import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';
import { Bar, Line } from 'react-chartjs-2';
import { NavLink, useNavigate } from 'react-router-dom';
import { useProjectDetails } from '../zustand/useProjectDetails';
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import { Datepicker, Modal, Select } from '@nayeshdaggula/tailify';
import { IconCash, IconCreditCardPay, IconEye, IconIdBadge2, IconUsers, IconUsersGroup } from '@tabler/icons-react';
import { Users, User, Home, UserCheck, UserMinus, UserX, CheckCircle, XCircle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Filler, Tooltip, Legend } from 'chart.js';
import Flatschart from './Flatschart';
import Paymentchart from './Paymentchart';
import Customerschart from './Customerschart';
import Dashboardapi from '../api/Dashboardapi';
import AssignProject from '../shared/AssignProject';

ChartJS.register(CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: labels.map(() => faker.number.int()),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

function DashboardWrapper() {

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  const [dashboardData, setDashboardData] = useState({
    totalFlats: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    totalPayments: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    suspendedCustomers: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    suspendedEmployees: 0,
    soldFlats: 0,
    unsoldFlats: 0,
    totalLeads: 0,
    assignedLeads: 0,
    unassignedLeads: 0,
    flatsData: [],
    customersData: [],
    employeesData: [],
    paymentsData: [],
    leadsData: [],
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const permissions = useEmployeeDetails((state) => state.permissions);

  const { projectData, hasFetched, fetchProjectData } = useProjectDetails();
  const [projectModel, setProjectModel] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Default to current year (2025)

  const openProjectModel = () => setProjectModel(true);
  const closeProjectModel = () => setProjectModel(false);

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

  const fetchGetAllData = () => {
    setIsLoadingEffect(true);
    setErrorMessage('');
    const url = `get-dashboard-data`;

    Dashboardapi.get(url)
      .then((response) => {
        const data = response.data;

        if (data.status === 'error') {
          setErrorMessage({
            message: data.message,
            server_res: data,
          });
          setIsLoadingEffect(false);
          return;
        }

        if (data?.adobe_data) {
          const apiData = data.adobe_data;
          setDashboardData({
            totalFlats: apiData.total_flats || 0,
            totalCustomers: apiData.total_customers || 0,
            totalEmployees: apiData.total_employees || 0,
            totalPayments: apiData.total_payments || 0,
            activeCustomers: apiData.active_customers || 0,
            inactiveCustomers: apiData.inactive_customers || 0,
            suspendedCustomers: apiData.suspended_customers || 0,
            activeEmployees: apiData.active_employees || 0,
            inactiveEmployees: apiData.inactive_employees || 0,
            suspendedEmployees: apiData.suspended_employees || 0,
            soldFlats: apiData.sold_flats || 0,
            unsoldFlats: apiData.unsold_flats || 0,
            totalLeads: apiData.total_leads || 0,
            assignedLeads: apiData.assigned_leads || 0,
            unassignedLeads: apiData.unassigned_leads || 0,
            flatsData: apiData.flatsData || [],
            customersData: apiData.customersData || [],
            employeesData: apiData.employeesData || [],
            paymentsData: apiData.payment_details || [],
            leadsData: apiData.leads_details || [],
          });
        }
        setIsLoadingEffect(false);
      })
      .catch((error) => {
        console.log('Fetch dashboard error:', error);
        setErrorMessage({
          message: error.message,
          server_res: error.response?.data || null,
        });
        setIsLoadingEffect(false);
      });
  };

  useEffect(() => {
    fetchGetAllData();
  }, []);

  const openSingleFlatView = (uuid) => navigate(`/singlepaymentview/${uuid}`);
  const openSingleCustomer = (uuid) => navigate(`/customers/${uuid}`);
  const openSingleLead = (uuid) => navigate(`/lead/${uuid}`);
  const openSingleFlat = (uuid) => navigate(`/flats/view-flat/${uuid}`);

  // Generate years for the dropdown (2020 to 2040)
  const years = Array.from({ length: 21 }, (_, i) => 2020 + i).map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  // Process data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Payments Chart Data
  const paymentData = months.map(() => 0);
  dashboardData.paymentsData.forEach(payment => {
    // Link payment to flat's created_at or use a fallback date
    const flat = dashboardData.flatsData.find(f => f.flat_no === payment.flat_no);
    const date = new Date(flat?.created_at || '2025-08-01'); // Fallback to Aug 2025 if no flat match
    if (date.getFullYear().toString() === selectedYear) {
      const monthIndex = date.getMonth();
      paymentData[monthIndex] += payment.amount || 0;
    }
  });

  const paymentsChartData = {
    labels: months,
    datasets: [{
      label: 'Payments (₹)',
      data: paymentData,
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    }]
  };

  // Customers Chart Data
  const customerData = months.map(() => 0);
  dashboardData.customersData.forEach(customer => {
    const date = new Date(customer.created_at);
    if (date.getFullYear().toString() === selectedYear) {
      customerData[date.getMonth()] += 1;
    }
  });

  const customersChartData = {
    labels: months,
    datasets: [{
      label: 'Customers',
      data: customerData,
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }]
  };

  // Flats Chart Data
  const flatsData = months.map(() => 0);
  dashboardData.flatsData.forEach(flat => {
    const date = new Date(flat.created_at);
    if (date.getFullYear().toString() === selectedYear) {
      flatsData[date.getMonth()] += 1;
    }
  });

  const flatsChartData = {
    labels: months,
    datasets: [{
      label: 'Flats',
      data: flatsData,
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = (title, yAxisLabel, yMin, yMax) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title, font: { size: 16 } },
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: {
        title: { display: true, text: yAxisLabel },
        min: yMin,
        max: yMax,
        ticks: {
          callback: (value) => {
            if (yAxisLabel === 'Amount (₹)') {
              return value >= 10000000 ? `${(value / 10000000).toFixed(1)}Cr` : `${(value / 100000).toFixed(1)}L`;
            }
            return value;
          }
        }
      }
    }
  });

  const statsCards = [
    {
      title: 'Total Leads',
      value: dashboardData.totalLeads,
      icon: <IconUsersGroup size={20} />,
      bgColor: 'from-blue-600/10 to-blue-50',
      iconBg: 'bg-orange-300',
      subStats: [
        { label: 'Assigned Leads', value: dashboardData.assignedLeads, color: 'text-green-600', icon: <CheckCircle size={14} /> },
        { label: 'Unassigned Leads', value: dashboardData.unassignedLeads, color: 'text-orange-600', icon: <XCircle size={14} /> },
      ]
    },
    {
      title: 'Total Flats',
      value: dashboardData.totalFlats,
      icon: <Home size={20} />,
      bgColor: 'from-purple-600/10 to-purple-50',
      iconBg: 'bg-purple-300',
      subStats: [
        { label: 'Sold', value: dashboardData.soldFlats, color: 'text-green-600', icon: <CheckCircle size={14} /> },
        { label: 'Unsold', value: dashboardData.unsoldFlats, color: 'text-orange-600', icon: <XCircle size={14} /> }
      ]
    },
    {
      title: 'Total Customers',
      value: dashboardData.totalCustomers,
      icon: <Users size={20} />,
      bgColor: '#ffffff',
      iconBg: 'bg-cyan-300',
      subStats: [
        { label: 'Active', value: dashboardData.activeCustomers, color: 'text-green-600', icon: <UserCheck size={14} /> },
        { label: 'Inactive', value: dashboardData.inactiveCustomers, color: 'text-gray-600', icon: <UserMinus size={14} /> },
        { label: 'Suspended', value: dashboardData.suspendedCustomers, color: 'text-red-600', icon: <UserX size={14} /> }
      ]
    },
    {
      title: 'Total Employees',
      value: dashboardData.totalEmployees,
      icon: <User size={20} />,
      bgColor: 'from-blue-600/10 to-blue-50',
      iconBg: 'bg-blue-300',
      subStats: [
        { label: 'Active', value: dashboardData.activeEmployees, color: 'text-green-600', icon: <UserCheck size={14} /> },
        { label: 'Inactive', value: dashboardData.inactiveEmployees, color: 'text-gray-600', icon: <UserMinus size={14} /> },
        { label: 'Suspended', value: dashboardData.suspendedEmployees, color: 'text-red-600', icon: <UserX size={14} /> }
      ]
    },
    {
      title: 'Total Payments',
      value: dashboardData.totalPayments,
      icon: <IconCreditCardPay size={20} />,
      bgColor: 'from-cyan-600/10 to-cyan-50',
      iconBg: 'bg-cyan-300',
    }
  ];

  if (isLoadingEffect) {
    return (
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 p-3">
          <h6 className="text-[18px] font-semibold dark:text-white">Dashboard</h6>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-14 w-16 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-8">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <XCircle size={18} />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{errorMessage.message}</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard</h1>
            <p className="text-neutral-500 mt-1">{greeting}, {employeeInfo?.name || "User"}!</p>
          </div>
          {/* Action Buttons could go here */}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statsCards?.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">{card.title}</p>
                  <h3 className="text-2xl font-bold text-neutral-900">{card.value}</h3>
                </div>
                <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                  {card.icon}
                </div>
              </div>
              {/* Sub-stats with clearer visual hierarchy */}
              {card.subStats && (
                <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2">
                  {card.subStats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className={stat.color}>{stat.icon}</span>
                        <span className={`text-base font-semibold ${stat.color}`}>{stat.value}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium mt-0.5">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section - Full Width Row */}
        <div className="grid grid-cols-1 ml-0 lg:grid-cols-3 gap-6">
          {permissions?.main_page?.includes("flats_page") && (
            <div className="col-span-1">
              <Flatschart />
            </div>
          )}
          {permissions?.main_page?.includes("customers_page") && (
            <div className="col-span-1">
              <Customerschart />
            </div>
          )}
          {permissions?.main_page?.includes("payments_page") && (
            <div className="col-span-1">
              <Paymentchart />
            </div>
          )}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Leads Table */}
          {permissions?.main_page?.includes("leads_page") && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                  <IconUsersGroup className="text-blue-600" size={18} />
                  Recent Leads
                </h4>
                <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{dashboardData.leadsData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.leadsData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.leadsData.slice(0, 5).map((ele) => (
                        <tr key={ele.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {ele.full_name?.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{ele.prefixes} {ele.full_name}</p>
                                <p className="text-xs text-neutral-500">{ele.uuid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-900 mb-0.5">+{ele.phone_code} {ele.phone_number}</span>
                              <a href={`mailto:${ele.email}`} className="text-neutral-500 hover:text-blue-600 truncate max-w-[120px]">{ele.email}</a>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-neutral-500 text-xs text-nowrap">
                            {new Date(ele.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button onClick={() => openSingleLead(ele.uuid)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent leads</div>
                )}
              </div>
            </div>
          )}

          {/* Flats Table */}
          {permissions?.main_page?.includes("flats_page") && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                  <Home className="text-purple-600" size={18} />
                  Recent Flats
                </h4>
                <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">{dashboardData.flatsData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.flatsData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3">Flat Details</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.flatsData.slice(0, 5).map((flat) => (
                        <tr key={flat.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold border border-purple-100">
                                {flat.flat_no}
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900 text-xs">Block {flat.block_id}</p>
                                <p className="text-[11px] text-neutral-500">Floor {flat.floor_no}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${flat.status === 'Sold'
                              ? 'bg-green-50 text-green-700 border border-green-100'
                              : 'bg-orange-50 text-orange-700 border border-orange-100'
                              }`}>
                              {flat.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-neutral-500 text-xs text-nowrap">
                            {new Date(flat.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button onClick={() => openSingleFlat(flat.uuid)} className="p-1.5 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent flats</div>
                )}
              </div>
            </div>
          )}

          {/* Customers Table */}
          {permissions?.main_page?.includes("customers_page") && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                  <IconUsers className="text-teal-600" size={18} />
                  Recent Customers
                </h4>
                <span className="text-xs font-medium bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">{dashboardData.customersData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.customersData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Contact</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.customersData.slice(0, 5).map((customer) => (
                        <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">
                                {customer.first_name?.[0]}{customer.last_name?.[0]}
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{customer.prefixes} {customer.first_name} {customer.last_name}</p>
                                <p className="text-xs text-neutral-500">{customer.uuid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex flex-col text-xs">
                              <span className="text-neutral-900 mb-0.5">+{customer.phone_code} {customer.phone_number}</span>
                              <a href={`mailto:${customer.email}`} className="text-neutral-500 hover:text-teal-600 truncate max-w-[120px]">{customer.email}</a>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-neutral-500 text-xs text-nowrap">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button onClick={() => openSingleCustomer(customer.uuid)} className="p-1.5 text-neutral-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent customers</div>
                )}
              </div>
            </div>
          )}

          {/* Payments Table */}
          {permissions?.main_page?.includes("payments_page") && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <h4 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                  <IconCash className="text-green-600" size={18} />
                  Recent Payments
                </h4>
                <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">{dashboardData.paymentsData.length} New</span>
              </div>
              <div className="overflow-x-auto">
                {dashboardData.paymentsData.length > 0 ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Details</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {dashboardData.paymentsData.slice(0, 5).map((payment) => (
                        <tr key={payment.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                ₹
                              </div>
                              <div>
                                <p className="font-medium text-neutral-900">{payment.customer_prefixes} {payment.customer_name}</p>
                                <p className="text-xs text-neutral-500">{payment.uuid}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-xs">
                            <p className="font-medium text-neutral-700">Flat {payment.flat_no}</p>
                            <p className="text-neutral-500">{payment.block_name}</p>
                          </td>
                          <td className="px-6 py-3.5 text-sm font-semibold text-neutral-900">
                            ₹{payment.amount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <button onClick={() => openSingleFlatView(payment.uuid)} className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all">
                              <IconEye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-8 text-center text-neutral-400 text-sm">No recent payments</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>



      <Modal
        open={projectModel}
        onClose={closeProjectModel}
        size="lg"
        zIndex={9999}
        withCloseButton={false}
      >
        {projectModel === true && (
          <AssignProject closeProjectModel={closeProjectModel} />
        )}
      </Modal>
    </>
  );
}

export default DashboardWrapper;
