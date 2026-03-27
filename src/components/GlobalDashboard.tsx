import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Thermometer, 
  Cpu, 
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Play,
  Pause,
  Users,
  MessageSquare,
  Layers,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// 模拟线路并发数据
const lineConcurrencyData = [
  { subject: '广东移动', A: 92, fullMark: 100 },
  { subject: '北京联通', A: 65, fullMark: 100 },
  { subject: '上海电信', A: 88, fullMark: 100 },
  { subject: '浙江移动', A: 45, fullMark: 100 },
  { subject: '江苏联通', A: 78, fullMark: 100 },
  { subject: '四川电信', A: 30, fullMark: 100 },
];

// 模拟 AI 算力趋势数据
const initialAiTrendData = [
  { time: '10:00', usage: 45 },
  { time: '10:30', usage: 52 },
  { time: '11:00', usage: 68 },
  { time: '11:30', usage: 85 },
  { time: '12:00', usage: 72 },
  { time: '12:30', usage: 90 },
  { time: '13:00', usage: 95 },
];

// 模拟算力占用明细
const computeDetails = [
  { id: 1, name: '销售一部-张三', script: 'A类金融催收', concurrency: 12, duration: '45分钟' },
  { id: 2, name: '销售二部-李四', script: 'B类存量激活', concurrency: 8, duration: '120分钟' },
  { id: 3, name: '运营中心-王五', script: '满意度调研', concurrency: 24, duration: '15分钟' },
  { id: 4, name: '技术支持-赵六', script: '故障自动通知', concurrency: 4, duration: '300分钟' },
];

