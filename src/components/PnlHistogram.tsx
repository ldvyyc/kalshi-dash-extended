'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MatchedTrade } from '@/utils/processData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PnlHistogramProps {
  matchedTrades: MatchedTrade[];
}

export default function PnlHistogram({ matchedTrades }: PnlHistogramProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!matchedTrades || matchedTrades.length === 0) return;

    const profits = matchedTrades.map(t => t.Net_Profit);
    const min = Math.min(...profits);
    const max = Math.max(...profits);
    const binCount = Math.min(20, Math.ceil(Math.sqrt(profits.length)));
    const binSize = (max - min) / binCount;

    const bins: number[] = Array(binCount).fill(0);
    profits.forEach(p => {
      const idx = Math.min(Math.floor((p - min) / binSize), binCount - 1);
      bins[idx]++;
    });

    const labels = Array.from({ length: binCount }, (_, i) => {
      const lo = min + i * binSize;
      const hi = lo + binSize;
      return `$${lo.toFixed(1)} – $${hi.toFixed(1)}`;
    });

    const colors = bins.map((_, i) => {
      const midpoint = min + (i + 0.5) * binSize;
      return midpoint >= 0
        ? 'rgba(34, 197, 94, 0.7)'
        : 'rgba(239, 68, 68, 0.7)';
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Trade Count',
          data: bins,
          backgroundColor: colors,
          borderColor: colors.map(c => c.replace('0.7', '1')),
          borderWidth: 1,
        },
      ],
    });
  }, [matchedTrades]);

  if (!chartData) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Return Distribution</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <div style={{ height: '320px' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Distribution of Net P&L per Trade',
                  font: { size: 14 },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.parsed.y} trades`,
                  },
                },
              },
              scales: {
                x: {
                  ticks: { maxRotation: 45, minRotation: 30, font: { size: 10 } },
                },
                y: {
                  beginAtZero: true,
                  title: { display: true, text: '# Trades' },
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
