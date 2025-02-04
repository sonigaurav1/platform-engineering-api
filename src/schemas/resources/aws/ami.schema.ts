import type { Document } from 'mongoose';

export interface AmiInfo {
  name: string;
  ami: string;
  description: string;
  architecture: string;
  os: string;
}

export interface AMIDbDoc extends Document, AmiInfo {
  name: string;
  ami: string;
  description: string;
  architecture: string;
  os: string;
  isDeleted: boolean;
}
