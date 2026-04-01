export type LineStatus = 'enabled' | 'disabled';
export type NumberStatus = 'normal' | 'cooling' | 'disabled';
export type DisplayStatus = 'active' | 'inactive';

export interface LineGroup {
  id: string;
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
  city: string;
  dailyCalls: number;
  createdAt: string;
  status: NumberStatus;
  displayStatus: DisplayStatus;
  agentId?: string;
  remark: string;
  coolingStartTime?: string;
  coolingReason?: string;
}

export interface Agent {
  id: string;
  name: string;
  city: string;
  operator: string;
  numberCount: number;
  boundNumbers: string[]; // IDs of numbers
  concurrency: number;
  accountId: string;
  status: LineStatus;
  remark: string;
}

export interface GlobalConfig {
  coolingRule: {
    shortCalls: number; // e.g., 5
    shortCallDuration: number; // e.g., 3 seconds
    rejections: number; // e.g., 10
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
}
