export const chartColors = {
  brand: 'rgba(99, 102, 241, 0.8)',
  brandLight: 'rgba(99, 102, 241, 0.2)',
  emerald: 'rgba(16, 185, 129, 0.8)',
  amber: 'rgba(245, 158, 11, 0.8)',
  rose: 'rgba(244, 63, 94, 0.8)',
  purple: 'rgba(168, 85, 247, 0.8)',
  cyan: 'rgba(6, 182, 212, 0.8)',
};

export const palette = [
  chartColors.brand,
  chartColors.emerald,
  chartColors.amber,
  chartColors.rose,
  chartColors.purple,
  chartColors.cyan,
];

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter' },
      },
    },
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
    },
    y: {
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
    },
  },
};
