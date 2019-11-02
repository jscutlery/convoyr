import { async, TestBed } from '@angular/core/testing';
import { PluginCacheModule } from './plugin-cache.module';

describe('PluginCacheModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PluginCacheModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PluginCacheModule).toBeDefined();
  });
});
