import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus,
  Ban,
  RefreshCw,
  MoreVertical,
  X,
  Settings2,
  Check,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { PhoneNumber, LineGroup, GlobalConfig, NumberStatus, Operator } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Props {
  numbers: PhoneNumber[];
  setNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  lineGroups: LineGroup[];
  config: GlobalConfig;
  operators: Operator[];
  triggerCooling: (id: string, reason: string) => void;
}

const CallingNumberModule: React.FC<Props> = ({ numbers, setNumbers, lineGroups, config, operators, triggerCooling }) => {
  const [filterLineGroup, setFilterLineGroup] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDisplay, setFilterDisplay] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'lineGroup', 'number', 'operator', 'dailyCalls', 'totalCalls', 'displayStatus', 'numberStatus', 'remark'
  ]);

  const columns = [
    { id: 'lineGroup', label: '线路组' },
    { id: 'number', label: '号码' },
    { id: 'operator', label: '运营商' },
    { id: 'dailyCalls', label: '今日呼出' },
    { id: 'totalCalls', label: '累计呼出' },
    { id: 'displayStatus', label: '外显状态' },
    { id: 'numberStatus', label: '号码状态' },
    { id: 'remark', label: '备注' },
  ];

  const toggleColumn = (id: string) => {
    setVisibleColumns(prev => 
      prev.includes(id) ? prev.filter(col => col !== id) : [...prev, id]
    );
  };

  const filteredNumbers = useMemo(() => {
    return numbers.filter(num => {
      const matchesSearch = num.number.includes(searchQuery) || (num.remark && num.remark.includes(searchQuery));
      const matchesLine = filterLineGroup === '' || num.lineGroupId === filterLineGroup;
      const matchesOperator = filterOperator === '' || num.operator === filterOperator;
      const matchesStatus = filterStatus === '' || num.status === filterStatus;
      const matchesDisplay = filterDisplay === '' || num.displayStatus === filterDisplay;
      return matchesSearch && matchesLine && matchesOperator && matchesStatus && matchesDisplay;
    });
  }, [numbers, searchQuery, filterLineGroup, filterOperator, filterStatus, filterDisplay]);

  const getLineGroupDisplay = (id: string) => {
    const lg = lineGroups.find(g => g.id === id);
    return lg ? lg.city : '-';
  };

  const updateStatus = (id: string, status: NumberStatus) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, status } : n));
    toast.success('状态更新成功');
  };

  const toggleDisplayStatus = (id: string) => {
    setNumbers(prev => prev.map(n => 
      n.id === id ? { ...n, displayStatus: n.displayStatus === 'active' ? 'inactive' : 'active' } : n
    ));
  };

  const formatNumber = (num: string) => {
    // "号码不显示区号" - assuming format is "AreaCode-Number"
    if (num.includes('-')) {
      return num.split('-')[1];
    }
    return num;
  };

  const getStatusIcon = (status: NumberStatus) => {
    switch (status) {
      case 'normal': return <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 flex-shrink-0"></span>;
      case 'cooling': return <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1.5 flex-shrink-0"></span>;
      case 'suspended_with_agent': return <span className="w-2 h-2 rounded-full bg-orange-400 mr-1.5 flex-shrink-0"></span>;
      case 'disabled': return <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 flex-shrink-0"></span>;
    }
  };

  const getStatusText = (status: NumberStatus) => {
    switch (status) {
      case 'normal': return '正常';
      case 'cooling': return '冷却中';
      case 'suspended_with_agent': return '随坐席挂起';
      case 'disabled': return '停用';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Info - All Statuses */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
        <div className="grid grid-cols-5 gap-8 flex-1">
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280]">号码总额</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{numbers.length}</p>
          </div>
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-green-600">正常号码</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{numbers.filter(n => n.status === 'normal').length}</p>
          </div>
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-yellow-600">冷却号码</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{numbers.filter(n => n.status === 'cooling').length}</p>
          </div>
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-orange-600">挂起号码</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{numbers.filter(n => n.status === 'suspended_with_agent').length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-red-600">停用号码</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{numbers.filter(n => n.status === 'disabled').length}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            新增号码
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#D9D9D9] text-[#666] text-sm font-medium rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            导出号码
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div 
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">搜索筛选</span>
          </div>
          <motion.div
            animate={{ rotate: isFiltersExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {isFiltersExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="p-4 flex flex-wrap items-center gap-4 border-t border-[#F3F4F6]">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">所属线路组</span>
                  <select 
                    value={filterLineGroup}
                    onChange={(e) => setFilterLineGroup(e.target.value)}
                    className="w-32 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部线路组</option>
                    {lineGroups.map(lg => <option key={lg.id} value={lg.id}>{getLineGroupDisplay(lg.id)}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">运营商</span>
                  <select 
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部运营商</option>
                    {operators.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">外显状态</span>
                  <select 
                    value={filterDisplay}
                    onChange={(e) => setFilterDisplay(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs transition-all"
                  >
                    <option value="">全部外显</option>
                    <option value="active">在线</option>
                    <option value="inactive">离线</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">号码状态</span>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部状态</option>
                    <option value="normal">正常</option>
                    <option value="cooling">冷却中</option>
                    <option value="suspended_with_agent">随坐席挂起</option>
                    <option value="disabled">停用</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索号码 / 备注" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-[#D9D9D9] rounded text-xs focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                {visibleColumns.includes('lineGroup') && <th className="px-4 py-4 font-semibold text-[#1A1A1A]">线路组</th>}
                {visibleColumns.includes('number') && <th className="px-4 py-4 font-semibold text-[#1A1A1A]">号码</th>}
                {visibleColumns.includes('operator') && <th className="px-4 py-4 font-semibold text-[#1A1A1A]">运营商</th>}
                {visibleColumns.includes('dailyCalls') && <th className="px-4 py-4 font-semibold text-[#1A1A1A] text-center">今日呼出</th>}
                {visibleColumns.includes('totalCalls') && <th className="px-4 py-4 font-semibold text-[#1A1A1A] text-center">累计呼出</th>}
                {visibleColumns.includes('displayStatus') && <th className="px-4 py-4 font-semibold text-[#1A1A1A] text-center whitespace-nowrap">外显状态</th>}
                {visibleColumns.includes('numberStatus') && <th className="px-4 py-4 font-semibold text-[#1A1A1A] whitespace-nowrap">号码状态</th>}
                {visibleColumns.includes('remark') && <th className="px-4 py-4 font-semibold text-[#1A1A1A]">备注</th>}
                <th className="px-4 py-4 font-semibold text-[#1A1A1A] text-right px-8">
                  <div className="flex items-center justify-end relative">
                    <button onClick={() => setShowColumnConfig(!showColumnConfig)} className="p-1 hover:bg-gray-200 rounded-md transition-colors mr-2">
                       <Settings2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <span>操作</span>
                    
                    <AnimatePresence>
                      {showColumnConfig && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-2xl z-[100] py-2"
                        >
                          <div className="px-3 py-1 mb-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">显示列配置</div>
                          {columns.map(col => (
                            <button 
                              key={col.id}
                              onClick={() => toggleColumn(col.id)}
                              className="w-full px-4 py-2 text-left text-xs hover:bg-gray-50 flex items-center justify-between"
                            >
                              <span className={cn(visibleColumns.includes(col.id) ? "text-[#1A1A1A] font-medium" : "text-gray-400")}>
                                {col.label}
                              </span>
                              {visibleColumns.includes(col.id) && <Check className="w-3 h-3 text-[#0066FF]" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredNumbers.map((num) => (
                <tr key={num.id} className="hover:bg-[#F9FAFB] transition-colors group h-14">
                  {visibleColumns.includes('lineGroup') && <td className="px-4 py-3 text-gray-500 font-medium">{getLineGroupDisplay(num.lineGroupId)}</td>}
                  {visibleColumns.includes('number') && <td className="px-4 py-3 font-bold text-[#1A1A1A] tabular-nums text-[13px]">{formatNumber(num.number)}</td>}
                  {visibleColumns.includes('operator') && <td className="px-4 py-3 text-gray-400">{num.operator}</td>}
                  {visibleColumns.includes('dailyCalls') && <td className="px-4 py-3 text-center tabular-nums">{num.dailyCalls}</td>}
                  {visibleColumns.includes('totalCalls') && <td className="px-4 py-3 text-center tabular-nums">{num.totalCalls}</td>}
                  {visibleColumns.includes('displayStatus') && <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleDisplayStatus(num.id)}
                      className={cn(
                        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mx-auto",
                        num.displayStatus === 'active' ? "bg-[#0066FF]" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          num.displayStatus === 'active' ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                    <span className="block text-[9px] mt-0.5 text-gray-400">{num.displayStatus === 'active' ? '在线' : '离线'}</span>
                  </td>}
                  {visibleColumns.includes('numberStatus') && <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getStatusIcon(num.status)}
                      <span className="text-[12px] font-medium text-gray-700">
                        {getStatusText(num.status)}
                      </span>
                    </div>
                  </td>}
                  {visibleColumns.includes('remark') && <td className="px-4 py-3 text-gray-400 max-w-[120px] truncate">{num.remark || '-'}</td>}
                  <td className="px-4 py-3 text-right px-8">
                    <div className="flex items-center justify-end gap-4">
                      <button className="text-[#0066FF] hover:text-blue-800 font-medium">备注</button>
                      <button className="text-[#0066FF] hover:text-blue-800 font-medium">编辑</button>
                      
                      <div className="relative group/more flex items-center">
                        <button className="text-[#6B7280] hover:text-[#1A1A1A] font-medium flex items-center gap-0.5">
                          更多
                          <MoreVertical className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#E5E7EB] rounded-lg shadow-xl invisible group-hover/more:visible opacity-0 group-hover/more:opacity-100 transition-all z-50 py-1 overflow-hidden">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 border-b">修改号码状态</div>
                          <button onClick={() => updateStatus(num.id, 'normal')} className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2">
                             <RefreshCw className="w-3.5 h-3.5 text-green-500" /> 置为正常
                          </button>
                          <button onClick={() => updateStatus(num.id, 'cooling')} className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2">
                             <Ban className="w-3.5 h-3.5 text-yellow-500" /> 进入冷却
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <div className="px-3 py-1.5 text-[9px] font-bold text-gray-400 bg-gray-50/50">仿真：触发冷却预警</div>
                          <button 
                            onClick={() => triggerCooling(num.id, `过去 1 小时内，累计有 ${config.coolingRule.shortCallCountLimit} 通通话时长 < 3秒（超短通话阈值）`)} 
                            className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                          >
                             <RotateCcw className="w-3.5 h-3.5" /> 模拟超短通话触发
                          </button>
                          <button 
                            onClick={() => triggerCooling(num.id, `过去 1 小时内，累计有 ${config.coolingRule.rejectionLimit} 次用户拒接异常记录`)} 
                            className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                          >
                             <Ban className="w-3.5 h-3.5" /> 模拟高频拒接触发
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button onClick={() => updateStatus(num.id, 'disabled')} className="w-full px-3 py-2 text-left text-[11px] hover:bg-gray-50 flex items-center gap-2 text-red-600">
                             <Ban className="w-3.5 h-3.5" /> 停用号码
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

export default CallingNumberModule;
