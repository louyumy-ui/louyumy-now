import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  UserPlus, 
  X,
  Users,
  Trash2,
  Building2,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Archive,
  Ban,
  Play,
  Eye,
  ChevronRight,
  Minus,
  Settings,
  MoreVertical,
  Zap,
  ChevronDown,
  Layers,
  History,
  Activity
} from 'lucide-react';
import { Agent, PhoneNumber, LineGroup, AgentStatus } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface Props {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  numbers: PhoneNumber[];
  setNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  lineGroups: LineGroup[];
  setLineGroups: React.Dispatch<React.SetStateAction<LineGroup[]>>;
}

const AgentModule: React.FC<Props> = ({ agents, setAgents, numbers, setNumbers, lineGroups, setLineGroups }) => {
  const [filterLineGroup, setFilterLineGroup] = useState('');
  const [filterOperator, setFilterOperator] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [step, setStep] = useState(1);

  // New Agent Form State
  const [formData, setFormData] = useState({
    name: '',
    operator: '',
    lineGroupId: '',
    numberCount: 1,
    selectionMode: 'auto' as 'auto' | 'manual',
    selectedNumbers: [] as string[],
    concurrencyLimit: 10,
    associatedAccounts: [] as string[],
    associatedScripts: [] as string[],
    remark: ''
  });

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLine = filterLineGroup === '' || agent.lineGroupId === filterLineGroup;
      const matchesOperator = filterOperator === '' || agent.operator === filterOperator;
      const matchesStatus = filterStatus === '' || agent.status === filterStatus;
      return matchesSearch && matchesLine && matchesOperator && matchesStatus;
    });
  }, [agents, searchQuery, filterLineGroup, filterOperator, filterStatus]);

  const getLineGroupName = (id: string) => {
    const lg = lineGroups.find(g => g.id === id);
    return lg ? `${lg.city} (${lg.areaCode})` : '-';
  };

  const handleStatusChange = (id: string, newStatus: AgentStatus) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    if (newStatus === 'archived') {
      if (!confirm('归档操作不可逆，将全额释放线路并发与号码资源。确定归档吗？')) return;
      
      setNumbers(prev => prev.map(n => 
        n.agentId === agent.id ? { ...n, agentId: undefined, status: 'normal' } : n
      ));

      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'archived', numberCount: 0, availableNumberCount: 0, concurrencyLimit: 0 } : a));
      toast.success('坐席已归档，资源已释放');
    } else {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success(`坐席状态已变更为 ${newStatus === 'enabled' ? '启用' : '停用'}`);
    }
  };

  const handleDelete = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    if (agent.status === 'archived') {
      toast.error('已归档坐席无法直接删除');
      return;
    }

    if (confirm('确定删除该坐席吗？删除将停机并自动释放所有资源。')) {
      setNumbers(prev => prev.map(n => 
        n.agentId === agent.id ? { ...n, agentId: undefined, status: 'normal' } : n
      ));
      setAgents(prev => prev.filter(a => a.id !== id));
      toast.success('坐席已删除');
    }
  };

  const handleCreateAgent = () => {
    const lg = lineGroups.find(l => l.id === formData.lineGroupId);
    if (!lg) return;

    let finalNumbers: string[] = [];
    if (formData.selectionMode === 'auto') {
      const available = numbers.filter(n => n.lineGroupId === formData.lineGroupId && n.status === 'normal' && !n.agentId);
      if (available.length < formData.numberCount) {
        toast.error(`可用号码不足，仅剩 ${available.length} 个`);
        return;
      }
      finalNumbers = available.slice(0, formData.numberCount).map(n => n.id);
    } else {
      if (formData.selectedNumbers.length === 0) {
        toast.error('请至少选择一个号码');
        return;
      }
      finalNumbers = formData.selectedNumbers;
    }

    const newAgent: Agent = {
      id: editingAgent ? editingAgent.id : Date.now().toString(),
      name: formData.name,
      operator: formData.operator,
      lineGroupId: formData.lineGroupId,
      numberCount: finalNumbers.length,
      availableNumberCount: finalNumbers.length,
      concurrencyLimit: formData.concurrencyLimit,
      associatedAccounts: formData.associatedAccounts,
      associatedScripts: formData.associatedScripts,
      status: editingAgent ? editingAgent.status : 'enabled',
      remark: formData.remark,
      selectionMode: formData.selectionMode,
      selectedNumbers: finalNumbers
    };

    if (editingAgent) {
      setNumbers(prev => prev.map(n => 
        n.agentId === editingAgent.id ? { ...n, agentId: undefined } : n
      ));
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? newAgent : a));
    } else {
      setAgents(prev => [...prev, newAgent]);
    }

    setNumbers(prev => prev.map(n => finalNumbers.includes(n.id) ? { ...n, agentId: newAgent.id } : n));

    toast.success(editingAgent ? '坐席更新成功' : '坐席创建成功');
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      operator: '',
      lineGroupId: '',
      numberCount: 1,
      selectionMode: 'auto',
      selectedNumbers: [],
      concurrencyLimit: 10,
      associatedAccounts: [],
      associatedScripts: [],
      remark: ''
    });
    setStep(1);
    setEditingAgent(null);
  };

  const availableNumbersForSelection = useMemo(() => {
    return numbers.filter(n => n.lineGroupId === formData.lineGroupId && (editingAgent ? (n.agentId === editingAgent.id || !n.agentId) : !n.agentId) && n.status === 'normal');
  }, [numbers, formData.lineGroupId, editingAgent]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Search and Filters */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div 
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="px-8 py-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-black text-gray-900 uppercase tracking-widest">高级坐席检索系统</span>
          </div>
          <motion.div
            animate={{ rotate: isFiltersExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
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
              <div className="p-8 flex flex-wrap items-center gap-6 border-t border-gray-50 bg-gray-50/30">
                <button 
                  onClick={() => { resetForm(); setIsModalOpen(true); }}
                  className="bg-[#1A1A1A] text-white px-8 py-4 rounded-2xl text-xs font-black hover:bg-black transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  新建业务坐席
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">坐席名称</span>
                  <div className="relative w-48 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0066FF]" />
                    <input 
                      type="text" 
                      placeholder="关键字检索" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0066FF]/10 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">归属线路</span>
                  <select 
                    value={filterLineGroup}
                    onChange={(e) => setFilterLineGroup(e.target.value)}
                    className="w-36 border border-gray-100 rounded-xl px-4 py-3 bg-white text-xs font-bold focus:outline-none"
                  >
                    <option value="">全部线路</option>
                    {lineGroups.map(lg => <option key={lg.id} value={lg.id}>{lg.city}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">业务状态</span>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-32 border border-gray-100 rounded-xl px-4 py-3 bg-white text-xs font-bold focus:outline-none"
                  >
                    <option value="">全部状态</option>
                    <option value="enabled">启用中</option>
                    <option value="disabled">已停机</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm flex-1 flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left order-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">坐席核心主体</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">负载详情</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">并发 / 号码</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">关联业务流</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">当前状态</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                          {agent.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900">{agent.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {agent.id.toUpperCase()}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-gray-700">{getLineGroupName(agent.lineGroupId)}</p>
                       <p className="text-[10px] text-gray-400 font-medium">ISP: {agent.operator}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center tabular-nums">
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-[#0066FF]">{agent.concurrencyLimit} CONC.</span>
                       <span className="text-[10px] font-bold text-gray-400">{agent.numberCount} NUMS</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-gray-900 bg-gray-100 px-2 py-0.5 rounded w-fit">{agent.associatedScripts[0] || '默认话术'}</span>
                      <span className="text-[9px] text-gray-400 font-bold">ACCOUNT: {agent.associatedAccounts[0] || 'SYSTEM'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black italic shadow-inner",
                      agent.status === 'enabled' ? 'bg-green-50 text-green-600' :
                      agent.status === 'disabled' ? 'bg-red-50 text-red-600' :
                      'bg-gray-100 text-gray-400'
                    )}>
                      {agent.status === 'enabled' ? 'RUNNING' : agent.status === 'disabled' ? 'SUSPENDED' : 'ARCHIVED'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {agent.status !== 'archived' && (
                        <>
                          <button 
                            onClick={() => {
                              setEditingAgent(agent);
                              setFormData({
                                name: agent.name,
                                operator: agent.operator,
                                lineGroupId: agent.lineGroupId,
                                numberCount: agent.numberCount,
                                selectionMode: agent.selectionMode || 'auto',
                                selectedNumbers: agent.selectedNumbers || [],
                                concurrencyLimit: agent.concurrencyLimit,
                                associatedAccounts: agent.associatedAccounts,
                                associatedScripts: agent.associatedScripts,
                                remark: agent.remark,
                              });
                              setStep(1);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          ><Layers className="w-4 h-4" /></button>
                          <button 
                            onClick={() => handleStatusChange(agent.id, agent.status === 'enabled' ? 'disabled' : 'enabled')}
                            className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                          ><Activity className="w-4 h-4" /></button>
                          <button 
                            onClick={() => handleStatusChange(agent.id, 'archived')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          ><Archive className="w-4 h-4" /></button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(agent.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <Users className="w-16 h-16 text-gray-100 mx-auto" />
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">未检索到匹配的业务坐席</p>
            </div>
          )}
        </div>
      </div>

      {/* Multi-step Creation Modal (Updated) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[48px] shadow-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#1A1A1A] text-white rounded-2xl">
                     <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{editingAgent ? '坐席资源重构' : '创建业务坐席'}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{"Base Config > Number pool > Concurrency"}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white rounded-2xl border shadow-sm hover:scale-110 transition-all text-gray-400 hover:text-gray-900">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-12 flex-1 overflow-y-auto custom-scrollbar">
                {/* Tabs Indicator */}
                <div className="flex items-center justify-between mb-12 px-8 relative">
                  <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 -z-10 rounded-full">
                     <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((step - 1) / 2) * 100}%` }}
                      className="h-full bg-[#0066FF] rounded-full transition-all duration-500"
                     />
                  </div>
                  {[1, 2, 3].map(s => (
                    <div key={s} className="flex flex-col items-center gap-3 bg-white px-2">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black border-4 transition-all duration-300",
                        step === s ? "bg-[#0066FF] border-blue-100 text-white shadow-xl shadow-blue-500/30" :
                        step > s ? "bg-green-500 border-green-100 text-white" : "bg-white border-gray-100 text-gray-300"
                      )}>
                        {step > s ? "✓" : s}
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        step === s ? "text-gray-900 underline decoration-[#0066FF] decoration-2 underline-offset-4" : "text-gray-400"
                      )}>
                        {s === 1 ? "基础" : s === 2 ? "号码" : "并发"}
                      </span>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 1 && (
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">坐席显示名称 <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:ring-4 focus:ring-[#0066FF]/10 transition-all"
                            placeholder="例如：华东区催收-一组"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">运营商属性 <span className="text-red-500">*</span></label>
                            <select 
                              value={formData.operator}
                              onChange={(e) => setFormData({ ...formData, operator: e.target.value, lineGroupId: '' })}
                              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:outline-none"
                            >
                              <option value="">选择运营商</option>
                              {['中国移动', '中国联通', '中国电信'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">挂载线路组 <span className="text-red-500">*</span></label>
                            <select 
                              value={formData.lineGroupId}
                              disabled={!formData.operator}
                              onChange={(e) => setFormData({ ...formData, lineGroupId: e.target.value })}
                              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                            >
                              <option value="">选择线路</option>
                              {lineGroups.filter(lg => lg.operator === formData.operator).map(lg => (
                                <option key={lg.id} value={lg.id}>{lg.city} ({lg.areaCode})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">业务备注</label>
                          <textarea 
                            value={formData.remark}
                            onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-black focus:outline-none min-h-[100px]"
                            placeholder="坐席特定业务备注..."
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <div className="flex gap-10">
                          <div 
                            onClick={() => setFormData({ ...formData, selectionMode: 'auto' })}
                            className={cn(
                              "flex-1 p-8 rounded-[32px] border-2 cursor-pointer transition-all relative group shadow-sm",
                              formData.selectionMode === 'auto' ? "border-[#0066FF] bg-blue-50/20" : "border-gray-50 hover:border-blue-100"
                            )}
                          >
                            <Zap className={cn("w-8 h-8 mb-4 transition-all", formData.selectionMode === 'auto' ? "text-[#0066FF] fill-blue-600" : "text-gray-300")} />
                            <h4 className="font-black text-lg text-gray-900 tracking-tight">自动流转分配</h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">系统全量扫描线路组内可用号段，自动匹配挂载。</p>
                          </div>
                          <div 
                            onClick={() => setFormData({ ...formData, selectionMode: 'manual' })}
                            className={cn(
                              "flex-1 p-8 rounded-[32px] border-2 cursor-pointer transition-all relative group shadow-sm",
                              formData.selectionMode === 'manual' ? "border-[#0066FF] bg-blue-50/20" : "border-gray-50 hover:border-blue-100"
                            )}
                          >
                            <Eye className={cn("w-8 h-8 mb-4 transition-all", formData.selectionMode === 'manual' ? "text-[#0066FF] fill-blue-600" : "text-gray-300")} />
                            <h4 className="font-black text-lg text-gray-900 tracking-tight">人工资源精选</h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">手动在资产库中挑选特定流水号段进入坐席池。</p>
                          </div>
                        </div>

                        {formData.selectionMode === 'auto' && (
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">号码入库数量</label>
                              <div className="flex items-center bg-gray-50 p-2 rounded-2xl gap-4">
                                <button onClick={() => setFormData({...formData, numberCount: Math.max(1, formData.numberCount - 1)})} className="p-2 hover:bg-gray-200 rounded-xl transition-all"><Minus className="w-4 h-4" /></button>
                                <span className="text-xl font-black text-gray-900 tabular-nums w-8 text-center">{formData.numberCount}</span>
                                <button onClick={() => setFormData({...formData, numberCount: formData.numberCount + 1})} className="p-2 hover:bg-gray-200 rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                              </div>
                            </div>
                            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 border-dashed">
                               <p className="text-[11px] text-blue-700 font-bold leading-relaxed italic">
                                  " 正在从 [{lineGroups.find(l => l.id === formData.lineGroupId)?.city}] 线路组中预检资源... 当前可用空闲号: {availableNumbersForSelection.length} "
                               </p>
                            </div>
                          </div>
                        )}

                        {formData.selectionMode === 'manual' && (
                          <div className="space-y-4">
                            <div className="p-2 bg-gray-50 rounded-3xl grid grid-cols-4 gap-2 max-h-[240px] overflow-auto custom-scrollbar">
                              {availableNumbersForSelection.map(num => {
                                const isSelected = formData.selectedNumbers.includes(num.id);
                                return (
                                  <div 
                                    key={num.id}
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        selectedNumbers: isSelected 
                                          ? prev.selectedNumbers.filter(id => id !== num.id)
                                          : [...prev.selectedNumbers, num.id]
                                      }));
                                    }}
                                    className={cn(
                                      "p-4 rounded-2xl cursor-pointer transition-all text-center",
                                      isSelected ? "bg-[#1A1A1A] text-white" : "bg-white text-gray-400 hover:bg-gray-100"
                                    )}
                                  >
                                    <span className="text-xs font-black tabular-nums">{num.number.slice(-4)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-12">
                        <div className="space-y-6">
                           <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">设定独立并发动态上限</h5>
                              <span className="text-3xl font-black text-[#0066FF] tracking-tighter tabular-nums">{formData.concurrencyLimit} <span className="text-sm">路</span></span>
                           </div>
                           <input 
                            type="range" 
                            min="1" 
                            max={100}
                            value={formData.concurrencyLimit}
                            onChange={(e) => setFormData({ ...formData, concurrencyLimit: parseInt(e.target.value) })}
                            className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#0066FF]"
                           />
                           <div className="flex justify-between text-[9px] font-black text-gray-400 italic">
                             <span>MIN: 1</span>
                             <span>DYNAMIC SYSTEM BALANCING</span>
                             <span>MAX: 100</span>
                           </div>
                        </div>

                        <div className="p-10 bg-[#1A1A1A] rounded-[40px] text-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl pointer-events-none"></div>
                           <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">资源锁定清单统计</h5>
                           <div className="space-y-4">
                              {[
                                { label: '线路并发扣减', val: `-${formData.concurrencyLimit} 路`, color: 'text-red-400' },
                                { label: '资产池锁定号码', val: `+${formData.selectionMode === 'auto' ? formData.numberCount : formData.selectedNumbers.length} 个`, color: 'text-green-400' },
                                { label: '全链路路由同步', val: 'READY', color: 'text-blue-400' },
                              ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                   <span className="font-bold opacity-60">{row.label}</span>
                                   <span className={cn("font-black tracking-tighter", row.color)}>{row.val}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="p-10 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                <button 
                  onClick={() => { if (step > 1) setStep(step - 1); else setIsModalOpen(false); }}
                  className="px-8 py-5 text-xs font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
                >
                  {step === 1 ? '放弃创建' : '后退确认'}
                </button>
                
                <div className="flex gap-4">
                  {step < 3 ? (
                    <button 
                      disabled={step === 1 && (!formData.name || !formData.lineGroupId)}
                      onClick={() => setStep(step + 1)}
                      className="px-12 py-5 bg-[#1A1A1A] text-white rounded-3xl text-sm font-black shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      继续推进
                    </button>
                  ) : (
                    <button 
                      onClick={handleCreateAgent}
                      className="px-12 py-5 bg-[#0066FF] text-white rounded-3xl text-sm font-black shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                    >
                      部署并提交生效
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentModule;
