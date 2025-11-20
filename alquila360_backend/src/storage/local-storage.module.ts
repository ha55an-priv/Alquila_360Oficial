// src/storage/local-storage.module.ts
import { Module } from '@nestjs/common';
import { LocalStorageService } from './local-storage.service';

@Module({
  providers: [LocalStorageService],
  exports: [LocalStorageService], // Para que otros módulos puedan usarlo
})
export class LocalStorageModule {}