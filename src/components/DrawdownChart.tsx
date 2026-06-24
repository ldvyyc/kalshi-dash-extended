'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { MatchedTrade } from '@/utils/processData';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

interface DrawdownChartProps {
  matchedTrades: MatchedTrade[];
}

export default function DrawdownChart({ matchedTrades }: DrawdownChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [maxDrawdown, setMaxDrawdown] = useState<number>(0);

  useEffect(() => {
    if (!matchedTrades || matchedTrades.length === 0) return;

    const sorted = [...matchedTrades].sort(
      (a, b) => new Date(a.Exit_Date).getTime() - new Date(b.Exit_Date).getTime()
    );

    let cumPnl = 0;
    let peak = 0;
    let maxDD = 0;

    const points: { x: number; y: number }[] = [{ x: new Date(sorted[0].Exit_Date).getTime() - 86400000, y: 0 }];

    sorted.forEach(t => {
      cumPnl += t.Net_Profit;
      if (cumPnl > peak) peak = cumPnl;
      const dd = peak > 0 ? ((cumPnl - peak) / peak) * 100 : 0;
      if (dd < maxDD) maxDD = dd;
      points.push({ x: new Date(t.Exit_Date).getTime(), y: dd });
    });

    setMaxDrawdown(maxDD);
    setChartData({
      datasets: [
        {
          label: 'Drawdown (%)',
          data: points,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    });
  }, [matchedTrades]);

  if (!chartData) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Drawdown Over Time
        <span className="ml-3 text-base font-normal text-red-500">
          Max Drawdown: {maxDrawdown.toFixed(2)}%
        </span>
      </h2>
      <div className="bg-white shadow rounded-lg p-4">
        <div style={{ height: '280px' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: 'Drawdown from Peak Cumulative P&L (%)',
                  font: { size: 14 },
                },
                tooltip: {
                  callbacks: {
                    title: (ctx) => new Date(ctx[0].parsed.x).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    label: (ctx) => `Drawdown: ${ctx.parsed.y.toFixed(2)}%`,
                  },
                },
              },
              scales: {
                x: {
                  type: 'time',
                  time: { unit: 'day', displayFormats: { day: 'MMM d' } },
                  adapters: { date: Date },
                  ticks: { maxRotation: 45, minRotation: 45 },
                },
                y: {
                  ticks: {
                    callback: (v) => `${Number(v).toFixed(1)}%`,
                  },
                  grid: { color: 'rgba(0,0,0,0.07)' },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
