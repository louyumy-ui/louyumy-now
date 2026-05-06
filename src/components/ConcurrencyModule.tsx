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
      {/* 算力水池业务逻辑重绘 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex bg-gray-100 p-1 rounded-2xl">
              <button 
                onClick={() => setActivePool('TTS')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-black transition-all",
                  activePool === 'TTS' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                TTS 语音合成
              </button>
              <button 
                onClick={() => setActivePool('ASR')}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-xs font-black transition-all",
                  activePool === 'ASR' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                ASR 语音识别
              </button>
           </div>
           <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full italic">
              全局算力集群同步中
           </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
           <div className="col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">全局总采购</p>
              <p className="text-4xl font-black text-gray-900 tabular-nums">20</p>
              <div className="pt-4 border-t border-gray-50 flex gap-4 text-[9px] font-black text-gray-400 uppercase">
                 <span>普通话 10</span>
                 <span className="w-px h-3 bg-gray-100"></span>
                 <span>粤语 10</span>
              </div>
           </div>

           <div className="col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">固定池-已分配</p>
              <p className="text-4xl font-black text-blue-600 tabular-nums">4</p>
              <p className="text-[9px] font-black text-gray-300 leading-relaxed">
                 固定并发享有绝对优先权，系统将确保资源不可被抢占。
              </p>
           </div>

           <div className="col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4 text-emerald-600 border-emerald-50">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">动态池总量</p>
              <p className="text-4xl font-black tabular-nums">17</p>
              <div className="pt-4 border-t border-emerald-50/50 flex gap-4 text-[9px] font-black text-emerald-400 uppercase">
                 <span>普通话 7</span>
                 <span className="w-px h-3 bg-emerald-50"></span>
                 <span>粤语 10</span>
              </div>
           </div>

           <div className="col-span-3 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">动态池-已分配</p>
              <p className="text-4xl font-black text-gray-900 tabular-nums">33</p>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg w-fit">
                 超量溢出预警
              </div>
           </div>
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
