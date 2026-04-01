import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  FileText, 
  History, 
  Edit2, 
  Eye, 
  Thermometer, 
  CheckCircle2, 
  XCircle,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PhoneNumber, LineGroup, GlobalConfig } from '../types';
import { OPERATORS, CITIES } from '../constants';

interface Props {
  numbers: PhoneNumber[];
  setNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  lineGroups: LineGroup[];
  config: GlobalConfig;
}

const NumberPoolModule: React.FC<Props> = ({ numbers, setNumbers, lineGroups, config }) => {
  const [filterCity, setFilterCity] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNumbers = useMemo(() => {
    return numbers.filter(num => {
      const matchesSearch = num.number.includes(searchQuery) || (num.remark && num.remark.includes(searchQuery));
      const matchesCity = filterCity === '' || num.city === filterCity;
      const matchesOperator = filterOperator === '' || num.operator === filterOperator;
      const matchesStatus = filterStatus === '' || num.status === filterStatus;
      return matchesSearch && matchesCity && matchesOperator && matchesStatus;
    });
  }, [numbers, searchQuery, filterCity, filterOperator, filterStatus]);

  const getLineGroupName = (id: string) => {
    return lineGroups.find(g => g.id === id)?.city + ' ' + lineGroups.find(g => g.id === id)?.operator;
  };

  const updateStatus = (id: string, status: PhoneNumber['status']) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, status } : n));
  };

  return (
    <div className="space-y-6">
      {/* Batch Operations & Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-[#4B5563] rounded-xl font-medium hover:bg-[#F9FAFB] transition-all">
              <Download className="w-4 h-4" />
              下载模板
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-[#4B5563] rounded-xl font-medium hover:bg-[#F9FAFB] transition-all">
              <Upload className="w-4 h-4" />
              批量导入
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-[#4B5563] rounded-xl font-medium hover:bg-[#F9FAFB] transition-all">
              <FileText className="w-4 h-4" />
              批量导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] text-[#4B5563] rounded-xl font-medium hover:bg-[#F9FAFB] transition-all">
              <History className="w-4 h-4" />
              导入记录
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            正常: {numbers.filter(n => n.status === 'normal').length}
            <span className="w-2 h-2 bg-orange-500 rounded-full ml-4"></span>
            冷却: {numbers.filter(n => n.status === 'cooling').length}
            <span className="w-2 h-2 bg-red-500 rounded-full ml-4"></span>
            停用: {numbers.filter(n => n.status === 'disabled').length}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="搜索号码或备注..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
            />
          </div>
          
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">归属地</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select 
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">运营商</option>
            {OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
          >
            <option value="">状态</option>
            <option value="normal">正常</option>
            <option value="cooling">冷却</option>
            <option value="disabled">停用</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">号码 / 线路组</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">运营商 / 归属地</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-center">今日呼出</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">外显状态</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">关联坐席</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredNumbers.map((num) => (
                <tr key={num.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1A1A1A] text-lg tracking-tight">{num.number}</span>
                      <span className="text-xs text-[#6B7280]">{getLineGroupName(num.lineGroupId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#4B5563]">{num.operator}</span>
                      <span className="text-xs text-[#6B7280]">{num.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-[#1A1A1A]">{num.dailyCalls}</span>
                      <div className="flex items-center gap-1 text-[10px] text-green-600">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>12%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">
                    {new Date(num.createdAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    {num.status === 'cooling' ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <Thermometer className="w-3 h-3" />
                          冷却中
                        </span>
                        <span className="text-[10px] text-orange-600 font-medium">
                          {num.coolingReason}
                        </span>
                      </div>
                    ) : num.status === 'normal' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3" />
                        正常
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <XCircle className="w-3 h-3" />
                        停用
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      num.displayStatus === 'active' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {num.displayStatus === 'active' ? '在线' : '离线'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4B5563]">
                    {num.agentId ? `坐席-${num.agentId}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#6B7280] hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#6B7280] hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-[#6B7280] hover:text-[#1A1A1A] hover:bg-gray-50 rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E5E7EB] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                          <button 
                            onClick={() => updateStatus(num.id, 'normal')}
                            className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 text-green-600"
                          >
                            置为正常
                          </button>
                          <button 
                            onClick={() => updateStatus(num.id, 'cooling')}
                            className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 text-orange-600"
                          >
                            置为冷却
                          </button>
                          <button 
                            onClick={() => updateStatus(num.id, 'disabled')}
                            className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 text-red-600"
                          >
                            置为停用
                          </button>
                        </div>
                      </div>
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

export default NumberPoolModule;
