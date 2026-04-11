import { TestBed } from '@angular/core/testing';

import { DashboardChartsService } from './dashboard-charts.service';

describe('DashboardChartsService', () => {
  let service: DashboardChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
