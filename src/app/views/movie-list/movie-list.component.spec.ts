import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MovieListComponent } from './movie-list.component';
import { MovieService } from 'src/app/services/movie.service';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MovieService', ['getMovies']);

    TestBed.configureTestingModule({
      declarations: [MovieListComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: MovieService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieServiceSpy = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    const mockResponse = {
      content: [
        { id: 1, year: 1980, title: 'Movie 1', studios: [], producers: [], winner: true },
        { id: 2, year: 1981, title: 'Movie 2', studios: [], producers: [], winner: false }
      ],
      pageable: {
        sort: {
          sorted: false,
          unsorted: true
        },
        pageSize: 15,
        pageNumber: 0,
        offset: 0,
        paged: true,
        unpaged: false
      },
      totalElements: 2,
      totalPages: 1,
      last: true,
      first: true,
      sort: {
        sorted: false,
        unsorted: true
      },
      number: 0,
      numberOfElements: 2,
      size: 15
    };

    movieServiceSpy.getMovies.and.returnValue(of(mockResponse));

    fixture.detectChanges();

    expect(movieServiceSpy.getMovies).toHaveBeenCalledWith(0, 15, undefined, undefined);
    expect(component.movies).toEqual(mockResponse.content);
    expect(component.totalElements).toBe(mockResponse.totalElements);
    expect(component.totalPages).toBe(mockResponse.totalPages);
  });

  it('should apply filters when applyFilters is called', () => {
    const mockResponse = {
      content: [
        { id: 1, year: 1980, title: 'Movie 1', studios: [], producers: [], winner: true }
      ],
      pageable: {
        sort: {
          sorted: false,
          unsorted: true
        },
        pageSize: 15,
        pageNumber: 0,
        offset: 0,
        paged: true,
        unpaged: false
      },
      totalElements: 1,
      totalPages: 1,
      last: true,
      first: true,
      sort: {
        sorted: false,
        unsorted: true
      },
      number: 0,
      numberOfElements: 1,
      size: 15
    };

    movieServiceSpy.getMovies.and.returnValue(of(mockResponse));

    component.yearFilter = 1980;
    component.winnerFilter = 'true';
    component.currentPage = 2;
    component.applyFilters();

    expect(component.currentPage).toBe(0); // should reset to page 0
    expect(movieServiceSpy.getMovies).toHaveBeenCalledWith(0, 15, 1980, true);
  });

  it('should reset filters when resetFilters is called', () => {
    const mockResponse = {
      content: [],
      pageable: {
        sort: {
          sorted: false,
          unsorted: true
        },
        pageSize: 15,
        pageNumber: 0,
        offset: 0,
        paged: true,
        unpaged: false
      },
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
      sort: {
        sorted: false,
        unsorted: true
      },
      number: 0,
      numberOfElements: 0,
      size: 15
    };

    movieServiceSpy.getMovies.and.returnValue(of(mockResponse));

    component.yearFilter = 1980;
    component.winnerFilter = 'true';
    component.currentPage = 2;
    component.resetFilters();

    expect(component.yearFilter).toBeNull();
    expect(component.winnerFilter).toBeNull();
    expect(component.currentPage).toBe(0);
    expect(movieServiceSpy.getMovies).toHaveBeenCalledWith(0, 15, undefined, undefined);
  });

  it('should navigate to page when goToPage is called with valid page', () => {
    const mockResponse = {
      content: [],
      pageable: {
        sort: {
          sorted: false,
          unsorted: true
        },
        pageSize: 15,
        pageNumber: 1,
        offset: 15,
        paged: true,
        unpaged: false
      },
      totalElements: 30,
      totalPages: 2,
      last: true,
      first: false,
      sort: {
        sorted: false,
        unsorted: true
      },
      number: 1,
      numberOfElements: 15,
      size: 15
    };

    movieServiceSpy.getMovies.and.returnValue(of(mockResponse));
    component.totalPages = 2;

    component.goToPage(1);

    expect(component.currentPage).toBe(1);
    expect(movieServiceSpy.getMovies).toHaveBeenCalledWith(1, 15, undefined, undefined);
  });

  it('should not navigate to invalid page', () => {
    component.totalPages = 2;
    component.currentPage = 0;

    // Test negative page
    component.goToPage(-1);
    expect(component.currentPage).toBe(0);
    expect(movieServiceSpy.getMovies).not.toHaveBeenCalled();

    // Test page >= totalPages
    component.goToPage(2);
    expect(component.currentPage).toBe(0);
    expect(movieServiceSpy.getMovies).not.toHaveBeenCalled();
  });

  it('should parse winner filter correctly', () => {
    component.winnerFilter = 'true';
    expect(component.parseWinnerFilter()).toBe(true);

    component.winnerFilter = 'false';
    expect(component.parseWinnerFilter()).toBe(false);

    component.winnerFilter = null;
    expect(component.parseWinnerFilter()).toBeUndefined();
  });

  it('should calculate page array correctly', () => {
    component.totalPages = 10;
    
    component.currentPage = 0;
    expect(component.getPageArray()).toEqual([0, 1, 2, 3, 4]);
    
    component.currentPage = 5;
    expect(component.getPageArray()).toEqual([3, 4, 5, 6, 7]);
    
    component.currentPage = 9;
    expect(component.getPageArray()).toEqual([5, 6, 7, 8, 9]);
  });
});
