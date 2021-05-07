import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class StorageService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  get(key: string) {
    return this.cacheManager.get(key);
  }

  set(key: string, value: string) {
    return this.cacheManager.set(key, value);
  }

  delete(key: string) {
    return this.cacheManager.del(key);
  }
}
