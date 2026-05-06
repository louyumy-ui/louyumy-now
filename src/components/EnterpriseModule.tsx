import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  Plus,
  Briefcase,
  Layers,
  Phone,
  Zap,
  Activity,
  ArrowRight,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_TOPOLOGY = [
  {
    id: 'ENT01',
    name: '阿里巴巴集团控股有限公司',
    status: 'active',
    depts: [
      {
        name: '淘宝事业部',
        agents: [
          { name: '杭州-售前接待一组', concurrency: 200, numbers: 50, status: 'running' },
          { name: '华东-大促临时坐席', concurrency: 500, numbers: 150, status: 'running' },
        ]
      },
      {
        name: '菜鸟网络-末端网点部',
        agents: [
          { name: '全国网点回访', concurrency: 100, numbers: 820, status: 'running' },
        ]
      }
    ]
  },
  {
    id: 'ENT02',
    name: '字节跳动 (中国) 科技有限公司',
    status: 'active',
    depts: [
      {
        name: '抖音电商-商服中心',
        agents: [
          { name: '华南-售后处理专席', concurrency: 300, numbers: 120, status: 'running' },
        ]
      }
    ]
  },
  {
    id: 'ENT03',
    name: '腾讯科技 (深圳) 有限公司',
    status: 'suspended',
    depts: []
  }
];

const EnterpriseModule: React.FC = () => {
  const [expandedEnts, setExpandedEnts] = useState<string[]>(['ENT01']);

  const toggleEnt = (id: string) => {
    setExpandedEnts(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Search & Actions */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0066FF] transition-colors" />
               <input 
                type="text" 
                placeholder="快速定位企业主体或坐席..." 
                className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-4 focus:ring-[#0066FF]/10 focus:outline-none transition-all w-80"
               />
            </div>
            <div className="flex gap-4">
               <button className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-colors">
                 <Filter className="w-3.5 h-3.5" /> 筛选条件
               </button>
            </div>
         </div>
         <button className="flex items-center gap-2 px-8 py-4 bg-[#0066FF] text-white rounded-2xl text-[10px] font-black shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
            <Plus className="w-5 h-5" /> 录入新合同主体
         </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar pr-4 space-y-6">
         {MOCK_TOPOLOGY.map((ent) => (
           <div key={ent.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-gray-200">
              {/* Enterprise Header */}
              <div 
                onClick={() => toggleEnt(ent.id)}
                className={cn(
                  "p-8 flex items-center justify-between cursor-pointer transition-colors",
                  expandedEnts.includes(ent.id) ? "bg-gray-900 text-white" : "hover:bg-gray-50"
                )}
              >
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "p-4 rounded-2xl transition-colors",
                      expandedEnts.includes(ent.id) ? "bg-white/10" : "bg-gray-100"
                    )}>
                       <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black tracking-tight">{ent.name}</h4>
                       <div className="flex items-center gap-4 mt-1 opacity-60">
                          <span className="text-[10px] font-black italic uppercase tracking-widest">UID: {ent.id}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-black italic uppercase tracking-widest">{ent.status === 'active' ? 'Authorized' : 'Suspended'}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-current opacity-20 flex items-center justify-center font-black text-[9px] italic">SA</div>
                       ))}
                       <p className="text-[10px] font-black opacity-40">+{ent.depts.length + 5} SUB</p>
                    </div>
                    {expandedEnts.includes(ent.id) ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                 </div>
              </div>

              {/* Topology Layers */}
              <AnimatePresence>
                 {expandedEnts.includes(ent.id) && (
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: 'auto' }}
                     exit={{ height: 0 }}
                     className="overflow-hidden border-t border-white/10 bg-gray-50/50"
                   >
                      <div className="p-10 space-y-10">
                         {ent.depts.length > 0 ? ent.depts.map((dept, di) => (
                           <div key={di} className="relative">
                              {/* Connector Line */}
                              <div className="absolute -left-5 top-0 bottom-0 w-px bg-gray-200"></div>
                              
                              <div className="flex items-center gap-4 mb-6">
                                 <div className="w-8 h-[2px] bg-gray-200 -ml-5"></div>
                                 <div className="flex items-center gap-3 px-5 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{dept.name}</span>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6 pl-10">
                                 {dept.agents.map((agent, ai) => (
                                   <div key={ai} className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <MoreVertical className="w-5 h-5 text-gray-300 cursor-pointer" />
                                      </div>
                                      
                                      <div className="flex items-center justify-between mb-8">
                                         <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                                               <Users className="w-5 h-5" />
                                            </div>
                                            <h5 className="font-black text-gray-900 tracking-tight">{agent.name}</h5>
                                         </div>
                                         <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="text-[9px] font-black uppercase text-emerald-500 italic">Running</span>
                                         </div>
                                      </div>

                                      <div className="flex items-center gap-10">
                                         <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                               <Zap className="w-3 h-3" /> 并发锁定
                                            </div>
                                            <p className="text-xl font-black text-gray-900 tabular-nums">{agent.concurrency} <span className="text-xs opacity-40 italic">路</span></p>
                                         </div>
                                         <div className="w-px h-8 bg-gray-100"></div>
                                         <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                               <Phone className="w-3 h-3" /> 已分配资源
                                            </div>
                                            <p className="text-xl font-black text-gray-900 tabular-nums">{agent.numbers} <span className="text-xs opacity-40 italic">个</span></p>
                                         </div>
                                      </div>

                                      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between group-hover:border-gray-100 transition-colors">
                                         <p className="text-[10px] text-gray-300 font-bold">LAST_SYNC: 3m ago</p>
                                         <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-blue-500 transition-colors" />
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         )) : (
                           <div className="py-20 text-center space-y-6">
                              <Layers className="w-20 h-20 text-gray-100 mx-auto" />
                              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">暂未配置组织架构与坐席绑定</p>
                              <button className="px-8 py-3 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl hover:border-blue-500 hover:text-blue-500 transition-all font-black text-[10px] uppercase tracking-widest">初始化子账号架构</button>
                           </div>
                         )}
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
         ))}
      </div>

      {/* Global Safety Info Bar */}
      <div className="p-8 bg-[#1A1A1A] rounded-[40px] flex items-center justify-between overflow-hidden relative group overflow-hidden">
         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none"></div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/5 shadow-2xl">
               <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
               <h4 className="text-lg font-black text-white tracking-tight leading-none mb-2">多租户数据隔离网格 (Strong SaaS Isolation)</h4>
               <p className="text-xs text-gray-500 font-bold leading-none tracking-tight">所有企业主体数据在物理存储层与应用逻辑层均实现 100% 权限解耦与独立加密。</p>
            </div>
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="flex flex-col items-end">
               <p className="text-xl font-black text-white tabular-nums leading-none mb-1">99.99<span className="text-[10px] text-gray-500">%</span></p>
               <p className="text-[9px] font-black text-gray-500 uppercase italic tracking-tighter">Availability SLA</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
         </div>
      </div>
    </div>
  );
};

export default EnterpriseModule;
