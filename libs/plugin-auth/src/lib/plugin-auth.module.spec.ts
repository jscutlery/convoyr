import { async, TestBed } from '@angular/core/testing';
import { PluginAuthModule } from './plugin-auth.module';

describe('PluginAuthModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PluginAuthModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PluginAuthModule).toBeDefined();
  });
});
