import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Plus, 
  ChevronRight,
  Database,
  History,
  Clock,
  Snowflake,
  Trash2,
  Download,
  Filter,
  X,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const MOCK_PROVINCES = [
  { name: '北京市', cities: ['朝阳区', '海淀区', '丰台区'], count: 1240 },
  { name: '上海市', cities: ['浦东新区', '徐汇区', '黄浦区'], count: 856 },
  { name: '广东省', cities: ['广州市', '深圳市', '珠海市', '佛山市'], count: 3420 },
  { name: '浙江省', cities: ['杭州市', '宁波市', '温州市'], count: 1120 },
  { name: '江苏省', cities: ['南京市', '苏州市', '无锡市'], count: 980 },
];

const MOCK_NUMBERS = [
  { id: 'N001', number: '170-9122-8833', operator: '中国移动', province: '北京市', city: '朝阳区', status: 'buffering', countdown: '3天', user: '字节跳动', time: '2026-05-12' },
  { id: 'N002', number: '165-8829-1122', operator: '中国联通', province: '上海市', city: '浦东新区', status: 'frozen', countdown: '15天', user: '闲置', time: '2026-04-30' },
  { id: 'N003', number: '171-4433-5566', operator: '中国电信', province: '广东省', city: '深圳市', status: 'public', countdown: null, user: '公共资金池', time: '2026-05-01' },
  { id: 'N004', number: '170-1122-3344', operator: '中国移动', province: '北京市', city: '海淀区', status: 'normal', countdown: null, user: '腾讯科技', time: '2026-05-05' },
];

