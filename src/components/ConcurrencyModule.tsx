import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', location: '北京/华北', status: 'online', physical: 80, physicalMax: 500, bandwidth: 120, bandwidthMax: 1000, fixed: 200, dynamic: 50 },
  { id: '2', name: '移动-核心接入节点02', location: '上海/华东', status: 'online', physical: 340, physicalMax: 600, bandwidth: 450, bandwidthMax: 1000, fixed: 150, dynamic: 80 },
  { id: '3', name: '电信-冗余灾备节点03', location: '广东/华南', status: 'online', physical: 45, physicalMax: 400, bandwidth: 88, bandwidthMax: 800, fixed: 50, dynamic: 20 },
];

const ConcurrencyModule: React.FC = () => {
  const [activePool, setActivePool] = useState<'TTS' | 'ASR'>('TTS');

  return (
    <div className="space-y-8 custom-scrollbar overflow-auto h-full pr-4 pb-12">
      {/* 算力水池业务逻辑 - 深度复刻截图 */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 space-y-8">
        <div className="flex items-center justify-between pb-8 border-b border-gray-50">
           <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setActivePool('TTS')}
                className={cn(
                  "px-10 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                  activePool === 'TTS' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                TTS (声音复制)
              </button>
              <button 
                onClick={() => setActivePool('ASR')}
                className={cn(
                  "px-10 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                  activePool === 'ASR' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                ASR (语音识别)
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-[11px] font-black tracking-tight flex items-center gap-4">
                 <span className="text-gray-400 uppercase">普通话 <span className="text-blue-600">10 路</span></span>
                 <span className="w-px h-3 bg-gray-200" />
                 <span className="text-gray-400 uppercase">粤语 <span className="text-blue-600">20 路</span></span>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                 切片汇总
              </div>
           </div>
        </div>

        {/* 紧急预警 Banner */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-4">
           <div className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-red-500/20">!</div>
           <div>
              <p className="text-xs font-black text-red-800 leading-none">紧急预警</p>
              <p className="text-[10px] text-red-600/80 font-black mt-1.5 uppercase tracking-tight">
                 当前 <span className="text-red-900 underline decoration-red-900/30 underline-offset-4">TTS 普通常话的动态池-预分配总量 (18路)</span> 已经超越动态池容量 (17路)，请注意可能导致抢占拥堵。
              </p>
           </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
           {/* Card 1: 采购总量 */}
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 group hover:shadow-xl transition-all">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">全局总采购</p>
                 <p className="text-5xl font-black text-gray-900 tabular-nums tracking-tighter">30</p>
                 <p className="text-[9px] font-black text-red-500 mt-2 uppercase tracking-widest">物理红线</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-50">
                 <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
                    <span className="flex items-center gap-2 font-mono"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 普通话 10</span>
                    <span className="flex items-center gap-2 font-mono"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 粤语 20</span>
                 </div>
              </div>
           </div>

           {/* Card 2: 最短板并发量 - New Bottleneck Metric */}
           <div className="bg-[#1A1A1A] p-8 rounded-[40px] shadow-2xl space-y-6 group transform hover:-translate-y-1 transition-all">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">模板内最短板</p>
                 <p className="text-5xl font-black text-white tabular-nums tracking-tighter">12</p>
                 <p className="text-[9px] font-black text-blue-500 mt-2 uppercase tracking-widest">当前链路瓶颈阈值</p>
              </div>
              <div className="pt-6 border-t border-white/10">
                 <p className="text-[9px] font-black text-gray-500 leading-relaxed uppercase">
                    由运营商线路 (UNICOM-03) 实时动态CPS反算得出，为当前业务最高可用上限。
                 </p>
              </div>
           </div>

           {/* Card 3: 动态池总量 */}
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">动态分配池总量</p>
                 <p className="text-5xl font-black text-gray-900 tabular-nums tracking-tighter">17</p>
                 <p className="text-[9px] font-black text-gray-300 mt-2 uppercase tracking-widest">动态池可用总量</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-50">
                 <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase font-mono">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 普通话 7</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 粤语 10</span>
                 </div>
              </div>
           </div>

           {/* Card 4: 预分配占用量 */}
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 border-amber-100">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">业务预分配占用</p>
                 <p className="text-5xl font-black text-gray-900 tabular-nums tracking-tighter">33</p>
                 <p className="text-[9px] font-black text-amber-500 mt-2 uppercase tracking-widest italic">预分配总量 / 动态抢占式</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-50">
                 <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase font-mono">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 普通话 18</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> 粤语 15</span>
                 </div>
              </div>
           </div>

           {/* Card 5: 实时实际占用 */}
           <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6 border-emerald-100">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">当前通话实际占用</p>
                 <p className="text-5xl font-black text-emerald-600 tabular-nums tracking-tighter">2</p>
                 <p className="text-[9px] font-black text-emerald-500 mt-2 uppercase tracking-widest">Real-time Usage</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-50">
                 <div className="flex justify-between text-[9px] font-black text-emerald-600/40 uppercase font-mono">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-200 rounded-full" /> 普通话 1</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-200 rounded-full" /> 粤语 1</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-12 pt-6">
           {['并发购买记录', '并发占用明细', '预警设置'].map((t, i) => (
             <button key={i} className={cn(
               "text-[11px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all",
               i === 0 ? "text-blue-600 border-blue-600" : "text-gray-400 border-transparent hover:text-gray-900"
             )}>
                {t}
             </button>
           ))}
        </div>
      </div>

      {/* SBC 节点卡片 */}
      <div className="pt-4 border-t border-gray-50">
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">SBC 核心边缘节点集群</h4>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">边缘计算节点矩阵</span>
         </div>

         <div className="grid grid-cols-12 gap-6">
            {MOCK_NODES.map(node => (
              <div key={node.id} className="col-span-4 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <p className="text-xl font-black text-gray-900 leading-none uppercase tracking-tight">{node.name}</p>
                       <p className="text-[9px] text-gray-400 font-black uppercase mt-2 tracking-widest">物理区域: {node.location}</p>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 rounded-lg">
                       <span className="text-[9px] font-black text-emerald-600 uppercase italic">运行中</span>
                    </div>
                 </div>

                 <div className="space-y-10">
                    <div className="space-y-4">
                       <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 tracking-widest">
                          <span>当前负载</span>
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
                          <span>专线带宽</span>
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

                    <button className="w-full py-5 bg-[#1A1A1A] text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all">
                       查看节点详情
                    </button>
                 </div>
              </div>
            ))}
            
            <div className="col-span-4 border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-8 bg-white/50 opacity-40 hover:opacity-100 cursor-not-allowed transition-all min-h-[460px]">
               <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.4em]">初始化新物理节点</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ConcurrencyModule;
