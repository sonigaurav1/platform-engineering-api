/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from 'mongoose';

export interface InstanceTypeCustomInfo {
  instanceType: string;
  freeTierEligible: boolean;
  cpuInfo: any;
  memoryInfo: any;
}

export interface InstanceTypeDBDoc extends Document, InstanceTypeCustomInfo {
  instanceType: string;
  freeTierEligible: boolean;
  cpuInfo: any;
  memoryInfo: any;
  isDeleted: boolean;
}
