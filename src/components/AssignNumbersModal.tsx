import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, MapPin, Zap, Info, CheckCircle2 } from 'lucide-react';

interface AssignNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
}

const AssignNumbersModal: React.FC<AssignNumbersModalProps> = ({ isOpen, onClose, selectedCount }) => {
  const [step, setStep] = useState(1);
  const [priorityLocal, setPriorityLocal] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ant-blue/10 flex items-center justify-center text-ant-blue">
              <UserCheck size={18} />
            </div>
            <h3 className="font-bold text-gray-900">批量分配号码 ({selectedCount}个)</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">选择目标坐席/部门</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['销售一部', '销售二部', '张三', '李四'].map((item) => (
                      <button key={item} className="px-4 py-3 border border-gray-200 rounded-xl text-left hover:border-ant-blue hover:bg-blue-50/50 transition-all group">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-ant-blue">{item}</div>
                        <div className="text-[10px] text-gray-400">当前负载: 65%</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700">分配策略</label>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setPriorityLocal(!priorityLocal)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${priorityLocal ? 'border-ant-blue bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${priorityLocal ? 'bg-ant-blue text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <MapPin size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">归属地优先</div>
                          <div className="text-[10px] text-gray-500">优先分配与目标客户归属地一致的号码</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${priorityLocal ? 'border-ant-blue bg-ant-blue' : 'border-gray-300'}`}>
                        {priorityLocal && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-xl flex items-center gap-3 opacity-50 cursor-not-allowed">
                      <div className="p-2 rounded-lg bg-gray-100 text-gray-400">
                        <Zap size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">平均分配 (均衡负载)</div>
                        <div className="text-[10px] text-gray-500">按坐席当前并发能力平均分配号码</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">分配成功</h4>
                <p className="text-sm text-gray-500 max-w-xs">
                  已成功将 {selectedCount} 个号码分配至目标坐席。系统将自动根据归属地优先规则进行呼叫调度。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-600">
            <Info size={14} />
            <span className="text-[10px] font-bold">分配后将立即生效</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
            <button 
              onClick={() => step === 1 ? setStep(2) : onClose()}
              className="px-6 py-2 bg-ant-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
            >
              {step === 1 ? '确认分配' : '完成'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignNumbersModal;
