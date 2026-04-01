import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Power, 
  Link, 
  UserPlus, 
  Hash, 
  Zap, 
  MapPin, 
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Users
} from 'lucide-react';
import { Agent, PhoneNumber, LineGroup } from '../types';
import { OPERATORS, CITIES } from '../constants';

interface Props {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  numbers: PhoneNumber[];
  setNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  lineGroups: LineGroup[];
}

const AgentModule: React.FC<Props> = ({ agents, setAgents, numbers, setNumbers, lineGroups }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.includes(searchQuery) || agent.accountId.includes(searchQuery);
    const matchesCity = filterCity === '' || agent.city === filterCity;
    const matchesOperator = filterOperator === '' || agent.operator === filterOperator;
    return matchesSearch && matchesCity && matchesOperator;
  });

  const toggleStatus = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const newStatus = a.status === 'enabled' ? 'disabled' : 'enabled';
        // If disabling, release numbers
        if (newStatus === 'disabled') {
          setNumbers(nums => nums.map(n => 
            a.boundNumbers.includes(n.id) ? { ...n, agentId: undefined } : n
          ));
          return { ...a, status: newStatus, boundNumbers: [] };
        }
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="搜索坐席名称/账号..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
            />
          </div>
          
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">线路地市</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">运营商</option>
            {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white rounded-xl font-medium hover:bg-[#0052CC] transition-colors shadow-lg shadow-[#0066FF]/20"
        >
          <UserPlus className="w-4 h-4" />
          新建坐席
        </button>
      </div>

      {/* Grid Layout for Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    agent.status === 'enabled' ? 'bg-blue-50 text-[#0066FF]' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-lg">{agent.name}</h3>
                    <p className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Link className="w-3 h-3" />
                      {agent.accountId || '未关联账号'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleStatus(agent.id)}
                  className={`p-2 rounded-lg transition-all ${
                    agent.status === 'enabled' ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50'
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F9FAFB] p-3 rounded-xl">
                  <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    线路地市
                  </p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{agent.city}</p>
                </div>
                <div className="bg-[#F9FAFB] p-3 rounded-xl">
                  <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    运营商
                  </p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{agent.operator}</p>
                </div>
                <div className="bg-[#F9FAFB] p-3 rounded-xl">
                  <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    绑定号码
                  </p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{agent.boundNumbers.length} 个</p>
                </div>
                <div className="bg-[#F9FAFB] p-3 rounded-xl">
                  <p className="text-[10px] text-[#6B7280] uppercase font-bold mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    并发数
                  </p>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{agent.concurrency}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                <div className="flex -space-x-2">
                  {agent.boundNumbers.slice(0, 3).map((numId, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full bg-white border-2 border-[#F3F4F6] flex items-center justify-center text-[10px] font-bold text-[#0066FF]">
                      {numbers.find(n => n.id === numId)?.number.slice(-4)}
                    </div>
                  ))}
                  {agent.boundNumbers.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#6B7280]">
                      +{agent.boundNumbers.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[#6B7280] hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-[#6B7280] hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Agent Modal (Simplified) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
              <h3 className="text-xl font-bold text-[#1A1A1A]">新建坐席</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4B5563]">坐席名称</label>
                  <input type="text" placeholder="输入坐席名称" className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4B5563]">关联账号</label>
                  <input type="text" placeholder="输入账号ID" className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4B5563]">线路地市</label>
                  <select className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20">
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#4B5563]">运营商</label>
                  <select className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#0066FF]/20">
                    {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-[#0066FF] mt-0.5" />
                <div className="text-sm text-[#0066FF]">
                  <p className="font-bold mb-1">选号规则说明</p>
                  <p className="opacity-80">系统将优先从同线路组、同归属地的空闲号码中选取。若无空闲号码，系统将发出告警。</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[#6B7280] font-medium hover:bg-gray-100 rounded-xl transition-all">
                  取消
                </button>
                <button className="px-8 py-2.5 bg-[#0066FF] text-white font-bold rounded-xl shadow-lg shadow-[#0066FF]/20 hover:bg-[#0052CC] transition-all">
                  确认创建
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AgentModule;
