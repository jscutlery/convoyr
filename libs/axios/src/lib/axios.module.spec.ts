import { async, TestBed } from '@angular/core/testing';
import { AxiosModule } from './axios.module';

describe('AxiosModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AxiosModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(AxiosModule).toBeDefined();
  });
});
