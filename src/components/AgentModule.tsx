import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface LineGroup {
  id: string;
  name: string;
  city: string;
  operator: string;
  isLocked: boolean;
  boundAgentId?: string;
}

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle';
  boundLineGroupId?: string;
}

const INITIAL_LINE_GROUPS: LineGroup[] = [
  { id: 'LG-001', name: '杭州移动-核心组', city: '杭州', operator: '中国移动', isLocked: false },
  { id: 'LG-002', name: '北京联通-研发组', city: '北京', operator: '中国联通', isLocked: false },
  { id: 'LG-003', name: '上海电信-外呼组', city: '上海', operator: '中国电信', isLocked: false },
  { id: 'LG-004', name: '广东移动-测试组', city: '广州', operator: '中国移动', isLocked: false },
];

const INITIAL_AGENTS: Agent[] = [
  { id: 'AGENT-01', name: '杭州-售前客服一组', status: 'active' },
  { id: 'AGENT-02', name: '北京-技术支持二组', status: 'idle' },
  { id: 'AGENT-03', name: '上海-售后维修专席', status: 'idle' },
  { id: 'AGENT-04', name: '广州-投诉处理三组', status: 'active' },
];

const AgentModule: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [lineGroups, setLineGroups] = useState<LineGroup[]>(INITIAL_LINE_GROUPS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const handleBind = (lineGroupId: string) => {
    if (!selectedAgentId) return;

    setAgents(prev => prev.map(a => 
      a.id === selectedAgentId ? { ...a, boundLineGroupId: lineGroupId } : a
    ));

    setLineGroups(prev => prev.map(lg => {
      // If this group was already bound to this agent, we're swapping, so release it?
      // Actually, standard binding: if I pick LG-01 for Agent-01, LG-01 becomes locked to Agent-01.
      // If Agent-01 already had LG-02, LG-02 becomes unlocked.
      
      const isCurrentlyBoundToThisAgent = lg.boundAgentId === selectedAgentId;
      const isTheNewGroup = lg.id === lineGroupId;

      if (isTheNewGroup) return { ...lg, isLocked: true, boundAgentId: selectedAgentId };
      if (isCurrentlyBoundToThisAgent) return { ...lg, isLocked: false, boundAgentId: undefined };
      return lg;
    }));
  };

  const handleUnbind = () => {
    if (!selectedAgentId) return;
    setAgents(prev => prev.map(a => a.id === selectedAgentId ? { ...a, boundLineGroupId: undefined } : a));
    setLineGroups(prev => prev.map(lg => lg.boundAgentId === selectedAgentId ? { ...lg, isLocked: false, boundAgentId: undefined } : lg));
  };

  return (
    <div className="flex gap-8 h-full relative overflow-hidden">
      {/* 坐席矩阵网格 */}
      <div className={cn("flex-1 grid grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-300", selectedAgentId ? "pr-[420px]" : "")}>
        {agents.map((agent) => {
          const boundLG = lineGroups.find(lg => lg.id === agent.boundLineGroupId);
          return (
            <div 
              key={agent.id}
              onClick={() => setSelectedAgentId(selectedAgentId === agent.id ? null : agent.id)}
              className={cn(
                "p-10 rounded-[40px] border-[1.33px] flex flex-col justify-between cursor-pointer transition-all h-[320px]",
                selectedAgentId === agent.id ? "bg-black text-white border-black shadow-2xl scale-[1.02]" : "bg-white text-black border-gray-100 hover:border-black"
              )}
            >
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{agent.id}</p>
                    <h4 className="text-[22px] font-[900] tracking-tight leading-none uppercase">{agent.name}</h4>
                 </div>
                 <div className={cn(
                   "px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic",
                   agent.status === 'active' ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                 )}>
                    {agent.status}
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="pt-8 border-t border-current border-opacity-10">
                    <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-3">当前线路绑定</p>
                    {boundLG ? (
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xs">LG</div>
                         <div>
                            <p className="text-sm font-[900] uppercase tracking-tight">{boundLG.name}</p>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{boundLG.operator} / {boundLG.city}</p>
                         </div>
                      </div>
                    ) : (
                      <p className="text-sm font-[900] opacity-20 italic">未绑定外呼线路</p>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
        
        <div className="h-[320px] rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-4 opacity-30 hover:opacity-100 transition-all cursor-pointer">
           <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-xl font-black">+</div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">INIT NEW AGENT SLOT</p>
        </div>
      </div>

      {/* 右侧抽屉抽屉 (Binding Drawer) */}
      {selectedAgentId && (
        <div className="fixed right-12 top-[128px] bottom-12 w-[380px] bg-white rounded-[40px] border-[1.33px] border-gray-100 shadow-3xl flex flex-col overflow-hidden z-20">
           <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
              <div>
                 <h5 className="text-[18px] font-[900] text-black tracking-tight leading-none uppercase">资源绑定中心</h5>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-1">AGENT: {selectedAgentId}</p>
              </div>
              <button onClick={() => setSelectedAgentId(null)} className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center font-black text-gray-400 hover:text-black">×</button>
           </div>

           <div className="flex-1 overflow-auto p-8 space-y-6">
              <div className="space-y-3">
                 <p className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest ml-2">可用线路组池 (1:1 独占)</p>
                 <div className="grid grid-cols-1 gap-4">
                    {lineGroups.map(lg => {
                      const isDisabled = lg.isLocked && lg.boundAgentId !== selectedAgentId;
                      const isSelected = lg.boundAgentId === selectedAgentId;
                      
                      return (
                        <div 
                          key={lg.id}
                          onClick={() => !isDisabled && handleBind(lg.id)}
                          className={cn(
                            "p-6 rounded-[32px] border-[1.33px] transition-all cursor-pointer relative overflow-hidden group",
                            isSelected ? "bg-black text-white border-black shadow-xl" : 
                            isDisabled ? "bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed opacity-40" : 
                            "bg-white text-black border-gray-100 hover:border-black"
                          )}
                        >
                           <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-black uppercase tracking-widest">{lg.operator}</span>
                              {isSelected && <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded italic">CURRENT</span>}
                              {isDisabled && <span className="text-[8px] font-black bg-gray-200 text-gray-400 px-2 py-0.5 rounded italic">LOCKED</span>}
                           </div>
                           <h6 className="text-sm font-[900] uppercase tracking-tight">{lg.name}</h6>
                           <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">{lg.city} 接入点</p>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>

           <div className="p-10 border-t border-gray-50 bg-gray-50/30 space-y-4">
              <button 
                onClick={handleUnbind}
                className="w-full py-5 bg-white border border-gray-200 text-black rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-red-50 hover:text-red-600 hover:border-red-100"
              >
                 释放当前资源绑定
              </button>
              <button 
                onClick={() => setSelectedAgentId(null)}
                className="w-full py-5 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20"
              >
                 确认并保存配置
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AgentModule;
