
export interface AssetRawData {
  asset_id: string;
  timestamp: string;
  temperature: number;
  vibration_level: number;
  pressure: number;
  runtime_hours: number;
  failure_event?: number; // 0 or 1
  location: string;
}

export enum HealthStatus {
  Healthy = "Healthy",
  Degrading = "Degrading",
  Critical = "Critical",
}

export enum SuggestedAction {
  Monitor = "Monitor",
  ScheduleMaintenance = "Schedule Maintenance",
  ImmediateCheck = "Immediate Check",
}

export interface AssetPredictionResult extends AssetRawData {
  failure_probability: number;
  health_status: HealthStatus;
  suggested_action: SuggestedAction;
  parsed_timestamp: Date;
}

export interface KPI {
  totalAssets: number;
  averageRisk: number;
  criticalCount: number;
  degradingCount: number;
  healthyCount: number;
}

export interface AssetProcessedData {
  assets: AssetPredictionResult[];
  kpis: KPI;
}
