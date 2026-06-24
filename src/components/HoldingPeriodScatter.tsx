'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { MatchedTrade } from '@/utils/processData';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

interface HoldingPeriodScatterProps {
  matchedTrades: MatchedTrade[];
}

export default function HoldingPeriodScatter({ matchedTrades }: HoldingPeriodScatterProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (!matchedTrades || matchedTrades.length === 0) return;

    const wins = matchedTrades
      .filter(t => t.Net_Profit > 0)
      .map(t => ({ x: t.Holding_Period_Days, y: t.Net_Profit, ticker: t.Ticker }));

    const losses = matchedTrades
      .filter(t => t.Net_Profit <= 0)
      .map(t => ({ x: t.Holding_Period_Days, y: t.Net_Profit, ticker: t.Ticker }));

    setChartData({
      datasets: [
        {
          label: 'Wins',
          data: wins,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Losses',
          data: losses,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    });
  }, [matchedTrades]);

  if (!chartData) return null;

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Holding Period vs. P&L</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <div style={{ height: '340px' }}>
          <Scatter
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Holding Days vs Net P&L',
                  font: { size: 14 },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => {
                      const raw = ctx.raw as any;
                      return `${raw.ticker}: ${fmt(raw.y)} (${raw.x.toFixed(1)} days)`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Holding Period (days)' },
                  beginAtZero: true,
                },
                y: {
                  title: { display: true, text: 'Net P&L ($)' },
                  ticks: {
                    callback: (v) => fmt(Number(v)),
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
