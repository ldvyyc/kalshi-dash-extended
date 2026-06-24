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

interface WeeklyPnlBarProps {
  matchedTrades: MatchedTrade[];
}

const getWeekLabel = (date: Date): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday of that week
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
};

export default function WeeklyPnlBar({ matchedTrades }: WeeklyPnlBarProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!matchedTrades || matchedTrades.length === 0) return;

    const weekMap: Record<string, number> = {};
    const weekDates: Record<string, number> = {};

    matchedTrades.forEach(t => {
      const d = new Date(t.Exit_Date);
      const label = getWeekLabel(d);
      weekMap[label] = (weekMap[label] || 0) + t.Net_Profit;
      // Track for sorting
      if (!weekDates[label]) weekDates[label] = d.getTime();
    });

    const sorted = Object.entries(weekMap).sort(
      ([la], [lb]) => (weekDates[la] - weekDates[lb])
    );

    const labels = sorted.map(([l]) => l);
    const values = sorted.map(([, v]) => v);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Weekly Net P&L ($)',
          data: values,
          backgroundColor: values.map(v => v >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
          borderColor: values.map(v => v >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'),
          borderWidth: 1,
        },
      ],
    });
  }, [matchedTrades]);

  if (!chartData) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Weekly P&L</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <div style={{ height: '300px' }}>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Net P&L by Week', font: { size: 14 } },
                tooltip: {
                  callbacks: { label: (ctx) => fmt(ctx.parsed.y) },
                },
              },
              scales: {
                x: { ticks: { maxRotation: 45, font: { size: 10 } } },
                y: {
                  ticks: { callback: (v) => fmt(Number(v)) },
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