const GlobalDashboard: React.FC = () => {
  const [isLive, setIsLive] = useState(false);
  const [totalConcurrency, setTotalConcurrency] = useState(3842);
  const [aiUsage, setAiUsage] = useState(85.4);
  const [aiTrendData, setAiTrendData] = useState(initialAiTrendData);
  const [currentTime, setCurrentTime] = useState(new Date());

  const highUsageLines = lineConcurrencyData.filter(line => line.A > 90);

  // 判断是否为禁呼时段 (21:00 - 08:00)
  const isForbiddenTime = () => {
    const hours = currentTime.getHours();
    return hours >= 21 || hours < 8;
  };

  // 模拟数据刷新逻辑
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    let dataInterval: NodeJS.Timeout;
    if (isLive) {
      dataInterval = setInterval(() => {
        setTotalConcurrency(prev => {
          const change = Math.floor(Math.random() * 25) + 5;
          return Math.random() > 0.5 ? prev + change : prev - change;
        });

        setAiUsage(prev => {
          const change = parseFloat((Math.random() * 1.4 + 0.1).toFixed(1));
          const next = Math.random() > 0.5 ? prev + change : prev - change;
          return Math.min(Math.max(next, 0), 100);
        });

        setAiTrendData(prev => {
          const newData = [...prev];
          const lastIndex = newData.length - 1;
          const change = Math.floor(Math.random() * 10) - 5;
          newData[lastIndex] = { 
            ...newData[lastIndex], 
            usage: Math.min(Math.max(newData[lastIndex].usage + change, 0), 100) 
          };
          return newData;
        });
      }, 2000);
    }
    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, [isLive]);

  // 仪表盘数据
  const cpsData = [
    { value: 24, color: '#10b981' },
    { value: 6, color: '#f3f4f6' }
  ];
  const poolData = [
    { value: 120, color: '#6366f1' },
    { value: 180, color: '#f3f4f6' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* 顶部红绿灯 Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`px-6 py-3 rounded-xl flex items-center justify-between shadow-sm border ${
          isForbiddenTime() 
            ? 'bg-rose-50 border-rose-200 text-rose-700' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isForbiddenTime() ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-sm font-black tracking-wide">
            {isForbiddenTime() ? '🔴 禁呼时段 (工信部红线) - 已自动暂停外呼' : '🟢 正常外呼时段'}
          </span>
        </div>
        <div className="text-xs font-bold opacity-70">
          当前服务器时间: {currentTime.toLocaleTimeString()}
        </div>
      </motion.div>

      {/* 顶部标题与实时开关 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-600" />
            智能外呼全局监控大盘
          </h1>
          <p className="text-sm text-gray-500 font-medium">实时监控全网线路并发与 AI 算力分配状态</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLive ? 'text-green-600' : 'text-gray-400'}`}>
            {isLive ? '实时数据流 (Live)' : '数据流已暂停'}
          </span>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isLive ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isLive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-ping' : 'bg-gray-300'}`} />
        </div>
      </div>

      {/* 核心指标与木桶效应分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
              <Thermometer size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">养号中 (Warming)</p>
              <p className="text-2xl font-bold text-gray-900">128 <span className="text-xs font-normal text-gray-400 ml-1">个号码</span></p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">风控冷却中 (Cooldown)</p>
              <p className="text-2xl font-bold text-gray-900">42 <span className="text-xs font-normal text-gray-400 ml-1">个号码</span></p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">当前总并发</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalConcurrency.toLocaleString()} <span className="text-xs font-normal text-gray-400 ml-1">CPS</span>
              </p>
            </div>
          </div>
        </div>

        {/* 木桶效应分析卡片 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">木桶效应分析</h4>
            <Info size={12} className="text-gray-300" />
          </div>
          <div className="space-y-3">
            {[
              { label: 'ASR', val: 1500, max: 2000, color: 'bg-blue-500' },
              { label: '网关', val: 1000, max: 1500, color: 'bg-blue-500' },
              { label: '中继', val: 1000, max: 1200, color: 'bg-blue-500' },
              { label: '声音克隆', val: 10, max: 10, color: 'bg-rose-500 animate-pulse', bottleneck: true },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-500">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <span className={item.bottleneck ? 'text-rose-600' : 'text-gray-700'}>{item.val}/{item.max}</span>
                    {item.bottleneck && <span className="bg-rose-100 text-rose-600 px-1 rounded scale-75 origin-right">系统瓶颈</span>}
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.val / item.max) * 100}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 线路并发水位雷达 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border transition-colors duration-500 ${
            highUsageLines.length > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className={highUsageLines.length > 0 ? 'text-rose-500 animate-pulse' : 'text-blue-500'} size={20} />
              <h3 className="font-bold text-gray-900">线路并发水位雷达</h3>
            </div>
            {highUsageLines.length > 0 && (
              <div className="flex items-center gap-1 text-rose-500 text-xs font-bold bg-rose-100 px-2 py-1 rounded-full">
                <AlertTriangle size={12} />
                <span>高负载告警</span>
              </div>
            )}
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={lineConcurrencyData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Radar
                  name="并发占用"
                  dataKey="A"
                  stroke={highUsageLines.length > 0 ? '#f43f5e' : '#3b82f6'}
                  fill={highUsageLines.length > 0 ? '#f43f5e' : '#3b82f6'}
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {highUsageLines.map(line => (
              <div key={line.subject} className="flex items-center justify-between p-3 bg-rose-100/50 rounded-lg border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-rose-500" />
                  <span className="text-sm font-bold text-rose-700">⚠️ 警告：{line.subject}专线并发告急</span>
                </div>
                <span className="text-sm font-black text-rose-600">{line.A}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI声音复刻算力看板 */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Cpu className="text-indigo-500" size={20} />
                <h3 className="font-bold text-gray-900">AI 声音复刻算力看板</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">当前算力占用</p>
                  <p className="text-xl font-black text-indigo-600">{aiUsage.toFixed(1)}%</p>
                </div>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">剩余可用时长</p>
                  <p className="text-xl font-black text-gray-900">1,240 <span className="text-xs font-normal">min</span></p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiTrendData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsage)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800">算力消耗趋势预测</p>
                  <p className="text-sm text-amber-700">基于当前消耗速率，预计将于 <span className="font-black underline decoration-2 underline-offset-2">2小时15分钟</span> 后耗尽可用时长</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors shadow-sm shadow-amber-200">
                立即扩容
              </button>
            </div>
          </motion.div>

          {/* AI 算力占用明细 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-bottom border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="text-indigo-500" size={20} />
                <h3 className="font-bold text-gray-900">当前算力占用明细</h3>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">实时任务列表</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">业务/坐席名称</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">关联话术</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">当前实时占用并发</th>
                    <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">持续消耗时长</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {computeDetails.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                            <Users size={14} />
                          </div>
                          <span className="text-sm font-bold text-gray-700">{task.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{task.script}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black text-indigo-600">{task.concurrency}</span>
                          <span className="text-[10px] text-gray-400 font-bold">路</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{task.duration}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 合规雷达双表盘 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h3 className="font-bold text-gray-900">运营商合规监控 (CPS)</h3>
            </div>
            <div className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded tracking-widest uppercase">实时频次控制</div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-24">
              <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                  <Pie
                    data={cpsData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {cpsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <p className="text-2xl font-black text-gray-900">24</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">当前 CPS / 30</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">今日累计外呼</p>
                  <p className="text-lg font-bold text-gray-900">12,482 <span className="text-[10px] font-normal">次</span></p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">运营商日限额</p>
                  <p className="text-lg font-bold text-gray-900">50,000 <span className="text-[10px] font-normal">次</span></p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                <ShieldCheck size={16} className="text-emerald-500" />
                <p className="text-xs text-emerald-700 font-medium">合规状态良好：未触碰运营商频次红线</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="text-indigo-500" size={20} />
              <h3 className="font-bold text-gray-900">动态并发池余量</h3>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg hover:bg-indigo-100 transition-colors">
              <RefreshCw size={12} />
              一键释放闲置
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-48 h-24">
              <ResponsiveContainer width="100%" height="200%">
                <PieChart>
                  <Pie
                    data={poolData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {poolData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <p className="text-2xl font-black text-gray-900">120</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">可用并发 / 300</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-500">资源池占用率</span>
                  <span className="text-indigo-600">60%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-indigo-500 rounded-full" />
                </div>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                  <span className="font-bold">资源建议：</span>当前并发池水位适中，建议在 14:00 高峰期前预留 20% 的弹性空间以应对突发话务。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GlobalDashboard;
