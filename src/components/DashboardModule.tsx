const MOCK_NODES = [
  { id: '1', name: '联通-主网关节点01', status: 'online', physicalCurrent: 80, physicalMax: 500, bandwidthCurrent: 120, bandwidthMax: 1000 },
  { id: '2', name: '移动-核心接入节点02', status: 'online', physicalCurrent: 340, physicalMax: 600, bandwidthCurrent: 450, bandwidthMax: 1000 },
  { id: '3', name: '电信-冗余灾备节点03', status: 'online', physicalCurrent: 45, physicalMax: 400, bandwidthCurrent: 88, bandwidthMax: 800 },
];

const MOCK_AI_POOL = {
  globalPurchase: 2000,
  realtimeOccupancy: 1540,
  dynamicQuota: 460,
  mandarin: { globalPurchase: 1200, realtimeOccupancy: 940 },
  cantonese: { globalPurchase: 800, realtimeOccupancy: 600 }
};

const DashboardModule: React.FC = () => {
  const stats = [
    { label: '全国并发总占用', val: 465, total: 1500, unit: '路', color: 'bg-blue-600' },
    { label: 'AI 实时算力消耗', val: 1540, total: 2000, unit: '路', color: 'bg-black' },
    { label: '全量在网号码库', val: 6540, total: 8240, unit: '个', color: 'bg-blue-600' },
    { label: '活跃企业主体数', val: 38, total: 42, unit: '家', color: 'bg-black' },
  ];

  return (
    <div className="space-y-10">
      {/* 顶部核心指标看板 */}
      <div className="grid grid-cols-4 gap-8">
        {stats.map((card, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border-[1.33px] border-gray-100 shadow-sm flex flex-col justify-between h-[220px]">
            <div>
              <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-[0.2em] mb-4">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-[900] tracking-tighter text-black tabular-nums">{card.val.toLocaleString()}</span>
                <span className="text-[11px] font-[900] text-gray-300 uppercase tracking-widest">/ {card.total.toLocaleString()} {card.unit}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden mt-6">
               <div 
                className={cn("h-full rounded-full transition-all duration-700", card.color)}
                style={{ width: `${(card.val / card.total) * 100}%` }}
               />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* AI 算力水池分布 */}
        <div className="col-span-4 bg-white p-12 rounded-[48px] border-[1.33px] border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-xl font-[900] tracking-tight text-black uppercase">AI 算力水池矩阵</h3>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
            </div>

            <div className="space-y-8">
              {[
                { label: '普通话算力分布式池', stats: MOCK_AI_POOL.mandarin },
                { label: '粤语算力定制化分支', stats: MOCK_AI_POOL.cantonese },
              ].map((pool, i) => (
                <div key={i} className="p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                  <div className="flex items-center justify-between mb-8">
                     <p className="text-[11px] font-[900] text-black uppercase tracking-widest">{pool.label}</p>
                     <span className="text-[10px] font-black text-blue-600">ONLINE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">物理配额</p>
                        <p className="text-2xl font-[900] tabular-nums">{pool.stats.globalPurchase}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">实时消耗</p>
                        <p className="text-2xl font-[900] text-blue-600 tabular-nums">{pool.stats.realtimeOccupancy}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="mt-12 w-full py-5 bg-black text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] active:scale-95 transition-transform">
             进入模型资源调度
          </button>
        </div>

        {/* SBC 边缘网关状态 */}
        <div className="col-span-8 bg-black p-12 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
          <div className="relative z-10 space-y-12 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-[28px] font-[900] tracking-tight text-white uppercase leading-none">SBC 核心边缘节点集群</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">HIGH-PERFORMANCE INFRASTRUCTURE</p>
               </div>
               <div className="px-5 py-2 bg-white/5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/10">AVG LATENCY: 12.4ms</div>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
              {MOCK_NODES.map(node => (
                <div key={node.id} className="p-10 bg-white/5 rounded-[40px] border border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer group">
                   <div className="flex items-center justify-between mb-10">
                      <p className="text-lg font-[900] text-white uppercase tracking-tight">{node.name}</p>
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)]"></div>
                   </div>
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>当前物理负载</span>
                            <span className="text-white font-[900]">{node.physicalCurrent} / {node.physicalMax}</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                              style={{ width: `${(node.physicalCurrent/node.physicalMax)*100}%` }}
                            />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>专线带宽状态</span>
                            <span className="text-white font-[900]">{node.bandwidthCurrent} Mbps</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400 rounded-full transition-all duration-1000" 
                              style={{ width: `${(node.bandwidthCurrent/node.bandwidthMax)*100}%` }}
                            />
                         </div>
                      </div>
                   </div>
                </div>
              ))}
              
              <div className="p-10 border-[1.33px] border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center space-y-4 opacity-40 hover:opacity-100 cursor-pointer">
                 <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-black">+</div>
                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">INIT NEW SB-NODE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部监控预警提示 */}
      <div className="bg-red-600 px-12 py-8 rounded-[40px] flex items-center justify-between text-white shadow-xl shadow-red-600/10">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white text-red-600 rounded-2xl flex items-center justify-center text-2xl font-[900]">!</div>
            <div>
               <p className="text-[14px] font-[900] uppercase tracking-tight">异常监控警报 - SYSTEM CRITICAL ALERT</p>
               <p className="text-[10px] text-red-100 font-bold uppercase tracking-widest mt-1 opacity-60">DETECTED: 运营商(联通-03)物理链路不稳定，建议手动切流</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">立即介入处理</button>
      </div>
    </div>
  );
};

export default DashboardModule;
