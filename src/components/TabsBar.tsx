import React from 'react';
import { X } from 'lucide-react';
import { TabItem } from '../types';

interface TabsBarProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ tabs, activeTabId, onTabChange, onTabClose }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 flex items-end gap-1 overflow-x-auto scrollbar-hide shrink-0 h-10">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            group relative h-8 px-4 flex items-center gap-2 cursor-pointer text-sm transition-all duration-200 rounded-t-md border-x border-t
            ${activeTabId === tab.id 
              ? 'bg-ant-blue text-white border-ant-blue z-10' 
              : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
            }
          `}
        >
          {activeTabId === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
          <span className="whitespace-nowrap">{tab.label}</span>
          
          {tab.closable !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className={`
                p-0.5 rounded-full transition-colors
                ${activeTabId === tab.id ? 'hover:bg-white/20' : 'hover:bg-gray-200'}
              `}
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabsBar;
