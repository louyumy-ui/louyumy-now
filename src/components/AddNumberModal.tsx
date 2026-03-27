import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Info, CheckCircle2, Phone, MapPin, Globe, FileSpreadsheet, Edit3 } from 'lucide-react';
import { Carrier, PhoneNumber } from '../types';

interface AddNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (numbers: any[]) => void;
  editNumber?: PhoneNumber | null;
}

const AddNumberModal: React.FC<AddNumberModalProps> = ({ isOpen, onClose, onAdd, editNumber }) => {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');
  const [carrier, setCarrier] = useState<Carrier>('中国移动');
  const [province, setProvince] = useState('广东');
  const [city, setCity] = useState('广州');
  const [areaCode, setAreaCode] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (editNumber) {
      setCarrier(editNumber.carrier);
      setProvince(editNumber.province);
      setCity(editNumber.city);
      setAreaCode(editNumber.areaCode || '');
      setLandlineNumber(editNumber.landlineNumber || '');
      setRemark(editNumber.remark || '');
      setActiveTab('manual');
      setInputMode('single');
    } else {
      setCarrier('中国移动');
      setProvince('广东');
      setCity('广州');
      setAreaCode('');
      setLandlineNumber('');
      setRemark('');
      setActiveTab('manual');
      setInputMode('single');
    }
    setStep(1);
  }, [editNumber, isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    let numbers: any[] = [];
    
    if (activeTab === 'manual') {
      if (inputMode === 'single') {
        if (!areaCode || !landlineNumber) return;
        numbers = [{
          id: editNumber?.id || Math.random().toString(36).substr(2, 9),
          areaCode,
          landlineNumber,
          number: `${areaCode}-${landlineNumber}`,
          carrier,
          province,
          city,
          remark,
          isEnabled: editNumber ? editNumber.isEnabled : true,
          isDisplay: editNumber ? editNumber.isDisplay : true,
          status: editNumber ? editNumber.status : 'active',
          usageCount: editNumber ? editNumber.usageCount : 0,
          successRate: editNumber ? editNumber.successRate : 0,
          isHarassed: editNumber ? editNumber.isHarassed : false,
          lastUsed: editNumber ? editNumber.lastUsed : '-',
          assignedAgentIds: editNumber ? editNumber.assignedAgentIds : [],
          selected: false
        }];
      } else {
        const lines = batchInput.split('\n').map(n => n.trim()).filter(n => n);
        numbers = lines.map(line => {
          const [ac, ln] = line.includes('-') ? line.split('-') : ['', line];
          return {
            id: Math.random().toString(36).substr(2, 9),
            areaCode: ac,
            landlineNumber: ln,
            number: line.includes('-') ? line : `${ac}-${ln}`,
            carrier,
            province,
            city,
            remark,
            isEnabled: true,
            isDisplay: true,
            status: 'active',
            usageCount: 0,
            successRate: 0,
            isHarassed: false,
            lastUsed: '-',
            assignedAgentIds: [],
            selected: false
          };
        });
      }
    } else {
      // 自动导入模拟逻辑
      alert('已触发自动导入流程，支持 .csv, .xlsx 格式');
      return;
    }
    
    if (numbers.length === 0) return;
    
    onAdd(numbers);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ant-blue/10 flex items-center justify-center text-ant-blue">
              {editNumber ? <Edit3 size={18} /> : <Plus size={18} />}
            </div>
            <h3 className="font-bold text-gray-900">{editNumber ? '编辑号码' : '新增号码'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        {!editNumber && step === 1 && (
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'manual' ? 'text-ant-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              手动填写
              {activeTab === 'manual' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ant-blue" />}
            </button>
            <button 
              onClick={() => setActiveTab('auto')}
              className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'auto' ? 'text-ant-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              自动导入
              {activeTab === 'auto' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-ant-blue" />}
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full"
              >
                {activeTab === 'manual' ? (
                  <div className="grid grid-cols-2 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">运营商</label>
                        <div className="flex gap-2">
                          {['中国移动', '中国联通', '中国电信'].map((c) => (
                            <button
                              key={c}
                              onClick={() => setCarrier(c as Carrier)}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${carrier === c ? 'border-ant-blue bg-blue-50 text-ant-blue' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">归属省份</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select 
                              value={province}
                              onChange={(e) => setProvince(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none appearance-none"
                            >
                              <option>广东</option>
                              <option>北京</option>
                              <option>上海</option>
                              <option>江苏</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">归属地市</label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <select 
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none appearance-none"
                            >
                              <option>广州</option>
                              <option>深圳</option>
                              <option>东莞</option>
                              <option>佛山</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <Info className="text-amber-500 shrink-0" size={18} />
                        <p className="text-[11px] text-amber-700 leading-relaxed">
                          请确保导入的号码已在运营商侧完成实名报备，否则可能导致呼叫失败或被快速标记。
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Number Input */}
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">号码录入</label>
                        {!editNumber && (
                          <div className="flex bg-gray-100 p-0.5 rounded-md">
                            <button 
                              onClick={() => setInputMode('single')}
                              className={`px-2 py-1 text-[10px] font-bold rounded ${inputMode === 'single' ? 'bg-white shadow-sm text-ant-blue' : 'text-gray-500'}`}
                            >
                              单号
                            </button>
                            <button 
                              onClick={() => setInputMode('batch')}
                              className={`px-2 py-1 text-[10px] font-bold rounded ${inputMode === 'batch' ? 'bg-white shadow-sm text-ant-blue' : 'text-gray-500'}`}
                            >
                              批量
                            </button>
                          </div>
                        )}
                      </div>

                      {inputMode === 'single' ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <input 
                                type="text" 
                                value={areaCode}
                                onChange={(e) => setAreaCode(e.target.value)}
                                placeholder="区号"
                                className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none font-mono"
                              />
                            </div>
                            <div className="col-span-2">
                              <input 
                                type="text" 
                                value={landlineNumber}
                                onChange={(e) => setLandlineNumber(e.target.value)}
                                placeholder="座机号码"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea 
                            value={batchInput}
                            onChange={(e) => setBatchInput(e.target.value)}
                            placeholder="请输入号码，每行一个（支持 020-12345678 格式）..."
                            className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none resize-none font-mono"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">备注信息</label>
                        <input 
                          type="text" 
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="选填，如：双11活动专号"
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-ant-blue/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="w-full max-w-lg border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-ant-blue/30 transition-all cursor-pointer group">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-ant-blue transition-colors mb-6">
                        <Plus size={32} />
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-2">点击或拖拽文件到此处导入</p>
                      <p className="text-xs text-gray-400 mb-8">支持 .csv, .xlsx 格式，单次最多1000条</p>
                      <button className="flex items-center gap-1.5 text-ant-blue text-xs font-bold hover:underline">
                        下载模板
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{editNumber ? '号码更新成功' : '号码导入成功'}</h4>
                <p className="text-sm text-gray-500 max-w-sm">
                  {editNumber ? '号码信息已成功更新并同步。' : '已成功导入并激活号码资源。您现在可以在号码管理列表中查看并分配这些号码。'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">取消</button>
          <button 
            onClick={() => step === 1 ? handleConfirm() : onClose()}
            className="px-8 py-2 bg-ant-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
          >
            {step === 1 ? (editNumber ? '确认更新' : '确认导入') : '完成'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNumberModal;
