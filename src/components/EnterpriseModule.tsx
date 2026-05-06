import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  ChevronRight, 
  ChevronDown,
  Briefcase,
  Layers,
  Phone,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_TOPOLOGY = [
  {
    id: 'ENT01',
    name: '阿里巴巴集团控股有限公司',
    depts: [
      {
        id: 'D01',
        name: '淘宝事业部 / 核心商服中心',
        agents: [
          { name: '杭州-售前客服一组', concurrency: 120, numbers: 45 },
          { name: '华东-全网大促专席', concurrency: 400, numbers: 110 },
        ]
      },
      {
        id: 'D02',
        name: '菜鸟物流 / 末端配送部',
        agents: [
           { name: '自动外呼回调系统', concurrency: 50, numbers: 420 },
        ]
      }
    ]
  },
  {
    id: 'ENT02',
    name: '字节跳动 (中国) 科技有限公司',
    depts: [
      {
        id: 'D03',
        name: '抖音电商运营部',
        agents: [{ name: '北京-商家质检专席', concurrency: 100, numbers: 30 }]
      }
    ]
  }
];

const EnterpriseModule: React.FC = () => {
  const [expandedEnts, setExpandedEnts] = useState<string[]>(['ENT01']);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['D01']);

  const toggleEnt = (id: string) => {
    setExpandedEnts(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full pr-4 pb-12">
      <div className="col-span-12 flex items-center justify-between bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input 
                type="text" 
                placeholder="搜索企业主体 / 坐席标识 / 号码资产..." 
                className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:outline-none w-[400px]"
               />
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">多租户逻辑隔离已生效</span>
            </div>
         </div>
      </div>

      <div className="col-span-12 space-y-6">
         {MOCK_TOPOLOGY.map((ent) => (
           <div key={ent.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
              {/* Enterprise Header */}
              <div 
                onClick={() => toggleEnt(ent.id)}
                className={cn(
                  "p-8 flex items-center justify-between cursor-pointer transition-all",
                  expandedEnts.includes(ent.id) ? "bg-gray-900 text-white" : "hover:bg-gray-50"
                )}
              >
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <Building2 className="w-8 h-8" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black tracking-tight">{ent.name}</h4>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Tenant_ID: {ent.id}</p>
                    </div>
                 </div>
                 {expandedEnts.includes(ent.id) ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
              </div>

              {/* Tree Content */}
              <AnimatePresence>
                 {expandedEnts.includes(ent.id) && (
                   <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden bg-gray-50/30 p-8 space-y-4"
                   >
                      {ent.depts.map(dept => (
                        <div key={dept.id} className="ml-6 border-l-2 border-gray-100 pl-6 space-y-4">
                           <div 
                            onClick={() => toggleDept(dept.id)}
                            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-blue-500 transition-all shadow-sm"
                           >
                              <div className="flex items-center gap-3">
                                 <Briefcase className="w-4 h-4 text-blue-500" />
                                 <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{dept.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black text-gray-400 italic">{dept.agents.length} AGENTS ACTIVE</span>
                                 {expandedDepts.includes(dept.id) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                              </div>
                           </div>

                           <AnimatePresence>
                              {expandedDepts.includes(dept.id) && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="grid grid-cols-12 gap-6 pl-4"
                                >
                                   {dept.agents.map((agent, ai) => (
                                     <div key={ai} className="col-span-6 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-lg transition-all group overflow-hidden">
                                        <div className="flex items-center justify-between mb-8">
                                           <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-all">
                                                 <Users className="w-5 h-5" />
                                              </div>
                                              <p className="text-sm font-black text-gray-900 tracking-tight">{agent.name}</p>
                                           </div>
                                           <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                              <span className="text-[9px] font-black uppercase text-emerald-500 italic">Syncing</span>
                                           </div>
                                        </div>

                                        <div className="flex items-center gap-8 mb-6">
                                           <div>
                                              <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase mb-1">
                                                <Zap className="w-3 h-3" /> 并发锁定
                                              </div>
                                              <p className="text-xl font-black text-gray-900 tracking-tighter tabular-nums">{agent.concurrency}</p>
                                           </div>
                                           <div className="w-px h-6 bg-gray-100"></div>
                                           <div>
                                              <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase mb-1">
                                                <Phone className="w-3 h-3" /> 绑定号码
                                              </div>
                                              <p className="text-xl font-black text-gray-900 tracking-tighter tabular-nums">{agent.numbers}</p>
                                           </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                           <span className="text-[9px] font-bold text-gray-300">REF: AGT_{ent.id}_{ai}</span>
                                           <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                     </div>
                                   ))}
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
         ))}
      </div>
    </div>
  );
};

export default EnterpriseModule;
