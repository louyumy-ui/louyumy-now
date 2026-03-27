import React from 'react';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    { label: '号码总数', value: '1,284', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50', trend: '+12%' },
    { label: '活跃号码', value: '856', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '正常' },
    { label: '冷却中', value: '342', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', trend: '-5%' },
    { label: '平均接通率', value: '68.4%', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+2.4%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-0">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 font-medium mb-1">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</span>
              <span className={`text-xs font-semibold ${stat.trend.includes('+') ? 'text-emerald-500' : stat.trend === '正常' ? 'text-blue-500' : 'text-amber-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
          <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
            <stat.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
