/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppSidebar from './components/AppSidebar';
import Header from './components/Header';
import TabsBar from './components/TabsBar';
import StatsCards from './components/StatsCards';
import NumberTable from './components/NumberTable';
import AgentManagement from './components/AgentManagement';
import LineGroupDetails from './components/LineGroupDetails';
import { TabItem } from './types';

// 占位组件，后续将替换为真实的模块组件
const PlaceholderContent = ({ title }: { title: string }) => (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow-ant p-8 border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500">模块正在开发中，请期待极致质感的呈现...</p>
    </div>
  </div>
);

export default function App() {
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    { id: 'home', label: '首页', closable: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('home');

  const handleTabChange = useCallback((id: string, label?: string) => {
    setActiveTabId(id);
    if (label && !openTabs.find(tab => tab.id === id)) {
      setOpenTabs(prev => [...prev, { id, label }]);
    }
  }, [openTabs]);

  const handleCloseTab = useCallback((id: string) => {
    if (openTabs.length <= 1) return;
    
    const newTabs = openTabs.filter(tab => tab.id !== id);
    setOpenTabs(newTabs);
    
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  }, [openTabs, activeTabId]);

  const activeTabLabel = openTabs.find(t => t.id === activeTabId)?.label || '首页';

  return (
    <div id="root" className="flex h-screen w-full overflow-hidden bg-ant-bg font-sans">
      {/* 侧边栏 */}
      <AppSidebar 
        activeTab={activeTabId} 
        onTabChange={handleTabChange} 
      />

      {/* 主体区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTabLabel={activeTabLabel} />
        
        <TabsBar 
          tabs={openTabs} 
          activeTabId={activeTabId} 
          onTabChange={(id) => setActiveTabId(id)}
          onTabClose={handleCloseTab}
        />

        <main className="flex-1 overflow-auto relative bg-[#f0f2f5]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {/* 路由分发逻辑 */}
              {activeTabId === 'numbers' ? (
                <div className="flex flex-col min-h-full">
                  <StatsCards />
                  <NumberTable />
                </div>
              ) : activeTabId === 'agents' ? (
                <AgentManagement />
              ) : activeTabId === 'line_groups' ? (
                <LineGroupDetails />
              ) : activeTabId === 'home' ? (
                <div className="p-6">
                  <div className="bg-white rounded-xl shadow-ant p-12 border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-ant-blue mb-6">
                      <LayoutDashboard size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">欢迎使用 AI智能外呼系统</h1>
                    <p className="text-gray-500 max-w-md leading-relaxed">
                      高效管理您的号码资产与坐席资源，通过智能话术提升外呼转化率。
                      请从左侧菜单开始您的操作。
                    </p>
                  </div>
                </div>
              ) : (
                <PlaceholderContent title={activeTabLabel} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

import { LayoutDashboard } from 'lucide-react';
