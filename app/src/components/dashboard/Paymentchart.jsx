import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Dashboardapi from '../api/Dashboardapi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Chart options
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Payments Chart',
    },
  },
};

const labels = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Paymentchart = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate year options (2020 to 2030)
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  useEffect(() => {
    fetchPaymentsDashboardData(selectedYear);
  }, [selectedYear]);

  const fetchPaymentsDashboardData = async (year) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await Dashboardapi.get(`get-payments-dashboard-data?year=${year}`);
      const data = response.data;

      if (data.status === 'error') {
        setErrorMessage(data.message || 'Error fetching data');
      } else {
        const monthlyAmounts = data.monthlyPayments || []; // Expected format: [0, 20000, 30000, ...] (length 12)
        setChartData({
          labels,
          datasets: [
            {
              fill: true,
              label: `Payments in ${year}`,
              data: monthlyAmounts,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setErrorMessage(error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-md bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Payment Chart</h2>
        <select
          className="border rounded p-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p>Loading chart...</p>}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {chartData && <Line options={options} data={chartData} />}
    </div>
  );
};

export default Paymentchart;
