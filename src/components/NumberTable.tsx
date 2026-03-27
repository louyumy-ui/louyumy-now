import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, Filter, MoreHorizontal, Edit, Trash2, ExternalLink, Plus, ShieldAlert, UserCheck, Ban, Power, ShieldX, Info } from 'lucide-react';
import { PhoneNumber, Carrier } from '../types';
import AssignNumbersModal from './AssignNumbersModal';
import AddNumberModal from './AddNumberModal';
import { RiskControlModal } from './RiskControlModal';

// 自定义内联 Switch 组件 (胶囊样式)
const CustomSwitch: React.FC<{ checked: boolean; onChange: () => void; label?: string }> = ({ checked, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div 
        onClick={onChange}
        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${checked ? 'bg-ant-blue' : 'bg-gray-300'}`}
      >
        <motion.div 
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
};

const NumberTable: React.FC = () => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [riskAction, setRiskAction] = useState<{ id: string; number: string; type: 'disable' | 'harassment' } | null>(null);
  const [editNumber, setEditNumber] = useState<PhoneNumber | null>(null);
  const [filterCarrier, setFilterCarrier] = useState<string>('全部');
  const [filterEnable, setFilterEnable] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [filterDisplay, setFilterDisplay] = useState<'all' | 'on' | 'off'>('all');
  const [numbers, setNumbers] = useState<PhoneNumber[]>([
    { id: '1', number: '020-13800138000', areaCode: '020', landlineNumber: '13800138000', carrier: '中国移动', province: '广东', city: '广州', usageCount: 1250, successRate: 85, status: 'active', isDisplay: true, lastUsed: '2024-03-16 14:30', selected: false, remark: '优质号段', isHarassed: false, isEnabled: true, assignedAgentIds: ['张三', '李四'] },
    { id: '2', number: '010-18612345678', areaCode: '010', landlineNumber: '18612345678', carrier: '中国联通', province: '北京', city: '北京', usageCount: 800, successRate: 72, status: 'cooldown', isDisplay: false, lastUsed: '2024-03-15 09:15', selected: false, remark: '高频外呼', isHarassed: true, isEnabled: true, assignedAgentIds: ['王五'] },
    { id: '3', number: '021-13399887766', areaCode: '021', landlineNumber: '13399887766', carrier: '中国电信', province: '上海', city: '上海', usageCount: 2100, successRate: 91, status: 'active', isDisplay: true, lastUsed: '2024-03-16 16:45', selected: false, remark: 'VIP专用', isHarassed: false, isEnabled: true, assignedAgentIds: ['张三', '赵六'] },
    { id: '4', number: '0571-17011223344', areaCode: '0571', landlineNumber: '17011223344', carrier: '虚拟运营商', province: '浙江', city: '杭州', usageCount: 450, successRate: 45, status: 'suspended', isDisplay: false, lastUsed: '2024-03-10 11:20', selected: false, remark: '已停用', isHarassed: false, isEnabled: false, assignedAgentIds: [] },
    { id: '5', number: '025-13912345678', areaCode: '025', landlineNumber: '13912345678', carrier: '中国移动', province: '江苏', city: '南京', usageCount: 1560, successRate: 78, status: 'active', isDisplay: true, lastUsed: '2024-03-16 10:00', selected: false, remark: '普通号', isHarassed: false, isEnabled: true, assignedAgentIds: ['钱七'] },
  ]);

  const filteredNumbers = React.useMemo(() => {
    return numbers.filter(num => {
      // 运营商筛选
      if (filterCarrier !== '全部' && num.carrier !== filterCarrier) return false;
      
      // 启用状态筛选
      if (filterEnable === 'enabled' && !num.isEnabled) return false;
      if (filterEnable === 'disabled' && num.isEnabled) return false;
      
      // 外显状态筛选
      if (filterDisplay === 'on' && !num.isDisplay) return false;
      if (filterDisplay === 'off' && num.isDisplay) return false;
      
      return true;
    });
  }, [numbers, filterCarrier, filterEnable, filterDisplay]);

  const selectedCount = numbers.filter(n => n.selected).length;

  const toggleSelectAll = () => {
    const allSelected = numbers.every(n => n.selected);
    setNumbers(prev => prev.map(n => ({ ...n, selected: !allSelected })));
  };

  const toggleSelect = (id: string) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, selected: !n.selected } : n));
  };

  const toggleDisplay = (id: string) => {
    setNumbers(prev => prev.map(n => n.id === id ? { ...n, isDisplay: !n.isDisplay } : n));
  };

  const handleRiskAction = (id: string, number: string, type: 'disable' | 'harassment') => {
    setRiskAction({ id, number, type });
    setIsRiskModalOpen(true);
  };

  const confirmRiskAction = (reason: string) => {
    if (!riskAction) return;
    
    setNumbers(prev => prev.map(n => {
      if (n.id === riskAction.id) {
        return {
          ...n,
          isEnabled: riskAction.type === 'disable' ? false : n.isEnabled,
          isHarassed: riskAction.type === 'harassment' ? true : n.isHarassed,
          status: 'suspended',
          remark: `[风控下线] 原因: ${reason}`
        };
      }
      return n;
    }));
    setRiskAction(null);
  };

  const getCarrierColor = (carrier: Carrier) => {
    switch (carrier) {
      case '中国移动': return 'bg-blue-50 text-blue-600 border-blue-100';
      case '中国联通': return 'bg-orange-50 text-orange-600 border-orange-100';
      case '中国电信': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleEdit = (num: PhoneNumber) => {
    setEditNumber(num);
    setIsAddModalOpen(true);
  };

  const handleAdd = () => {
    setEditNumber(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 组合筛选器 */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">启用状态:</span>
              <select 
                value={filterEnable}
                onChange={(e) => setFilterEnable(e.target.value as any)}
                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ant-blue/20"
              >
                <option value="all">全部</option>
                <option value="enabled">启用</option>
                <option value="disabled">停用</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">外显状态:</span>
              <select 
                value={filterDisplay}
                onChange={(e) => setFilterDisplay(e.target.value as any)}
                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ant-blue/20"
              >
                <option value="all">全部</option>
                <option value="on">开启</option>
                <option value="off">关闭</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索号码/备注..." 
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ant-blue/20 focus:border-ant-blue w-48 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setFilterCarrier('全部'); setFilterEnable('all'); setFilterDisplay('all'); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <RotateCcw size={14} />
              <span>重置</span>
            </button>
            <button 
              onClick={handleAdd}
              className="px-4 py-1.5 bg-ant-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
            >
              + 新增号码
            </button>
          </div>
        </div>

        {/* 线路组管理与运营商标签 */}
        <div className="px-4 py-3 bg-gray-50/30 border-b border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">运营商筛选:</span>
            <div className="flex gap-1.5">
              {['全部', '中国移动', '中国联通', '中国电信'].map(carrier => (
                <button
                  key={carrier}
                  onClick={() => setFilterCarrier(carrier)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all shadow-sm ${filterCarrier === carrier ? 'bg-ant-blue text-white border-ant-blue' : 'bg-white text-gray-600 border-gray-200 hover:border-ant-blue hover:text-ant-blue'}`}
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-4 w-px bg-gray-200" />
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">线路组管理:</span>
            <div className="flex gap-1.5">
              {['广州移动组', '北京联通组', '全国电信组'].map(group => (
                <button
                  key={group}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50/50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  {group}
                </button>
              ))}
              <button className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-white text-ant-blue border border-dashed border-ant-blue/50 hover:bg-ant-blue/5 transition-all">
                <Plus size={10} />
                <span>新建线路组</span>
              </button>
            </div>
          </div>
        </div>

        {/* 批量操作栏 */}
        <AnimatePresence>
          {selectedCount > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-ant-blue/5 border-b border-ant-blue/10 px-6 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-ant-blue">已选择 {selectedCount} 个号码</span>
                <div className="h-4 w-px bg-ant-blue/20" />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsAssignModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white border border-ant-blue/20 rounded-md text-xs font-bold text-ant-blue hover:bg-ant-blue hover:text-white transition-all"
                  >
                    <UserCheck size={14} />
                    批量分配
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-ant-blue/20 rounded-md text-xs font-bold text-ant-blue hover:bg-ant-blue hover:text-white transition-all">
                    <Power size={14} />
                    批量启用/停用
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-200 rounded-md text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                    <Ban size={14} />
                    批量骚扰下线
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setNumbers(prev => prev.map(n => ({ ...n, selected: false })))}
                className="text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                取消选择
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 数据表 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 border-b border-gray-100 w-12">
                  <input 
                    type="checkbox" 
                    checked={numbers.length > 0 && numbers.every(n => n.selected)}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-ant-blue focus:ring-ant-blue cursor-pointer" 
                  />
                </th>
                <th className="px-6 py-4 border-b border-gray-100">手机号码</th>
                <th className="px-6 py-4 border-b border-gray-100">运营商</th>
                <th className="px-6 py-4 border-b border-gray-100">归属省</th>
                <th className="px-6 py-4 border-b border-gray-100">地市</th>
                <th className="px-6 py-4 border-b border-gray-100">关联坐席数</th>
                <th className="px-6 py-4 border-b border-gray-100">关联坐席明细</th>
                <th className="px-6 py-4 border-b border-gray-100">外显状态</th>
                <th className="px-6 py-4 border-b border-gray-100">启用状态</th>
                <th className="px-6 py-4 border-b border-gray-100">备注</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredNumbers.map((num) => (
                <tr key={num.id} className={`hover:bg-blue-50/30 transition-colors group ${num.selected ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={num.selected}
                      onChange={() => toggleSelect(num.id)}
                      className="rounded border-gray-300 text-ant-blue focus:ring-ant-blue cursor-pointer" 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{num.areaCode}-{num.landlineNumber}</span>
                      {num.isHarassed && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded border border-rose-100">
                          <ShieldAlert size={10} />
                          骚扰标记
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCarrierColor(num.carrier)}`}>
                      {num.carrier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{num.province}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{num.city}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-ant-blue bg-blue-50 px-2 py-0.5 rounded-full">
                      {num.assignedAgentIds.length} 坐席
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {num.assignedAgentIds.length > 0 ? (
                        num.assignedAgentIds.map(name => (
                          <span key={name} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded border border-gray-200">
                            {name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CustomSwitch checked={num.isDisplay} onChange={() => toggleDisplay(num.id)} />
                      <span className={`text-xs font-medium ${num.isDisplay ? 'text-ant-blue' : 'text-gray-400'}`}>
                        {num.isDisplay ? '开启' : '关闭'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${num.isEnabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500'}`} />
                        <span className={`text-xs font-bold ${num.isEnabled ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {num.isEnabled ? '启用中' : '已停用'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-400 max-w-[120px] truncate block" title={num.remark}>
                      {num.remark || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        title="标记骚扰下线"
                        onClick={() => handleRiskAction(num.id, num.number, 'harassment')}
                        className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <ShieldX size={16} />
                      </button>
                      <button 
                        title="停用号码"
                        onClick={() => handleRiskAction(num.id, num.number, 'disable')}
                        className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <Ban size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(num)}
                        className="p-1.5 text-gray-400 hover:text-ant-blue hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">共 1,284 条记录</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed">上一页</button>
            <button className="px-2 py-1 text-xs border border-ant-blue rounded bg-ant-blue text-white">1</button>
            <button className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-600 hover:border-ant-blue hover:text-ant-blue transition-colors">2</button>
            <button className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-600 hover:border-ant-blue hover:text-ant-blue transition-colors">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-2 py-1 text-xs border border-gray-200 rounded bg-white text-gray-600 hover:border-ant-blue hover:text-ant-blue transition-colors">下一页</button>
          </div>
        </div>

        <AssignNumbersModal 
          isOpen={isAssignModalOpen} 
          onClose={() => setIsAssignModalOpen(false)} 
          selectedCount={selectedCount} 
        />

        <AddNumberModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          editNumber={editNumber}
          onAdd={(newNums) => {
            if (editNumber) {
              setNumbers(prev => prev.map(n => n.id === editNumber.id ? newNums[0] : n));
            } else {
              setNumbers(prev => [...newNums, ...prev]);
            }
          }}
        />

        <RiskControlModal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          onConfirm={confirmRiskAction}
          title={riskAction?.type === 'harassment' ? '标记骚扰下线' : '停用号码'}
          targetNumber={riskAction?.number || ''}
          actionType={riskAction?.type || 'disable'}
        />
      </div>
    </div>
  );
};

export default NumberTable;
