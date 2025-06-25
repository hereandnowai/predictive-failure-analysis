
import React from 'react';
import { AssetProcessedData, HealthStatus } from '../types';
import { KPICard } from './KPICard';
import { AssetTable } from './AssetTable';
import { RiskByLocationChart } from './charts/RiskByLocationChart';
import { RiskDistributionChart } from './charts/RiskDistributionChart';

interface DashboardProps {
  data: AssetProcessedData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { assets, kpis } = data;

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard title="Total Assets" value={kpis.totalAssets.toString()} unit="assets" />
        <KPICard title="Average Risk" value={kpis.averageRisk.toFixed(3)} unit="probability" />
        <KPICard title="Critical Assets" value={kpis.criticalCount.toString()} unit="assets" valueTextColor="var(--hnai-status-critical)" />
        <KPICard title="Degrading Assets" value={kpis.degradingCount.toString()} unit="assets" valueTextColor="var(--hnai-status-degrading)" />
        <KPICard title="Healthy Assets" value={kpis.healthyCount.toString()} unit="assets" valueTextColor="var(--hnai-status-healthy)" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--hnai-card-background)] p-6 rounded-xl shadow-xl border border-[var(--hnai-border-color)]">
          <h3 className="text-xl font-semibold text-[var(--hnai-text-accent)] mb-4">Risk by Location</h3>
          <div className="h-72 md:h-96">
            <RiskByLocationChart assets={assets} />
          </div>
        </div>
        <div className="bg-[var(--hnai-card-background)] p-6 rounded-xl shadow-xl border border-[var(--hnai-border-color)]">
          <h3 className="text-xl font-semibold text-[var(--hnai-text-accent)] mb-4">Asset Risk Distribution</h3>
           <div className="h-72 md:h-96">
            <RiskDistributionChart assets={assets} />
          </div>
        </div>
      </section>
      
      <section className="bg-[var(--hnai-card-background)] p-4 sm:p-6 rounded-xl shadow-xl border border-[var(--hnai-border-color)]">
        <h3 className="text-xl font-semibold text-[var(--hnai-text-accent)] mb-4">Asset Risk Summary</h3>
        <AssetTable assets={assets} />
      </section>
    </div>
  );
};