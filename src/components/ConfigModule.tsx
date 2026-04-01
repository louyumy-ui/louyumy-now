import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Clock, 
  RefreshCw, 
  Save, 
  AlertTriangle,
  Info,
  Mic,
  Cpu,
  Server
} from 'lucide-react';
import { GlobalConfig } from '../types';

interface Props {
  config: GlobalConfig;
  setConfig: React.Dispatch<React.SetStateAction<GlobalConfig>>;
}

const ConfigModule: React.FC<Props> = ({ config, setConfig }) => {
  const handleSave = () => {
    // In a real app, this would be an API call
    console.log('Saving config:', config);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#1A1A1A]">全局策略配置</h3>
          <p className="text-[#6B7280] text-sm mt-1">管理系统核心外呼规则、并发管控及合规性设置</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 bg-[#0066FF] text-white rounded-2xl font-bold hover:bg-[#0052CC] transition-all shadow-xl shadow-[#0066FF]/20"
        >
          <Save className="w-5 h-5" />
          保存配置
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cooling Rules */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A1A1A]">号码冷却规则</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <span className="text-sm font-medium text-[#4B5563]">连续短通话次数 (≤3秒)</span>
              <input 
                type="number" 
                value={config.coolingRule.shortCalls}
                onChange={(e) => setConfig(prev => ({ ...prev, coolingRule: { ...prev.coolingRule, shortCalls: parseInt(e.target.value) } }))}
                className="w-20 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-center font-bold focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <span className="text-sm font-medium text-[#4B5563]">连续拒接次数</span>
              <input 
                type="number" 
                value={config.coolingRule.rejections}
                onChange={(e) => setConfig(prev => ({ ...prev, coolingRule: { ...prev.coolingRule, rejections: parseInt(e.target.value) } }))}
                className="w-20 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-center font-bold focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <span className="text-sm font-medium text-[#4B5563]">冷却时长 (小时)</span>
              <input 
                type="number" 
                value={config.coolingRule.coolingHours}
                onChange={(e) => setConfig(prev => ({ ...prev, coolingRule: { ...prev.coolingRule, coolingHours: parseInt(e.target.value) } }))}
                className="w-20 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-center font-bold focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
          </div>
        </div>

        {/* Concurrency Rules */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A1A1A]">并发管控逻辑</h4>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-[#0066FF] uppercase mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                计算公式
              </p>
              <p className="text-xs text-[#0066FF] leading-relaxed opacity-80">
                实际可用并发 = min(坐席并发, 账号并发, 线路组并发, 全局ASR并发, 网关硬件并发)
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-[#4B5563]">全局声音克隆池并发</span>
              </div>
              <input 
                type="number" 
                value={config.concurrencyRule.maxGlobalVoiceCloneConcurrency}
                onChange={(e) => setConfig(prev => ({ ...prev, concurrencyRule: { ...prev.concurrencyRule, maxGlobalVoiceCloneConcurrency: parseInt(e.target.value) } }))}
                className="w-20 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-lg text-center font-bold focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-[#4B5563]">线路组默认CPS上限</span>
              </div>
              <span className="text-sm font-bold text-[#1A1A1A]">30 次/秒</span>
            </div>
          </div>
        </div>

        {/* Forbidden Hours */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A1A1A]">禁呼时段设置</h4>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-[#6B7280]">开始时间</label>
              <input 
                type="time" 
                value={config.forbiddenHours.start}
                onChange={(e) => setConfig(prev => ({ ...prev, forbiddenHours: { ...prev.forbiddenHours, start: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-xs font-bold text-[#6B7280]">结束时间</label>
              <input 
                type="time" 
                value={config.forbiddenHours.end}
                onChange={(e) => setConfig(prev => ({ ...prev, forbiddenHours: { ...prev.forbiddenHours, end: e.target.value } }))}
                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20"
              />
            </div>
          </div>
          <p className="text-xs text-[#6B7280] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            禁呼时段内，系统将自动拦截所有外呼请求。
          </p>
        </div>

        {/* Auto Replenish */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-[#1A1A1A]">自动补号策略</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1A1A1A]">冷却自动补号</span>
                <span className="text-[10px] text-[#6B7280]">号码进入冷却时，自动从空闲池补齐</span>
              </div>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, autoReplenishCooling: !prev.autoReplenishCooling }))}
                className={`w-12 h-6 rounded-full transition-all relative ${config.autoReplenishCooling ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.autoReplenishCooling ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-2xl">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#1A1A1A]">停用自动补号</span>
                <span className="text-[10px] text-[#6B7280]">号码被停用时，自动从空闲池补齐</span>
              </div>
              <button 
                onClick={() => setConfig(prev => ({ ...prev, autoReplenishDisabled: !prev.autoReplenishDisabled }))}
                className={`w-12 h-6 rounded-full transition-all relative ${config.autoReplenishDisabled ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.autoReplenishDisabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModule;
