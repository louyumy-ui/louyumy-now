import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  ChevronRight,
  Database,
  History,
  Clock,
  Snowflake,
  Filter,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
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
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Province List - 3 Columns */}
      <div className="col-span-3 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col p-8 overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
           <MapPin className="w-5 h-5 text-gray-900" />
           <h4 className="text-xl font-black text-gray-900 tracking-tight">地缘号码架构</h4>
        </div>

        <div className="flex-1 space-y-2 overflow-auto custom-scrollbar">
           {['北京市', '上海市', '广东省', '浙江省', '江苏省'].map(prov => (
             <div 
               key={prov}
               onClick={() => setSelectedProvince(prov)}
               className={cn(
                 "p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between",
                 selectedProvince === prov ? "bg-gray-900 text-white shadow-xl" : "hover:bg-gray-50 text-gray-400"
               )}
             >
                <span className="text-sm font-black">{prov}</span>
                {selectedProvince === prov && <TrendingUp className="w-4 h-4 text-blue-400" />}
             </div>
           ))}
        </div>
        
        <button className="mt-8 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
           查看全国回收池
        </button>
      </div>

      {/* Number List - 9 Columns */}
      <div className="col-span-9 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
         <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <div>
               <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedProvince} 号段池</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Resource Pool Logic Distribution</p>
            </div>
            <div className="flex gap-3">
               <button className="p-4 bg-gray-900 text-white rounded-2xl shadow-xl shadow-black/10"><Filter className="w-5 h-5" /></button>
               <button className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20"><Plus className="w-5 h-5" /></button>
            </div>
         </div>

         <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">终端号码 / ISP</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">单向流转状态 [Mock]</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">业务挂载主体</th>
                     <th className="px-10 py-6 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">时间轴</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {MOCK_NUMBERS.map(num => (
                    <tr key={num.id} className="hover:bg-gray-50 transition-all group">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-xs text-gray-900 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {num.operator.charAt(2)}
                             </div>
                             <div>
                                <p className="text-sm font-black text-gray-900">{num.number}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{num.operator}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          {num.status === 'buffering' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                               <Clock className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black italic uppercase">缓冲期 - 剩余 {num.countdown}</span>
                            </div>
                          )}
                          {num.status === 'frozen' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-xl">
                               <Snowflake className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black italic uppercase">冻结池 - 冷却中 ({num.countdown})</span>
                            </div>
                          )}
                          {num.status === 'public' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                               <Database className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black italic uppercase">公共池 - 可分配</span>
                            </div>
                          )}
                          {num.status === 'normal' && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                               <TrendingUp className="w-3.5 h-3.5" />
                               <span className="text-[10px] font-black italic uppercase">业务服役中</span>
                            </div>
                          )}
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-xs font-black text-gray-900 italic">@{num.user}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">ID: {num.id}</p>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <History className="w-5 h-5 text-gray-200 group-hover:text-gray-900 transition-colors inline-block" />
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
