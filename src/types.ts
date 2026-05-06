export type LineStatus = 'enabled' | 'disabled';
export type AgentStatus = 'enabled' | 'disabled' | 'archived';
export type NumberStatus = 
  | 'normal' 
  | 'cooling' 
  | 'disabled' 
  | 'suspended_with_agent' 
  | 'buffering' // 缓冲期
  | 'frozen'    // 冻结期
  | 'public';   // 公共期
export type DisplayStatus = 'active' | 'inactive';

export interface Operator {
  id: string;
  name: string;
  remark: string;
}

export interface SBCNode {
  id: string;
  name: string;
  physicalMax: number;
  physicalCurrent: number;
  bandwidthMax: number;
  bandwidthCurrent: number; // 每一兆对应 8.5 路并发计算得出
  cpsMax: number;
  cpsCurrent: number;
  status: 'online' | 'offline' | 'maint';
  location: string;
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
  status: LineStatus;
  remark: string;
}

export interface PhoneHistory {
  time: string;
  user: string;
  business: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  lineGroupId: string;
  operator: string;
  province: string;
  city: string;
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
  history?: PhoneHistory[];
}

export interface Agent {
  id: string;
  name: string;
  operator: string;
  lineGroupId: string;
  numberCount: number;
  availableNumberCount: number;
  concurrencyLimit: number;
  associatedAccounts: string[]; 
  associatedScripts: string[]; 
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

export interface Enterprise {
  id: string;
  name: string;
  status: 'active' | 'expired' | 'frozen';
  expiryDate: string;
  concurrencyQuota: number;
  minutesQuota: number;
}

export interface SubAccount {
  id: string;
  name: string;
  enterpriseId: string;
  concurrencyQuota: number;
  minutesQuota: number;
  permissions: string[]; // ['admin', 'marketing', 'agent']
}

export interface GlobalConfig {
  coolingRule: {
    rejectionLimit: number;
    rejectionWindow: number;
    shortCallDuration: number;
    shortCallCountLimit: number;
    shortCallWindow: number;
    coolingHours: number;
  };
  concurrencyRule: {
    defaultCPS: number;
    bandwidthMultiplier: number; // 1M = 8.5路
  };
  forbiddenHours: {
    start: string;
    end: string;
  };
}
