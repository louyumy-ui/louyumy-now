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
  ChevronDown
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
      const matchesSearch = agent.name.includes(searchQuery);
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
      
      // Release resources
      setLineGroups(prev => prev.map(lg => 
        lg.id === agent.lineGroupId 
          ? { ...lg, availableConcurrency: lg.availableConcurrency + agent.concurrencyLimit } 
          : lg
      ));

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
      if (agent.status !== 'archived') {
        setLineGroups(prev => prev.map(lg => 
          lg.id === agent.lineGroupId 
            ? { ...lg, availableConcurrency: lg.availableConcurrency + agent.concurrencyLimit } 
            : lg
        ));
        setNumbers(prev => prev.map(n => 
          n.agentId === agent.id ? { ...n, agentId: undefined, status: 'normal' } : n
        ));
      }
      setAgents(prev => prev.filter(a => a.id !== id));
      toast.success('坐席已删除');
    }
  };

  const handleCreateAgent = () => {
    const lg = lineGroups.find(l => l.id === formData.lineGroupId);
    if (!lg) return;
    if (formData.concurrencyLimit > lg.availableConcurrency) {
      toast.error('坐席总并发超过所属线路组剩余可用并发');
      return;
    }

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
      // Release old resources first
      setLineGroups(prev => prev.map(lg => 
        lg.id === editingAgent.lineGroupId 
          ? { ...lg, availableConcurrency: lg.availableConcurrency + editingAgent.concurrencyLimit } 
          : lg
      ));
      setNumbers(prev => prev.map(n => 
        n.agentId === editingAgent.id ? { ...n, agentId: undefined } : n
      ));

      setAgents(prev => prev.map(a => a.id === editingAgent.id ? newAgent : a));
    } else {
      setAgents(prev => [...prev, newAgent]);
    }

    // Set new resources
    setNumbers(prev => prev.map(n => finalNumbers.includes(n.id) ? { ...n, agentId: newAgent.id } : n));
    setLineGroups(prev => prev.map(lg => lg.id === newAgent.lineGroupId ? { ...lg, availableConcurrency: lg.availableConcurrency - newAgent.concurrencyLimit } : lg));

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
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div 
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">坐席筛选</span>
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
                  onClick={() => { resetForm(); setIsModalOpen(true); }}
                  className="bg-[#0066FF] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  新建坐席
                </button>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">坐席名称</span>
                  <div className="relative w-40">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="请输入名称" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 border border-[#D9D9D9] rounded text-xs focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">线路组</span>
                  <select 
                    value={filterLineGroup}
                    onChange={(e) => setFilterLineGroup(e.target.value)}
                    className="w-32 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部线路</option>
                    {lineGroups.map(lg => <option key={lg.id} value={lg.id}>{lg.city}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">运营商</span>
                  <select 
                    value={filterOperator}
                    onChange={(e) => setFilterOperator(e.target.value)}
                    className="w-32 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部运营商</option>
                    {['中国移动', '中国联通', '中国电信'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#333] whitespace-nowrap">状态</span>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-28 border border-[#D9D9D9] rounded px-2 py-1.5 bg-white text-xs"
                  >
                    <option value="">全部状态</option>
                    <option value="enabled">启用</option>
                    <option value="disabled">停用</option>
                    <option value="archived">归档</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">坐席名称</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">线路组</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">运营商</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">号码总数</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center whitespace-nowrap">可用号码</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">并发上限</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">关联账号/话术</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-center">状态</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A]">备注</th>
                <th className="px-5 py-4 font-semibold text-[#1A1A1A] text-right px-8">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-[#F9FAFB] transition-colors h-14">
                  <td className="px-5 py-4 font-medium text-[#1A1A1A]">{agent.name}</td>
                  <td className="px-5 py-4 text-gray-500">{getLineGroupName(agent.lineGroupId)}</td>
                  <td className="px-5 py-4 text-gray-500">{agent.operator}</td>
                  <td className="px-5 py-4 text-center tabular-nums font-bold">{agent.numberCount}</td>
                  <td className="px-5 py-4 text-center tabular-nums text-blue-600 font-bold">{agent.availableNumberCount}</td>
                  <td className="px-5 py-4 text-center tabular-nums">{agent.concurrencyLimit}</td>
                  <td className="px-5 py-4 text-gray-400">
                    <div className="flex flex-col gap-0.5">
                      <span className="truncate max-w-[150px]">{agent.associatedAccounts.join(', ') || '-'}</span>
                      <span className="text-[10px] text-gray-400 italic truncate max-w-[150px]">{agent.associatedScripts.join(', ') || '-'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                      agent.status === 'enabled' ? 'bg-green-50 text-green-600 border-green-100' :
                      agent.status === 'disabled' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      'bg-gray-100 text-gray-400 border-gray-200'
                    )}>
                      {agent.status === 'enabled' ? '启用中' : agent.status === 'disabled' ? '已停用' : '已归档'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 truncate max-w-[100px]">{agent.remark || '-'}</td>
                  <td className="px-5 py-4 text-right px-8">
                    <div className="flex items-center justify-end gap-3">
                      {agent.status !== 'archived' && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
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
                            className="text-[#0066FF] hover:text-blue-800 font-medium"
                          >
                            编辑
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(agent.id, agent.status === 'enabled' ? 'disabled' : 'enabled'); }}
                            className="text-[#EF4444] hover:text-red-700 font-medium"
                          >
                            {agent.status === 'enabled' ? '停用' : '启用'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(agent.id, 'archived'); }}
                            className="text-gray-500 hover:text-gray-700 font-medium"
                          >
                            归档
                          </button>
                        </>
                      )}
                      {agent.status === 'archived' && (
                        <button className="text-[#0066FF] hover:text-blue-800 font-medium">查看号码</button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(agent.id); }}
                        className="text-[#EF4444] hover:text-red-700 font-medium"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAgents.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-gray-400">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-step Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-base font-bold">{editingAgent ? '编辑坐席' : '新建坐席'}</h3>
                <p className="text-[10px] text-gray-400">核心流程：基础配置 &gt; 号码分配 &gt; 并发授权</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              {/* Tabs Indicator */}
              <div className="flex items-center justify-between mb-10 px-10 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex flex-col items-center gap-2 bg-white px-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
                      step === s ? "bg-[#0066FF] border-[#0066FF] text-white shadow-lg shadow-blue-200" :
                      step > s ? "bg-green-500 border-green-500 text-white" : "border-gray-200 text-gray-300"
                    )}>
                      {step > s ? "✓" : s}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold",
                      step === s ? "text-[#0066FF]" : step > s ? "text-green-500" : "text-gray-400"
                    )}>
                      {s === 1 ? "基础信息" : s === 2 ? "号码池配置" : "并发配置"}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">坐席名称 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      autoFocus
                      className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                      placeholder="例如：催收二组-深圳"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">运营商 <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.operator}
                        onChange={(e) => setFormData({ ...formData, operator: e.target.value, lineGroupId: '' })}
                        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                      >
                        <option value="">请选择运营商</option>
                        {['中国移动', '中国联通', '中国电信'].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">锁定线路组 <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.lineGroupId}
                        disabled={!formData.operator}
                        onChange={(e) => setFormData({ ...formData, lineGroupId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0066FF] disabled:bg-gray-50"
                      >
                        <option value="">请选择线路</option>
                        {lineGroups.filter(lg => lg.operator === formData.operator).map(lg => (
                          <option key={lg.id} value={lg.id}>{lg.city} ({lg.areaCode}) - 可用并发: {lg.availableConcurrency + (editingAgent?.lineGroupId === lg.id ? editingAgent.concurrencyLimit : 0)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">备注</label>
                    <textarea 
                      value={formData.remark}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                      rows={2}
                      placeholder="业务核心分公司备注..."
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
                        "flex-1 p-6 border-2 rounded-2xl cursor-pointer transition-all relative group",
                        formData.selectionMode === 'auto' ? "border-[#0066FF] bg-blue-50/30" : "border-gray-100 hover:border-blue-200"
                      )}
                    >
                      {formData.selectionMode === 'auto' && <CheckCircle2 className="w-5 h-5 text-[#0066FF] absolute top-4 right-4" />}
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">自动选号模式</h4>
                      <p className="text-[10px] text-gray-400">系统根据线路组状态自动匹配最优质号码填充，极速部署。</p>
                    </div>
                    <div 
                      onClick={() => setFormData({ ...formData, selectionMode: 'manual' })}
                      className={cn(
                        "flex-1 p-6 border-2 rounded-2xl cursor-pointer transition-all relative group",
                        formData.selectionMode === 'manual' ? "border-[#0066FF] bg-blue-50/30" : "border-gray-100 hover:border-blue-200"
                      )}
                    >
                      {formData.selectionMode === 'manual' && <CheckCircle2 className="w-5 h-5 text-[#0066FF] absolute top-4 right-4" />}
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Eye className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm mb-1">人工精选模式</h4>
                      <p className="text-[10px] text-gray-400">手动查看可用号码库，支持跨业务、号段多重自定义筛选。</p>
                    </div>
                  </div>

                  {formData.selectionMode === 'auto' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label className="text-xs font-bold text-gray-700 whitespace-nowrap">需分配号码数量 <span className="text-red-500">*</span></label>
                        <div className="flex items-center border rounded-lg overflow-hidden divide-x">
                          <button onClick={() => setFormData({...formData, numberCount: Math.max(1, formData.numberCount - 1)})} className="p-2 bg-gray-50 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                          <input 
                            type="number" 
                            min="1" 
                            className="w-16 text-center text-sm font-bold focus:outline-none" 
                            value={formData.numberCount}
                            onChange={(e) => setFormData({ ...formData, numberCount: parseInt(e.target.value) || 1 })}
                          />
                          <button onClick={() => setFormData({...formData, numberCount: formData.numberCount + 1})} className="p-2 bg-gray-50 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                        </div>
                        <span className="text-[10px] text-gray-400">系统将强制匹配 ≥1 个可用号码</span>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] text-amber-700">自动模式下，系统优先选择“历史呼出量较低”且“状态正常”的空闲号。</p>
                          <p className="text-[10px] text-amber-800 font-bold">
                            线路组总号码：{numbers.filter(n => n.lineGroupId === formData.lineGroupId).length} | 
                            空闲可用：{availableNumbersForSelection.length}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-4 border rounded-xl bg-gray-50/50">
                        <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">预分配号码预览</p>
                        <div className="flex flex-wrap gap-2">
                          {availableNumbersForSelection.slice(0, formData.numberCount).map(n => (
                            <span key={n.id} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold tabular-nums text-gray-600">
                              {n.number}
                            </span>
                          ))}
                          {availableNumbersForSelection.length === 0 && <span className="text-[10px] text-gray-400 italic">暂无可用号码</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.selectionMode === 'manual' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700">从线路组中精选号码 <span className="text-red-500">*</span></label>
                        <span className="text-[10px] font-bold text-[#0066FF]">已选 {formData.selectedNumbers.length} 个</span>
                      </div>
                      
                      <div className="p-4 border rounded-xl bg-gray-50/50 max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-4 gap-3">
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
                                  "p-3 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center gap-1 relative overflow-hidden",
                                  isSelected ? "border-[#0066FF] bg-white shadow-sm" : "border-transparent bg-white hover:border-gray-200"
                                )}
                              >
                                {isSelected && (
                                  <div className="absolute top-0 right-0 bg-[#0066FF] text-white p-0.5 rounded-bl-md">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                  </div>
                                )}
                                <span className={cn("text-xs font-bold tabular-nums", isSelected ? "text-[#0066FF]" : "text-gray-700")}>
                                  {num.number}
                                </span>
                                <span className="text-[9px] text-gray-400 uppercase">{num.businessType}</span>
                              </div>
                            );
                          })}
                          {availableNumbersForSelection.length === 0 && (
                            <div className="col-span-full py-8 text-center text-gray-400 text-[10px]">
                              当前线路组暂无可分配的空闲号码
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">当前线路组可用总并发</p>
                        <p className="text-2xl font-bold tabular-nums">
                          {lineGroups.find(lg => lg.id === formData.lineGroupId)?.availableConcurrency + (editingAgent?.lineGroupId === formData.lineGroupId ? editingAgent.concurrencyLimit : 0) || 0}
                        </p>
                      </div>
                      <div className="h-10 w-px bg-gray-200"></div>
                      <div className="space-y-1 text-right">
                        <p className="text-xs text-gray-500 font-medium">所属运营商</p>
                        <p className="text-lg font-bold text-[#0066FF]">{formData.operator}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700">设置坐席并发上限 <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-6">
                        <input 
                          type="range" 
                          min="1" 
                          max={lineGroups.find(lg => lg.id === formData.lineGroupId)?.availableConcurrency + (editingAgent?.lineGroupId === formData.lineGroupId ? editingAgent.concurrencyLimit : 0) || 100}
                          value={formData.concurrencyLimit}
                          onChange={(e) => setFormData({ ...formData, concurrencyLimit: parseInt(e.target.value) })}
                          className="flex-1 h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#0066FF]"
                        />
                        <div className="w-24 px-3 py-2 border rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <span className="text-lg font-bold text-[#0066FF] tabular-nums">{formData.concurrencyLimit}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 font-medium pt-1">
                        <span>最小: 1</span>
                        <span>系统实时校验并发平衡</span>
                        <span>最大: {lineGroups.find(lg => lg.id === formData.lineGroupId)?.availableConcurrency + (editingAgent?.lineGroupId === formData.lineGroupId ? editingAgent.concurrencyLimit : 0) || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#1A1A1A] rounded-2xl text-white space-y-4">
                    <h5 className="text-xs font-bold flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-green-400" /> 确认生效内容
                    </h5>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[11px] opacity-80">
                      <div className="flex justify-between"><span>对应线路并发扣减</span><span className="text-red-400">-{formData.concurrencyLimit}</span></div>
                      <div className="flex justify-between"><span>号码池资源锁定</span><span className="text-green-400">+{formData.selectionMode === 'auto' ? formData.numberCount : formData.selectedNumbers.length} 个</span></div>
                      <div className="flex justify-between"><span>回拨路由自动生成</span><span className="text-green-400">已就绪</span></div>
                      <div className="flex justify-between"><span>业务规则同步生效</span><span className="text-green-400">已就绪</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 bg-gray-50 border-t flex justify-between items-center">
              <button 
                onClick={() => { if (step > 1) setStep(step - 1); else setIsModalOpen(false); }}
                className="px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                {step === 1 ? '取消' : '上一步'}
              </button>
              
              <div className="flex gap-4">
                {step < 3 ? (
                  <button 
                    disabled={step === 1 && (!formData.name || !formData.lineGroupId)}
                    onClick={() => {
                        if (step === 2 && formData.selectionMode === 'manual' && formData.selectedNumbers.length === 0) {
                            toast.error('请至少精选一个号码');
                            return;
                        }
                        setStep(step + 1);
                    }}
                    className="px-10 py-2.5 bg-[#0066FF] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:shadow-none"
                  >
                    下一步
                  </button>
                ) : (
                  <button 
                    onClick={handleCreateAgent}
                    className="px-10 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all"
                  >
                    完成，提交生效
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentModule;
