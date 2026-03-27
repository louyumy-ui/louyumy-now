import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Search, Zap, Check, Info, CheckCircle2, Phone, Filter, Edit } from 'lucide-react';
import { PhoneNumber, Agent } from '../types';

interface AddAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableNumbers: PhoneNumber[];
  onAdd: (agentData: any) => void;
  editAgent?: Agent | null;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ isOpen, onClose, availableNumbers, onAdd, editAgent }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [remark, setRemark] = useState('');
  const [concurrency, setConcurrency] = useState(5);
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [smartCount, setSmartCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState<'smart' | 'manual'>('manual');

  // 初始化编辑数据
  React.useEffect(() => {
    if (editAgent && isOpen) {
      setName(editAgent.name);
      setAccount(editAgent.account);
      setRemark(editAgent.remark || '');
      setConcurrency(editAgent.concurrency);
      setIsEnabled(editAgent.isEnabled);
      // 匹配号码ID
      const matchedIds = availableNumbers
        .filter(n => editAgent.assignedNumbers.includes(n.number))
        .map(n => n.id);
      setSelectedNumbers(matchedIds);
      setStep(1);
    } else if (isOpen) {
      setName('');
      setAccount('');
      setRemark('');
      setConcurrency(5);
      setIsEnabled(true);
      setSelectedNumbers([]);
      setSmartCount(0);
      setStep(1);
    }
  }, [editAgent, isOpen, availableNumbers]);

  // 智能选号逻辑：推荐低频使用的号码
  const recommendedNumbers = useMemo(() => {
    if (smartCount <= 0) return [];
    return [...availableNumbers]
      .sort((a, b) => a.usageCount - b.usageCount)
      .slice(0, smartCount);
  }, [availableNumbers, smartCount]);

  // 列表显示逻辑：已选置顶 > 推荐置顶 > 其他
  const displayNumbers = useMemo(() => {
    let list = [...availableNumbers];
    
    if (searchQuery) {
      list = list.filter(n => n.number.includes(searchQuery) || n.city.includes(searchQuery));
    }

    return list.sort((a, b) => {
      const aSelected = selectedNumbers.includes(a.id);
      const bSelected = selectedNumbers.includes(b.id);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      const aRec = recommendedNumbers.some(rn => rn.id === a.id);
      const bRec = recommendedNumbers.some(rn => rn.id === b.id);
      if (aRec && !bRec) return -1;
      if (!aRec && bRec) return 1;

      return 0;
    });
  }, [availableNumbers, selectedNumbers, recommendedNumbers, searchQuery]);

  if (!isOpen) return null;

  const handleSmartSelect = (count: number) => {
    setSmartCount(count);
    const recs = [...availableNumbers]
      .sort((a, b) => a.usageCount - b.usageCount)
      .slice(0, count);
    const ids = recs.map(n => n.id);
    setSelectedNumbers(ids);
  };

  const toggleNumber = (id: string) => {
    setSelectedNumbers(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    // 将ID转回号码字符串
    const numberStrings = availableNumbers
      .filter(n => selectedNumbers.includes(n.id))
      .map(n => n.number);
    onAdd({ name, account, selectedNumbers: numberStrings, remark, concurrency, isEnabled });
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex h-[700px]"
      >
        {/* Left Side: Form */}
        <div className="w-80 border-r border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-ant-blue/10 flex items-center justify-center text-ant-blue">
                {editAgent ? <Edit size={18} /> : <UserPlus size={18} />}
              </div>
              <h3 className="font-bold text-gray-900">{editAgent ? '编辑坐席' : '新增坐席'}</h3>
            </div>
            <p className="text-[10px] text-gray-400">配置坐席基本信息与初始号码池</p>
          </div>

          <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">坐席姓名</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="如：张三"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">登录账号</label>
                <input 
                  type="text" 
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="手机号或工号"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">启用状态</label>
                <div className="flex bg-gray-100 p-0.5 rounded-lg w-full">
                  <button 
                    onClick={() => setIsEnabled(true)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${isEnabled ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    启用
                  </button>
                  <button 
                    onClick={() => setIsEnabled(false)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded transition-all ${!isEnabled ? 'bg-rose-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    禁用
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">并发限制</label>
                <input 
                  type="number" 
                  value={concurrency}
                  onChange={(e) => setConcurrency(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">备注</label>
                <textarea 
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="选填..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-ant-blue">
                  <Zap size={14} />
                  <span className="text-xs font-bold">智能选号助手</span>
                </div>
                <div className="flex bg-white p-0.5 rounded-md border border-blue-100">
                  <button 
                    onClick={() => setSelectionMode('smart')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${selectionMode === 'smart' ? 'bg-ant-blue text-white' : 'text-gray-400'}`}
                  >
                    智能
                  </button>
                  <button 
                    onClick={() => setSelectionMode('manual')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${selectionMode === 'manual' ? 'bg-ant-blue text-white' : 'text-gray-400'}`}
                  >
                    手动
                  </button>
                </div>
              </div>
              
              {selectionMode === 'smart' ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-blue-600 leading-relaxed">
                    系统将自动挑选使用频率最低的优质号码。
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={smartCount}
                      onChange={(e) => handleSmartSelect(parseInt(e.target.value) || 0)}
                      placeholder="数量"
                      className="w-20 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs focus:ring-2 focus:ring-ant-blue/20 outline-none"
                    />
                    <div className="flex-1 flex items-center justify-center bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg">
                      自动勾选低频号
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-blue-600 leading-relaxed">
                  手动在右侧列表中勾选所需号码。已选号码将自动置顶。
                </p>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
            <button 
              onClick={handleConfirm}
              disabled={!name || !account}
              className="flex-1 py-2 bg-ant-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {editAgent ? '保存修改' : '确认创建'}
            </button>
          </div>
        </div>

        {/* Right Side: Number Selection */}
        <div className="flex-1 flex flex-col bg-gray-50/30">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <h4 className="font-bold text-gray-900">选择号码池</h4>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-ant-blue text-white text-[10px] font-bold rounded-full">
                  已选 {selectedNumbers.length}
                </span>
                {selectionMode === 'smart' && smartCount > 0 && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full border border-amber-200">
                    智能推荐 {smartCount}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索号码/归属地..." 
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-ant-blue/20 outline-none w-64"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {displayNumbers.map((num) => {
                  const isRecommended = recommendedNumbers.some(rn => rn.id === num.id);
                  const isSelected = selectedNumbers.includes(num.id);
                  
                  return (
                    <motion.div
                      layout
                      key={num.id}
                      onClick={() => toggleNumber(num.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all relative group ${
                        isSelected 
                          ? 'border-ant-blue bg-blue-50/50 ring-2 ring-ant-blue/20 shadow-md shadow-blue-100' 
                          : 'border-gray-200 bg-white hover:border-ant-blue/30 hover:shadow-sm'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-amber-400 text-white text-[9px] font-bold rounded-lg italic shadow-md z-10 flex items-center gap-1">
                          <Zap size={10} />
                          推荐
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-ant-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Phone size={14} />
                          </div>
                          <span className={`text-sm font-bold ${isSelected ? 'text-ant-blue' : 'text-gray-900'}`}>
                            {num.number}
                          </span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-ant-blue border-ant-blue text-white' : 'border-gray-200 bg-white'
                        }`}>
                          {isSelected && <Check size={12} />}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1 text-gray-500">
                          <span className="font-medium">{num.city}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-400">{num.carrier}</span>
                        </div>
                        <div className="text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded font-mono">
                          {num.usageCount}次
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ant-blue" />
              <span className="text-[10px] text-gray-500 font-bold">已选号码</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] text-gray-500 font-bold">智能推荐</span>
            </div>
            <div className="h-4 w-px bg-gray-200 mx-2" />
            <span className="text-[10px] text-gray-400">已选号码将自动置顶，智能推荐基于低频使用原则</span>
          </div>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center p-12"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{editAgent ? '坐席更新成功' : '坐席创建成功'}</h4>
              <p className="text-sm text-gray-500 max-w-sm mb-8">
                坐席信息已同步，并已关联 {selectedNumbers.length} 个号码。
              </p>
              <button 
                onClick={onClose}
                className="px-12 py-2 bg-ant-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
              >
                完成
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AddAgentModal;
