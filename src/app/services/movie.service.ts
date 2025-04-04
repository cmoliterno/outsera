import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../models/movie.model';
import { YearsWithMultipleWinnersResponse } from '../models/years-with-multiple-winners.model';
import { StudiosWithWinCountResponse } from '../models/studios-with-win-count.model';
import { ProducersWinIntervalResponse } from '../models/producers-win-interval.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://challenge.outsera.tech/api/movies';

  constructor(private http: HttpClient) { }

  getMovies(page: number = 0, size: number = 15, year?: number, winner?: boolean): Observable<MovieResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (year !== undefined) {
      params = params.set('year', year.toString());
    }

    if (winner !== undefined) {
      params = params.set('winner', winner.toString());
    }

    return this.http.get<MovieResponse>(this.baseUrl, { params });
  }

  getYearsWithMultipleWinners(): Observable<YearsWithMultipleWinnersResponse> {
    const params = new HttpParams().set('projection', 'years-with-multiple-winners');
    return this.http.get<YearsWithMultipleWinnersResponse>(this.baseUrl, { params });
  }

  getStudiosWithWinCount(): Observable<StudiosWithWinCountResponse> {
    const params = new HttpParams().set('projection', 'studios-with-win-count');
    return this.http.get<StudiosWithWinCountResponse>(this.baseUrl, { params });
  }

  getProducersWinInterval(): Observable<ProducersWinIntervalResponse> {
    const params = new HttpParams().set('projection', 'max-min-win-interval-for-producers');
    return this.http.get<ProducersWinIntervalResponse>(this.baseUrl, { params });
  }

  getMoviesByYear(year: number, winner: boolean = true): Observable<MovieResponse> {
    const params = new HttpParams()
      .set('winner', winner.toString())
      .set('year', year.toString());
    
    return this.http.get<MovieResponse>(this.baseUrl, { params });
  }
}
