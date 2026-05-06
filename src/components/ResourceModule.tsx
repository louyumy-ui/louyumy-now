import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const MOCK_NUMBERS = [
  { id: 'N001', number: '170-9122-8833', operator: '中国移动', status: 'buffering', countdown: '2天', user: '字节抖音', time: '2026-05-12' },
  { id: 'N002', number: '165-8829-1122', operator: '中国联通', status: 'frozen', countdown: '15天', user: '冻结储备', time: '2026-04-30' },
  { id: 'N003', number: '171-4433-5566', operator: '中国电信', status: 'public', countdown: null, user: '公共资金池', time: '2026-05-01' },
  { id: 'N004', number: '170-1122-3344', operator: '中国移动', status: 'normal', countdown: null, user: '腾讯客服', time: '2026-05-05' },
];

const ResourceModule: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState('北京市');

  return (
    <div className="grid grid-cols-12 gap-8 h-full pr-4 pb-12">
      {/* 区域选择器 - 3 栏 */}
      <div className="col-span-3 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col p-10 overflow-hidden">
        <div className="mb-10">
           <h4 className="text-2xl font-black text-gray-900 tracking-tight uppercase">地缘号码架构</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">按运营商地理分布</p>
        </div>

        <div className="flex-1 space-y-3 overflow-auto custom-scrollbar">
           {['北京市', '上海市', '广东省', '浙江省', '江苏省'].map(prov => (
             <div 
               key={prov}
               onClick={() => setSelectedProvince(prov)}
               className={cn(
                 "px-6 py-5 rounded-3xl cursor-pointer transition-all flex items-center justify-between group",
                 selectedProvince === prov ? "bg-[#1A1A1A] text-white shadow-2xl shadow-black/20" : "hover:bg-gray-50 text-gray-400"
               )}
             >
                <span className="text-xs font-black uppercase tracking-widest">{prov}</span>
                {selectedProvince === prov && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
             </div>
           ))}
        </div>
        
        <button className="mt-10 py-5 bg-gray-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
           查看全国回收池
        </button>
      </div>

      {/* 号码资源列表 - 9 栏 */}
      <div className="col-span-9 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
         <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <div>
               <h4 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{selectedProvince} 号段池</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">资源逻辑链路分发监控</p>
            </div>
            <div className="flex gap-4">
               <button className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest">筛选过滤</button>
               <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">下发新资源</button>
            </div>
         </div>

         <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">终端号码 / 运营商</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">单向流转状态 [生命周期]</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">当前业务挂载点</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">时间戳</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {MOCK_NUMBERS.map(num => (
                    <tr key={num.id} className="hover:bg-gray-50/50 transition-all group">
                       <td className="px-10 py-8">
                          <div>
                             <p className="text-base font-black text-gray-900 tabular-nums">{num.number}</p>
                             <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mt-1">{num.operator}</p>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          {num.status === 'buffering' && (
                            <div className="inline-block px-4 py-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                               <span className="text-[9px] font-black italic uppercase tracking-widest font-mono">缓冲期 - 剩余 {num.countdown}</span>
                            </div>
                          )}
                          {num.status === 'frozen' && (
                            <div className="inline-block px-4 py-2 bg-gray-400 text-white rounded-xl">
                               <span className="text-[9px] font-black italic uppercase tracking-widest font-mono">冻结池 - 冷却中 ({num.countdown})</span>
                            </div>
                          )}
                          {num.status === 'public' && (
                            <div className="inline-block px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                               <span className="text-[9px] font-black italic uppercase tracking-widest font-mono">公共池 - 可分配</span>
                            </div>
                          )}
                          {num.status === 'normal' && (
                            <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl">
                               <span className="text-[9px] font-black italic uppercase tracking-widest font-mono">正常服役中</span>
                            </div>
                          )}
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-xs font-black text-gray-900 uppercase tracking-widest">@{num.user}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">流水号: {num.id}</p>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <span className="text-[10px] font-black text-gray-300 tabular-nums uppercase">{num.time}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ResourceModule;
