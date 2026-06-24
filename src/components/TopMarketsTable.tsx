'use client';

import React, { useMemo, useState } from 'react';
import { MatchedTrade } from '@/utils/processData';

interface TopMarketsTableProps {
  matchedTrades: MatchedTrade[];
}

interface MarketStat {
  ticker: string;
  trades: number;
  totalPnl: number;
  totalRisked: number;
  roi: number;
  winRate: number;
  avgHoldDays: number;
}

export default function TopMarketsTable({ matchedTrades }: TopMarketsTableProps) {
  const [sortKey, setSortKey] = useState<keyof MarketStat>('totalPnl');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showAll, setShowAll] = useState(false);

  const stats = useMemo(() => {
    const map: Record<string, MarketStat> = {};
    matchedTrades.forEach(t => {
      if (!map[t.Ticker]) {
        map[t.Ticker] = { ticker: t.Ticker, trades: 0, totalPnl: 0, totalRisked: 0, roi: 0, winRate: 0, avgHoldDays: 0 };
      }
      const s = map[t.Ticker];
      s.trades++;
      s.totalPnl += t.Net_Profit;
      s.totalRisked += t.Entry_Cost;
      s.avgHoldDays += t.Holding_Period_Days;
      if (t.Net_Profit > 0) s.winRate++;
    });

    return Object.values(map).map(s => ({
      ...s,
      roi: s.totalRisked > 0 ? (s.totalPnl / s.totalRisked) * 100 : 0,
      winRate: s.trades > 0 ? (s.winRate / s.trades) * 100 : 0,
      avgHoldDays: s.trades > 0 ? s.avgHoldDays / s.trades : 0,
    }));
  }, [matchedTrades]);

  const sorted = useMemo(() => {
    return [...stats].sort((a, b) => {
      const diff = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === 'desc' ? -diff : diff;
    });
  }, [stats, sortKey, sortDir]);

  const displayed = showAll ? sorted : sorted.slice(0, 15);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(v);

  const handleSort = (key: keyof MarketStat) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }: { col: keyof MarketStat }) =>
    sortKey === col ? (
      <span className="ml-1">{sortDir === 'desc' ? '▼' : '▲'}</span>
    ) : (
      <span className="ml-1 text-gray-300">⇅</span>
    );

  const cols: { key: keyof MarketStat; label: string }[] = [
    { key: 'ticker', label: 'Ticker' },
    { key: 'trades', label: 'Trades' },
    { key: 'totalPnl', label: 'Net P&L' },
    { key: 'roi', label: 'ROI (%)' },
    { key: 'winRate', label: 'Win %' },
    { key: 'totalRisked', label: 'Capital Risked' },
    { key: 'avgHoldDays', label: 'Avg Hold (days)' },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Per-Market Performance</h2>
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {cols.map(c => (
                <th
                  key={c.key}
                  className="py-2 px-3 text-left font-medium text-gray-500 cursor-pointer hover:text-gray-800 whitespace-nowrap"
                  onClick={() => handleSort(c.key)}
                >
                  {c.label}<SortIcon col={c.key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((s, i) => (
              <tr key={s.ticker} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-3 font-mono text-xs text-gray-700">{s.ticker}</td>
                <td className="py-2 px-3 text-center">{s.trades}</td>
                <td className={`py-2 px-3 font-semibold ${s.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {fmt(s.totalPnl)}
                </td>
                <td className={`py-2 px-3 ${s.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {s.roi.toFixed(1)}%
                </td>
                <td className="py-2 px-3">{s.winRate.toFixed(0)}%</td>
                <td className="py-2 px-3 text-gray-600">{fmt(s.totalRisked)}</td>
                <td className="py-2 px-3 text-gray-600">{s.avgHoldDays.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length > 15 && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            {showAll ? `Show top 15` : `Show all ${sorted.length} markets`}
          </button>
        )}
      </div>
    </div>
  );
}
