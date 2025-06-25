
import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  valueTextColor?: string; // e.g., "var(--hnai-status-critical)"
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, unit, valueTextColor }) => {
  const finalValueTextColor = valueTextColor || 'var(--hnai-text-accent)';
  
  return (
    <div className={`p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 bg-[var(--hnai-card-background)] hover:bg-[var(--hnai-secondary)] border-b-4 border-[var(--hnai-border-color)] hover:border-[var(--hnai-text-accent)]`}>
      <h4 className={`text-sm font-medium text-[var(--hnai-text-on-secondary)] opacity-80 uppercase tracking-wider`}>{title}</h4>
      <p className={`mt-1 text-3xl font-bold`} style={{ color: finalValueTextColor }}>{value}</p>
      {unit && <p className={`text-xs text-[var(--hnai-text-muted)] opacity-70`}>{unit}</p>}
    </div>
  );
};