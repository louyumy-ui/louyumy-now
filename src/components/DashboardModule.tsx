import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Database, 
  Zap, 
  Users, 
  AlertCircle,
  Server
} from 'lucide-react';
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
          { label: '全国并发总占用', val: totalCurrent, total: totalPhysical, unit: '路', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'AI 实时算力消耗', val: MOCK_AI_POOL.realtimeOccupancy, total: MOCK_AI_POOL.globalPurchase, unit: '路', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: '全量在网号码', val: normalNumbers, total: totalNumbers, unit: '个', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
          { label: '活跃企业主体', val: activeEnterprises, total: totalEnterprises, unit: '家', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="col-span-3 bg-white p-6 rounded-[32px] shadow-sm border border-white hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{card.label}</p>
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-black tracking-tighter text-gray-900">{card.val.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-400">/ {card.total.toLocaleString()} {card.unit}</span>
                </div>
              </div>
            </div>
            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
               <div 
                className={cn("h-full rounded-full transition-all duration-1000", card.color.replace('text', 'bg'))}
                style={{ width: `${(card.val / card.total) * 100}%` }}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid - 12 Column */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left: AI Resource Pool Detail - 4 Column */}
        <div className="col-span-4 bg-white p-8 rounded-[40px] shadow-sm border border-white space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-gray-900">AI 算力水池 (跨节点)</h3>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-full italic uppercase">Real-time</span>
          </div>

          <div className="space-y-4">
            {[
              { label: '普通话算力 (GPT-4o Backend)', stats: MOCK_AI_POOL.mandarin },
              { label: '粤语算力 (Custom Llama-3)', stats: MOCK_AI_POOL.cantonese },
            ].map((pool, i) => (
              <div key={i} className="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[11px] font-black text-gray-900 uppercase">{pool.label}</p>
                   <p className="text-[10px] font-bold text-blue-600">
                    {Math.round((pool.stats.realtimeOccupancy / pool.stats.globalPurchase) * 100)}%
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">总容量</p>
                      <p className="text-base font-black tabular-nums">{pool.stats.globalPurchase.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">实时占用</p>
                      <p className="text-base font-black text-blue-600 tabular-nums">{pool.stats.realtimeOccupancy.toLocaleString()}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex gap-4">
             <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
             <p className="text-[10px] text-red-800 font-medium leading-relaxed">
               当前动态 Quota 分配已接近物理总容量。建议 24h 内扩容 500 路 ASR 实例。
             </p>
          </div>
        </div>

        {/* Center: Node Heatmap - 8 Column */}
        <div className="col-span-8 bg-[#1A1A1A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px]"></div>
          
          <div className="relative z-10 space-y-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Server className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-black tracking-tight text-white uppercase">SBC 边缘物理节点 (Latency: 12ms)</h3>
               </div>
               <div className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Sync: Enabled</div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1 overflow-auto pr-2 custom-scrollbar">
              {MOCK_NODES.map(node => (
                <div key={node.id} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
                   <div className="flex items-center justify-between mb-6">
                      <p className="text-sm font-black text-white group-hover:text-blue-500 transition-colors uppercase">{node.name}</p>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                            <span>物理并发占用</span>
                            <span className="text-white">{node.physicalCurrent} / {node.physicalMax}</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(node.physicalCurrent/node.physicalMax)*100}%` }} />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                            <span>专线带宽容量</span>
                            <span className="text-white">{node.bandwidthCurrent} Mbps</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(node.bandwidthCurrent/node.bandwidthMax)*100}%` }} />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
               <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">物理负载</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">专线负载</span>
                  </div>
               </div>
               <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">全网物理拓扑矩阵</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center animate-bounce">
               <AlertCircle className="w-5 h-5" />
            </div>
            <div>
               <p className="text-xs font-black text-gray-900 tracking-tight">即将到期的资源提醒</p>
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Warnings Distribution</p>
            </div>
         </div>
         <div className="flex gap-4">
            {['字节跳动 (号码库 15天后)', '腾讯科技 (欠费警示)', '联通-03 (巡检预定)'].map((t, i) => (
              <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-400">
                {t}
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DashboardModule;
