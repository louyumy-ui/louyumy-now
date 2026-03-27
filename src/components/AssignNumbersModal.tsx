import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Info, CheckCircle2, AlertCircle, Users, Layers, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AssignNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignNumbersModal: React.FC<AssignNumbersModalProps> = ({ 
  isOpen, 
  onClose, 
}) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedLineGroup, setSelectedLineGroup] = useState<string>('');
  const [numberCount, setNumberCount] = useState<number>(5);

  const agents = [
    { id: '1', name: '销售一部-张三', province: '广东' },
    { id: '2', name: '销售二部-李四', province: '北京' },
    { id: '3', name: '运营中心-王五', province: '上海' },
  ];

  const lineGroups = [
    { id: 'lg1', name: '广东移动专线 (0755)', carrier: '中国移动' },
    { id: 'lg2', name: '北京联通专线 (010)', carrier: '中国联通' },
    { id: 'lg3', name: '上海电信专线 (021)', carrier: '中国电信' },
  ];

  if (!isOpen) return null;

  const handleSmartSelection = () => {
    if (!selectedAgent || !selectedLineGroup) {
      toast.error('请完整填写分配策略');
      return;
    }
    
    setIsLoading(true);
    // 模拟智能盲捞逻辑
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast.success(`成功从空闲池抽调 ${numberCount} 个低频号码`);
    }, 2000);
  };

  const resetAndClose = () => {
    setStep(1);
    setIsLoading(false);
    setSelectedAgent('');
    setSelectedLineGroup('');
    setNumberCount(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Zap size={18} />
            </div>
            <h3 className="font-bold text-gray-900">智能资源分配引擎</h3>
          </div>
          <button onClick={resetAndClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={24} className="text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">智能分配中...</p>
                      <p className="text-xs text-gray-500 mt-1">正在空闲池优先匹配低频号码...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">目标坐席/部门</label>
                      <select 
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      >
                        <option value="">请选择目标坐席</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.province})</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">目标线路组</label>
                      <select 
                        value={selectedLineGroup}
                        onChange={(e) => setSelectedLineGroup(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      >
                        <option value="">请选择线路组</option>
                        {lineGroups.map(lg => <option key={lg.id} value={lg.id}>{lg.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">需求号码数量</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={numberCount}
                          onChange={(e) => setNumberCount(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                          min="1"
                          max="50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">个号码</div>
                      </div>
                      <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-1">
                        <Info size={10} />
                        单次分配上限为 50 个号码
                      </p>
                    </div>

                    <button 
                      onClick={handleSmartSelection}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Zap size={18} className="group-hover:scale-110 transition-transform" />
                      智能盲捞并分配
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 relative">
                  <CheckCircle2 size={40} />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 border-2 border-emerald-500 rounded-full"
                  />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2">资源调度成功</h4>
                <p className="text-sm text-gray-500 max-w-[240px] leading-relaxed">
                  已成功从 <span className="text-indigo-600 font-bold">空闲号码池</span> 中抽调 <span className="text-indigo-600 font-bold">{numberCount}</span> 个高权重号码，并完成与目标坐席的动态绑定。
                </p>
                <button 
                  onClick={resetAndClose}
                  className="mt-8 px-8 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all"
                >
                  完成
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {step === 1 && !isLoading && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-gray-400 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed">
                <span className="font-bold">策略说明：</span>系统将自动过滤处于“冷却中”或“已封禁”状态的号码，优先选择历史接通率高且今日外呼频次低于 50 次的优质资源。
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignNumbersModal;
