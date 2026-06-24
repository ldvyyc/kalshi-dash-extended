'use client';

import React, { useMemo } from 'react';
import { MatchedTrade } from '@/utils/processData';

interface MonthlyPnlHeatmapProps {
  matchedTrades: MatchedTrade[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MonthlyPnlHeatmap({ matchedTrades }: MonthlyPnlHeatmapProps) {
  const { grid, years, maxAbs } = useMemo(() => {
    // Accumulate PnL per (year, month)
    const map: Record<string, number> = {};
    matchedTrades.forEach(t => {
      const d = new Date(t.Exit_Date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map[key] = (map[key] || 0) + t.Net_Profit;
    });

    const years = Array.from(
      new Set(matchedTrades.map(t => new Date(t.Exit_Date).getFullYear()))
    ).sort();

    const allValues = Object.values(map);
    const maxAbs = allValues.length ? Math.max(...allValues.map(Math.abs)) : 1;

    // Build grid[year][month]
    const grid: Record<number, Record<number, number | null>> = {};
    years.forEach(y => {
      grid[y] = {};
      MONTHS.forEach((_, m) => {
        grid[y][m] = map[`${y}-${m}`] ?? null;
      });
    });

    return { grid, years, maxAbs };
  }, [matchedTrades]);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(v);

  const cellColor = (v: number | null): string => {
    if (v === null) return 'bg-gray-100 text-gray-400';
    const intensity = Math.min(Math.abs(v) / maxAbs, 1);
    const alpha = Math.round(intensity * 180 + 40); // 40-220
    if (v >= 0) return `text-green-900`;
    return `text-red-900`;
  };

  const cellStyle = (v: number | null): React.CSSProperties => {
    if (v === null) return { backgroundColor: '#f3f4f6' };
    const intensity = Math.min(Math.abs(v) / maxAbs, 1);
    if (v >= 0) {
      const g = Math.round(255 - intensity * 180);
      return { backgroundColor: `rgb(${Math.round(255 - intensity * 60)}, ${g}, ${Math.round(255 - intensity * 180)})` };
    } else {
      const r = Math.round(255 - intensity * 20);
      return { backgroundColor: `rgb(${r}, ${Math.round(255 - intensity * 200)}, ${Math.round(255 - intensity * 200)})` };
    }
  };

  if (years.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Monthly P&L Heatmap</h2>
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-gray-500 font-medium w-12">Year</th>
              {MONTHS.map(m => (
                <th key={m} className="p-2 text-center text-gray-500 font-medium">{m}</th>
              ))}
              <th className="p-2 text-center text-gray-500 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {years.map(year => {
              const yearTotal = MONTHS.reduce((sum, _, m) => sum + (grid[year][m] ?? 0), 0);
              return (
                <tr key={year}>
                  <td className="p-2 font-semibold text-gray-700">{year}</td>
                  {MONTHS.map((_, m) => {
                    const v = grid[year][m];
                    return (
                      <td
                        key={m}
                        className={`p-2 text-center font-medium rounded transition-all ${cellColor(v)}`}
                        style={{ ...cellStyle(v), minWidth: 64 }}
                        title={v !== null ? fmt(v) : 'No trades'}
                      >
                        {v !== null ? fmt(v) : '—'}
                      </td>
                    );
                  })}
                  <td
                    className={`p-2 text-center font-bold rounded ${yearTotal >= 0 ? 'text-green-700' : 'text-red-700'}`}
                    style={cellStyle(yearTotal)}
                  >
                    {fmt(yearTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-400">Color intensity reflects relative magnitude within your trading history.</p>
      </div>
    </div>
  );
}
