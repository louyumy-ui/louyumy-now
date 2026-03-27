import React from 'react';

export type Carrier = '中国移动' | '中国联通' | '中国电信' | '虚拟运营商';

/**
 * 号码状态：
 * active: 活跃中
 * cooldown: 风控冷却中
 * suspended: 已封禁/停用
 * warming: 冷启动/养号中
 */
export type NumberStatus = 'active' | 'cooldown' | 'suspended' | 'warming';

export interface PhoneNumber {
  id: string;
  number: string; // 完整号码 (区号+座机)
  areaCode: string; // 区号
  landlineNumber: string; // 座机号
  carrier: Carrier;
  province: string;
  city: string;
  usageCount: number;
  successRate: number;
  status: NumberStatus;
  isHarassed: boolean; // 骚扰标记
  selected: boolean;
  lastUsed: string;
  isDisplay: boolean; // 是否外显
  isEnabled: boolean; // 启用/停用状态
  remark: string; // 备注
  assignedAgentIds: string[]; // 关联坐席ID列表
  assignedScriptId?: number; // 关联话术ID
  lineGroupId?: string; // 所属线路组ID
}

/**
 * AI 算力资源接口
 */
export interface AIResource {
  totalConcurrent: number; // 总并发
  usedConcurrent: number; // 已用并发
  remainingDuration: number; // 剩余可用时长 (分钟)
  predictExhaustTime: string; // 预计耗尽时间 (如: "2小时15分钟")
}

export interface Agent {
  id: string;
  name: string;
  account: string;
  associatedAccounts: string[]; // 关联的多个账号列表
  status: 'online' | 'offline' | 'busy';
  isEnabled: boolean; // 账号启用状态
  assignedNumbers: string[]; // 关联的号码ID列表
  assignedScriptIds: number[]; // 关联的话术ID列表
  lineGroupId?: string; // 关联线路组/号码池
  targetProvince?: string; // 目标外呼省份 (用于地域优先分配)
  seatConcurrency: number; // 坐席业务并发 (重命名自 concurrency)
  accountConcurrency: number; // 账号底层最大并发 (新增)
  lastLogin?: string; // 最后登录时间
  remark: string; // 备注
}

export interface CarrierConfig {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface RegionConfig {
  id: string;
  province: string;
  cities: string[];
}

export interface Filters {
  carrier: string;
  province: string;
  city: string;
  search: string;
  frequency?: 'all' | 'low' | 'high';
  displayStatus: 'all' | 'on' | 'off'; // 外显状态：开启/关闭/全部
  enableStatus: 'all' | 'enabled' | 'disabled'; // 启用状态：启用/停用/全部
  viewStatus: 'all' | 'cooldown' | 'suspended' | 'no_display' | 'has_display' | 'warming'; // 综合视图筛选
}

export interface LineGroup {
  id: string;
  name: string;
  areaCode: string;
  totalConcurrency: number;
  assignedConcurrency: number;
  remainingConcurrency: number;
  priorityQuota: number; // 优先业务配额 (新增)
  normalQuota: number; // 普通业务配额 (新增)
  status: 'enabled' | 'disabled';
  createdAt: string;
  carriers: Carrier[];
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  closable?: boolean;
}
