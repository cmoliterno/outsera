import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movies with correct parameters', () => {
    const mockResponse = {
      content: [],
      pageable: { pageSize: 15, pageNumber: 0 },
      totalElements: 100,
      totalPages: 7
    };

    service.getMovies(0, 15).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === 'https://challenge.outsera.tech/api/movies' && 
      req.params.get('page') === '0' && 
      req.params.get('size') === '15'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get years with multiple winners', () => {
    const mockResponse = {
      years: [
        { year: 1980, winnerCount: 2 },
        { year: 1990, winnerCount: 2 }
      ]
    };

    service.getYearsWithMultipleWinners().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === 'https://challenge.outsera.tech/api/movies' && 
      req.params.get('projection') === 'years-with-multiple-winners'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get studios with win count', () => {
    const mockResponse = {
      studios: [
        { name: 'Studio A', winCount: 5 },
        { name: 'Studio B', winCount: 3 }
      ]
    };

    service.getStudiosWithWinCount().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === 'https://challenge.outsera.tech/api/movies' && 
      req.params.get('projection') === 'studios-with-win-count'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get producers win interval', () => {
    const mockResponse = {
      min: [{ producer: 'Producer A', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Producer B', interval: 13, previousWin: 2002, followingWin: 2015 }]
    };

    service.getProducersWinInterval().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === 'https://challenge.outsera.tech/api/movies' && 
      req.params.get('projection') === 'max-min-win-interval-for-producers'
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
