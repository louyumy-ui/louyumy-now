import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Database, 
  Zap, 
  Users, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  Server
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SBCNode, PhoneNumber, AIResourceStats, Enterprise } from '../types';

interface Props {
  sbcNodes: SBCNode[];
  numbers: PhoneNumber[];
  aiPool: AIResourceStats;
  enterprises: Enterprise[];
}

const DashboardModule: React.FC<Props> = ({ sbcNodes, numbers, aiPool, enterprises }) => {
  const totalPhysical = sbcNodes.reduce((acc, node) => acc + node.physicalMax, 0);
  const totalCurrent = sbcNodes.reduce((acc, node) => acc + node.physicalCurrent, 0);
  
  const totalNumbers = numbers.length;
  const normalNumbers = numbers.filter(n => n.status === 'normal').length;
  
  const activeEnterprises = enterprises.filter(e => e.status === 'active').length;

  return (
    <div className="space-y-10">
      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-4 gap-8">
        {[
          { label: '全国并发总占用', val: totalCurrent, total: totalPhysical, unit: '路', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI 实时算力消耗', val: aiPool.realtimeOccupancy, total: aiPool.globalPurchase, unit: '路', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: '全量在网号码', val: normalNumbers, total: totalNumbers, unit: '个', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '活跃企业主体', val: activeEnterprises, total: enterprises.length, unit: '家', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{card.label}</p>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-3xl font-black tracking-tighter text-gray-900">{card.val}</span>
                  <span className="text-xs font-bold text-gray-400">/ {card.total} {card.unit}</span>
                </div>
              </div>
            </div>
            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(card.val / card.total) * 100}%` }}
                className={cn("h-full rounded-full transition-all duration-1000", card.color.replace('text', 'bg'))}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left: AI Resource Pool Detail */}
        <div className="col-span-1 bg-white p-8 rounded-[40px] shadow-sm border border-white space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black tracking-tight text-gray-900">AI 算力水池 (跨节点)</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full italic uppercase">Real-time stats</span>
          </div>

          <div className="space-y-6">
            {[
              { label: '普通话算力', stats: aiPool.mandarin },
              { label: '粤语算力', stats: aiPool.cantonese },
            ].map((pool, i) => (
              <div key={i} className="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-sm font-black text-gray-900">{pool.label}</p>
                   <p className="text-xs font-bold text-blue-600">
                    占用率 {Math.round((pool.stats.realtimeOccupancy / pool.stats.globalPurchase) * 100)}%
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">总采购</p>
                      <p className="text-lg font-black">{pool.stats.globalPurchase}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">实时占用</p>
                      <p className="text-lg font-black text-blue-600">{pool.stats.realtimeOccupancy}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-red-50 rounded-3xl border border-red-100 space-y-3">
             <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-black">Quota 预警状态</p>
             </div>
             <p className="text-[11px] text-red-800 font-medium leading-relaxed">
               当前动态 Quota 分配 ({aiPool.dynamicQuota}) 已超过物理总容量 ({aiPool.globalPurchase})，峰值时期可能出现资源抢占。
             </p>
          </div>
        </div>

        {/* Center: Node Concurrency Heatmap (Simplified) */}
        <div className="col-span-2 bg-[#1A1A1A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] opacity-10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Server className="w-6 h-6 text-[#0066FF]" />
                 <h3 className="text-xl font-black tracking-tight text-white">SBC 核心节点状态</h3>
              </div>
              <p className="text-[10px] text-gray-500 font-bold">UPDATED: JUST NOW</p>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {sbcNodes.map(node => (
                <div key={node.id} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-black text-white">{node.name}</p>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        node.status === 'online' ? "bg-green-500" : "bg-red-500"
                      )}></span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                            <span>物理并发占用</span>
                            <span>{node.physicalCurrent} / {node.physicalMax}</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#0066FF] rounded-full w-[14%]"></div>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                            <span>专线带宽容量</span>
                            <span>{node.bandwidthCurrent} / {node.bandwidthMax}</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full w-[33%]"></div>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
                     <span className="text-[10px] text-gray-500 font-bold">物理负载</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                     <span className="text-[10px] text-gray-500 font-bold">带宽负载</span>
                  </div>
               </div>
               <button className="text-[10px] font-black text-[#0066FF] hover:underline">查看全量拓扑</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;
