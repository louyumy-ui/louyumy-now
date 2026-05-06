import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Users, 
  Settings, 
  Database, 
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Bell,
  User,
  Building2,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import LineGroupModule from './components/LineGroupModule';
import CallingNumberModule from './components/CallingNumberModule';
import AgentModule from './components/AgentModule';
import ConfigModule from './components/ConfigModule';
import OperatorModule from './components/OperatorModule';
import AIResourceModule from './components/AIResourceModule';
import { 
  INITIAL_LINE_GROUPS, 
  INITIAL_NUMBERS, 
  INITIAL_AGENTS, 
  INITIAL_CONFIG,
  INITIAL_OPERATORS
} from './constants';
import { LineGroup, PhoneNumber, Agent, GlobalConfig, Operator } from './types';
import { cn } from './lib/utils';

import { SvgCopyButton } from './components/SvgCopyButton';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lines' | 'numbers' | 'agents' | 'config' | 'operators' | 'ai-resources'>('lines');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Global State
  const [lineGroups, setLineGroups] = useState<LineGroup[]>(INITIAL_LINE_GROUPS);
  const [numbers, setNumbers] = useState<PhoneNumber[]>(INITIAL_NUMBERS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [config, setConfig] = useState<GlobalConfig>(INITIAL_CONFIG);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);

  const [coolingAlert, setCoolingAlert] = useState<{ number: PhoneNumber; reason: string } | null>(null);

  const triggerCooling = (id: string, reason: string) => {
    const number = numbers.find(n => n.id === id);
    if (!number) return;

    setNumbers(prev => prev.map(n => 
      n.id === id ? { 
        ...n, 
        status: 'cooling', 
        coolingReason: reason,
        coolingStartTime: new Date().toISOString() 
      } : n
    ));
    
    setCoolingAlert({ number: { ...number, status: 'cooling', coolingReason: reason }, reason });
    toast.warning(`号码 ${number.number} 已触发冷却保护`);
  };

  const tabs = [
    { id: 'operators', label: '运营商管理', icon: Building2 },
    { id: 'lines', label: '线路组管理', icon: LayoutDashboard },
    { id: 'numbers', label: '主叫号码管理', icon: Database },
    { id: 'agents', label: '坐席管理', icon: Users },
    { id: 'ai-resources', label: 'AI并发资源', icon: Zap },
    { id: 'config', label: '规则配置', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lines':
        return <LineGroupModule lineGroups={lineGroups} setLineGroups={setLineGroups} operators={operators} />;
      case 'numbers':
        return <CallingNumberModule 
          numbers={numbers} 
          setNumbers={setNumbers} 
          lineGroups={lineGroups}
          config={config}
          operators={operators}
          triggerCooling={triggerCooling}
        />;
      case 'operators':
        return <OperatorModule operators={operators} setOperators={setOperators} />;
      case 'agents':
        return <AgentModule 
          agents={agents} 
          setAgents={setAgents} 
          numbers={numbers} 
          setNumbers={setNumbers}
          lineGroups={lineGroups}
          setLineGroups={setLineGroups}
        />;
      case 'config':
        return <ConfigModule config={config} setConfig={setConfig} />;
      case 'ai-resources':
        return <AIResourceModule />;
      default:
        return null;
    }
  };

  return (
    <div className="w-[2340px] h-[1272px] bg-[#F8F9FA] flex font-sans text-[#1A1A1A] mx-auto overflow-hidden shadow-2xl">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-[#E5E7EB] flex flex-col h-full z-20 shrink-0"
      >
        <div className="p-4 border-b border-[#E5E7EB] mb-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {tabs.map((tab) => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                 activeTab === tab.id 
                   ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20 font-bold' 
                   : 'text-[#6B7280] hover:bg-gray-100 font-medium'
               }`}
             >
               <span className={cn("text-sm", !isSidebarOpen && "mx-auto")}>
                 {isSidebarOpen ? tab.label : tab.label.charAt(0)}
               </span>
             </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-[#E5E7EB] flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-5 h-5 text-[#6B7280] cursor-pointer hover:text-[#1A1A1A]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="h-8 w-[1px] bg-[#E5E7EB]"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center group-hover:bg-[#E5E7EB] transition-colors">
                <User className="w-5 h-5 text-[#6B7280]" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#1A1A1A]">管理员</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Global Figma Export Button */}
      <div className="fixed bottom-6 right-6 z-[9999]" data-svg-copy-ignore="true">
        <SvgCopyButton label="捕获全屏 Figma 矢量" className="!px-4 !py-3 !text-sm shadow-xl bg-[#0066FF] border-none text-white hover:bg-blue-700" />
      </div>

      {/* Cooling Alert Modal */}
      <AnimatePresence>
        {coolingAlert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-orange-100 flex flex-col"
            >
              <div className="p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-orange-50 rounded-[24px] flex items-center justify-center mx-auto mb-2 text-orange-500 shadow-inner">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-gray-900">触发号码辅助检查</h3>
                  <p className="text-gray-500 text-sm px-8">
                    系统监测到号码 <span className="font-bold text-gray-800">[{coolingAlert.number.number}]</span> 表现异常，已自动实施 <span className="text-orange-600 font-bold">{config.coolingRule.coolingHours}小时</span> 冷却保护。
                  </p>
                </div>

                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-orange-800 font-bold">冷却触发原因</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md font-mono text-[10px]">AUTO_SUSPEND_EVENT</span>
                  </div>
                  <p className="text-sm font-bold text-orange-950 text-left leading-relaxed">
                    🚨 {coolingAlert.reason}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    请核实号码是否已被运营商标记为“高频/骚扰”。若被标记，建议归档处理；若误判，请在冷却结束后重新评估并上线。
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button 
                    onClick={() => {
                      setNumbers(prev => prev.map(n => n.id === coolingAlert.number.id ? { ...n, status: 'disabled', remark: `[冷却核实强制停用] ${coolingAlert.reason}` } : n));
                      setCoolingAlert(null);
                      toast.error('号码已强制停用');
                    }}
                    className="py-4 border-2 border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all text-sm"
                  >
                    确认风险：立即停用
                  </button>
                  <button 
                    onClick={() => setCoolingAlert(null)}
                    className="py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-black/10 text-sm"
                  >
                    暂不处理：维持冷却
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
