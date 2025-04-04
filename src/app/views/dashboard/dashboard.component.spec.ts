import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { MovieService } from 'src/app/services/movie.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MovieService', [
      'getYearsWithMultipleWinners',
      'getStudiosWithWinCount',
      'getProducersWinInterval',
      'getMoviesByYear'
    ]);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [FormsModule],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load years with multiple winners on init', () => {
    const mockResponse = {
      years: [
        { year: 1980, winnerCount: 2 },
        { year: 1990, winnerCount: 2 }
      ]
    };

    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of(mockResponse));
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of({ studios: [] }));
    movieServiceSpy.getProducersWinInterval.and.returnValue(of({ min: [], max: [] }));

    fixture.detectChanges();

    expect(movieServiceSpy.getYearsWithMultipleWinners).toHaveBeenCalled();
    expect(component.yearsWithMultipleWinners).toEqual(mockResponse.years);
  });

  it('should load studios with most wins on init', () => {
    const mockResponse = {
      studios: [
        { name: 'Studio A', winCount: 5 },
        { name: 'Studio B', winCount: 3 },
        { name: 'Studio C', winCount: 7 },
        { name: 'Studio D', winCount: 1 }
      ]
    };

    const expectedTopStudios = [
      { name: 'Studio C', winCount: 7 },
      { name: 'Studio A', winCount: 5 },
      { name: 'Studio B', winCount: 3 }
    ];

    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of({ years: [] }));
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of(mockResponse));
    movieServiceSpy.getProducersWinInterval.and.returnValue(of({ min: [], max: [] }));

    fixture.detectChanges();

    expect(movieServiceSpy.getStudiosWithWinCount).toHaveBeenCalled();
    expect(component.studiosWithMostWins).toEqual(expectedTopStudios);
  });

  it('should load producers win interval on init', () => {
    const mockResponse = {
      min: [{ producer: 'Producer A', interval: 1, previousWin: 1990, followingWin: 1991 }],
      max: [{ producer: 'Producer B', interval: 13, previousWin: 2002, followingWin: 2015 }]
    };

    movieServiceSpy.getYearsWithMultipleWinners.and.returnValue(of({ years: [] }));
    movieServiceSpy.getStudiosWithWinCount.and.returnValue(of({ studios: [] }));
    movieServiceSpy.getProducersWinInterval.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(movieServiceSpy.getProducersWinInterval).toHaveBeenCalled();
    expect(component.maxWinIntervalProducers).toEqual(mockResponse.max);
    expect(component.minWinIntervalProducers).toEqual(mockResponse.min);
  });

  it('should search movies by year when searchMoviesByYear is called', () => {
    const mockResponse = {
      content: [
        { id: 1, year: 2000, title: 'Movie 1', studios: [], producers: [], winner: true }
      ],
      pageable: { pageSize: 15, pageNumber: 0 },
      totalElements: 1,
      totalPages: 1,
      last: true,
      first: true,
      sort: { sorted: false, unsorted: true },
      number: 0,
      numberOfElements: 1,
      size: 15
    };

    movieServiceSpy.getMoviesByYear.and.returnValue(of(mockResponse));

    component.searchYear = 2000;
    component.searchMoviesByYear();

    expect(movieServiceSpy.getMoviesByYear).toHaveBeenCalledWith(2000, true);
    expect(component.movieWinnersByYear).toEqual(mockResponse.content);
  });

  it('should clear movieWinnersByYear when searchYear is null', () => {
    component.movieWinnersByYear = [
      { id: 1, year: 2000, title: 'Movie 1', studios: [], producers: [], winner: true }
    ];
    component.searchYear = null;
    component.searchMoviesByYear();

    expect(movieServiceSpy.getMoviesByYear).not.toHaveBeenCalled();
    expect(component.movieWinnersByYear).toEqual([]);
  });
});
