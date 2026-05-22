import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { palette, defaultChartOptions } from './chartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const SalesBarChart = ({ monthlyData = [] }) => {
  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Orders',
        data: monthlyData.map((d) => d.orders),
        backgroundColor: palette,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="h-72">
      <Bar data={data} options={defaultChartOptions} />
    </div>
  );
};
