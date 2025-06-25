
import { HealthStatus, SuggestedAction } from './types';

export const RISK_THRESHOLDS = {
  HEALTHY_MAX: 0.3,
  DEGRADING_MAX: 0.7,
};

// Updated to use CSS variables for brand colors
export const STATUS_MAPPING: Record<HealthStatus, { color: string; action: SuggestedAction; iconColor: string; bgColor: string }> = {
  [HealthStatus.Healthy]: { 
    color: "text-[var(--hnai-status-healthy)]", 
    action: SuggestedAction.Monitor, 
    iconColor: "text-[var(--hnai-status-healthy)]",
    bgColor: "bg-green-500/20" // Keep a distinct green background for Healthy
  },
  [HealthStatus.Degrading]: { 
    color: "text-[var(--hnai-status-degrading)]", 
    action: SuggestedAction.ScheduleMaintenance, 
    iconColor: "text-[var(--hnai-status-degrading)]",
    bgColor: "bg-yellow-500/20" // Use a yellow background for Degrading for visual distinction
  },
  [HealthStatus.Critical]: { 
    color: "text-[var(--hnai-status-critical)]", 
    action: SuggestedAction.ImmediateCheck, 
    iconColor: "text-[var(--hnai-status-critical)]",
    bgColor: "bg-red-500/20" // Keep a distinct red background for Critical
  },
};


export const CSV_HEADER_FIELDS = [
  "asset_id", 
  "timestamp", 
  "temperature", 
  "vibration_level", 
  "pressure", 
  "runtime_hours", 
  "failure_event", 
  "location"
];
// Optional field 'failure_event' is handled in parsing logic