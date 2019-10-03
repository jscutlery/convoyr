import { async, TestBed } from '@angular/core/testing';
import { HttpextModule } from './httpext.module';

describe('HttpextModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpextModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HttpextModule).toBeDefined();
  });
});
