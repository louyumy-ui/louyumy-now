import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Thermometer, 
  Cpu, 
  TrendingUp,
  ShieldAlert,
  BarChart3
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
  Tooltip
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
const aiTrendData = [
  { time: '10:00', usage: 45 },
  { time: '10:30', usage: 52 },
  { time: '11:00', usage: 68 },
  { time: '11:30', usage: 85 },
  { time: '12:00', usage: 72 },
  { time: '12:30', usage: 90 },
  { time: '13:00', usage: 95 },
];

const GlobalDashboard: React.FC = () => {
  const highUsageLines = lineConcurrencyData.filter(line => line.A > 90);

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      {/* 顶部异常状态统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
            <Thermometer size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">养号中 (Warming)</p>
            <p className="text-2xl font-bold text-gray-900">128 <span className="text-xs font-normal text-gray-400 ml-1">个号码</span></p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">风控冷却中 (Cooldown)</p>
            <p className="text-2xl font-bold text-gray-900">42 <span className="text-xs font-normal text-gray-400 ml-1">个号码</span></p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">当前总并发</p>
            <p className="text-2xl font-bold text-gray-900">3,842 <span className="text-xs font-normal text-gray-400 ml-1">CPS</span></p>
          </div>
        </motion.div>
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
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Cpu className="text-indigo-500" size={20} />
              <h3 className="font-bold text-gray-900">AI 声音复刻算力看板</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">当前算力占用</p>
                <p className="text-xl font-black text-indigo-600">85.4%</p>
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
      </div>
    </div>
  );
};

export default GlobalDashboard;
