import React, { useState } from 'react';
import { Toaster } from 'sonner';

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
  const [activeTab, setActiveTab] = useState<string>('resources');
  
  const tabs = [
    { id: 'dashboard', label: '看板总览' },
    { id: 'enterprises', label: '企业管理' },
    { id: 'resources', label: '资源管理' },
    { id: 'agents', label: '坐席管理' },
    { id: 'concurrency', label: '并发管理' },
    { id: 'config', label: '系统规则配置' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardModule />;
      case 'resources': return <ResourceModule />;
      case 'concurrency': return <ConcurrencyModule />;
      case 'enterprises': return <EnterpriseModule />;
      case 'agents': return <AgentModule />;
      case 'config': return <ConfigModule />;
      default: return <ResourceModule />;
    }
  };

  return (
    <div id="figma-export-container" className="w-[1920px] h-[1080px] bg-white flex font-sans text-[#1A1A1A] mx-auto overflow-hidden relative border border-gray-100 shadow-2xl">
      <Toaster position="top-right" richColors />
      
      {/* 1. 左侧固定侧边栏：宽度280px，高度100vh */}
      <aside className="fixed left-0 top-0 w-[280px] h-full bg-white border-r border-gray-100 flex flex-col z-50">
        <div className="p-10 mb-6">
          <div className="flex items-center gap-4 mb-16 grayscale">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-black uppercase">AI CORE / OPS</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tabs.map((tab) => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "w-full flex items-center px-8 py-5 rounded-2xl transition-all relative group",
                 activeTab === tab.id 
                   ? "bg-black text-white shadow-xl" 
                   : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
               )}
             >
               <span className="text-[13px] font-[900] uppercase tracking-widest">{tab.label}</span>
               {activeTab === tab.id && (
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-full mr-2" />
               )}
             </button>
          ))}
        </nav>
      </aside>

      {/* 2. 顶部固定Header：宽度1640px，高度96px */}
      <header className="fixed left-[280px] top-0 w-[1640px] h-[96px] flex items-center justify-between px-12 z-40 bg-white border-b border-gray-50">
        <div className="flex flex-col">
          <h2 className="text-[32px] font-[900] text-black uppercase tracking-tighter leading-none">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
             NODE: ASIA-SOUTH-01
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase">SU</div>
          </div>
        </div>
      </header>

      {/* 3. 右侧内容区 */}
      <main className="ml-[280px] mt-[96px] w-[1640px] h-[calc(1080px-96px)] px-12 overflow-y-auto bg-white flex flex-col relative scrollbar-hide">
        <div className="py-12 flex-1">
          {renderContent()}
        </div>

        {/* Floating Export Button for Figma */}
        <div className="fixed bottom-12 right-12 z-50">
           <SvgCopyButton 
            label="1:1 EXPORT TO FIGMA" 
            className="!px-8 !py-5 !bg-black !text-white !rounded-2xl !text-[11px] !font-black !tracking-[0.2em] !shadow-2xl hover:!scale-105 transition-transform" 
           />
        </div>
      </main>
    </div>
  );
};

export default App;
