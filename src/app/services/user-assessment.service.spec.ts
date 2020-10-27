import { TestBed } from '@angular/core/testing';

import { UserAssessmentService } from './user-assessment.service';

describe('UserAssessmentService', () => {
  let service: UserAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
