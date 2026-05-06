import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Clock,
  Briefcase,
  Layers,
  Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Enterprise, SubAccount } from '../types';

interface Props {
  enterprises: Enterprise[];
  setEnterprises: React.Dispatch<React.SetStateAction<Enterprise[]>>;
}

const EnterpriseModule: React.FC<Props> = ({ enterprises, setEnterprises }) => {
  const [selectedEnt, setSelectedEnt] = useState<string | null>(null);

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-2xl">
               <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight">企业主体管理</h3>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Enterprise Hierarchy & Billing Matrix</p>
            </div>
         </div>
         <button className="flex items-center gap-2 px-6 py-4 bg-[#0066FF] text-white rounded-2xl text-xs font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
            <Plus className="w-5 h-5" /> 录入新合同主体
         </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedEnt ? (
            <motion.div 
               key="list"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="grid grid-cols-2 gap-8"
            >
              {enterprises.map(ent => (
                <div 
                  key={ent.id}
                  onClick={() => setSelectedEnt(ent.id)}
                  className="bg-white p-10 rounded-[48px] border border-white shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8">
                     <div className="p-2 rounded-full border border-gray-100 text-gray-300 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                     </div>
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-all font-black text-xl">
                          {ent.name.charAt(0)}
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-gray-900 tracking-tight">{ent.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <div className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-black italic",
                               ent.status === 'active' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                             )}>
                               {ent.status.toUpperCase()}
                             </div>
                             <span className="text-[10px] text-gray-400 font-bold">UID: {ent.id.toUpperCase()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                       <div className="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-2">合约并发</p>
                          <p className="text-xl font-black text-gray-900 tabular-nums">{ent.concurrencyQuota}</p>
                       </div>
                       <div className="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-2">剩余额度</p>
                          <p className="text-xl font-black text-gray-900 tabular-nums">{ent.minutesQuota}m</p>
                       </div>
                       <div className="p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 text-amber-600">
                          <p className="text-[10px] text-gray-400 font-black uppercase mb-2">账期提醒</p>
                          <p className="text-xs font-black truncate">{ent.expiryDate}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                       <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                               <div className="w-full h-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">子</div>
                            </div>
                          ))}
                          <div className="w-10 h-10 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-gray-400">+5</div>
                       </div>
                       <span className="text-xs font-bold text-gray-400 group-hover:text-[#0066FF] transition-colors">查看子账号架构 (9)</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
               key="detail"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-white rounded-[48px] shadow-2xl border border-gray-100 flex flex-col h-full overflow-hidden"
            >
               {/* Detail Header */}
               <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button onClick={() => setSelectedEnt(null)} className="p-4 bg-white rounded-3xl border shadow-sm hover:scale-105 transition-all text-gray-400 hover:text-gray-900">
                        <ArrowUpRight className="w-6 h-6 rotate-[225deg]" />
                     </button>
                     <div>
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">
                           {enterprises.find(e => e.id === selectedEnt)?.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                           <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400"><Clock className="w-3.5 h-3.5" /> 2026-12-31 到期</span>
                           <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400"><CreditCard className="w-3.5 h-3.5" /> 预付费模式</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">一键冻结实体</button>
                     <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20">分配新子账号</button>
                  </div>
               </div>

               {/* Detail Content: Sub-accounts */}
               <div className="flex-1 overflow-auto p-10 custom-scrollbar">
                  <div className="grid grid-cols-3 gap-8">
                     {[
                       { name: '华北自营部', concurrency: 50, minutes: 12000, color: 'border-blue-500' },
                       { name: '华南外呼部', concurrency: 100, minutes: 25000, color: 'border-purple-500' },
                       { name: '电销测试组', concurrency: 10, minutes: 2000, color: 'border-amber-500' },
                     ].map((sub, i) => (
                        <div key={i} className={cn("p-8 bg-white rounded-[32px] border-2 shadow-sm relative overflow-hidden group", sub.color)}>
                           <div className="absolute top-0 right-0 p-6">
                              <MoreHorizontal className="w-5 h-5 text-gray-300 cursor-pointer" />
                           </div>
                           
                           <div className="space-y-6">
                              <div className="flex items-center gap-3">
                                 <div className="p-3 bg-gray-50 rounded-2xl text-gray-900">
                                    <Users className="w-5 h-5" />
                                 </div>
                                 <h5 className="font-black text-gray-900">{sub.name}</h5>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold">子账号并发配额</span>
                                    <span className="font-black text-gray-900">{sub.concurrency} 路</span>
                                 </div>
                                 <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-1/2"></div>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold">资源池池化权限</span>
                                    <div className="flex gap-1">
                                       <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tighter">Market</span>
                                       <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[9px] font-black uppercase tracking-tighter">Admin</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                 <button className="text-[10px] font-black text-[#0066FF] hover:underline flex items-center gap-1">
                                    <Key className="w-3 h-3" /> 修改配额与权限
                                 </button>
                                 <button className="text-[10px] font-black text-gray-400 hover:text-gray-900">登录此端</button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 bg-[#1A1A1A] rounded-[40px] flex items-center justify-between overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
               <Layers className="w-8 h-8 text-white" />
            </div>
            <div>
               <h4 className="text-lg font-black text-white tracking-tight">层级绑定架构说明 (Strong Topology)</h4>
               <p className="text-xs text-gray-400 mt-1 font-medium">企业主体 → 子账号 (互相隔离) → 坐席 (物理绑定) → 号码 → 话术</p>
            </div>
         </div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               <span className="text-[10px] font-black text-white italic">SSO ENABLED</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default EnterpriseModule;
