const ConcurrencyModule: React.FC = () => {
  const [sbc, setSbc] = useState(1000);
  const [ims, setIms] = useState(1000);
  const [ai, setAi] = useState(200);
  const [cps, setCps] = useState(30);

  const globalCap = Math.min(sbc, ims, ai);
  const fixedPool = 300;
  const isOverSold = globalCap < fixedPool;
  
  const bottleneck = 
    globalCap === sbc ? 'SBC' : 
    globalCap === ims ? 'IMS' : 'TTS/ASR';

  return (
    <div className="space-y-12">
      {/* 1. 顶部核心控制区 */}
      <div className="grid grid-cols-4 gap-8">
        {[
          { label: 'SBC 物理上限', val: sbc, set: setSbc, id: 'SBC' },
          { label: 'IMS 宽带并发', val: ims, set: setIms, id: 'IMS' },
          { label: 'TTS/ASR 算力并发', val: ai, set: setAi, id: 'AI' },
          { label: 'CPS 频次 (独立管控)', val: cps, set: setCps, id: 'CPS' },
        ].map((item) => (
          <div key={item.label} className={cn(
            "bg-white p-10 rounded-[40px] border-[1.33px] transition-all",
            bottleneck === item.id && item.id !== 'CPS' ? "border-blue-600 shadow-2xl shadow-blue-500/10 ring-4 ring-blue-50" : "border-gray-100 shadow-sm"
          )}>
            <div className="flex justify-between items-center mb-10">
               <span className="text-[11px] font-[900] text-gray-400 uppercase tracking-widest">{item.label}</span>
               {bottleneck === item.id && item.id !== 'CPS' && (
                 <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full italic animate-pulse">CAPACITY LOCK</span>
               )}
            </div>
            <div className="space-y-8">
               <input 
                 type="number" 
                 value={item.val} 
                 onChange={(e) => item.set(Number(e.target.value))}
                 className="w-full text-5xl font-[900] text-black tabular-nums border-none p-0 focus:ring-0"
               />
               <input 
                 type="range" 
                 min="100" 
                 max="2000" 
                 value={item.val}
                 onChange={(e) => item.set(Number(e.target.value))}
                 className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
               />
            </div>
          </div>
        ))}
      </div>

      {/* 2. 全局并发大闸指标卡 & 3. 三池资源占比条 */}
      <div className="bg-white rounded-[48px] border-[1.33px] border-gray-100 p-16 shadow-sm space-y-12 relative overflow-hidden">
        {isOverSold && <div className="absolute inset-0 bg-red-50/30 backdrop-blur-[2px] z-10 pointer-events-none" />}
        
        <div className="flex justify-between items-end relative z-20">
          <div className="space-y-4">
             <h4 className="text-[12px] font-[900] text-gray-400 uppercase tracking-[0.4em]">SYSTEM GLOBAL GATE</h4>
             <div className="flex items-baseline gap-4">
                <span className="text-[120px] font-[900] text-black leading-none tabular-nums tracking-tighter">
                   {globalCap}
                </span>
                <span className="text-2xl font-black text-gray-300 uppercase italic">Concurrency Max</span>
             </div>
          </div>
          
          <div className="text-right space-y-2">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">当前短板维度</p>
             <p className="text-2xl font-black text-blue-600 uppercase italic">{bottleneck}</p>
          </div>
        </div>

        <div className="space-y-6 relative z-20">
           <div className="flex justify-between text-[11px] font-[900] uppercase tracking-widest">
              <span className="text-blue-600">已分配 (固定池): {fixedPool}</span>
              <span className="text-gray-400">空闲 (动态分配池): {Math.max(0, globalCap - fixedPool)}</span>
           </div>
           <div className="h-16 w-full flex rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100">
              <div 
                className="h-full bg-black transition-all duration-500 relative" 
                style={{ width: `${(fixedPool / globalCap) * 100}%` }}
              >
                {isOverSold && <div className="absolute inset-0 bg-red-600 animate-pulse" />}
              </div>
              <div className="flex-1 h-full bg-gray-100" />
           </div>
        </div>

        {/* 4. 异常阻断UI */}
        {isOverSold && (
          <div className="bg-red-600 p-8 rounded-[32px] flex items-center justify-between relative z-20">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center font-[900] text-2xl">!</div>
                <div>
                   <p className="text-white font-[900] text-lg uppercase tracking-tight">警告：全局物理上限已低于已售出额度</p>
                   <p className="text-red-100 text-[11px] font-bold uppercase tracking-widest mt-1">INSTANCE OVER-SOLD DETECTED / SYSTEM BLOCKING ACTIVE</p>
                </div>
             </div>
             <button className="px-8 py-4 bg-white text-red-600 rounded-2xl text-[10px] font-[900] uppercase tracking-widest">详情透视</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
         <div className="bg-gray-50 rounded-[40px] p-12 border border-gray-100 space-y-6">
            <h5 className="text-sm font-[900] text-black uppercase tracking-widest">集群性能分布</h5>
            <div className="space-y-4">
               {[
                 { label: 'Cluster-A', val: 88 },
                 { label: 'Cluster-B', val: 42 },
                 { label: 'Cluster-C', val: 12 },
               ].map(c => (
                 <div key={c.label} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                       <span>{c.label}</span>
                       <span className="text-black">{c.val}%</span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                       <div className="h-full bg-black" style={{ width: `${c.val}%` }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="bg-gray-50 rounded-[40px] p-12 border border-gray-100 flex flex-col justify-center items-center text-center space-y-4 grayscale opacity-40">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">待解锁高级分析</p>
            <p className="text-xs font-bold text-gray-300">需开通「全链路拓扑分析」订阅单元</p>
         </div>
      </div>
    </div>
  );
};

export default ConcurrencyModule;
