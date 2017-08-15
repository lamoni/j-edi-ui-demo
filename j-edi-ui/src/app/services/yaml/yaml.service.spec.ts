import { TestBed, inject } from '@angular/core/testing';

import { YamlService } from './yaml.service';

describe('YamlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YamlService]
    });
  });

  it('should ...', inject([YamlService], (service: YamlService) => {
    expect(service).toBeTruthy();
  }));
});
