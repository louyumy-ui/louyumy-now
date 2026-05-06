import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { Operator } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface Props {
  operators: Operator[];
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>;
}

const OperatorModule: React.FC<Props> = ({ operators, setOperators }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    remark: ''
  });

  const filteredOperators = operators.filter(op => 
    op.name.includes(searchQuery) || op.remark.includes(searchQuery)
  );

  const handleOpenModal = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormData({ name: operator.name, remark: operator.remark });
    } else {
      setEditingOperator(null);
      setFormData({ name: '', remark: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error('请输入运营商名称');
      return;
    }

    if (editingOperator) {
      setOperators(prev => prev.map(op => 
        op.id === editingOperator.id ? { ...op, ...formData } : op
      ));
      toast.success('更新成功');
    } else {
      const newOp: Operator = {
        id: Date.now().toString(),
        ...formData
      };
      setOperators(prev => [...prev, newOp]);
      toast.success('添加成功');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该运营商吗？')) {
      setOperators(prev => prev.filter(op => op.id !== id));
      toast.success('删除成功');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div 
          onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-700">运营商筛选</span>
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
              <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#F3F4F6]">
                <button 
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0066FF] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  新增运营商
                </button>

                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="搜索运营商名称 / 备注" 
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

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
              <th className="px-6 py-4 font-semibold text-[#1A1A1A]">运营商名称</th>
              <th className="px-6 py-4 font-semibold text-[#1A1A1A]">备注</th>
              <th className="px-6 py-4 font-semibold text-[#1A1A1A] text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {filteredOperators.map((op) => (
              <tr key={op.id} className="hover:bg-[#F9FAFB] transition-colors h-14">
                <td className="px-6 py-4 font-medium text-[#1A1A1A]">{op.name}</td>
                <td className="px-6 py-4 text-gray-500">{op.remark || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => handleOpenModal(op)}
                      className="text-[#0066FF] hover:text-blue-800 font-medium"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => handleDelete(op.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOperators.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">暂无数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-base font-bold">{editingOperator ? '编辑运营商' : '新增运营商'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">运营商名称 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                  placeholder="如：中国移动"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">备注</label>
                <textarea 
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                  rows={3}
                  placeholder="运营商相关备注信息"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-[#0066FF] text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200"
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

export default OperatorModule;
