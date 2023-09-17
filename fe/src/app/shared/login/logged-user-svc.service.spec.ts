import { TestBed } from '@angular/core/testing';

import { LoggedUserSvcService } from './logged-user-service.service';

describe('LoggedUserSvcService', () => {
  let service: LoggedUserSvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggedUserSvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
