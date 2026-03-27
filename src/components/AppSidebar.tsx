import React, { useState } from 'react';
import { 
  LayoutDashboard, PhoneCall, MessageSquare, BarChart3, Users, 
  ListTodo, FileText, UserCheck, Database, Monitor, Wrench, 
  ChevronRight, ChevronDown, Figma, Check 
} from 'lucide-react';
import { elementToSVG } from 'dom-to-svg';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string, label: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, onTabChange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['numbers_mgmt']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const menuGroups = [
    { id: 'home', label: '首页', icon: LayoutDashboard },
    { id: 'tasks', label: '任务管理', icon: ListTodo },
    { 
      id: 'numbers_mgmt', 
      label: '话术管理 (管理端)', 
      icon: MessageSquare,
      children: [
        { id: 'monitor', label: '监控看板', icon: BarChart3 },
        { id: 'scripts', label: '外呼话术', icon: FileText },
        { id: 'line_groups', label: '线路组详情', icon: Monitor },
        { id: 'numbers', label: '号码管理', icon: PhoneCall },
        { id: 'agents', label: '坐席管理', icon: Users },
        { id: 'call_records', label: '通话记录', icon: ListTodo },
        { id: 'tts', label: 'TTS管理', icon: FileText },
        { id: 'callback', label: '回访管理', icon: UserCheck },
        { id: 'analytics', label: '统计报表', icon: BarChart3 },
      ]
    },
    { 
      id: 'demand_mgmt', 
      label: '需求管理', 
      icon: ListTodo,
      children: [
        { id: 'demand_list', label: '需求列表' },
        { id: 'sms_remind', label: '短信提醒' },
      ]
    },
    { id: 'finance', label: '财务管理', icon: Database },
    { id: 'resource', label: '资源管理', icon: Database },
    { id: 'production', label: '生产管理', icon: Monitor },
    { id: 'model', label: '模型管理', icon: Database },
    { id: 'system_monitor', label: '监控管理', icon: Monitor },
    { id: 'tools', label: '系统工具', icon: Wrench },
  ];

  // 核心资产保护：SVG 导出黑魔法逻辑 (升级版：支持全架构复制与精准定位)
  // 已移至 Header.tsx 以便全局调用

  return (
    <aside className="w-64 bg-ant-sidebar text-gray-400 flex flex-col border-r border-white/5 select-none shrink-0">
      <div className="p-4 h-16 flex items-center gap-3 border-b border-white/5">
        <div className="w-8 h-8 bg-ant-blue rounded flex items-center justify-center">
          <PhoneCall size={18} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">AI智能外呼</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-1">
            <button
              onClick={() => group.children ? toggleMenu(group.id) : onTabChange(group.id, group.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                activeTab === group.id 
                  ? 'bg-ant-blue text-white' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <group.icon size={16} />
              <span className="text-sm flex-1 text-left">{group.label}</span>
              {group.children && (
                expandedMenus.includes(group.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </button>
            
            {group.children && expandedMenus.includes(group.id) && (
              <div className="bg-black/20">
                {group.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => onTabChange(child.id, child.label)}
                    className={`w-full flex items-center gap-3 pl-12 pr-4 py-3 transition-all duration-200 ${
                      activeTab === child.id 
                        ? 'bg-ant-blue text-white' 
                        : 'hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
