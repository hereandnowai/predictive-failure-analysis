
import React, { useState, useMemo } from 'react';
import { AssetPredictionResult, HealthStatus } from '../types';
import { STATUS_MAPPING } from '../constants';
import { CheckIcon } from './icons/CheckIcon';
import { WarningIcon } from './icons/WarningIcon';
import { CriticalIcon } from './icons/CriticalIcon';

interface AssetTableProps {
  assets: AssetPredictionResult[];
}

type SortKey = keyof AssetPredictionResult | 'failure_probability' | 'health_status' | 'runtime_hours';
type SortOrder = 'asc' | 'desc';

const StatusIcon: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const { iconColor } = STATUS_MAPPING[status];
  // Remove 'text-' prefix as CSS variables directly provide color values
  const finalIconColor = iconColor.startsWith('text-[var') ? iconColor.replace('text-[','').replace(']','') : iconColor;

  switch (status) {
    case HealthStatus.Healthy:
      return <CheckIcon className={`w-5 h-5`} style={{ color: `var(${finalIconColor.substring(4, finalIconColor.length-1)})` }} />;
    case HealthStatus.Degrading:
      return <WarningIcon className={`w-5 h-5`} style={{ color: `var(${finalIconColor.substring(4, finalIconColor.length-1)})` }} />;
    case HealthStatus.Critical:
      return <CriticalIcon className={`w-5 h-5`} style={{ color: `var(${finalIconColor.substring(4, finalIconColor.length-1)})` }} />;
    default:
      return null;
  }
};

export const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  const [sortKey, setSortKey] = useState<SortKey>('failure_probability');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<HealthStatus | ''>('');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const textMatch = filterText === '' ||
        asset.asset_id.toLowerCase().includes(filterText.toLowerCase()) ||
        asset.location.toLowerCase().includes(filterText.toLowerCase());
      const statusMatch = statusFilter === '' || asset.health_status === statusFilter;
      return textMatch && statusMatch;
    });
  }, [assets, filterText, statusFilter]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      
      if (sortKey === 'parsed_timestamp') {
        valA = a.parsed_timestamp.getTime();
        valB = b.parsed_timestamp.getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortKey, sortOrder]);

  const renderSortArrow = (key: SortKey) => {
    if (sortKey === key) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  const headers: { key: SortKey; label: string; numeric?: boolean }[] = [
    { key: 'asset_id', label: 'Asset ID' },
    { key: 'location', label: 'Location' },
    { key: 'parsed_timestamp', label: 'Timestamp' },
    { key: 'temperature', label: 'Temp (°C)', numeric: true },
    { key: 'vibration_level', label: 'Vibration', numeric: true },
    { key: 'pressure', label: 'Pressure (psi)', numeric: true },
    { key: 'runtime_hours', label: 'Runtime (hrs)', numeric: true },
    { key: 'failure_probability', label: 'Risk Score', numeric: true },
    { key: 'health_status', label: 'Status' },
    { key: 'suggested_action', label: 'Action' },
  ];

  return (
    <div className="overflow-x-auto bg-transparent p-1 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 p-2">
        <input
          type="text"
          placeholder="Filter by Asset ID or Location..."
          className="px-3 py-2 bg-[var(--hnai-secondary)] border border-[var(--hnai-border-color)] rounded-md text-[var(--hnai-text-on-secondary)] focus:border-[var(--hnai-text-accent)] focus:ring-1 focus:ring-[var(--hnai-text-accent)] w-full sm:w-auto hnai-focus-ring"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as HealthStatus | '')}
          className="px-3 py-2 bg-[var(--hnai-secondary)] border border-[var(--hnai-border-color)] rounded-md text-[var(--hnai-text-on-secondary)] focus:border-[var(--hnai-text-accent)] focus:ring-1 focus:ring-[var(--hnai-text-accent)] w-full sm:w-auto hnai-focus-ring"
        >
          <option value="">All Statuses</option>
          {Object.values(HealthStatus).map(status => (
            <option key={status} value={status} style={{ backgroundColor: 'var(--hnai-secondary)'}}>{status}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-[var(--hnai-border-color)]">
        <thead className="bg-[var(--hnai-secondary)]">
          <tr>
            {headers.map(header => (
              <th
                key={header.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold text-[var(--hnai-text-accent)] uppercase tracking-wider cursor-pointer hover:bg-[var(--hnai-secondary-lighter)] transition-colors"
                onClick={() => handleSort(header.key)}
              >
                {header.label} {renderSortArrow(header.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-[var(--hnai-card-background)] divide-y divide-[var(--hnai-border-color)]">
          {sortedAssets.length > 0 ? sortedAssets.map((asset) => (
            <tr key={asset.asset_id} className="hover:bg-[var(--hnai-secondary)] transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[var(--hnai-text-on-secondary)]">{asset.asset_id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)]">{asset.location}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)]">{asset.parsed_timestamp.toLocaleString()}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)] text-right">{asset.temperature.toFixed(1)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)] text-right">{asset.vibration_level.toFixed(2)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)] text-right">{asset.pressure.toFixed(1)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)] text-right">{asset.runtime_hours}</td>
              <td 
                className={`px-4 py-3 whitespace-nowrap text-sm font-semibold text-right`}
                style={{ color: STATUS_MAPPING[asset.health_status].color.startsWith('text-[var') ? `var(${STATUS_MAPPING[asset.health_status].color.substring(9, STATUS_MAPPING[asset.health_status].color.length-2)})` : STATUS_MAPPING[asset.health_status].color }}
              >
                {asset.failure_probability.toFixed(3)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`flex items-center gap-2 px-2 py-1 text-xs font-semibold rounded-full ${STATUS_MAPPING[asset.health_status].bgColor}`}
                 style={{ color: STATUS_MAPPING[asset.health_status].color.startsWith('text-[var') ? `var(${STATUS_MAPPING[asset.health_status].color.substring(9, STATUS_MAPPING[asset.health_status].color.length-2)})` : STATUS_MAPPING[asset.health_status].color }}
                >
                  <StatusIcon status={asset.health_status} />
                  {asset.health_status}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--hnai-text-muted)]">{asset.suggested_action}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-10 text-center text-sm text-[var(--hnai-text-muted)]">
                No assets match your current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {sortedAssets.length === 0 && assets.length > 0 && (
         <p className="p-4 text-center text-sm text-[var(--hnai-text-muted)]">
            No assets match the current filter criteria. Try adjusting your filters.
          </p>
      )}
      {assets.length === 0 && (
          <p className="p-4 text-center text-sm text-[var(--hnai-text-muted)]">
            No asset data available to display. Please upload a CSV file.
          </p>
      )}
    </div>
  );
};