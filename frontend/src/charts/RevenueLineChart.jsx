import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { chartColors, defaultChartOptions } from './chartConfig';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const RevenueLineChart = ({ monthlyData = [] }) => {
  const data = {
    labels: monthlyData.map((d) => `${d.month} ${d.year}`),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyData.map((d) => d.revenue),
        borderColor: chartColors.brand,
        backgroundColor: chartColors.brandLight,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Sales',
        data: monthlyData.map((d) => d.sales),
        borderColor: chartColors.emerald,
        backgroundColor: 'transparent',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="h-72">
      <Line data={data} options={{ ...defaultChartOptions, plugins: { ...defaultChartOptions.plugins, title: { display: false } } }} />
    </div>
  );
};
