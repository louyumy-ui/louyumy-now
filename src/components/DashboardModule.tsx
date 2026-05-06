import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', status: 'online', physicalCurrent: 80, physicalMax: 500, bandwidthCurrent: 120, bandwidthMax: 1000 },
  { id: '2', name: '移动-核心接入节点02', status: 'online', physicalCurrent: 340, physicalMax: 600, bandwidthCurrent: 450, bandwidthMax: 1000 },
  { id: '3', name: '电信-冗余灾备节点03', status: 'online', physicalCurrent: 45, physicalMax: 400, bandwidthCurrent: 88, bandwidthMax: 800 },
];

const MOCK_AI_POOL = {
  globalPurchase: 2000,
  realtimeOccupancy: 1540,
  dynamicQuota: 460,
  mandarin: { globalPurchase: 1200, realtimeOccupancy: 940 },
  cantonese: { globalPurchase: 800, realtimeOccupancy: 600 }
};

const DashboardModule: React.FC = () => {
  const totalPhysical = 1500;
  const totalCurrent = 465;
  const totalNumbers = 8240;
  const normalNumbers = 6540;
  const totalEnterprises = 42;
  const activeEnterprises = 38;

  return (
    <div className="space-y-8 custom-scrollbar overflow-auto h-full pr-4 pb-12">
      {/* Top Level Summary Cards - 12 Column Grid */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: '全国并发总占用', val: totalCurrent, total: totalPhysical, unit: '路', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI 实时算力消耗', val: MOCK_AI_POOL.realtimeOccupancy, total: MOCK_AI_POOL.globalPurchase, unit: '路', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: '全量在网号码库', val: normalNumbers, total: totalNumbers, unit: '个', color: 'text-green-600', bg: 'bg-green-50' },
          { label: '活跃企业主体数', val: activeEnterprises, total: totalEnterprises, unit: '家', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="col-span-3 bg-white p-8 rounded-[40px] shadow-sm border border-white hover:shadow-xl transition-all group"
          >
            <div className="mb-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-3">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-gray-900 tabular-nums">{card.val.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">/ {card.total.toLocaleString()} {card.unit}</span>
              </div>
            </div>
            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(card.val / card.total) * 100}%` }}
                className={cn("h-full rounded-full", card.color.replace('text', 'bg'))}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid - 12 Column */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: AI Resource Detail - 4 Column */}
        <div className="col-span-4 bg-white p-10 rounded-[40px] shadow-sm border border-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase">AI 算力水池矩阵</h3>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full italic uppercase tracking-widest">Global Sync</span>
            </div>

            <div className="space-y-6">
              {[
                { label: '普通话算力 (GPT-4o LLM)', stats: MOCK_AI_POOL.mandarin },
                { label: '粤语算力 (Llama-3 Fine-tuned)', stats: MOCK_AI_POOL.cantonese },
              ].map((pool, i) => (
                <div key={i} className="p-8 bg-gray-50/50 rounded-[32px] border border-dashed border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                     <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.1em]">{pool.label}</p>
                     <p className="text-[11px] font-black text-blue-600 tabular-nums">
                      {Math.round((pool.stats.realtimeOccupancy / pool.stats.globalPurchase) * 100)}%
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">总配额</p>
                        <p className="text-xl font-black tabular-nums">{pool.stats.globalPurchase.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">实时占用</p>
                        <p className="text-xl font-black text-blue-600 tabular-nums">{pool.stats.realtimeOccupancy.toLocaleString()}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-red-50 rounded-3xl border border-red-100/50">
             <p className="text-[11px] text-red-800 font-bold leading-relaxed uppercase tracking-tighter">
               DYNAMIC QUOTA ALERT: ALLOCATION APPROACHING PHYSICAL CAPACITY. SCALE-OUT REOMMENDED WITHIN 24H.
             </p>
          </div>
        </div>

        {/* Center: Node Topology - 8 Column */}
        <div className="col-span-8 bg-[#1A1A1A] p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px]"></div>
          
          <div className="relative z-10 space-y-10 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-2xl font-black tracking-tight text-white uppercase">SBC 边缘物理网关 (Cluster 0x1A)</h3>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Hyper-Scale Edge Infrastructure</p>
               </div>
               <div className="px-5 py-2 bg-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">Cluster Latency: 12ms</div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1 overflow-auto pr-4 custom-scrollbar">
              {MOCK_NODES.map(node => (
                <div key={node.id} className="p-8 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                   <div className="flex items-center justify-between mb-8">
                      <p className="text-base font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{node.name}</p>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>物理并发吞吐 / Load</span>
                            <span className="text-white font-black">{node.physicalCurrent} / {node.physicalMax}</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(node.physicalCurrent/node.physicalMax)*100}%` }}
                              className="h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(0,102,255,0.4)]" 
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>专线带宽水位 / Bandwidth</span>
                            <span className="text-white font-black">{node.bandwidthCurrent} Mbps</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(node.bandwidthCurrent/node.bandwidthMax)*100}%` }}
                              className="h-full bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]" 
                            />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/10 flex items-center justify-between">
               <div className="flex gap-10">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Physical Load</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ISP Bandwidth</span>
                  </div>
               </div>
               <button className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] hover:underline">Global Topology View</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Alert Strip */}
      <div className="bg-white px-10 py-8 rounded-[40px] border border-gray-100 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center animate-pulse border border-amber-100 shadow-sm">
               <span className="text-xl font-black">!</span>
            </div>
            <div>
               <p className="text-sm font-black text-gray-900 tracking-tight uppercase">Resource Monitoring Insights</p>
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.4em] mt-1">Real-time Anomaly Detection Service</p>
            </div>
         </div>
         <div className="flex gap-6">
            {['BYTEDANCE (15D Expire)', 'TENCENT (Billing Warning)', 'UNICOM-03 (Maintenance)'].map((t, i) => (
              <div key={i} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[9px] font-black text-gray-500 uppercase tracking-widest">
                {t}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DashboardModule;
