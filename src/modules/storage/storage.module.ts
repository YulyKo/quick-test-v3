import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { StorageService } from './storage.service';

@Module({
  imports: [
    CacheModule.register({ store: redisStore, host: 'localhost', port: 6379 }),
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
