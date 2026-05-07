const MOCK_DATA = {
  '北京市': [
    { id: 'N001', number: '170-9122-8833', operator: '中国移动', status: 'buffering', label: '缓冲期', countdown: '2天', user: '字节抖音', time: '17:21:05', date: '2026-05-12' },
    { id: 'N002', number: '165-8829-1122', operator: '中国联通', status: 'frozen', label: '冻结池-冷却中', countdown: '15天', user: '资源中心', time: '14:30:12', date: '2026-04-30' },
    { id: 'N003', number: '171-4433-5566', operator: '中国电信', status: 'public', label: '公共池-可分配', countdown: null, user: '回收池', time: '09:00:00', date: '2026-05-01' },
    { id: 'N004', number: '170-1122-3344', operator: '中国移动', status: 'normal', label: '正常服役中', countdown: null, user: '腾讯售后', time: '11:45:33', date: '2026-05-05' },
  ],
  '上海市': [],
  '广东省': [],
  '浙江省': [],
  '江苏省': [],
};

const ResourceModule: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState('北京市');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const rows = MOCK_DATA[selectedProvince as keyof typeof MOCK_DATA] || [];
  
  const isBatchActionDisabled = selectedIds.length === 0 || selectedIds.some(id => {
    const row = rows.find(r => r.id === id);
    return row && (row.status === 'buffering' || row.status === 'frozen');
  });

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(rows.map(r => r.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="flex gap-x-[32px] w-[1528px] mx-auto">
      {/* 左侧栏：宽度358px，高度888px，圆角40px */}
      <div className="w-[358px] h-[888px] bg-white rounded-[40px] border-[1.33px] border-gray-100 flex flex-col p-[41.33px] shadow-sm">
        <div className="mb-12">
           <h4 className="text-[24px] font-[900] text-black tracking-tight leading-tight">地缘号码架构</h4>
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-2">按运营商地理分布</p>
        </div>

        <div className="flex-1 space-y-2 overflow-auto scrollbar-hide">
           {['北京市', '上海市', '广东省', '浙江省', '江苏省'].map(prov => (
             <div 
               key={prov}
               onClick={() => setSelectedProvince(prov)}
               className={cn(
                 "h-[56px] px-8 rounded-[24px] cursor-pointer transition-all flex items-center justify-between",
                 selectedProvince === prov ? "bg-black text-white shadow-xl shadow-black/20" : "bg-white text-gray-400 hover:bg-gray-50"
               )}
             >
                <span className="text-[13px] font-[900] uppercase tracking-widest">{prov}</span>
                {selectedProvince === prov && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
             </div>
           ))}
        </div>
        
        <button className="mt-10 h-[55px] bg-[#00008B] text-white rounded-[24px] text-[10px] font-[900] uppercase tracking-[0.2em] transition-transform active:scale-95">
           查看全国回收池
        </button>
      </div>

      {/* 右侧内容区：宽度1138px，高度888px，圆角40px */}
      <div className="w-[1138px] h-[888px] bg-white rounded-[40px] border-[1.33px] border-gray-100 flex flex-col overflow-hidden shadow-sm">
         {/* 顶部头部区域：高度136.33px */}
         <div className="h-[136.33px] px-[40px] flex items-center justify-between bg-gray-50 border-b border-gray-100">
            <div>
               <h4 className="text-[30px] font-[900] text-black tracking-tighter leading-none uppercase">{selectedProvince} 号段池</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-3">资源逻辑链路分发监控</p>
            </div>
            <div className="flex gap-4">
               <button 
                 disabled={isBatchActionDisabled}
                 className={cn(
                   "px-6 py-3 rounded-2xl text-[10px] font-[900] uppercase tracking-widest border border-gray-200 transition-all",
                   isBatchActionDisabled ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed" : "bg-white text-black hover:bg-gray-50 shadow-sm"
                 )}
               >
                 批量分配
               </button>
               <button className="w-[108px] h-[47px] bg-gray-200 text-black rounded-[16px] text-[10px] font-[900] uppercase tracking-widest">筛选过滤</button>
               <button className="w-[119px] h-[47px] bg-[#00008B] text-white rounded-[16px] text-[10px] font-[900] uppercase tracking-widest shadow-lg shadow-blue-900/10">下发新资源</button>
            </div>
         </div>

         <div className="flex-1 overflow-auto bg-white">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="h-[62.17px] bg-gray-50/50 border-b border-gray-100">
                     <th className="px-10 py-5 w-16">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 accent-black"
                          checked={selectedIds.length === rows.length && rows.length > 0}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                     </th>
                     <th className="px-5 py-5 text-[9px] font-[900] text-gray-400 uppercase tracking-widest">终端号码 / 运营商</th>
                     <th className="px-10 py-5 text-[9px] font-[900] text-gray-400 uppercase tracking-widest">单向流转状态 [生命周期]</th>
                     <th className="px-10 py-5 text-[9px] font-[900] text-gray-400 uppercase tracking-widest">当前业务挂载点</th>
                     <th className="px-10 py-5 text-[9px] font-[900] text-gray-400 uppercase tracking-widest text-right">时间戳</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {rows.map(num => (
                    <tr key={num.id} className="hover:bg-gray-50/30 transition-colors">
                       <td className="px-10 py-5">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 accent-black"
                            checked={selectedIds.includes(num.id)}
                            onChange={() => toggleSelect(num.id)}
                          />
                       </td>
                       <td className="px-5 py-8">
                          <div>
                             <p className="text-[15px] font-[900] text-black tabular-nums tracking-tight">{num.number}</p>
                             <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mt-1">{num.operator}</p>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div 
                            title={num.status === 'buffering' ? '即将到期，剩余缓冲期2天' : num.status === 'frozen' ? '触发风控：单日呼出频次超限' : ''}
                            className="inline-flex items-center px-4 py-2 rounded-[12px] text-white cursor-help"
                            style={{ 
                              backgroundColor: num.status === 'buffering' ? 'oklch(0.769 0.188 70.08)' :
                                              num.status === 'frozen' ? 'oklch(0.707 0.022 261.325)' :
                                              num.status === 'public' ? 'oklch(0.696 0.17 162.48)' :
                                              'oklch(0.546 0.245 262.881)'
                            }}
                          >
                             <span className="text-[10px] font-[900] uppercase tracking-widest whitespace-nowrap">
                                {num.label} {num.countdown && `- ${num.countdown}`}
                             </span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-xs font-[900] text-black uppercase tracking-widest">@{num.user}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {num.id}</p>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <div className="flex flex-col items-end">
                             <span className="text-[11px] font-[900] text-gray-900 tabular-nums">{num.time}</span>
                             <span className="text-[9px] font-bold text-gray-300 tabular-nums uppercase mt-1">{num.date}</span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ResourceModule;
