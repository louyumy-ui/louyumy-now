import { LineGroup, PhoneNumber, Agent, GlobalConfig, Operator, SBCNode, Enterprise, SubAccount } from './types';

export const OPERATORS = ['中国移动', '中国联通', '中国电信'];
export const CITIES = ['韶关', '茂名', '惠州', '广州', '深圳', '成都', '北京', '上海'];
export const PROVINCES = ['广东', '江苏', '浙江', '四川', '山东', '北京', '上海'];
export const BUSINESS_TYPES = ['催收业务', '营销推广', '客户回访', '行政通知'];

export const INITIAL_OPERATORS: Operator[] = [
  { id: '1', name: '中国移动', remark: '移动全国业务' },
  { id: '2', name: '中国联通', remark: '联通全国业务' },
  { id: '3', name: '中国电信', remark: '电信全国业务' },
];

export const INITIAL_SBC_NODES: SBCNode[] = [
  {
    id: 'sbc-01',
    name: '星纵120-联通主网关',
    physicalMax: 500,
    physicalCurrent: 70,
    bandwidthMax: 1200, // 预计1200路
    bandwidthCurrent: 400,
    cpsMax: 30,
    cpsCurrent: 10,
    status: 'online',
    location: '上海电信机房'
  },
  {
    id: 'sbc-02',
    name: '华为SoftCo-核心北向',
    physicalMax: 1000,
    physicalCurrent: 350,
    bandwidthMax: 2000,
    bandwidthCurrent: 800,
    cpsMax: 50,
    cpsCurrent: 25,
    status: 'online',
    location: '广州移动机房'
  }
];

export const INITIAL_ENTERPRISES: Enterprise[] = [
  {
    id: 'ent-01',
    name: '中和信贷有限公司',
    status: 'active',
    expiryDate: '2026-12-31',
    concurrencyQuota: 200,
    minutesQuota: 50000
  },
  {
    id: 'ent-02',
    name: '龙行金融外包',
    status: 'expired',
    expiryDate: '2024-04-30',
    concurrencyQuota: 100,
    minutesQuota: 10000
  }
];

export const INITIAL_LINE_GROUPS: LineGroup[] = [
  {
    id: '1',
    province: '广东',
    city: '韶关',
    operator: '中国移动',
    areaCode: '0751',
    totalConcurrency: 120,
    availableConcurrency: 120,
    maxCPS: 30,
    currentCPS: 0,
    status: 'enabled',
    remark: '韶关测试线路',
  },
  {
    id: '3',
    province: '广东',
    city: '惠州',
    operator: '中国电信',
    areaCode: '0752',
    totalConcurrency: 1000,
    availableConcurrency: 1000,
    maxCPS: 30,
    currentCPS: 0,
    status: 'enabled',
    remark: '惠州核心线路',
  },
];

export const INITIAL_NUMBERS: PhoneNumber[] = [
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `idle-${i}`,
    number: Math.floor(80000000 + Math.random() * 9999999).toString(),
    province: '广东',
    city: i % 2 === 0 ? '深圳' : '广州',
    operator: i < 7 ? '中国移动' : i < 14 ? '中国联通' : '中国电信',
    lineGroupId: (i % 3 + 1).toString(),
    businessType: '催收业务',
    dailyCalls: 0,
    totalCalls: 0,
    displayStatus: 'active' as any,
    status: 'normal' as any,
    remark: '测试空闲号',
  })),
  {
    id: 'num-buffering',
    number: '88889999',
    province: '浙江',
    city: '杭州',
    lineGroupId: '1',
    operator: '中国移动',
    dailyCalls: 5,
    totalCalls: 100,
    displayStatus: 'active',
    status: 'buffering',
    businessType: '营销推广',
    remark: '欠费缓冲中',
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: '上海坐席-01',
    operator: '中国移动',
    lineGroupId: '1',
    numberCount: 2,
    availableNumberCount: 2,
    concurrencyLimit: 50,
    associatedAccounts: ['user_001'],
    associatedScripts: ['核心催收脚本'],
    status: 'enabled',
    remark: '主要负责上海业务',
  },
];

export const INITIAL_CONFIG: GlobalConfig = {
  coolingRule: {
    rejectionLimit: 10,
    rejectionWindow: 1,
    shortCallDuration: 3,
    shortCallCountLimit: 5,
    shortCallWindow: 1,
    coolingHours: 2,
  },
  concurrencyRule: {
    defaultCPS: 30,
    bandwidthMultiplier: 8.5
  },
  forbiddenHours: {
    start: '22:00',
    end: '08:00',
  }
};
