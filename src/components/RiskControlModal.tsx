import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

interface RiskControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  targetNumber: string;
  actionType: 'disable' | 'harassment';
}

const REASONS = [
  '运营商封禁',
  '客户投诉',
  '超短通话过高',
  '其他'
];

export const RiskControlModal: React.FC<RiskControlModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  targetNumber,
  actionType
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!selectedReason) return;
    
    setIsExecuting(true);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsExecuting(false);
    setIsSuccess(true);
    
    // 成功提示后关闭
    setTimeout(() => {
      onConfirm(selectedReason);
      setIsSuccess(false);
      setSelectedReason('');
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className={`p-6 flex items-center justify-between ${actionType === 'harassment' ? 'bg-rose-50' : 'bg-amber-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  actionType === 'harassment' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-xs text-gray-500 font-mono">号码：{targetNumber}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {!isSuccess ? (
                <>
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      此操作属于<span className="font-bold text-rose-600">高危风控操作</span>。执行后该号码将立即停止所有外呼任务，并进入相应的状态池。请务必确认操作原因。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">选择操作原因</label>
                    <div className="grid grid-cols-2 gap-2">
                      {REASONS.map(reason => (
                        <button
                          key={reason}
                          onClick={() => setSelectedReason(reason)}
                          className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                            selectedReason === reason
                              ? 'bg-ant-blue border-ant-blue text-white shadow-md shadow-blue-100'
                              : 'bg-white border-gray-200 text-gray-600 hover:border-ant-blue/30 hover:bg-blue-50/30'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">操作成功</h4>
                  <p className="text-sm text-gray-500 mt-1">风控指令已下达，号码状态已更新</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  取消
                </button>
                <button
                  disabled={!selectedReason || isExecuting}
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 ${
                    !selectedReason || isExecuting
                      ? 'bg-gray-300 cursor-not-allowed'
                      : actionType === 'harassment' ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100' : 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-100'
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>执行中...</span>
                    </>
                  ) : (
                    <span>确认执行</span>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
