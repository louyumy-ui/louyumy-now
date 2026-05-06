import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Server, 
  Database, 
  Activity, 
  Cpu, 
  Wifi, 
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  ActivitySquare
} from 'lucide-react';
import { cn, calculateEffectiveConcurrency } from '../lib/utils';
import { SBCNode, AIResourceStats, GlobalResource } from '../types';

interface Props {
  sbcNodes: SBCNode[];
  setSbcNodes: React.Dispatch<React.SetStateAction<SBCNode[]>>;
  aiPool: AIResourceStats;
  setAiPool: React.Dispatch<React.SetStateAction<AIResourceStats>>;
}

const ConcurrencyModule: React.FC<Props> = ({ 
  sbcNodes, 
  setSbcNodes, 
  aiPool, 
  setAiPool 
}) => {
  const globalRes: GlobalResource = {
    ttsAvailable: Math.max(0, aiPool.globalPurchase - aiPool.fixedGuarantee - aiPool.realtimeOccupancy),
    asrAvailable: Math.max(0, aiPool.globalPurchase - aiPool.fixedGuarantee - aiPool.realtimeOccupancy)
  };

  const dynamicPoolCapacity = aiPool.globalPurchase - aiPool.fixedGuarantee;
  const isOverSold = aiPool.dynamicQuota > dynamicPoolCapacity;

  return (
    <div className="space-y-10">
      {/* [顶部区域：全局 AI 算力水池] */}
      <div className="bg-[#1A1A1A] rounded-[48px] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0066FF10] to-transparent pointer-events-none"></div>
         
         <div className="relative z-10 space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="p-4 bg-[#0066FF] rounded-[24px] shadow-lg shadow-blue-500/30">
                     <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white tracking-tight">全局 AI 算力水池</h3>
                     <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Global AI Computing Core (Cross-Node)</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-12 text-right">
                  <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase">实时 CPS 队列流速</p>
                     <p className="text-2xl font-black text-white tabular-nums">120 <span className="text-xs font-bold text-gray-500">TPS</span></p>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-gray-500 font-bold uppercase">集群健康度</p>
                     <div className="flex items-center gap-2 justify-end">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-sm font-black text-white italic">EXCELLENT</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-8">
               {[
                 { label: '全局总采购 (TTS/ASR)', val: aiPool.globalPurchase, color: 'text-white' },
                 { label: '固定已分配保底', val: aiPool.fixedGuarantee, color: 'text-blue-400' },
                 { label: '动态池总容量', val: dynamicPoolCapacity, color: 'text-cyan-400' },
                 { label: '已预占动态额度', val: aiPool.dynamicQuota, color: isOverSold ? 'text-red-500' : 'text-blue-400' },
               ].map((item, i) => (
                 <div key={i} className="p-8 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all border-dashed">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3 leading-none">{item.label}</p>
                    <p className={cn("text-4xl font-black tabular-nums tracking-tighter", item.color)}>{item.val}</p>
                 </div>
               ))}
            </div>

            {isOverSold && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-950/40 border border-red-500/20 rounded-[32px] flex items-center gap-6"
              >
                 <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-white" />
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-black text-red-500">动态超卖预警: 资源可用性风险</p>
                    <p className="text-xs text-red-400/80 mt-1 font-medium italic">
                      当前已预付/预占动态额度 ({aiPool.dynamicQuota}) 超过池剩余容量，建议申请扩容或清理长期挂机但未释放的沉淀。
                    </p>
                 </div>
                 <button className="px-6 py-3 bg-red-500 text-white rounded-2xl text-xs font-black hover:bg-red-600 transition-all">申请算力扩容</button>
              </motion.div>
            )}
         </div>
      </div>

      {/* [中部区域：SBC 物理节点看板] */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
               <Server className="w-6 h-6 text-gray-900" />
               <h4 className="text-xl font-black text-gray-900 tracking-tight">SBC 物理节点看板</h4>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> 在线</span>
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> 维护</span>
               <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> 离线</span>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-8">
            {sbcNodes.map(node => {
              const effective = calculateEffectiveConcurrency(node, globalRes);
              
              return (
                <motion.div 
                  key={node.id}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-[40px] shadow-sm border border-white hover:shadow-2xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                           <Wifi className="w-7 h-7" />
                        </div>
                        <div>
                           <p className="text-lg font-black text-gray-900">{node.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{node.location}</p>
                        </div>
                     </div>
                     <span className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black italic",
                       node.status === 'online' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                     )}>{node.status.toUpperCase()}</span>
                  </div>

                  <div className="space-y-8">
                     <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                           <p className="text-[9px] text-gray-400 font-black uppercase">物理并发</p>
                           <p className="text-base font-black text-gray-900 tabular-nums">{node.physicalCurrent} / {node.physicalMax}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-gray-400 font-black uppercase">线路带宽</p>
                           <p className="text-base font-black text-gray-900 tabular-nums">{node.bandwidthCurrent} / {node.bandwidthMax}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] text-gray-400 font-black uppercase">CPS流速</p>
                           <p className="text-base font-black text-gray-900 tabular-nums">{node.cpsCurrent} / {node.cpsMax}</p>
                        </div>
                     </div>

                     <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-2">
                              当前有效可用
                              <div className="p-0.5 bg-blue-100 rounded text-blue-800"><Info className="w-2.5 h-2.5" /></div>
                           </p>
                           <p className="text-3xl font-black text-blue-600 mt-1 tabular-nums tracking-tighter">{effective}</p>
                        </div>
                        <ActivitySquare className="w-10 h-10 text-blue-200" />
                     </div>

                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 italic">
                           <span>DYNAMIC CALCULATION (MIN LOAD)</span>
                           <span>{Math.round((node.physicalCurrent / node.physicalMax) * 100)}%</span>
                        </div>
                        <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full w-[14%]"></div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              );
            })}
            
            <button className="border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-all group">
               <div className="p-6 rounded-full border-4 border-gray-100 mb-6 group-hover:border-[#0066FF]">
                  <Plus className="w-10 h-10" />
               </div>
               <span className="text-sm font-black uppercase tracking-widest">注册新 SBC 物理网关节点</span>
               <p className="text-[10px] font-bold text-gray-400 mt-2">IMS / FREEPBX / ASTERISK SUPPORTED</p>
            </button>
         </div>
      </div>
    </div>
  );
};

const Plus: React.FC<any> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);

export default ConcurrencyModule;
