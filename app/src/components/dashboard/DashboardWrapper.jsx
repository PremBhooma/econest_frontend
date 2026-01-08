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
      <div className="w-full">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 mx-3">
            <p className="font-semibold">Error:</p>
            <p>{errorMessage.message}</p>
          </div>
        )}

        <div className="flex flex-col w-full gap-6">
          <div className='bg-[#fff] px-4 py-3 pb-3 shadow-sm rounded-md'>
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 p-3 w-[100%]">
              <h6 className="text-[20px] 2xl:text-[22px] font-semibold dark:text-white">{greeting}, {employeeInfo?.name || "Abode"}!</h6>
              <h6 className="text-[20px] 2xl:text-[22px] font-semibold dark:text-white">Dashboard</h6>
            </div>
            <div className="space-y-6 w-[100%] pb-3 px-3">
              <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-2">
                {statsCards?.map((card, index) => (
                  <div
                    key={index}
                    className={`card shadow-sm border border-gray-200 dark:border-neutral-600 bg-[#ffffff] rounded-md transition-transform hover:scale-95`}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-neutral-700 dark:text-white mb-1 text-sm 2xl:text-[15px]">
                            {card.title}
                          </p>
                          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            {card.value}
                          </h3>
                        </div>
                        <div className={`w-10 h-10 ${card.iconBg} rounded-full flex justify-center items-center shadow-sm`}>
                          <span className="text-white">{card.icon}</span>
                        </div>
                      </div>
                      <div className={`flex flex-row ${card?.subStats?.length === 3 ? "justify-between" : "gap-4"} pt-3 border-t border-gray-200 dark:border-neutral-600`}>
                        {card?.subStats?.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <span className={stat.color}>{stat.icon}</span>
                              <p className={`text-lg 2xl:text-[20px] font-semibold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <p className="text-[11px] 2xl:text-[12px] text-gray-600 dark:text-gray-400">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <Line options={options} data={data} />; */}
          <div className='flex flex-row w-full'>

            <div className="space-y-6 w-1/2">

              {/* Leads */}
              {permissions?.main_page?.includes("leads_page") && (
                <div className="bg-white dark:bg-neutral-700 rounded-md shadow-sm border border-gray-200 dark:border-neutral-600">
                  <div className="p-4 border-b border-gray-200 dark:border-neutral-600">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      <IconUsers className="text-neutral-700" size={20} />
                      Recent Leads ({dashboardData.customersData.length})
                    </h4>
                  </div>
                  <div className="p-3">
                    {dashboardData.leadsData.length > 0 ? (
                      <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-neutral-200">
                            <tr>
                              {permissions?.leads_page?.includes("view_lead") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">Ref Id</th>
                              )}
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[160px]">Customer</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[140px]">Email</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[160px]">Phone</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px]">Created</th>
                              {permissions?.leads_page?.includes("view_lead") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[70px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">View</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {dashboardData.leadsData.slice(0, 5).map((ele, index) => (
                              <tr key={ele.id} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                {permissions?.leads_page?.includes("view_lead") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 w-[120px] sticky left-0 z-20 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                    <NavLink to={`/lead/${ele.uuid}`} className="hover:text-blue-600">
                                      {ele.uuid}
                                    </NavLink>
                                  </td>
                                )}
                                <td className="py-4 px-4 min-w-[160px]">
                                  {permissions?.leads_page?.includes("view_lead") ? (
                                    <NavLink to={`/lead/${ele.uuid}`}>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                          {ele.full_name?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-xs text-neutral-900">
                                          {ele.prefixes} {ele.full_name}
                                        </span>
                                      </div>
                                    </NavLink>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {ele.full_name?.slice(0, 2).toUpperCase()}
                                      </div>
                                      <span className="font-medium text-xs text-neutral-900">
                                        {ele.prefixes} {ele.full_name}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[140px]">
                                  <NavLink to={`mailto:${ele.email}`} className="hover:text-blue-600">
                                    {ele.email}
                                  </NavLink>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[160px]">
                                  <NavLink
                                    to={`https://wa.me/${ele.phone_code}${ele.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600"
                                  >
                                    +{ele.phone_code} {ele.phone_number}
                                  </NavLink>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[120px]">
                                  {new Date(ele.created_at).toLocaleDateString()}
                                </td>
                                {permissions?.leads_page?.includes("view_lead") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[70px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                    <div
                                      onClick={() => openSingleLead(ele.uuid)}
                                      className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer inline-block"
                                    >
                                      <IconEye size={18} />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No leads found</p>
                    )}
                  </div>
                </div>
              )}

              {/* flats */}
              {permissions?.main_page?.includes("flats_page") && (
                <div className="bg-white dark:bg-neutral-700 rounded-md shadow-sm border border-gray-200 dark:border-neutral-600">
                  <div className="p-4 border-b border-gray-200 dark:border-neutral-600">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Home className="text-purple-600" size={20} />
                      Recent Flats ({dashboardData.flatsData.length})
                    </h4>
                  </div>
                  <div className="p-3">
                    {dashboardData.flatsData.length > 0 ? (
                      <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-neutral-200">
                            <tr>
                              {permissions?.flats_page?.includes("view_flat") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">Ref No</th>
                              )}
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[90px]">Flat No</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[70px]">Floor</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[100px]">Block</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[100px]">Status</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[100px]">Created</th>
                              {permissions?.flats_page?.includes("view_flat") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[70px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">View</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {dashboardData.flatsData.slice(0, 5).map((flat, index) => (
                              <tr key={flat.id} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                {permissions?.flats_page?.includes("view_flat") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 w-[120px] sticky left-0 z-20 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                    <NavLink to={`/flats/view-flat/${flat.uuid}`} className="hover:text-blue-600">
                                      {flat.uuid}
                                    </NavLink>
                                  </td>
                                )}
                                <td className="py-4 px-4 min-w-[90px]">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-purple-100 text-purple-700">
                                      {flat.flat_no}
                                    </div>
                                  </div>
                                  {/* Note: Original code had empty class for w-8 h-8rounded-full, assuming typo fixed */}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[70px]">
                                  {flat.floor_no}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[100px]">
                                  Block {flat.block_id}
                                </td>
                                <td className="py-4 px-4 min-w-[100px]">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${flat.status === 'Sold'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-100'
                                    }`}>
                                    {flat.status}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[100px]">
                                  {new Date(flat.created_at).toLocaleDateString()}
                                </td>
                                {permissions?.flats_page?.includes("view_flat") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[70px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                    <div
                                      onClick={() => openSingleFlat(flat.uuid)}
                                      className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer inline-block"
                                    >
                                      <IconEye size={18} />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No flats found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Customers */}
              {permissions?.main_page?.includes("customers_page") && (
                <div className="bg-white dark:bg-neutral-700 rounded-md shadow-sm border border-gray-200 dark:border-neutral-600">
                  <div className="p-4 border-b border-gray-200 dark:border-neutral-600">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      <IconUsers className="text-neutral-700" size={20} />
                      Recent Customers ({dashboardData.customersData.length})
                    </h4>
                  </div>
                  <div className="p-3">
                    {dashboardData.customersData.length > 0 ? (
                      <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-neutral-200">
                            <tr>
                              {permissions?.customers_page?.includes("view_single_customer") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">Ref Id</th>
                              )}
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[160px]">Customer</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[140px]">Email</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[160px]">Phone</th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px]">Created</th>
                              {permissions?.customers_page?.includes("view_single_customer") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[70px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">View</th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {dashboardData.customersData.slice(0, 5).map((customer, index) => (
                              <tr key={customer.id} className="hover:bg-neutral-50 transition-colors duration-150 align-top group">
                                {permissions?.customers_page?.includes("view_single_customer") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 w-[120px] sticky left-0 z-20 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                    <NavLink to={`/customers/${customer.uuid}`} className="hover:text-blue-600">
                                      {customer.uuid}
                                    </NavLink>
                                  </td>
                                )}
                                <td className="py-4 px-4 min-w-[160px]">
                                  {permissions?.customers_page?.includes("view_single_customer") ? (
                                    <NavLink to={`/customers/${customer.uuid}`}>
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                          {customer.first_name?.[0]}
                                          {customer.last_name?.[0]}
                                        </div>
                                        <span className="font-medium text-xs text-neutral-900">
                                          {customer.prefixes} {customer.first_name} {customer.last_name}
                                        </span>
                                      </div>
                                    </NavLink>
                                  ) : (
                                    <div className="flex items-center gap-3 cursor-not-allowed opacity-60">
                                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                        {customer.first_name?.[0]}
                                        {customer.last_name?.[0]}
                                      </div>
                                      <span className="font-medium text-xs text-neutral-900">
                                        {customer.prefixes} {customer.first_name} {customer.last_name}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[140px]">
                                  <NavLink to={`mailto:${customer.email}`} className="hover:text-blue-600">
                                    {customer.email}
                                  </NavLink>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[160px]">
                                  <NavLink
                                    to={`https://wa.me/${customer.phone_code}${customer.phone_number}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600"
                                  >
                                    +{customer.phone_code} {customer.phone_number}
                                  </NavLink>
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[120px]">
                                  {new Date(customer.created_at).toLocaleDateString()}
                                </td>
                                {permissions?.customers_page?.includes("view_single_customer") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[70px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                    <div
                                      onClick={() => openSingleCustomer(customer.uuid)}
                                      className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer inline-block"
                                    >
                                      <IconEye size={18} />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No customers found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Payments */}
              {permissions?.main_page?.includes("payments_page") && (
                <div className="bg-white dark:bg-neutral-700 rounded-md shadow-sm border border-gray-200 dark:border-neutral-600">
                  <div className="p-4 border-b border-gray-200 dark:border-neutral-600">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      <IconCash className="text-neutral-700" size={20} />
                      Recent Payments ({dashboardData.paymentsData.length})
                    </h4>
                  </div>
                  <div className="p-3">
                    {dashboardData.paymentsData.length > 0 ? (
                      <div className="w-full relative overflow-x-auto border border-neutral-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-gray-50 border-b border-neutral-200">
                            <tr>
                              {permissions?.payments_page?.includes("view_payment") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px] sticky left-0 z-20 bg-gray-50 border-r border-neutral-200">
                                  Ref Id
                                </th>
                              )}
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[80px]">
                                Flat No
                              </th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[150px]">
                                Customer Name
                              </th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[100px]">
                                Block Name
                              </th>
                              <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[120px]">
                                Amount
                              </th>
                              {permissions?.payments_page?.includes("view_payment") && (
                                <th className="py-3 px-4 font-bold text-sm text-neutral-700 uppercase tracking-wider min-w-[70px] sticky right-0 z-20 bg-gray-50 border-l border-neutral-200">
                                  View
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {dashboardData.paymentsData.slice(0, 5).map((payment, index) => (
                              <tr
                                key={payment?.id || index}
                                className="hover:bg-neutral-50 transition-colors duration-150 align-top group"
                              >
                                {permissions?.payments_page?.includes("view_payment") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 w-[120px] sticky left-0 z-20 bg-white group-hover:bg-neutral-50 border-r border-neutral-200">
                                    <NavLink to={`/singlepaymentview/${payment?.uuid}`} className="hover:text-blue-600">
                                      {payment?.uuid ?? "---"}
                                    </NavLink>
                                  </td>
                                )}
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[80px]">
                                  {payment?.flat_no ?? "---"}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[150px]">
                                  {`${payment.customer_prefixes} ${payment.customer_name}` || "----"}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[100px]">
                                  {payment?.block_name ?? "---"}
                                </td>
                                <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[120px]">
                                  {payment?.amount != null ? `₹${payment.amount}` : "---"}
                                </td>
                                {permissions?.payments_page?.includes("view_payment") && (
                                  <td className="py-4 px-4 text-xs font-medium text-neutral-600 min-w-[70px] sticky right-0 z-20 bg-white group-hover:bg-neutral-50 border-l border-neutral-200">
                                    <div
                                      onClick={() => openSingleFlatView(payment.uuid)}
                                      className="p-1 hover:bg-blue-50 rounded-md transition-colors text-neutral-500 hover:text-blue-600 cursor-pointer inline-block"
                                    >
                                      <IconEye size={18} />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No payments found</p>
                    )}
                  </div>
                </div>
              )}

              {employeeInfo?.role_name === "Super Admin" && (
                <div className="bg-white dark:bg-neutral-700 rounded-md shadow-sm border border-gray-200 dark:border-neutral-600">
                  <div className="p-4 border-b border-gray-200 dark:border-neutral-600">
                    <h4 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                      <IconIdBadge2 className="text-neutral-700" size={20} />
                      Recent Employees ({dashboardData.employeesData.length})
                    </h4>
                  </div>
                  <div className="p-3">
                    {dashboardData.employeesData.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-4">
                        {dashboardData.employeesData.slice(0, 5).map((employee, index) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-600 rounded-lg">
                            <div>
                              <a href={`/single-employee-view/${employee.id}`} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {employee.name?.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                                </div>
                                <div>
                                  <p className="font-medium text-neutral-900 dark:text-white">{employee.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{employee.email}</p>
                                </div>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">No employees found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className='flex flex-col w-1/2 pl-4 gap-6 '>
              {permissions?.main_page?.includes("flats_page") && (
                <Flatschart />
              )}
              {permissions?.main_page?.includes("customers_page") && (
                <Customerschart />
              )}
              {permissions?.main_page?.includes("payments_page") && (
                <Paymentchart />
              )}
            </div>
          </div>
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
