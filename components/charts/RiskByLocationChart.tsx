
import React, { useMemo } from 'react';
import { AssetPredictionResult } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { RISK_THRESHOLDS } from '../../constants';

interface RiskByLocationChartProps {
  assets: AssetPredictionResult[];
}

const BAR_COLORS = [
  'var(--hnai-text-accent)', // Primary brand accent
  '#A78BFA', // purple-400 (example of a complementary color)
  '#60A5FA', // blue-400 (example)
  '#34D399', // emerald-400 (example)
  'var(--hnai-status-critical)', // Critical status color
  'var(--hnai-status-healthy)', // Healthy status color
];


export const RiskByLocationChart: React.FC<RiskByLocationChartProps> = ({ assets }) => {
  const data = useMemo(() => {
    const locationData: { [key: string]: { totalRisk: number; count: number; criticalCount: number } } = {};
    assets.forEach(asset => {
      if (!locationData[asset.location]) {
        locationData[asset.location] = { totalRisk: 0, count: 0, criticalCount: 0 };
      }
      locationData[asset.location].totalRisk += asset.failure_probability;
      locationData[asset.location].count++;
      if (asset.failure_probability > RISK_THRESHOLDS.DEGRADING_MAX) { 
         locationData[asset.location].criticalCount++;
      }
    });

    return Object.entries(locationData)
      .map(([location, dataValue]) => ({ 
        location,
        averageRisk: parseFloat((dataValue.totalRisk / dataValue.count).toFixed(3)),
        assetCount: dataValue.count,
      }))
      .sort((a,b) => b.averageRisk - a.averageRisk)
      .slice(0, 10);
  }, [assets]);

  if (!assets || assets.length === 0) {
    return <div className="flex items-center justify-center h-full text-[var(--hnai-text-muted)]">No data available for chart.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--hnai-border-color)" />
        <XAxis 
          dataKey="location" 
          angle={-35} 
          textAnchor="end" 
          height={60} 
          tick={{ fontSize: 10, fill: 'var(--hnai-text-muted)' }} 
          interval={0}
        />
        <YAxis tick={{ fontSize: 12, fill: 'var(--hnai-text-muted)' }} domain={[0, 1]}/>
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--hnai-secondary)', border: '1px solid var(--hnai-border-color)', borderRadius: '0.5rem' }}
          labelStyle={{ color: 'var(--hnai-text-on-secondary)', fontWeight: 'bold' }}
          itemStyle={{ color: 'var(--hnai-text-muted)' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--hnai-text-muted)', paddingTop: '10px' }} />
        <Bar dataKey="averageRisk" name="Avg. Risk Score" unit="" >
           {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length].startsWith('var(') ? `var(${BAR_COLORS[index % BAR_COLORS.length].substring(4, BAR_COLORS[index % BAR_COLORS.length].length-1)})` : BAR_COLORS[index % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};