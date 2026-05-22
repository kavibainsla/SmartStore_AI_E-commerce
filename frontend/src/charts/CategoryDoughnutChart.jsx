import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { palette } from './chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export const CategoryDoughnutChart = ({ categoryBreakdown = [] }) => {
  const data = {
    labels: categoryBreakdown.map((c) => c.category),
    datasets: [
      {
        data: categoryBreakdown.map((c) => c.revenue),
        backgroundColor: palette,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, padding: 12 },
      },
    },
  };

  return (
    <div className="h-72">
      <Doughnut data={data} options={options} />
    </div>
  );
};