const ResourceModule: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState('北京市');
  const [selectedCity, setSelectedCity] = useState('朝阳区');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeNumber, setActiveNumber] = useState<any>(null);

  return (
    <div className="flex h-full gap-8">
      {/* Left Sidebar: Province-City Cascade */}
      <div className="w-80 bg-white rounded-[40px] border border-gray-100 shadow-sm flex flex-col p-8 overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
           <MapPin className="w-5 h-5 text-gray-900" />
           <h4 className="text-xl font-black text-gray-900 tracking-tight">资源地域架构</h4>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar space-y-2 pr-2">
           {MOCK_PROVINCES.map((prov) => (
             <div key={prov.name} className="space-y-1">
                <div 
                  onClick={() => setSelectedProvince(selectedProvince === prov.name ? '' : prov.name)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all",
                    selectedProvince === prov.name ? "bg-gray-900 text-white shadow-xl shadow-black/10" : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                   <span className="text-sm font-black">{prov.name}</span>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold opacity-40">{prov.count}</span>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", selectedProvince === prov.name && "rotate-90")} />
                   </div>
                </div>
                
                <AnimatePresence>
                  {selectedProvince === prov.name && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                       {prov.cities.map(city => (
                         <div 
                           key={city}
                           onClick={() => setSelectedCity(city)}
                           className={cn(
                             "p-3 rounded-xl cursor-pointer transition-all text-xs font-bold",
                             selectedCity === city ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600"
                           )}
                         >
                            {city}
                         </div>
                       ))}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           ))}
        </div>

        <button className="mt-8 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
           查看全国兜底资源
        </button>
      </div>

      {/* Right Column: Number List */}
      <div className="flex-1 bg-white rounded-[48px] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-10 border-b flex items-center justify-between bg-gray-50/30">
           <div className="flex items-center gap-6">
              <div>
                 <h4 className="text-2xl font-black text-gray-900 tracking-tight">{selectedCity || '全部资源'}</h4>
                 <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Active Pool Distribution</p>
              </div>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg">420 可用</span>
                 <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-lg">12 缓冲</span>
                 <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg">8 冻结</span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0066FF] transition-colors" />
                 <input 
                  type="text" 
                  placeholder="检索特定终端号段..." 
                  className="pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-4 focus:ring-[#0066FF]/10 focus:outline-none transition-all w-64"
                 />
              </div>
              <button className="p-4 bg-gray-900 text-white rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-all">
                <Filter className="w-5 h-5" />
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
           <table className="w-full text-left order-collapse">
              <thead>
                 <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">终端号码 / ISP</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">状态周期标识</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">所属业务主体</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">流转生效期</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">管理</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {MOCK_NUMBERS.map(num => (
                   <tr key={num.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-bold text-xs group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                               {num.operator.charAt(2)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900">{num.number}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase">{num.operator}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         {num.status === 'buffering' && (
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-sm animate-pulse">
                              <Clock className="w-3 h-3" />
                              <span className="text-[10px] font-black italic uppercase">缓冲期 倒计时 {num.countdown}</span>
                           </div>
                         )}
                         {num.status === 'frozen' && (
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-400 rounded-full border border-gray-200">
                              <Snowflake className="w-3 h-3" />
                              <span className="text-[10px] font-black italic uppercase">冻结池 冷却中 ({num.countdown})</span>
                           </div>
                         )}
                         {num.status === 'public' && (
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                              <Database className="w-3 h-3" />
                              <span className="text-[10px] font-black italic uppercase">公共资产池</span>
                           </div>
                         )}
                         {num.status === 'normal' && (
                           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                              <ShieldCheck className="w-3 h-3" />
                              <span className="text-[10px] font-black italic uppercase">业务运行中</span>
                           </div>
                         )}
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-900 italic">@{num.user}</span>
                            <span className="text-[10px] text-gray-400 font-bold">PID: {num.id}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 font-black text-xs text-gray-500 tabular-nums">
                        {num.time}
                      </td>
                      <td className="px-10 py-8 text-right">
                         <button 
                          onClick={() => { setActiveNumber(num); setIsDrawerOpen(true); }}
                          className="p-3 bg-gray-50 rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all shadow-sm"
                         >
                            <History className="w-4 h-4" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* History Timeline Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-3xl z-[110] flex flex-col"
            >
              <div className="p-10 border-b flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                   <div className="p-4 bg-[#1A1A1A] text-white rounded-[24px]">
                      <History className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-gray-900 tracking-tight">号码溯源历史流水</h3>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{activeNumber?.number} / {activeNumber?.id}</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-3 bg-white border rounded-2xl hover:scale-110 transition-all text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-12 space-y-10 custom-scrollbar">
                 <div className="space-y-12 relative">
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gray-100 -z-10"></div>
                    
                    {[
                      { type: 'transfer', user: 'Admin01', action: '资源重新分配', target: '闲鱼运营主体', time: '2026-05-01 10:24', detail: '从公共池划转至特定业务主体' },
                      { type: 'cooling', user: 'System', action: '进入缓冲冷却', target: '-', time: '2026-04-20 18:00', detail: '由于主叫呼出超限触发系统策略' },
                      { type: 'usage', user: 'Ops_Team', action: '挂载至坐席', target: '北京电销-一组', time: '2026-03-15 09:00', detail: '初始化批量部署' },
                      { type: 'init', user: 'Carrier', action: '号码初次入库', target: 'CMCC_NORTH', time: '2026-01-01 00:00', detail: '物理资产登记' },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-12 h-12 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors bg-white">
                            {step.type === 'transfer' && <User className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />}
                            {step.type === 'cooling' && <Clock className="w-5 h-5 text-gray-400 group-hover:text-amber-500" />}
                            {step.type === 'usage' && <Database className="w-5 h-5 text-gray-400 group-hover:text-emerald-500" />}
                            {step.type === 'init' && <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />}
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                               <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{step.action}</p>
                               <span className="text-[10px] text-gray-300 font-bold italic">{step.time}</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                               <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.detail}</p>
                               <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                  <span className="text-[9px] font-black text-gray-400 uppercase">操作人:</span>
                                  <span className="text-[9px] font-black text-blue-600">{step.user}</span>
                                  {step.target !== '-' && (
                                    <>
                                      <ArrowRight className="w-3 h-3 text-gray-300" />
                                      <span className="text-[9px] font-black text-gray-900">{step.target}</span>
                                    </>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-10 bg-gray-50/80 border-t border-gray-100">
                 <button className="w-full py-5 bg-gray-900 text-white rounded-3xl text-sm font-black shadow-xl hover:bg-black transition-all">
                    申请人工资源复核
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheck: React.FC<any> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default ResourceModule;
