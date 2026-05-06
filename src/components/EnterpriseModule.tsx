import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
      {/* Top Controls */}
      <div className="col-span-12 bg-white px-10 py-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-6">
            <input 
              type="text" 
              placeholder="搜索企业主体 / 坐席 / 资源配额..." 
              className="px-8 py-3 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-500/10 focus:outline-none w-[400px]"
            />
         </div>
         <div className="flex items-center gap-6">
            <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">Cross-Tenant Isolation: ACTIVE</span>
            </div>
         </div>
      </div>

      {/* Main Tree View */}
      <div className="col-span-12 space-y-6">
         {MOCK_TOPOLOGY.map((ent) => (
           <div key={ent.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
              {/* Level 1: Enterprise */}
              <div 
                onClick={() => toggleEnt(ent.id)}
                className={cn(
                  "p-10 flex items-center justify-between cursor-pointer transition-all",
                  expandedEnts.includes(ent.id) ? "bg-[#1A1A1A] text-white" : "hover:bg-gray-50"
                )}
              >
                 <div className="flex items-center gap-8">
                    <div className="text-4xl font-black opacity-20 uppercase tracking-tighter">0{ent.id.slice(-1)}</div>
                    <div>
                       <h4 className="text-xl font-black tracking-tight uppercase">{ent.name}</h4>
                       <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Global Anchor ID: {ent.id}</p>
                    </div>
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-widest px-4 py-2 border border-current rounded-xl opacity-60">
                    {expandedEnts.includes(ent.id) ? 'Collapse' : 'Expand'}
                 </div>
              </div>

              {/* Level 2: Departments */}
              <AnimatePresence>
                 {expandedEnts.includes(ent.id) && (
                   <motion.div 
                    initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden bg-gray-50/20 p-10 space-y-6"
                   >
                      {ent.depts.map(dept => (
                        <div key={dept.id} className="ml-8 border-l-2 border-gray-100 pl-10 space-y-4">
                           <div 
                            onClick={() => toggleDept(dept.id)}
                            className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 cursor-pointer hover:border-gray-900 transition-all shadow-sm group"
                           >
                              <div>
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 block">Sub-Account Group</span>
                                 <h5 className="text-sm font-black text-gray-900 uppercase tracking-widest">{dept.name}</h5>
                              </div>
                              <div className="flex items-center gap-8">
                                 <span className="text-[9px] font-black text-gray-900 italic uppercase bg-gray-50 px-3 py-1 rounded-lg">
                                    {dept.agents.length} Instances
                                 </span>
                              </div>
                           </div>

                           {/* Level 3: Agents */}
                           <AnimatePresence>
                              {expandedDepts.includes(dept.id) && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="grid grid-cols-12 gap-6 pt-4"
                                >
                                   {dept.agents.map((agent, ai) => (
                                     <div key={ai} className="col-span-6 bg-white p-8 rounded-[36px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4">
                                           <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter shadow-sm shadow-blue-200">Ref: AGT_{ai}</span>
                                        </div>
                                        
                                        <div className="mb-10">
                                           <p className="text-base font-black text-gray-900 uppercase tracking-tight">{agent.name}</p>
                                           <p className="text-[9px] font-black text-emerald-500 uppercase italic mt-1">Live Endpoint Synchronization</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-px bg-gray-50 rounded-3xl overflow-hidden border border-gray-50">
                                           <div className="bg-white p-6 space-y-1">
                                              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">物理并发配额</p>
                                              <p className="text-2xl font-black text-gray-900 tabular-nums">{agent.concurrency}</p>
                                           </div>
                                           <div className="bg-white p-6 space-y-1">
                                              <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">在库号码资产</p>
                                              <p className="text-2xl font-black text-gray-900 tabular-nums">{agent.numbers}</p>
                                           </div>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                           <button className="text-[9px] font-black text-gray-900 uppercase tracking-[0.2em] hover:underline">
                                             Enter Instance Console
                                           </button>
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
