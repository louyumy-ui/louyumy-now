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
  AlertTriangle,
  BarChart3,
  Globe,
  Briefcase
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

// New Modules
import DashboardModule from './components/DashboardModule';
import ResourceModule from './components/ResourceModule';
import ConcurrencyModule from './components/ConcurrencyModule';
import EnterpriseModule from './components/EnterpriseModule';
import AgentModule from './components/AgentModule';
import ConfigModule from './components/ConfigModule';

import { 
  INITIAL_LINE_GROUPS, 
  INITIAL_NUMBERS, 
  INITIAL_AGENTS, 
  INITIAL_CONFIG,
  INITIAL_OPERATORS,
  INITIAL_SBC_NODES,
  INITIAL_ENTERPRISES
} from './constants';
import { 
  LineGroup, 
  PhoneNumber, 
  Agent, 
  GlobalConfig, 
  Operator, 
  SBCNode, 
  Enterprise, 
  AIResourceStats 
} from './types';
import { cn } from './lib/utils';
import { SvgCopyButton } from './components/SvgCopyButton';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Global State
  const [lineGroups, setLineGroups] = useState<LineGroup[]>(INITIAL_LINE_GROUPS);
  const [numbers, setNumbers] = useState<PhoneNumber[]>(INITIAL_NUMBERS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [config, setConfig] = useState<GlobalConfig>(INITIAL_CONFIG);
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [sbcNodes, setSbcNodes] = useState<SBCNode[]>(INITIAL_SBC_NODES);
  const [enterprises, setEnterprises] = useState<Enterprise[]>(INITIAL_ENTERPRISES);
  
  // AI Pools
  const [aiPool, setAiPool] = useState<AIResourceStats>({
    globalPurchase: 1000,
    fixedGuarantee: 200,
    dynamicQuota: 1500,
    realtimeOccupancy: 450,
    mandarin: {
       globalPurchase: 600,
       fixedGuarantee: 100,
       dynamicQuota: 800,
       realtimeOccupancy: 250
    },
    cantonese: {
       globalPurchase: 400,
       fixedGuarantee: 100,
       dynamicQuota: 700,
       realtimeOccupancy: 200
    }
  });

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
    { id: 'dashboard', label: '全局总览看板', icon: BarChart3 },
    { id: 'resources', label: '资源管理', icon: Globe },
    { id: 'concurrency', label: '并发管理', icon: Zap },
    { id: 'enterprises', label: '企业管理', icon: Briefcase },
    { id: 'agents', label: '坐席/话术管理', icon: Users },
    { id: 'config', label: '系统规则配置', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule 
          sbcNodes={sbcNodes} 
          numbers={numbers} 
          aiPool={aiPool}
          enterprises={enterprises}
        />;
      case 'resources':
        return <ResourceModule 
          operators={operators} 
          setOperators={setOperators}
          lineGroups={lineGroups}
          setLineGroups={setLineGroups}
          numbers={numbers}
          setNumbers={setNumbers}
          triggerCooling={triggerCooling}
          config={config}
        />;
      case 'concurrency':
        return <ConcurrencyModule 
          sbcNodes={sbcNodes} 
          setSbcNodes={setSbcNodes}
          aiPool={aiPool}
          setAiPool={setAiPool}
        />;
      case 'enterprises':
        return <EnterpriseModule 
          enterprises={enterprises}
          setEnterprises={setEnterprises}
        />;
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
      default:
        return <DashboardModule sbcNodes={sbcNodes} numbers={numbers} aiPool={aiPool} enterprises={enterprises} />;
    }
  };

  return (
    <div id="figma-export-container" className="w-[1920px] h-[1080px] bg-[#F4F7FE] flex font-sans text-[#1A1A1A] mx-auto overflow-hidden shadow-2xl">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 100 }}
        className="bg-white border-r border-[#E5E7EB] flex flex-col h-full z-20 shrink-0 shadow-lg"
      >
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3 mb-10 overflow-hidden">
            <div className="w-10 h-10 bg-[#0066FF] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">AI CALL</h1>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-[#6B7280] transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group",
                 activeTab === tab.id 
                   ? "bg-[#1A1A1A] text-white shadow-xl shadow-black/10 font-bold" 
                   : "text-[#A3AED0] hover:bg-gray-50 hover:text-gray-900"
               )}
             >
               <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-[#A3AED0] group-hover:text-gray-900")} />
               {isSidebarOpen && <span className="text-sm tracking-tight">{tab.label}</span>}
               {activeTab === tab.id && (
                 <motion.div layoutId="active-indicator" className="ml-auto w-1.5 h-6 bg-[#0066FF] rounded-full" />
               )}
             </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-12 z-10 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative p-3 bg-white rounded-2xl border shadow-sm cursor-pointer hover:shadow-md transition-all">
              <Bell className="w-5 h-5 text-[#A3AED0]" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#EE5D50] rounded-full border-2 border-white"></span>
            </div>
          </div>
        </header>

        <div className="px-12 pb-12 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute bottom-12 right-12 z-50">
           <SvgCopyButton 
            label="Capture Figma Frame" 
            className="!px-6 !py-4 !text-xs !font-black" 
           />
        </div>
      </main>

      <AnimatePresence>
        {coolingAlert && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-3xl overflow-hidden border border-white/50"
            >
              <div className="p-12 text-center space-y-8">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
                  <AlertTriangle className="w-12 h-12" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black tracking-tight text-gray-900">冷却预警触发</h3>
                  <p className="text-gray-500 text-sm">
                    号码 <span className="font-bold text-[#1A1A1A]">[{coolingAlert.number.number}]</span> 触发拦截规则
                  </p>
                </div>

                <div className="bg-red-50/50 p-6 rounded-3xl border border-red-100/50">
                  <p className="text-sm font-bold text-red-900 leading-relaxed">
                    🚨 {coolingAlert.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setNumbers(prev => prev.map(n => n.id === coolingAlert.number.id ? { ...n, status: 'disabled', remark: `[PRD升级强制停用] ${coolingAlert.reason}` } : n));
                      setCoolingAlert(null);
                    }}
                    className="py-5 bg-[#EE5D50] text-white rounded-3xl font-black text-sm"
                  >
                    强制停用
                  </button>
                  <button 
                    onClick={() => setCoolingAlert(null)}
                    className="py-5 bg-gray-100 text-gray-900 rounded-3xl font-black text-sm"
                  >
                    继续冷却
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
