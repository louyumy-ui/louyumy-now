import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AIResourceStats, SBCNode, GlobalResource } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 动态木桶判定逻辑 (The Barrel Logic)
 * 核心逻辑：Math.min(node.物理并发, node.线路并发, globalRes.TTS余量, globalRes.ASR余量)
 */
export function calculateEffectiveConcurrency(
  node: SBCNode,
  globalRes: GlobalResource
) {
  const nodePhysicalRemained = Math.max(0, node.physicalMax - node.physicalCurrent);
  const nodeBandwidthRemained = Math.max(0, node.bandwidthMax - node.bandwidthCurrent);
  
  return Math.min(
    nodePhysicalRemained, 
    nodeBandwidthRemained, 
    globalRes.ttsAvailable, 
    globalRes.asrAvailable
  );
}
