export type LineStatus = 'enabled' | 'disabled';
export type AgentStatus = 'enabled' | 'disabled' | 'archived';
export type NumberStatus = 'normal' | 'cooling' | 'disabled' | 'suspended_with_agent';
export type DisplayStatus = 'active' | 'inactive';

export interface Operator {
  id: string;
  name: string;
  remark: string;
}

export interface LineGroup {
  id: string;
  province: string;
  city: string;
  operator: string;
  areaCode: string;
  totalConcurrency: number;
  availableConcurrency: number;
  maxCPS: number;
  currentCPS: number;
  onlineCount: number;
  currentOnlineCount: number;
  status: LineStatus;
  remark: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  lineGroupId: string;
  operator: string;
  dailyCalls: number;
  totalCalls: number;
  displayStatus: DisplayStatus;
  status: NumberStatus;
  agentId?: string;
  businessType: string;
  coolingReason?: string;
  createdAt?: string;
  remark?: string;
  coolingStartTime?: string;
}

export interface Agent {
  id: string;
  name: string;
  operator: string;
  lineGroupId: string;
  numberCount: number;
  availableNumberCount: number;
  concurrencyLimit: number;
  associatedAccounts: string[]; // List of account names or IDs
  associatedScripts: string[]; // List of script names or IDs
  status: AgentStatus;
  remark: string;
  selectionMode?: 'auto' | 'manual';
  selectedNumbers?: string[];
}

export interface AIResourceStats {
  globalPurchase: number;
  fixedGuarantee: number;
  dynamicQuota: number;
  realtimeOccupancy: number;
  mandarin: {
    globalPurchase: number;
    fixedGuarantee: number;
    dynamicQuota: number;
    realtimeOccupancy: number;
  };
  cantonese: {
    globalPurchase: number;
    fixedGuarantee: number;
    dynamicQuota: number;
    realtimeOccupancy: number;
  };
}

export interface AIResourceAllocation {
  id: string;
  name: string;
  type: 'fixed' | 'dynamic';
  language: 'mandarin' | 'cantonese';
  limit: number;
  occupancy: number;
  status: 'active' | 'warning' | 'error';
}

export interface GlobalConfig {
  coolingRule: {
    rejectionLimit: number; // e.g., 10
    rejectionWindow: number; // in hours, e.g., 1
    shortCallDuration: number; // e.g., 3 seconds
    shortCallCountLimit: number; // e.g., 5
    shortCallWindow: number; // in hours, e.g., 1
    coolingHours: number; // e.g., 2
  };
  concurrencyRule: {
    defaultCPS: number;
    maxGlobalVoiceCloneConcurrency: number;
  };
  forbiddenHours: {
    start: string; // "22:00"
    end: string; // "08:00"
  };
  autoReplenishCooling: boolean;
  autoReplenishDisabled: boolean;
  replenishLimit24h: number; // Max replenishment per day
}
