import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Server, 
  Cpu, 
  Wifi, 
  Activity,
  History,
  BarChart3
} from 'lucide-react';

const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', location: '北京/华北', status: 'online', physical: 80, physicalMax: 500, bandwidth: 120, bandwidthMax: 1000, fixed: 200, dynamic: 50 },
  { id: '2', name: '移动-核心接入节点02', location: '上海/华东', status: 'online', physical: 340, physicalMax: 600, bandwidth: 450, bandwidthMax: 1000, fixed: 150, dynamic: 80 },
  { id: '3', name: '电信-冗余灾备节点03', location: '广东/华南', status: 'online', physical: 45, physicalMax: 400, bandwidth: 88, bandwidthMax: 800, fixed: 50, dynamic: 20 },
];

const ConcurrencyModule: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 custom-scrollbar overflow-auto h-full pr-4 pb-12">
      {/* [顶部区域：全局 AI 算力水池] - 12 栏独占 */}
      <div className="col-span-12 bg-[#1A1A1A] rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent"></div>
         <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
            <div className="col-span-4 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-600 rounded-2xl">
                     <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white">全局 AI 算力水池</h3>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Resource Pool Cluster</p>
                  </div>
               </div>
               <div className="flex gap-10">
                  <div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">在用吞吐</p>
                     <p className="text-2xl font-black text-white tabular-nums">1,240 <span className="text-xs text-gray-600">TPS</span></p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div>
                     <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">集群延迟</p>
                     <p className="text-2xl font-black text-emerald-400 tabular-nums">12<span className="text-xs">ms</span></p>
                  </div>
               </div>
            </div>

            <div className="col-span-8 grid grid-cols-3 gap-6">
               {[
                 { label: 'TTS 总容量', val: '2,000', color: 'text-white' },
                 { label: 'ASR 实时消耗', val: '1,540', color: 'text-blue-500' },
                 { label: '动态共享池剩余', val: '460', color: 'text-emerald-500' },
               ].map((item, i) => (
                 <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">{item.label}</p>
                    <p className={`text-4xl font-black tabular-nums ${item.color}`}>{item.val}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* [下半部分：SBC 物理节点卡片] - 4 栏平铺 */}
      <div className="col-span-12 flex items-center justify-between mt-4">
         <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-gray-900" />
            <h4 className="text-lg font-black text-gray-900 uppercase">SBC 边缘物理节点 (Core)</h4>
         </div>
         <BarChart3 className="w-5 h-5 text-gray-300" />
      </div>

      {MOCK_NODES.map(node => (
        <div key={node.id} className="col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Wifi className="w-6 h-6" />
                 </div>
                 <div>
                    <p className="text-lg font-black text-gray-900 leading-none">{node.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">NODE: {node.id.padStart(3, '0')}</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[9px] font-black text-emerald-500 italic uppercase">Sync</span>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                 <div className="flex justify-between text-[9px] font-black uppercase text-gray-400">
                    <span>物理并发负载 (Load)</span>
                    <span className="text-gray-900">{node.physical} / {node.physicalMax}</span>
                 </div>
                 <div className="h-2.5 bg-gray-50 rounded-full p-0.5">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(node.physical/node.physicalMax)*100}%` }}></div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 border-dashed">
                    <p className="text-[9px] text-blue-600 font-black uppercase mb-1">已售固定并发</p>
                    <p className="text-2xl font-black text-blue-700 tabular-nums">{node.fixed}</p>
                 </div>
                 <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 border-dashed">
                    <p className="text-[9px] text-emerald-600 font-black uppercase mb-1">动态池占用</p>
                    <p className="text-2xl font-black text-emerald-700 tabular-nums">{node.dynamic}</p>
                 </div>
              </div>

              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                 进入节点健康诊断 (Audit)
              </button>
           </div>
        </div>
      ))}

      <div className="col-span-4 border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-8 bg-white opacity-60 hover:opacity-100 cursor-not-allowed transition-all">
         <Server className="w-10 h-10 text-gray-200 mb-4" />
         <span className="text-[10px] font-black uppercase text-gray-400">注册新物理网关</span>
      </div>
    </div>
  );
};

export default ConcurrencyModule;
