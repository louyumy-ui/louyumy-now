import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  AlertTriangle, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Share2, 
  Activity,
  ChevronDown,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AIResourceStats, AIResourceAllocation } from '../types';

const MOCK_TTS_STATS: AIResourceStats = {
  globalPurchase: 20,
  fixedGuarantee: 4,
  dynamicQuota: 36,
  realtimeOccupancy: 2,
  mandarin: {
    globalPurchase: 10,
    fixedGuarantee: 1,
    dynamicQuota: 18,
    realtimeOccupancy: 0,
  },
  cantonese: {
    globalPurchase: 10,
    fixedGuarantee: 3,
    dynamicQuota: 18,
    realtimeOccupancy: 2,
  }
};

const MOCK_ASR_STATS: AIResourceStats = {
  globalPurchase: 50,
  fixedGuarantee: 10,
  dynamicQuota: 60,
  realtimeOccupancy: 15,
  mandarin: {
    globalPurchase: 30,
    fixedGuarantee: 5,
    dynamicQuota: 40,
    realtimeOccupancy: 10,
  },
  cantonese: {
    globalPurchase: 20,
    fixedGuarantee: 5,
    dynamicQuota: 20,
    realtimeOccupancy: 5,
  }
};

const MOCK_ALLOCATIONS: AIResourceAllocation[] = [
  { id: '1', name: '金融催收A组', type: 'dynamic', language: 'mandarin', limit: 20, occupancy: 0, status: 'warning' },
  { id: '2', name: '正式拨打线路', type: 'fixed', language: 'mandarin', limit: 1, occupancy: 0, status: 'active' },
  { id: '3', name: '粤语外呼中心', type: 'fixed', language: 'cantonese', limit: 3, occupancy: 2, status: 'active' },
  { id: '4', name: '测试坐席01', type: 'dynamic', language: 'cantonese', limit: 18, occupancy: 0, status: 'warning' },
  { id: '5', name: '临时促销业务', type: 'dynamic', language: 'mandarin', limit: 5, occupancy: 0, status: 'active' },
];

const AIResourceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TTS' | 'ASR'>('TTS');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = activeTab === 'TTS' ? MOCK_TTS_STATS : MOCK_ASR_STATS;
  
  // Calculate Dynamic Pool Capacity
  const dynamicPoolCapacity = stats.globalPurchase - stats.fixedGuarantee;
  
  // Calculate Risk
  const isOverSold = stats.dynamicQuota > dynamicPoolCapacity;
  const overSoldPercent = isOverSold ? Math.round(((stats.dynamicQuota - dynamicPoolCapacity) / dynamicPoolCapacity) * 100) : 0;

  const filteredAllocations = MOCK_ALLOCATIONS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (type: 'fixed' | 'dynamic') => {
    if (type === 'fixed') {
      return <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100 italic">固定保底</span>;
    }
    return <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">动态共享</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('TTS')}
            className={cn(
              "px-8 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'TTS' ? "bg-white text-[#0066FF] shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            TTS (声音复刻)
          </button>
          <button 
            onClick={() => setActiveTab('ASR')}
            className={cn(
              "px-8 py-2 rounded-lg text-sm font-bold transition-all",
              activeTab === 'ASR' ? "bg-white text-[#0066FF] shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            ASR (语音识别)
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">语言切片汇总</p>
            <p className="text-sm font-bold text-gray-700">
              普通话 <span className="text-[#0066FF]">{stats.mandarin.globalPurchase}</span> 路 | 
              粤语 <span className="text-[#0066FF]">{stats.cantonese.globalPurchase}</span> 路
            </p>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <BarChart3 className="w-5 h-5 text-gray-300" />
        </div>
      </div>

      {/* Risk Alert Banner */}
      <AnimatePresence>
        {isOverSold && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 0 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-xl p-4 flex items-center gap-3 overflow-hidden"
          >
            <div className="bg-[#EF4444] p-1.5 rounded-lg shadow-sm">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#991B1B]">紧急超卖风险预警</p>
              <p className="text-xs text-[#B91C1C] opacity-80">
                当前动态预分配额度 ({stats.dynamicQuota}路) 已超过动态池容量 ({dynamicPoolCapacity}路) <span className="font-bold underline">{overSoldPercent}%</span>，请注意先到先得可能导致的抢占拥堵。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Metrics Cards */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: '全局总采购', val: stats.globalPurchase, sub: '采购红线不可突破', icon: ShieldCheck, color: 'text-gray-900', bg: 'bg-white', mandarin: stats.mandarin.globalPurchase, cantonese: stats.cantonese.globalPurchase },
          { label: '已分配固定保底', val: stats.fixedGuarantee, sub: '付费/正式业务独占锁定', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50/10', mandarin: stats.mandarin.fixedGuarantee, cantonese: stats.cantonese.fixedGuarantee },
          { label: '动态池总容量', val: dynamicPoolCapacity, sub: '总采购 - 固定保底', icon: Share2, color: 'text-blue-600', bg: 'bg-blue-50/10', mandarin: stats.mandarin.globalPurchase - stats.mandarin.fixedGuarantee, cantonese: stats.cantonese.globalPurchase - stats.cantonese.fixedGuarantee },
          { label: '动态预分配额度', val: stats.dynamicQuota, sub: '预占配额 (可超卖状态)', icon: BarChart3, color: isOverSold ? 'text-[#EF4444]' : 'text-[#0066FF]', bg: 'bg-red-50/10', mandarin: stats.mandarin.dynamicQuota, cantonese: stats.cantonese.dynamicQuota },
          { label: '实时实际占用', val: stats.realtimeOccupancy, sub: '当前通话真实消耗', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50/10', mandarin: stats.mandarin.realtimeOccupancy, cantonese: stats.cantonese.realtimeOccupancy },
        ].map((card, i) => (
          <div key={i} className={cn("p-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group")}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500">{card.label}</p>
                <card.icon className={cn("w-4 h-4 opacity-20", card.color)} />
              </div>
              <div className="space-y-1">
                <p className={cn("text-3xl font-black tabular-nums tracking-tight", card.color)}>{card.val}</p>
                <p className="text-[10px] text-gray-400">{card.sub}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                <span className="text-[9px] font-black text-gray-500">普通话</span>
                <span className="text-[10px] font-bold text-gray-700">{card.mandarin}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                <span className="text-[9px] font-black text-gray-500">粤语</span>
                <span className="text-[10px] font-bold text-gray-700">{card.cantonese}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocation List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-gray-800">分配明细列表</h3>
            <span className="px-2 py-0.5 rounded bg-gray-200 text-[#1A1A1A] text-[10px] font-bold">共 {filteredAllocations.length} 项</span>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索客户/坐席名称" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-[#D9D9D9] rounded-lg text-xs focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 font-bold text-[#1A1A1A]">客户/坐席名称</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A]">类型</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A]">语言</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A] text-center">分配额度上限</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A] text-center">实时占用</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A] text-center">剩余可用</th>
                <th className="px-6 py-4 font-bold text-[#1A1A1A] text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredAllocations.map((allocation) => {
                const isOverLimit = allocation.type === 'dynamic' && allocation.limit > dynamicPoolCapacity;
                const remaining = allocation.limit - allocation.occupancy;
                
                return (
                  <tr key={allocation.id} className="hover:bg-[#F9FAFB] transition-colors group h-14">
                    <td className="px-6 py-4 font-bold text-gray-700">{allocation.name}</td>
                    <td className="px-6 py-4">{getStatusBadge(allocation.type)}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">
                        {allocation.language === 'mandarin' ? '普通话' : '粤语'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("font-black tabular-nums", isOverLimit ? "text-[#EF4444]" : "text-gray-900")}>
                        {allocation.limit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold tabular-nums text-gray-500">{allocation.occupancy}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isOverLimit ? (
                        <div className="flex flex-col items-center">
                          <span className="text-[#EF4444] font-black uppercase text-[10px]">池上限超出</span>
                          <span className="text-[9px] text-[#EF4444] font-medium italic">🚨 资源风险</span>
                        </div>
                      ) : (
                        <span className={cn("font-bold tabular-nums", remaining > 0 ? "text-[#0066FF]" : "text-gray-400")}>
                          {remaining}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1 w-2 h-2 rounded-full",
                        allocation.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : 
                        allocation.status === 'warning' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" : "bg-red-500"
                      )}></span>
                    </td>
                  </tr>
                );
              })}
              {filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50/50 border-t flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[10px] text-gray-400 italic">
            备注：动态预估额度仅作为 Quota 管控准入，不代表实际底层硬件层并发锁定的绝对交付，峰值期间请关注抢占反馈。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIResourceModule;
