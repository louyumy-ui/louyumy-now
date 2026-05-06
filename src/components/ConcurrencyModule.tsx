import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Server, 
  Cpu, 
  Wifi, 
  AlertTriangle,
  Info,
  Activity,
  History,
  ShieldCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', location: '北京/华北', status: 'online', physical: 80, physicalMax: 500, bandwidth: 120, bandwidthMax: 1000, fixed: 200, dynamic: 50 },
  { id: '2', name: '移动-核心接入节点02', location: '上海/华东', status: 'online', physical: 340, physicalMax: 600, bandwidth: 450, bandwidthMax: 1000, fixed: 150, dynamic: 80 },
  { id: '3', name: '电信-冗余灾备节点03', location: '广东/华南', status: 'online', physical: 45, physicalMax: 400, bandwidth: 88, bandwidthMax: 800, fixed: 50, dynamic: 20 },
];

const ConcurrencyModule: React.FC = () => {
  return (
    <div className="space-y-10 custom-scrollbar overflow-auto h-full pr-4">
      {/* [顶部区域：全局 AI 算力水池] */}
      <div className="bg-[#1A1A1A] rounded-[48px] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0066FF15] to-transparent pointer-events-none"></div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
         
         <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#0066FF] rounded-[24px] shadow-lg shadow-blue-500/30">
                     <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white tracking-tight">全局 AI 算力水池</h3>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Cross-Node AI Computing Core</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-10 text-right">
                  <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase">集群在用吞吐</p>
                     <p className="text-2xl font-black text-white tabular-nums tracking-tighter">1,240 <span className="text-xs font-bold text-gray-500">TPS</span></p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase">实时就绪度</p>
                     <div className="flex items-center gap-2 justify-end">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></span>
                        <span className="text-sm font-black text-white italic">SYNCHRONIZED</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-8">
               {[
                 { label: 'TTS 总采购容量', val: '2,000', unit: 'Concurrency', color: 'text-white' },
                 { label: 'ASR 当前占用', val: '1,540', unit: 'Usage', color: 'text-blue-400' },
                 { label: '动态共享池剩余', val: '460', unit: 'Available', color: 'text-emerald-400' },
                 { label: '算力负载偏移度', val: '0.04', unit: 'Latency', color: 'text-amber-400' },
               ].map((item, i) => (
                 <div key={i} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 leading-none">{item.label}</p>
                    <p className={cn("text-4xl font-black tabular-nums tracking-tighter", item.color)}>{item.val} <span className="text-[10px] text-gray-600 block mt-1">{item.unit}</span></p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* [中部区域：SBC 物理节点看板] */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-100 rounded-xl">
                  <Server className="w-5 h-5 text-gray-900" />
               </div>
               <h4 className="text-xl font-black text-gray-900 tracking-tight">SBC 边缘物理节点 (Core Nodes)</h4>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-gray-400 uppercase">
               <span className="flex items-center gap-2 hover:text-emerald-500 cursor-pointer transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> 在线状态</span>
               <span className="flex items-center gap-2 hover:text-amber-500 cursor-pointer transition-colors"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> 负载预警</span>
               <div className="w-px h-4 bg-gray-100 mx-2"></div>
               <BarChart3 className="w-4 h-4" />
            </div>
         </div>

         <div className="grid grid-cols-3 gap-8">
            {MOCK_NODES.map(node => (
              <motion.div 
                key={node.id}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[48px] shadow-sm border border-white hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-900 group-hover:bg-[#0066FF] group-hover:text-white transition-all shadow-sm">
                         <Wifi className="w-8 h-8" />
                      </div>
                      <div>
                         <p className="text-xl font-black text-gray-900 leading-tight">{node.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">LOC: {node.location}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                         <p className="text-[10px] font-black text-emerald-500 italic uppercase">Operational</p>
                      </div>
                      <p className="text-[10px] text-gray-300 font-black">NODE_ID: {node.id.padStart(4, '0')}</p>
                   </div>
                </div>

                <div className="space-y-10">
                   {/* Progress Indicators */}
                   <div className="space-y-6">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>物理并发负载 (Physical)</span>
                            <span className="text-gray-900">{node.physical} / {node.physicalMax}</span>
                         </div>
                         <div className="h-3 bg-gray-50 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                              style={{ width: `${(node.physical / node.physicalMax) * 100}%` }}
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>线路带宽占用 (Bandwidth)</span>
                            <span className="text-gray-900">{node.bandwidth} / {node.bandwidthMax} Mbps</span>
                         </div>
                         <div className="h-3 bg-gray-50 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-[#1A1A1A] rounded-full transition-all duration-1000" 
                              style={{ width: `${(node.bandwidth / node.bandwidthMax) * 100}%` }}
                            />
                         </div>
                      </div>
                   </div>

                   {/* Fixed vs Dynamic */}
                   <div className="grid grid-cols-2 gap-4 pb-4">
                      <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 border-dashed">
                         <p className="text-[10px] text-blue-600 font-black uppercase mb-2">已付费固定保底</p>
                         <p className="text-3xl font-black text-blue-700 tracking-tighter tabular-nums">{node.fixed} <span className="text-xs opacity-50">路</span></p>
                      </div>
                      <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100 border-dashed">
                         <p className="text-[10px] text-emerald-600 font-black uppercase mb-2">动态池剩余占用</p>
                         <p className="text-3xl font-black text-emerald-700 tracking-tighter tabular-nums">{node.dynamic} <span className="text-xs opacity-50">路</span></p>
                      </div>
                   </div>

                   <button className="w-full py-5 bg-gray-900 text-white rounded-3xl text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2 group/btn">
                      查看节点健康矩阵
                      <History className="w-4 h-4 group-hover/btn:rotate-180 transition-transform" />
                   </button>
                </div>
              </motion.div>
            ))}
            
            <button className="border-4 border-dashed border-gray-100 rounded-[48px] flex flex-col items-center justify-center p-12 text-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-all bg-white hover:shadow-2xl group">
               <div className="p-6 rounded-full border-4 border-gray-100 mb-6 group-hover:border-[#0066FF] transition-colors">
                  <Server className="w-12 h-12" />
               </div>
               <span className="text-lg font-black uppercase tracking-widest text-gray-900 group-hover:text-[#0066FF] transition-colors">注册新物理网关</span>
               <p className="text-xs font-bold text-gray-400 mt-2 max-w-[180px] text-center">Support SIP / IMS / TRUNK Protocols Integration</p>
            </button>
         </div>
      </div>
    </div>
  );
};

export default ConcurrencyModule;
