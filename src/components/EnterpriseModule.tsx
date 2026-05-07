import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface SubAccount {
  id: string;
  name: string;
  quota: number;
}

interface Enterprise {
  id: string;
  name: string;
  totalQuota: number;
  subs: SubAccount[];
}

const MOCK_ENT: Enterprise[] = [
  {
    id: 'ET-001',
    name: '阿里巴巴集团控股有限公司 (政务云事业部)',
    totalQuota: 5000,
    subs: [
      { id: 'SUB-01', name: '杭州商事智能坐席专区', quota: 1200 },
      { id: 'SUB-02', name: '全网大促弹性储备中心', quota: 2500 },
    ]
  },
  {
    id: 'ET-002',
    name: '字节跳动 (中国) 科技有限公司',
    totalQuota: 3000,
    subs: [
      { id: 'SUB-03', name: '抖音电商运营-北京', quota: 1000 },
    ]
  }
];

const EnterpriseModule: React.FC = () => {
  const [activeEnt, setActiveEnt] = useState<string | null>('ET-001');
  const [ents, setEnts] = useState<Enterprise[]>(MOCK_ENT);

  const updateQuota = (entId: string, subId: string, newVal: number) => {
    setEnts(prev => prev.map(e => {
      if (e.id !== entId) return e;
      const otherSubsQuota = e.subs.filter(s => s.id !== subId).reduce((acc, curr) => acc + curr.quota, 0);
      if (otherSubsQuota + newVal > e.totalQuota) return e;
      return {
        ...e,
        subs: e.subs.map(s => s.id === subId ? { ...s, quota: newVal } : s)
      };
    }));
  };

  return (
    <div className="space-y-8">
      {/* 顶部统计面板 */}
      <div className="flex gap-8">
         <div className="flex-1 bg-white p-10 rounded-[40px] border-[1.33px] border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
               <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-[0.2em]">已入驻租户主体</p>
               <p className="text-4xl font-[900] text-black">128</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-xl">租</div>
         </div>
         <div className="flex-1 bg-white p-10 rounded-[40px] border-[1.33px] border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
               <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-[0.2em]">全网活跃子账号</p>
               <p className="text-4xl font-[900] text-black">4,912</p>
            </div>
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center font-black text-xl">号</div>
         </div>
      </div>

      {/* 组织架构树 */}
      <div className="space-y-6">
         {ents.map((ent) => (
           <div key={ent.id} className="space-y-4">
              {/* 企业主体卡称 */}
              <div 
                onClick={() => setActiveEnt(activeEnt === ent.id ? null : ent.id)}
                className={cn(
                  "p-10 rounded-[40px] border-[1.33px] flex items-center justify-between cursor-pointer transition-all",
                  activeEnt === ent.id ? "bg-black text-white border-black shadow-2xl" : "bg-white text-black border-gray-100 hover:border-black"
                )}
              >
                 <div className="flex items-center gap-8">
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{ent.id}</span>
                    <h4 className="text-[22px] font-[900] tracking-tight uppercase leading-none">{ent.name}</h4>
                 </div>
                 <div className="flex items-center gap-12">
                    <div className="text-right">
                       <p className={cn("text-[9px] font-black uppercase tracking-widest", activeEnt === ent.id ? "text-gray-500" : "text-gray-400")}>总配额池</p>
                       <p className="text-2xl font-[900] tabular-nums">{ent.totalQuota}</p>
                    </div>
                    <div className={cn("w-2 h-2 rounded-full", activeEnt === ent.id ? "bg-blue-600" : "bg-gray-200")} />
                 </div>
              </div>

              {/* 子账号列表 */}
              {activeEnt === ent.id && (
                <div className="ml-16 space-y-4 pt-2">
                   {ent.subs.map(sub => (
                     <div key={sub.id} className="bg-white p-8 rounded-[32px] border-[1.33px] border-gray-100 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">SUB_INSTANCE</p>
                           <h5 className="text-[16px] font-[900] text-black uppercase tracking-tight">{sub.name}</h5>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {sub.id}</p>
                        </div>
                        
                        <div className="flex items-center gap-12">
                           <div className="space-y-3 w-64">
                              <div className="flex justify-between text-[10px] font-black uppercase">
                                 <span className="text-gray-400">并发分配</span>
                                 <span className="text-black">{sub.quota} / {ent.totalQuota}</span>
                              </div>
                              <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600" style={{ width: `${(sub.quota / ent.totalQuota) * 100}%` }} />
                              </div>
                           </div>

                           <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuota(ent.id, sub.id, Math.max(0, sub.quota - 100)); }}
                                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black hover:bg-black hover:text-white transition-all"
                              >-</button>
                              <span className="w-16 text-center font-[900] text-sm tabular-nums">{sub.quota}</span>
                              <button 
                                onClick={(e) => { e.stopPropagation(); updateQuota(ent.id, sub.id, sub.quota + 100); }}
                                className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black hover:bg-black hover:text-white transition-all"
                              >+</button>
                           </div>
                        </div>
                     </div>
                   ))}
                   
                   <div className="bg-gray-50/50 p-6 rounded-[32px] border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all group">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] group-hover:text-black">INITIALIZE NEW SUB-ACCOUNT</span>
                   </div>
                </div>
              )}
           </div>
         ))}
      </div>
    </div>
  );
};

export default EnterpriseModule;
