import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Trash2,
  Calendar,
  RotateCcw,
  Minus,
  ChevronDown
} from 'lucide-react';
import { LineGroup, LineStatus, Operator } from '../types';
import { CITIES, PROVINCES } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface Props {
  lineGroups: LineGroup[];
  setLineGroups: React.Dispatch<React.SetStateAction<LineGroup[]>>;
  operators: Operator[];
}

const LineGroupModule: React.FC<Props> = ({ lineGroups, setLineGroups, operators }) => {
  const [filterProvince, setFilterProvince] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LineGroup | null>(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  const [formData, setFormData] = useState({
    city: '',
    areaCode: '',
    totalConcurrency: 120,
    operator: '',
    province: '',
    remark: ''
  });

  const filteredGroups = lineGroups.filter(group => {
    const matchesSearch = group.remark.includes(searchQuery) || 
                         group.city.includes(searchQuery) || 
                         group.operator.includes(searchQuery);
    return (filterProvince === '' || group.province === filterProvince) &&
           (filterCity === '' || group.city === filterCity) &&
           (filterOperator === '' || group.operator === filterOperator) &&
           (filterStatus === '' || group.status === filterStatus) &&
           matchesSearch;
  });

  const handleOpenModal = (group?: LineGroup) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        city: group.city,
        areaCode: group.areaCode,
        totalConcurrency: group.totalConcurrency,
        operator: group.operator,
        province: group.province,
        remark: group.remark
      });
    } else {
      setEditingGroup(null);
      setFormData({
        city: '',
        areaCode: '',
        totalConcurrency: 120,
        operator: operators[0]?.name || '',
        province: PROVINCES[0],
        remark: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.city || !formData.areaCode) {
      toast.error('请填写必填项');
      return;
    }

    if (editingGroup) {
      setLineGroups(prev => prev.map(g => 
        g.id === editingGroup.id ? { ...g, ...formData } : g
      ));
      toast.success('更新成功');
    } else {
      const newGroup: LineGroup = {
        id: Date.now().toString(),
        ...formData,
        availableConcurrency: formData.totalConcurrency,
        maxCPS: 30,
        currentCPS: 0,
        onlineCount: 0,
        currentOnlineCount: 0,
        status: 'enabled'
      };
      setLineGroups(prev => [...prev, newGroup]);
      toast.success('添加成功');
    }
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setLineGroups(prev => prev.map(g => 
      g.id === id ? { ...g, status: g.status === 'enabled' ? 'disabled' : 'enabled' } : g
    ));
  };

  const deleteGroup = (id: string) => {
    if (confirm('确定要删除该线路组吗？')) {
      setLineGroups(prev => prev.filter(g => g.id !== id));
      toast.success('删除成功');
    }
  };

  return (
    <div className="space-y-4" id="line-group-module">
      {/* Header Info - Stats Overview */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm flex items-center justify-between">
        <div className="grid grid-cols-4 gap-8 flex-1">
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280]">线路组总数</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">{lineGroups.length}</p>
          </div>
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280]">总并发量 (Total)</p>
            <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums">
              {lineGroups.reduce((acc, curr) => acc + curr.totalConcurrency, 0)}
            </p>
          </div>
          <div className="space-y-1 border-r border-[#F3F4F6]">
            <p className="text-xs text-[#6B7280]">已分配并发 (Assigned)</p>
            <p className="text-2xl font-bold text-[#EF4444] tabular-nums">
              {lineGroups.reduce((acc, curr) => acc + (curr.totalConcurrency - curr.availableConcurrency), 0)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#6B7280]">剩余可用并发 (Available)</p>
            <p className="text-2xl font-bold text-[#0066FF] tabular-nums">
              {lineGroups.reduce((acc, curr) => acc + curr.availableConcurrency, 0)}
            </p>
          </div>
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
            <span className="text-sm font-bold text-gray-700">线路组筛选</span>
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
                <button 
                  onClick={() => handleOpenModal()}
                  className="bg-[#0066FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shrink-0"
                >
                  新增线路组
                </button>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">省份</span>
                  <select 
                    value={filterProvince}
                    onChange={(e) => setFilterProvince(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部省份</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">地市</span>
                  <select 
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部地市</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
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

                <div className="flex-1 min-w-[150px] relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索线路组 / 备注" 
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">省份</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">线路组</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">运营商</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">总并发</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">已分配</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">剩余可用</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center whitespace-nowrap">开启状态</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">备注</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-right px-8">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredGroups.map((group) => (
                <tr key={group.id} className="hover:bg-[#F9FAFB] transition-colors h-14">
                  <td className="px-5 py-4 text-[#1A1A1A]">{group.province}</td>
                  <td className="px-5 py-4 font-medium text-[#1A1A1A]">{group.city}</td>
                  <td className="px-5 py-4 text-[#1A1A1A]">{group.operator}</td>
                  <td className="px-5 py-4 text-center font-medium text-[#1A1A1A] tabular-nums">{group.totalConcurrency}</td>
                  <td className="px-5 py-4 text-center text-[#1A1A1A] tabular-nums">{group.totalConcurrency - group.availableConcurrency}</td>
                  <td className="px-5 py-4 text-center font-bold text-[#1A1A1A] tabular-nums">{group.availableConcurrency}</td>
                  <td className="px-5 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(group.id)}
                      className={cn(
                        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mx-auto",
                        group.status === 'enabled' ? "bg-[#0066FF]" : "bg-gray-200"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          group.status === 'enabled' ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-[#6B7280] max-w-[120px] truncate">{group.remark || '-'}</td>
                  <td className="px-5 py-4 text-right px-8">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleOpenModal(group)}
                        className="text-[#0066FF] hover:text-blue-800 font-medium transition-colors"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => deleteGroup(group.id)}
                        className="text-[#EF4444] hover:text-red-700 font-medium transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-base font-bold text-[#1A1A1A]">{editingGroup ? '编辑线路组' : '新建线路组'}</span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <RotateCcw className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">
                    <span className="text-red-500 mr-1">*</span>线路组名称
                  </label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#0066FF]"
                    placeholder="请输入线路组名称"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">
                    <span className="text-red-500 mr-1">*</span>线路区号
                  </label>
                  <input 
                    type="text" 
                    value={formData.areaCode}
                    onChange={(e) => setFormData({ ...formData, areaCode: e.target.value })}
                    className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[#0066FF]"
                    placeholder="示例: 0751"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">
                    <span className="text-red-500 mr-1">*</span>线路总并发
                  </label>
                  <div className="flex items-center border border-gray-200 rounded divide-x">
                    <button 
                      onClick={() => setFormData({ ...formData, totalConcurrency: Math.max(0, formData.totalConcurrency - 1) })}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      value={formData.totalConcurrency}
                      onChange={(e) => setFormData({ ...formData, totalConcurrency: parseInt(e.target.value) || 0 })}
                      className="w-20 text-center px-2 text-sm focus:outline-none tabular-nums"
                    />
                    <button 
                      onClick={() => setFormData({ ...formData, totalConcurrency: formData.totalConcurrency + 1 })}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">省份</label>
                  <select 
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none"
                  >
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">运营商</label>
                  <select 
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none"
                  >
                    {operators.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-24 text-sm font-semibold text-[#4B5563] text-right shrink-0">备注信息</label>
                  <textarea 
                    value={formData.remark}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none"
                    rows={2}
                    placeholder="线路组备注信息"
                  />
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gray-50 border-t flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2 bg-[#0066FF] text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineGroupModule;
