import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', location: '北京/华北', status: 'online', physical: 80, physicalMax: 500, bandwidth: 120, bandwidthMax: 1000, fixed: 200, dynamic: 50 },
  { id: '2', name: '移动-核心接入节点02', location: '上海/华东', status: 'online', physical: 340, physicalMax: 600, bandwidth: 450, bandwidthMax: 1000, fixed: 150, dynamic: 80 },
  { id: '3', name: '电信-冗余灾备节点03', location: '广东/华南', status: 'online', physical: 45, physicalMax: 400, bandwidth: 88, bandwidthMax: 800, fixed: 50, dynamic: 20 },
];

const ConcurrencyModule: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 custom-scrollbar overflow-auto h-full pr-4 pb-12">
      {/* [顶部：全局 AI 算力水池] - 12 栏独占 */}
      <div className="col-span-12 bg-[#1A1A1A] rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent"></div>
         <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
            <div className="col-span-4 space-y-6">
               <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">全局 AI 算力水池</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Resource Pool Cluster Infrastructure</p>
               </div>
               <div className="flex gap-10">
                  <div>
                     <p className="text-[9px] text-gray-500 font-black uppercase mb-1">在用实时吞吐</p>
                     <p className="text-2xl font-black text-white tabular-nums">1,240 <span className="text-[10px] text-gray-600">TPS</span></p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div>
                     <p className="text-[9px] text-gray-500 font-black uppercase mb-1">集群平均延迟</p>
                     <p className="text-2xl font-black text-emerald-400 tabular-nums">12<span className="text-[10px]">ms</span></p>
                  </div>
               </div>
            </div>

            <div className="col-span-8 grid grid-cols-3 gap-6">
               {[
                 { label: 'TTS 总采购吞吐量', val: '2,000', color: 'text-white' },
                 { label: 'ASR 实时消耗水位', val: '1,540', color: 'text-blue-500' },
                 { label: '动态共享池剩余配额', val: '460', color: 'text-emerald-500' },
               ].map((item, i) => (
                 <div key={i} className="p-8 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
                    <p className={`text-4xl font-black tabular-nums tracking-tighter ${item.color}`}>{item.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* [下半部分：SBC 节点卡片] - 4 栏平铺 */}
      <div className="col-span-12 flex items-center justify-between mt-8 mb-2">
         <div className="flex items-center gap-3">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">SBC 核心边缘节点集群 (Edge Computing Nodes)</h4>
         </div>
         <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Network Topology Matrix</div>
      </div>

      {MOCK_NODES.map(node => (
        <div key={node.id} className="col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <p className="text-xl font-black text-gray-900 leading-none uppercase tracking-tight">{node.name}</p>
                 <p className="text-[9px] text-gray-400 font-black uppercase mt-2 tracking-widest">Zone: {node.location}</p>
              </div>
              <div className="px-3 py-1 bg-emerald-50 rounded-lg">
                 <span className="text-[9px] font-black text-emerald-600 uppercase italic">Active</span>
              </div>
           </div>

           <div className="space-y-10">
              <div className="space-y-4">
                 <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    <span>物理并发负载 / Loading</span>
                    <span className="text-gray-900 font-black">{node.physical} / {node.physicalMax}</span>
                 </div>
                 <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(node.physical/node.physicalMax)*100}%` }}
                      className="h-full bg-blue-600 rounded-full" 
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 tracking-widest">
                    <span>专线带宽水位 / Bandwidth</span>
                    <span className="text-gray-900 font-black">{node.bandwidth} / {node.bandwidthMax} Mbps</span>
                 </div>
                 <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(node.bandwidth/node.bandwidthMax)*100}%` }}
                      className="h-full bg-cyan-400 rounded-full" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[8px] text-gray-400 font-black uppercase mb-1 tracking-widest">固定预留</p>
                    <p className="text-xl font-black text-gray-900 tabular-nums">{node.fixed}</p>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[8px] text-gray-400 font-black uppercase mb-1 tracking-widest">动态分配</p>
                    <p className="text-xl font-black text-gray-900 tabular-nums">{node.dynamic}</p>
                 </div>
              </div>

              <button className="w-full py-5 bg-[#1A1A1A] text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all">
                 Health Check Routine
              </button>
           </div>
        </div>
      ))}

      <div className="col-span-4 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-8 bg-white/50 opacity-40 hover:opacity-100 cursor-not-allowed transition-all min-h-[460px]">
         <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.4em]">Initialize New Node</span>
      </div>
    </div>
  );
};

export default ConcurrencyModule;
