import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RotateCcw, UserPlus, MoreHorizontal, Edit, Trash2, Shield, ShieldOff, Activity } from 'lucide-react';
import { Agent, PhoneNumber } from '../types';
import AddAgentModal from './AddAgentModal';

const AgentManagement: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: '张三', account: 'agent_001', status: 'online', seatConcurrency: 5, accountConcurrency: 10, isEnabled: true, lastLogin: '2024-03-16 14:30', assignedNumbers: ['020-13800138000', '010-18612345678'], associatedAccounts: [], assignedScriptIds: [], remark: '资深坐席', targetProvince: '广东' },
    { id: '2', name: '李四', account: 'agent_002', status: 'busy', seatConcurrency: 3, accountConcurrency: 8, isEnabled: true, lastLogin: '2024-03-16 15:45', assignedNumbers: ['021-13399887766'], associatedAccounts: [], assignedScriptIds: [], remark: '新入职', targetProvince: '北京' },
    { id: '3', name: '王五', account: 'agent_003', status: 'offline', seatConcurrency: 10, accountConcurrency: 20, isEnabled: false, lastLogin: '2024-03-15 09:15', assignedNumbers: [], associatedAccounts: [], assignedScriptIds: [], remark: '待岗', targetProvince: '上海' },
    { id: '4', name: '赵六', account: 'agent_004', status: 'online', seatConcurrency: 8, accountConcurrency: 15, isEnabled: true, lastLogin: '2024-03-16 16:20', assignedNumbers: ['025-13912345678'], associatedAccounts: [], assignedScriptIds: [], remark: '外呼冠军', targetProvince: '广东' },
  ]);

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'online': return <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />在线</span>;
      case 'busy': return <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-100"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" />忙碌</span>;
      case 'offline': return <span className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-gray-100"><div className="w-1.5 h-1.5 rounded-full bg-gray-300" />离线</span>;
    }
  };

  const toggleEnabled = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, isEnabled: !a.isEnabled } : a));
  };

  const handleEdit = (agent: Agent) => {
    setEditAgent(agent);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除该坐席吗？')) {
      setAgents(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleAdd = () => {
    setEditAgent(null);
    setIsAddModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="搜索坐席姓名/账号..." 
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ant-blue/20 focus:border-ant-blue w-64 transition-all"
              />
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button className="px-3 py-1.5 text-xs font-medium bg-white shadow-sm rounded-md text-gray-900">全部坐席</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">在线</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">忙碌</button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">离线</button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <Filter size={14} />
              <span>筛选</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <RotateCcw size={14} />
              <span>重置</span>
            </button>
            <button 
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-1.5 bg-ant-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
            >
              <UserPlus size={16} />
              <span>新增坐席</span>
            </button>
          </div>
        </div>

        {/* 坐席列表表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 border-b border-gray-100">坐席信息</th>
                <th className="px-6 py-4 border-b border-gray-100">坐席业务并发</th>
                <th className="px-6 py-4 border-b border-gray-100">账号最大并发</th>
                <th className="px-6 py-4 border-b border-gray-100">号码池/线路组</th>
                <th className="px-6 py-4 border-b border-gray-100">关联账号/话术</th>
                <th className="px-6 py-4 border-b border-gray-100">启用状态</th>
                <th className="px-6 py-4 border-b border-gray-100">备注</th>
                <th className="px-6 py-4 border-b border-gray-100 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-ant-blue/10 flex items-center justify-center text-ant-blue font-bold text-sm">
                          {agent.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-gray-300'
                        }`} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{agent.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 font-mono">{agent.account}</span>
                          <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">{agent.targetProvince}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between w-24">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Seat CPS</span>
                        <span className="text-xs font-bold text-ant-blue">{agent.seatConcurrency}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-ant-blue rounded-full" 
                          style={{ width: `${(agent.seatConcurrency / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between w-24">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Account Max</span>
                        <span className="text-xs font-bold text-indigo-600">{agent.accountConcurrency}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${(agent.accountConcurrency / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-gray-700">{agent.lineGroupId || '默认号码池'}</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Activity size={10} />
                        <span>已绑 {agent.assignedNumbers.length} 个号码</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap gap-1">
                        {(agent.associatedAccounts.length > 0 ? agent.associatedAccounts : ['主账号', '测试岗']).map((tag, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                        <Edit size={10} />
                        <span>关联 {agent.assignedScriptIds.length || 2} 个话术</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex bg-gray-100 p-0.5 rounded-lg w-fit">
                      <button 
                        onClick={() => !agent.isEnabled && toggleEnabled(agent.id)}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${agent.isEnabled ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        启用
                      </button>
                      <button 
                        onClick={() => agent.isEnabled && toggleEnabled(agent.id)}
                        className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${!agent.isEnabled ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        禁用
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[150px] truncate text-xs text-gray-500 italic" title={agent.remark || '无备注'}>
                      {agent.remark || '暂无备注信息'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(agent)}
                        className="flex items-center gap-1 px-3 py-1.5 text-ant-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-all text-xs font-bold"
                      >
                        <Edit size={14} />
                        <span>编辑</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(agent.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all text-xs font-bold"
                      >
                        <Trash2 size={14} />
                        <span>删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="text-xs text-gray-500">
            显示 1 到 {agents.length} 条，共 {agents.length} 条记录
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs font-medium border border-gray-200 rounded bg-white text-gray-400 cursor-not-allowed">上一页</button>
            <button className="px-3 py-1 text-xs font-medium border border-ant-blue rounded bg-ant-blue text-white">1</button>
            <button className="px-3 py-1 text-xs font-medium border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>

      <AddAgentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editAgent={editAgent}
        availableNumbers={[
          { id: '1', number: '020-13800138000', areaCode: '020', landlineNumber: '13800138000', carrier: '中国移动', province: '广东', city: '广州', usageCount: 1250, successRate: 85, status: 'active', isDisplay: true, lastUsed: '2024-03-16 14:30', selected: false, remark: '优质号段', isHarassed: false, isEnabled: true, assignedAgentIds: ['张三', '李四'] },
          { id: '2', number: '010-18612345678', areaCode: '010', landlineNumber: '18612345678', carrier: '中国联通', province: '北京', city: '北京', usageCount: 800, successRate: 72, status: 'cooldown', isDisplay: false, lastUsed: '2024-03-15 09:15', selected: false, remark: '高频外呼', isHarassed: true, isEnabled: true, assignedAgentIds: ['王五'] },
          { id: '3', number: '021-13399887766', areaCode: '021', landlineNumber: '13399887766', carrier: '中国电信', province: '上海', city: '上海', usageCount: 2100, successRate: 91, status: 'active', isDisplay: true, lastUsed: '2024-03-16 16:45', selected: false, remark: 'VIP专用', isHarassed: false, isEnabled: true, assignedAgentIds: ['张三', '赵六'] },
          { id: '4', number: '0571-17011223344', areaCode: '0571', landlineNumber: '17011223344', carrier: '虚拟运营商', province: '浙江', city: '杭州', usageCount: 450, successRate: 45, status: 'suspended', isDisplay: false, lastUsed: '2024-03-10 11:20', selected: false, remark: '已停用', isHarassed: false, isEnabled: false, assignedAgentIds: [] },
          { id: '5', number: '025-13912345678', areaCode: '025', landlineNumber: '13912345678', carrier: '中国移动', province: '江苏', city: '南京', usageCount: 1560, successRate: 78, status: 'active', isDisplay: true, lastUsed: '2024-03-16 10:00', selected: false, remark: '普通号', isHarassed: false, isEnabled: true, assignedAgentIds: ['钱七'] },
          { id: '6', number: '0755-13700001111', areaCode: '0755', landlineNumber: '13700001111', carrier: '中国移动', province: '广东', city: '深圳', usageCount: 10, successRate: 95, status: 'active', isDisplay: true, lastUsed: '2024-03-16 10:00', selected: false, remark: '新号', isHarassed: false, isEnabled: true, assignedAgentIds: [] },
          { id: '7', number: '0755-13700002222', areaCode: '0755', landlineNumber: '13700002222', carrier: '中国移动', province: '广东', city: '深圳', usageCount: 5, successRate: 98, status: 'active', isDisplay: true, lastUsed: '2024-03-16 10:00', selected: false, remark: '新号', isHarassed: false, isEnabled: true, assignedAgentIds: [] },
        ]}
        onAdd={(data) => {
          if (editAgent) {
            setAgents(prev => prev.map(a => a.id === editAgent.id ? { ...a, ...data, assignedNumbers: data.selectedNumbers } : a));
          } else {
            const newAgent: Agent = {
              id: Date.now().toString(),
              name: data.name,
              account: data.account,
              status: 'offline',
              seatConcurrency: data.seatConcurrency,
              accountConcurrency: data.accountConcurrency,
              isEnabled: data.isEnabled,
              assignedNumbers: data.selectedNumbers,
              associatedAccounts: ['主账号'],
              assignedScriptIds: [1, 2],
              remark: data.remark || '新创建坐席',
              targetProvince: '广东'
            };
            setAgents(prev => [...prev, newAgent]);
          }
        }}
      />
    </motion.div>
  );
};

export default AgentManagement;
