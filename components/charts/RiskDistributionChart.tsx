
import React, { useMemo } from 'react';
import { AssetPredictionResult } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { RISK_THRESHOLDS } from '../../constants';

interface RiskDistributionChartProps {
  assets: AssetPredictionResult[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ assets }) => {
  const data = useMemo(() => {
    const riskBins = [
      { name: '0-0.1', count: 0, range: [0, 0.1] },
      { name: '0.1-0.2', count: 0, range: [0.1, 0.2] },
      { name: '0.2-0.3', count: 0, range: [0.2, 0.3] }, // Healthy
      { name: '0.3-0.4', count: 0, range: [0.3, 0.4] },
      { name: '0.4-0.5', count: 0, range: [0.4, 0.5] },
      { name: '0.5-0.6', count: 0, range: [0.5, 0.6] },
      { name: '0.6-0.7', count: 0, range: [0.6, 0.7] }, // Degrading
      { name: '0.7-0.8', count: 0, range: [0.7, 0.8] },
      { name: '0.8-0.9', count: 0, range: [0.8, 0.9] },
      { name: '0.9-1.0', count: 0, range: [0.9, 1.0] }, // Critical
    ];

    assets.forEach(asset => {
      for (const bin of riskBins) {
        if (asset.failure_probability >= bin.range[0] && asset.failure_probability < bin.range[1] ) {
          bin.count++;
          break;
        }
      }
      if (asset.failure_probability === 1.0) {
        riskBins[riskBins.length - 1].count++;
      }
    });
    return riskBins;
  }, [assets]);

  if (!assets || assets.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--hnai-text-muted)]">No data available for chart.</div>;
  }
  
  const getCellColor = (value: number) => {
    if (value < RISK_THRESHOLDS.HEALTHY_MAX) return 'var(--hnai-status-healthy)';
    if (value <= RISK_THRESHOLDS.DEGRADING_MAX) return 'var(--hnai-status-degrading)';
    return 'var(--hnai-status-critical)';
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--hnai-border-color)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--hnai-text-muted)' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--hnai-text-muted)' }} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--hnai-secondary)', border: '1px solid var(--hnai-border-color)', borderRadius: '0.5rem' }}
          labelStyle={{ color: 'var(--hnai-text-on-secondary)', fontWeight: 'bold' }}
          itemStyle={{ color: 'var(--hnai-text-muted)' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--hnai-text-muted)' }} />
        <Bar dataKey="count" name="Asset Count">
          {data.map((entry, index) => {
            const midPoint = (entry.range[0] + entry.range[1]) / 2;
            const colorVar = getCellColor(midPoint);
            return <Cell key={`cell-${index}`} fill={`var(${colorVar.substring(4, colorVar.length-1)})`} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};