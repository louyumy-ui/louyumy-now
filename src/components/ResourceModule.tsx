import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Plus, 
  ArrowLeft, 
  MoreHorizontal,
  ChevronRight,
  Database,
  History,
  Clock,
  Snowflake,
  Users,
  Trash2,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Operator, LineGroup, PhoneNumber, GlobalConfig, NumberStatus } from '../types';

interface Props {
  operators: Operator[];
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>;
  lineGroups: LineGroup[];
  setLineGroups: React.Dispatch<React.SetStateAction<LineGroup[]>>;
  numbers: PhoneNumber[];
  setNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  triggerCooling: (id: string, reason: string) => void;
  config: GlobalConfig;
}

const ResourceModule: React.FC<Props> = ({ 
  operators, 
  setOperators, 
  lineGroups, 
  setLineGroups, 
  numbers, 
  setNumbers,
  triggerCooling,
  config
}) => {
  const [view, setView] = useState<'hierarchy' | 'operators' | 'details'>('hierarchy');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Hierarchy Data Processing
  const provinceStats = useMemo(() => {
    const stats: Record<string, { cities: Set<string>, numbers: number, frozen: number }> = {};
    numbers.forEach(num => {
      if (!stats[num.province]) {
        stats[num.province] = { cities: new Set(), numbers: 0, frozen: 0 };
      }
      stats[num.province].cities.add(num.city);
      stats[num.province].numbers++;
      if (num.status === 'frozen') stats[num.province].frozen++;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      cityCount: data.cities.size,
      numberCount: data.numbers,
      frozenCount: data.frozen
    }));
  }, [numbers]);

  const cityStats = useMemo(() => {
    if (!selectedProvince) return [];
    const stats: Record<string, { numbers: number, active: number, buffering: number }> = {};
    numbers.filter(n => n.province === selectedProvince).forEach(num => {
      if (!stats[num.city]) {
        stats[num.city] = { numbers: 0, active: 0, buffering: 0 };
      }
      stats[num.city].numbers++;
      if (num.status === 'normal') stats[num.city].active++;
      if (num.status === 'buffering') stats[num.city].buffering++;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      ...data
    }));
  }, [numbers, selectedProvince]);

  const filteredNumbers = useMemo(() => {
    return numbers.filter(n => {
      const matchesLocation = (!selectedProvince || n.province === selectedProvince) && 
                            (!selectedCity || n.city === selectedCity);
      const matchesSearch = n.number.includes(searchQuery);
      return matchesLocation && matchesSearch;
    });
  }, [numbers, selectedProvince, selectedCity, searchQuery]);

  const getStatusBadge = (status: NumberStatus) => {
    switch (status) {
      case 'normal': return <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[10px] font-bold">在线中</span>;
      case 'buffering': return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold">缓冲中</span>;
      case 'frozen': return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold">已冻结</span>;
      case 'public': return <span className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 text-[10px] font-bold">公共池</span>;
      default: return <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold">已停用</span>;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search and Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('hierarchy')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'hierarchy' ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-gray-900"
            )}
          >
            省市资源层级
          </button>
          <button 
            onClick={() => setView('operators')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
              view === 'operators' ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/10" : "text-gray-400 hover:text-gray-900"
            )}
          >
            运营商管理
          </button>
          <div className="w-px h-6 bg-gray-100 mx-2"></div>
          {selectedProvince && (
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-gray-400">LOCATION:</span>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">
                  <MapPin className="w-3 h-3" />
                  {selectedProvince}
                  {selectedCity && ` / ${selectedCity}`}
                  <button 
                    onClick={() => { setSelectedProvince(null); setSelectedCity(null); setSearchQuery(''); }}
                    className="ml-1 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
           <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0066FF] transition-colors" />
              <input 
                type="text" 
                placeholder="快速全局搜索号码..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-[#0066FF]/20 focus:outline-none transition-all"
              />
           </div>
           <button className="p-3 bg-[#0066FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden h-full">
        <AnimatePresence mode="wait">
          {view === 'hierarchy' && !selectedProvince && (
            <motion.div 
              key="provinces"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-4 gap-6 h-full content-start"
            >
              {provinceStats.map(prov => (
                <div 
                  key={prov.name}
                  onClick={() => setSelectedProvince(prov.name)}
                  className="bg-white p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 cursor-pointer transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gray-50 rounded-2xl text-gray-900 group-hover:bg-[#0066FF] group-hover:text-white transition-all">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-all" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900">{prov.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{prov.cityCount} CITIES IN ACTIVE</p>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold">TOTAL NUMBERS</p>
                        <p className="text-lg font-black text-gray-900">{prov.numberCount}</p>
                     </div>
                     <div className="text-right space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold">FROZEN POOL</p>
                        <p className={cn("text-lg font-black", prov.frozenCount > 0 ? "text-blue-600" : "text-gray-300")}>{prov.frozenCount}</p>
                     </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {view === 'hierarchy' && selectedProvince && !selectedCity && (
            <motion.div 
              key="cities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 text-gray-400 px-2">
                 <button onClick={() => setSelectedProvince(null)} className="hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">返回省级列表</span>
                 </button>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {cityStats.map(city => (
                  <div 
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                       <h5 className="text-lg font-black text-gray-900">{city.name}</h5>
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full italic">{city.numbers} numbers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-green-50 rounded-xl">
                          <p className="text-[9px] text-green-700 font-black mb-1 uppercase">在线</p>
                          <p className="text-sm font-black text-green-700">{city.active}</p>
                       </div>
                       <div className="p-3 bg-amber-50 rounded-xl">
                          <p className="text-[9px] text-amber-700 font-black mb-1 uppercase">缓冲</p>
                          <p className="text-sm font-black text-amber-700">{city.buffering}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(selectedCity || searchQuery) && view === 'hierarchy' && (
            <motion.div 
              key="numbers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                 <div className="flex items-center gap-4">
                    <h5 className="text-sm font-black text-gray-900">
                      {selectedCity ? `[${selectedCity}] 号码资源明细` : "全局搜索结果"}
                    </h5>
                    <span className="px-3 py-1 bg-gray-200 text-gray-900 text-[10px] font-black rounded-lg">共 {filteredNumbers.length} 项</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-gray-500 hover:text-gray-900 transition-colors">
                       <Download className="w-3.5 h-3.5" /> 导出列表
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-blue-500/20">
                       <Plus className="w-3.5 h-3.5" /> 批量入库
                    </button>
                 </div>
              </div>

              <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">号码 / ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">归属运营商</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">当前生命周期</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">今日通话</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">最后业务流转</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredNumbers.map(num => (
                      <tr key={num.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-gray-900 group-hover:text-[#0066FF] transition-colors">{num.number}</span>
                              <span className="text-[10px] font-bold text-gray-400">ID: {num.id}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                              <span className="text-xs font-bold text-gray-700">{num.operator}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                           {getStatusBadge(num.status)}
                        </td>
                        <td className="px-8 py-6 text-center tabular-nums">
                           <span className="text-xs font-black text-gray-900">{num.dailyCalls}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2 text-gray-500">
                              <History className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-bold">{num.businessType}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="冻结"><Snowflake className="w-4 h-4" /></button>
                              <button className="p-2 text-gray-400 hover:text-amber-600 transition-colors" title="进入缓冲"><Clock className="w-4 h-4" /></button>
                              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="删除归档"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {view === 'operators' && (
             <motion.div 
              key="operators"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 gap-8"
             >
                {operators.map(op => (
                  <div key={op.id} className="bg-white p-10 rounded-[40px] border border-white shadow-sm hover:shadow-xl transition-all space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="p-4 bg-gray-50 rounded-3xl text-gray-900">
                          <Building2 className="w-8 h-8" />
                       </div>
                       <MoreHorizontal className="w-6 h-6 text-gray-300 cursor-pointer" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black text-gray-900 tracking-tight">{op.name}</h4>
                       <p className="text-sm font-bold text-gray-400 mt-2">{op.remark}</p>
                    </div>
                    <div className="pt-6 border-t border-gray-50 flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase">绑定线路组</span>
                          <span className="text-lg font-black text-gray-900">12</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase">总计号码量</span>
                          <span className="text-lg font-black text-gray-900">4.2k</span>
                       </div>
                    </div>
                  </div>
                ))}
                <div className="border-4 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center p-10 text-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] cursor-pointer transition-all space-y-3">
                   <Plus className="w-10 h-10" />
                   <span className="text-sm font-black uppercase">添加新物理运营商</span>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourceModule;
