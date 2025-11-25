import { Express } from 'express';

export function extractFileUrl(f: Express.Multer.File): string {
  if ((f as any).secure_url) return (f as any).secure_url;
  if ((f as any).secureUrl) return (f as any).secureUrl;
  if ((f as any).location) return (f as any).location;
  if ((f as any).url) return (f as any).url;
  if ((f as any).path) return (f as any).path;
  if ((f as any).filename) return `/uploads/tickets/${(f as any).filename}`;
  return `/uploads/tickets/${Date.now()}-${(f.originalname ?? 'file')}`;
}

export function extractFileName(f: Express.Multer.File): string {
  if ((f as any).originalname) return (f as any).originalname;
  if ((f as any).filename) return (f as any).filename;
  if ((f as any).public_id) return (f as any).public_id;
  return `file-${Date.now()}`;
}
