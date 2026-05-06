import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AIResourceStats, SBCNode } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 动态木桶判定逻辑 (The Barrel Logic)
 * 任务发起时，提取归属节点的“线路带宽余量、物理并发余量”，与顶部的“动态共享池余量 (TTS/ASR)”比对，
 * 取最小值作为实际可用并发。
 */
export function calculateEffectiveConcurrency(
  node: SBCNode,
  aiPool: AIResourceStats
) {
  const nodePhysicalRemained = node.physicalMax - node.physicalCurrent;
  const nodeBandwidthRemained = node.bandwidthMax - node.bandwidthCurrent;
  
  // 动态池总容量 = 全局总采购 - 已分配固定保底
  // 动态池剩余可用 = 动态池总容量 - 实时实际占用
  const aiPoolCapacity = aiPool.globalPurchase - aiPool.fixedGuarantee;
  const aiDynamicRemained = aiPoolCapacity - aiPool.realtimeOccupancy;
  
  return Math.max(0, Math.min(nodePhysicalRemained, nodeBandwidthRemained, aiDynamicRemained));
}
