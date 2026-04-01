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
  User
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import LineGroupModule from './components/LineGroupModule';
import NumberPoolModule from './components/NumberPoolModule';
import AgentModule from './components/AgentModule';
import ConfigModule from './components/ConfigModule';
import { 
  INITIAL_LINE_GROUPS, 
  INITIAL_NUMBERS, 
  INITIAL_AGENTS, 
  INITIAL_CONFIG 
} from './constants';
import { LineGroup, PhoneNumber, Agent, GlobalConfig } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lines' | 'numbers' | 'agents' | 'config'>('lines');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Global State
  const [lineGroups, setLineGroups] = useState<LineGroup[]>(INITIAL_LINE_GROUPS);
  const [numbers, setNumbers] = useState<PhoneNumber[]>(INITIAL_NUMBERS);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [config, setConfig] = useState<GlobalConfig>(INITIAL_CONFIG);

  const tabs = [
    { id: 'lines', label: '线路组管理', icon: LayoutDashboard },
    { id: 'numbers', label: '全国号码池', icon: Database },
    { id: 'agents', label: '坐席调度台', icon: Users },
    { id: 'config', label: '规则配置', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lines':
        return <LineGroupModule lineGroups={lineGroups} setLineGroups={setLineGroups} />;
      case 'numbers':
        return <NumberPoolModule 
          numbers={numbers} 
          setNumbers={setNumbers} 
          lineGroups={lineGroups}
          config={config}
        />;
      case 'agents':
        return <AgentModule 
          agents={agents} 
          setAgents={setAgents} 
          numbers={numbers} 
          setNumbers={setNumbers}
          lineGroups={lineGroups}
        />;
      case 'config':
        return <ConfigModule config={config} setConfig={setConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#1A1A1A]">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-[#E5E7EB] flex flex-col sticky top-0 h-screen z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#0066FF]"
            >
              <Phone className="w-6 h-6" />
              <span>智能外呼系统</span>
            </motion.div>
          )}
          {!isSidebarOpen && <Phone className="w-6 h-6 text-[#0066FF] mx-auto" />}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/20' 
                  : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
              }`}
            >
              <tab.icon className={`w-5 h-5 flex-shrink-0`} />
              {isSidebarOpen && <span className="font-medium">{tab.label}</span>}
              {isSidebarOpen && activeTab === tab.id && (
                <motion.div layoutId="active-indicator" className="ml-auto">
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-bottom border-[#E5E7EB] flex items-center justify-between px-8 sticky top-0 z-10">
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
                <p className="text-xs text-[#6B7280]">louyumy@gmail.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8 overflow-y-auto">
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
    </div>
  );
};

export default App;
