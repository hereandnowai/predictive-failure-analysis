
import { AssetRawData, AssetPredictionResult, HealthStatus, SuggestedAction, KPI, AssetProcessedData } from '../types';
import { RISK_THRESHOLDS, STATUS_MAPPING } from '../constants';

const simulatePrediction = (asset: AssetRawData): AssetPredictionResult => {
  let base_prob = Math.random() * 0.3; // Base random factor

  if (asset.temperature > 85) base_prob += 0.25;
  else if (asset.temperature > 75) base_prob += 0.1;

  if (asset.vibration_level > 1.8) base_prob += 0.25;
  else if (asset.vibration_level > 1.2) base_prob += 0.1;
  
  if (asset.pressure > 150) base_prob += 0.15;
  else if (asset.pressure < 80 && asset.pressure > 0) base_prob += 0.1;

  if (asset.runtime_hours > 7000) base_prob += 0.2;
  else if (asset.runtime_hours > 3000) base_prob += 0.1;
  
  const failure_probability = Math.min(Math.max(base_prob, 0.01), 0.99); // Clamp between 0.01 and 0.99

  let health_status: HealthStatus;
  if (failure_probability < RISK_THRESHOLDS.HEALTHY_MAX) {
    health_status = HealthStatus.Healthy;
  } else if (failure_probability <= RISK_THRESHOLDS.DEGRADING_MAX) {
    health_status = HealthStatus.Degrading;
  } else {
    health_status = HealthStatus.Critical;
  }

  const suggested_action = STATUS_MAPPING[health_status].action;
  
  let parsed_timestamp: Date = new Date(); // Initialize with a fallback current date

  try {
    const direct_parsed_date = new Date(asset.timestamp);
    if (!isNaN(direct_parsed_date.getTime())) {
        parsed_timestamp = direct_parsed_date;
    } else {
        // Attempt to parse common non-ISO formats, e.g. "DD/MM/YYYY HH:MM" or "MM/DD/YYYY HH:MM"
        const parts = asset.timestamp.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})[T\s]?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?/);
        if (parts) {
            // Assuming MM/DD/YYYY (parts[1]=month, parts[2]=day) as a common format. 
            // If DD/MM/YYYY is more common for your data, swap parts[1] and parts[2] for month and day.
            const year = parseInt(parts[3], 10);
            const month = parseInt(parts[1], 10) -1; // Month is 0-indexed in JS Date
            const day = parseInt(parts[2], 10);
            const hour = parts[4] ? parseInt(parts[4], 10) : 0;
            const minute = parts[5] ? parseInt(parts[5], 10) : 0;
            const second = parts[6] ? parseInt(parts[6], 10) : 0;
            
            const custom_parsed_date = new Date(year, month, day, hour, minute, second);
            if (!isNaN(custom_parsed_date.getTime())) {
                parsed_timestamp = custom_parsed_date;
            } else {
                 console.warn(`Could not parse timestamp "${asset.timestamp}" (custom attempt resulted in invalid date) for asset ${asset.asset_id}. Using current time as fallback.`);
            }
        } else {
             console.warn(`Could not parse timestamp "${asset.timestamp}" (unrecognized format) for asset ${asset.asset_id}. Using current time as fallback.`);
        }
    }
  } catch (e) {
    // If new Date(asset.timestamp) throws, parsed_timestamp retains its initialized value (current date)
    console.warn(`Error parsing timestamp "${asset.timestamp}" for asset ${asset.asset_id}. Using current time as fallback. Error: ${e}`);
  }

  return {
    ...asset,
    failure_probability,
    health_status,
    suggested_action,
    parsed_timestamp,
  };
};

export const processCsvData = (csvText: string): AssetProcessedData => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error("CSV file must contain a header row and at least one data row.");
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const assetIdIndex = header.indexOf('asset_id');
  const timestampIndex = header.indexOf('timestamp');
  const temperatureIndex = header.indexOf('temperature');
  const vibrationLevelIndex = header.indexOf('vibration_level');
  const pressureIndex = header.indexOf('pressure');
  const runtimeHoursIndex = header.indexOf('runtime_hours');
  const failureEventIndex = header.indexOf('failure_event'); // Optional
  const locationIndex = header.indexOf('location');

  if ([assetIdIndex, timestampIndex, temperatureIndex, vibrationLevelIndex, pressureIndex, runtimeHoursIndex, locationIndex].some(index => index === -1)) {
    throw new Error("CSV header is missing one or more required fields: asset_id, timestamp, temperature, vibration_level, pressure, runtime_hours, location.");
  }
  
  const assets: AssetPredictionResult[] = [];
  let totalRisk = 0;
  let criticalCount = 0;
  let degradingCount = 0;
  let healthyCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < header.length -1 && failureEventIndex === -1 && values.length < header.length) { 
        console.warn(`Skipping row ${i + 1}: Expected at least ${header.length -1} values (if failure_event is optional and missing) or ${header.length} values, got ${values.length}. Line: ${lines[i]}`);
        continue;
    }
     if (values.length < header.length && failureEventIndex !== -1 && header.indexOf('failure_event') > -1 && values.length < header.length -1){
        console.warn(`Skipping row ${i + 1}: Expected at least ${header.length -1} values, got ${values.length}. Line: ${lines[i]}`);
        continue;
    }


    const rawData: AssetRawData = {
      asset_id: values[assetIdIndex]?.trim(),
      timestamp: values[timestampIndex]?.trim(),
      temperature: parseFloat(values[temperatureIndex]),
      vibration_level: parseFloat(values[vibrationLevelIndex]),
      pressure: parseFloat(values[pressureIndex]),
      runtime_hours: parseInt(values[runtimeHoursIndex], 10),
      failure_event: failureEventIndex !== -1 && values[failureEventIndex]?.trim() ? parseInt(values[failureEventIndex], 10) : undefined,
      location: values[locationIndex]?.trim(),
    };
    
    // Check for undefined essential fields and NaN for numerical fields (excluding optional failure_event)
    const essentialFieldsValid = 
        rawData.asset_id &&
        rawData.timestamp &&
        !isNaN(rawData.temperature) &&
        !isNaN(rawData.vibration_level) &&
        !isNaN(rawData.pressure) &&
        !isNaN(rawData.runtime_hours) &&
        rawData.location;

    if (!essentialFieldsValid) {
        console.warn(`Skipping row ${i + 1} due to missing or invalid essential data: ${JSON.stringify(rawData)}`);
        continue;
    }
    
    const prediction = simulatePrediction(rawData);
    assets.push(prediction);
    totalRisk += prediction.failure_probability;
    if (prediction.health_status === HealthStatus.Critical) criticalCount++;
    else if (prediction.health_status === HealthStatus.Degrading) degradingCount++;
    else healthyCount++;
  }

  if (assets.length === 0) {
    throw new Error("No valid data rows found in the CSV file after parsing. Check CSV format and content.");
  }

  const kpis: KPI = {
    totalAssets: assets.length,
    averageRisk: assets.length > 0 ? parseFloat((totalRisk / assets.length).toFixed(3)) : 0,
    criticalCount,
    degradingCount,
    healthyCount,
  };

  return { assets, kpis };
};
