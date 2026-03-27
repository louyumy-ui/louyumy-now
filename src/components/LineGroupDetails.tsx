import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Server, ShieldCheck, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const LineGroupDetails: React.FC = () => {
  const carriers = [
    { 
      name: '中国移动', 
      total: 1000, 
      used: 650, 
      status: 'stable', 
      color: 'blue',
      latency: '24ms',
      successRate: '98.5%'
    },
    { 
      name: '中国联通', 
      total: 800, 
      used: 320, 
      status: 'stable', 
      color: 'orange',
      latency: '31ms',
      successRate: '97.2%'
    },
    { 
      name: '中国电信', 
      total: 1200, 
      used: 980, 
      status: 'busy', 
      color: 'cyan',
      latency: '28ms',
      successRate: '99.1%'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 顶部概览 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-ant-blue">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">2,950</div>
          <div className="text-xs text-gray-400 font-medium">总并发能力</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">实时</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,950</div>
          <div className="text-xs text-gray-400 font-medium">当前占用并发</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Server size={20} />
            </div>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">66%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,000</div>
          <div className="text-xs text-gray-400 font-medium">剩余可用并发</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">正常</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">98.2%</div>
          <div className="text-xs text-gray-400 font-medium">平均接通率</div>
        </div>
      </div>

      {/* 运营商物理线路详情 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-gray-400" />
            <h3 className="font-bold text-gray-900">运营商物理线路并发占用</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-ant-blue" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">已占用</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">空闲</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {carriers.map((carrier) => (
            <div key={carrier.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    carrier.name === '中国移动' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    carrier.name === '中国联通' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-cyan-50 text-cyan-600 border-cyan-100'
                  }`}>
                    {carrier.name}
                  </span>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>延迟:</span>
                      <span className="text-gray-600">{carrier.latency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>接通率:</span>
                      <span className="text-emerald-500">{carrier.successRate}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {carrier.used} <span className="text-gray-300 font-normal mx-1">/</span> {carrier.total}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Concurrent Lines</div>
                </div>
              </div>

              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(carrier.used / carrier.total) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    carrier.name === '中国移动' ? 'bg-ant-blue' :
                    carrier.name === '中国联通' ? 'bg-orange-500' :
                    'bg-cyan-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gray-50 text-gray-400">
                    <ArrowUpRight size={12} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-900">峰值占用</div>
                    <div className="text-[9px] text-gray-400">14:00 - 16:00</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gray-50 text-gray-400">
                    <ArrowDownRight size={12} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-900">低谷占用</div>
                    <div className="text-[9px] text-gray-400">02:00 - 05:00</div>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button className="text-[10px] font-bold text-ant-blue hover:underline">查看详细日志</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 线路健康度监控 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            物理线路稳定性 (24h)
          </h4>
          <div className="h-32 flex items-end gap-1">
            {[...Array(24)].map((_, i) => (
              <div 
                key={i} 
                className="flex-1 bg-emerald-100 rounded-t-sm hover:bg-emerald-500 transition-colors cursor-pointer"
                style={{ height: `${60 + Math.random() * 40}%` }}
                title={`时间: ${i}:00, 稳定性: ${95 + Math.random() * 5}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:59</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-ant-blue" />
            并发负载分布
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">呼叫中心 A (广州)</span>
              <span className="text-xs font-bold text-gray-900">45%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-ant-blue rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">呼叫中心 B (北京)</span>
              <span className="text-xs font-bold text-gray-900">32%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[32%] h-full bg-ant-blue rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">呼叫中心 C (上海)</span>
              <span className="text-xs font-bold text-gray-900">23%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="w-[23%] h-full bg-ant-blue rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineGroupDetails;
