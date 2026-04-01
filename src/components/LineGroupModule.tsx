import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Power, 
  MoreVertical,
  Activity,
  Zap,
  Users
} from 'lucide-react';
import { LineGroup, LineStatus } from '../types';
import { OPERATORS, CITIES } from '../constants';

interface Props {
  lineGroups: LineGroup[];
  setLineGroups: React.Dispatch<React.SetStateAction<LineGroup[]>>;
}

const LineGroupModule: React.FC<Props> = ({ lineGroups, setLineGroups }) => {
  const [filterCity, setFilterCity] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredGroups = lineGroups.filter(group => {
    return (filterCity === '' || group.city === filterCity) &&
           (filterOperator === '' || group.operator === filterOperator) &&
           (filterStatus === '' || group.status === filterStatus);
  });

  const toggleStatus = (id: string) => {
    setLineGroups(prev => prev.map(g => 
      g.id === id ? { ...g, status: g.status === 'enabled' ? 'disabled' : 'enabled' } : g
    ));
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
              placeholder="搜索线路组..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
            />
          </div>
          
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">所有地市</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">所有运营商</option>
            {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">所有状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#0066FF] text-white rounded-xl font-medium hover:bg-[#0052CC] transition-colors shadow-lg shadow-[#0066FF]/20">
          <Plus className="w-4 h-4" />
          新建线路组
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">总并发量</p>
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {lineGroups.reduce((acc, g) => acc + g.totalConcurrency, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">当前CPS</p>
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {lineGroups.reduce((acc, g) => acc + g.currentCPS, 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#6B7280]">在线坐席</p>
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {lineGroups.reduce((acc, g) => acc + g.currentOnlineCount, 0)}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">线路地市 / 运营商</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">区号</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-center">并发 (总/可用)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-center">CPS (最大/当前)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-center">在线 (总/当前)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">备注</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1A1A1A]">{group.city}</span>
                      <span className="text-xs text-[#6B7280]">{group.operator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">{group.areaCode}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-1">
                        <div 
                          className="h-full bg-[#0066FF]" 
                          style={{ width: `${(group.availableConcurrency / group.totalConcurrency) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-[#4B5563]">
                        {group.totalConcurrency} / <span className="text-[#0066FF]">{group.availableConcurrency}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-[#4B5563]">
                        {group.maxCPS} / <span className="text-orange-500 font-bold">{group.currentCPS}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium text-[#4B5563]">
                        {group.onlineCount} / <span className="text-green-600 font-bold">{group.currentOnlineCount}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      group.status === 'enabled' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {group.status === 'enabled' ? '启用' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280] max-w-[150px] truncate">
                    {group.remark || '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#6B7280] hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(group.id)}
                        className={`p-2 rounded-lg transition-all ${
                          group.status === 'enabled' 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-green-500 hover:bg-green-50'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
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

export default LineGroupModule;
