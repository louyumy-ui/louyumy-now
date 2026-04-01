import { LineGroup, PhoneNumber, Agent, GlobalConfig } from './types';

export const OPERATORS = ['中国移动', '中国联通', '中国电信'];
export const CITIES = ['上海', '北京', '广州', '深圳', '成都', '杭州', '武汉', '西安'];

export const INITIAL_LINE_GROUPS: LineGroup[] = [
  {
    id: '1',
    city: '上海',
    operator: '中国移动',
    areaCode: '021',
    totalConcurrency: 1000,
    availableConcurrency: 800,
    maxCPS: 30,
    currentCPS: 12,
    onlineCount: 500,
    currentOnlineCount: 320,
    status: 'enabled',
    remark: '上海移动主线路',
  },
  {
    id: '2',
    city: '北京',
    operator: '中国联通',
    areaCode: '010',
    totalConcurrency: 2000,
    availableConcurrency: 1500,
    maxCPS: 30,
    currentCPS: 8,
    onlineCount: 1000,
    currentOnlineCount: 600,
    status: 'enabled',
    remark: '北京联通主线路',
  },
];

export const INITIAL_NUMBERS: PhoneNumber[] = [
  {
    id: '1',
    number: '13812345678',
    lineGroupId: '1',
    operator: '中国移动',
    city: '上海',
    dailyCalls: 45,
    createdAt: '2026-03-01T10:00:00Z',
    status: 'normal',
    displayStatus: 'active',
    agentId: '1',
    remark: '优质号码',
  },
  {
    id: '2',
    number: '13987654321',
    lineGroupId: '1',
    operator: '中国移动',
    city: '上海',
    dailyCalls: 12,
    createdAt: '2026-03-05T14:30:00Z',
    status: 'cooling',
    displayStatus: 'active',
    agentId: '1',
    remark: '冷却中',
    coolingStartTime: '2026-03-31T06:00:00Z',
    coolingReason: '连续5通短通话',
  },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: '上海坐席-01',
    city: '上海',
    operator: '中国移动',
    numberCount: 2,
    boundNumbers: ['1', '2'],
    concurrency: 50,
    accountId: 'user_001',
    status: 'enabled',
    remark: '主要负责上海业务',
  },
];

export const INITIAL_CONFIG: GlobalConfig = {
  coolingRule: {
    shortCalls: 5,
    shortCallDuration: 3,
    rejections: 10,
    coolingHours: 2,
  },
  concurrencyRule: {
    defaultCPS: 30,
    maxGlobalVoiceCloneConcurrency: 10,
  },
  forbiddenHours: {
    start: '22:00',
    end: '08:00',
  },
  autoReplenishCooling: true,
  autoReplenishDisabled: true,
};
