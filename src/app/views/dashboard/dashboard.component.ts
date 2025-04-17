import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { YearWithMultipleWinners } from 'src/app/models/years-with-multiple-winners.model';
import { StudioWithWinCount } from 'src/app/models/studios-with-win-count.model';
import { ProducerWinInterval } from 'src/app/models/producers-win-interval.model';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  yearsWithMultipleWinners: YearWithMultipleWinners[] = [];
  studiosWithMostWins: StudioWithWinCount[] = [];
  maxWinIntervalProducers: ProducerWinInterval[] = [];
  minWinIntervalProducers: ProducerWinInterval[] = [];
  movieWinnersByYear: Movie[] = [];
  searchYear: number | null = null;
  loading = {
    years: false,
    studios: false,
    producers: false,
    moviesByYear: false
  };

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.loadYearsWithMultipleWinners();
    this.loadStudiosWithMostWins();
    this.loadProducersWinInterval();
  }

  loadYearsWithMultipleWinners(): void {
    this.loading.years = true;
    this.movieService.getYearsWithMultipleWinners().subscribe({
      next: (response) => {
        this.yearsWithMultipleWinners = response.years;
        this.loading.years = false;
      },
      error: (error) => {
        console.error('Error loading years with multiple winners', error);
        this.loading.years = false;
      }
    });
  }

  loadStudiosWithMostWins(): void {
    this.loading.studios = true;
    this.movieService.getStudiosWithWinCount().subscribe({
      next: (response) => {
        // Sort by win count in descending order and take the first 3
        this.studiosWithMostWins = response.studios
          .sort((a, b) => b.winCount - a.winCount)
          .slice(0, 3);
        this.loading.studios = false;
      },
      error: (error) => {
        console.error('Error loading studios with most wins', error);
        this.loading.studios = false;
      }
    });
  }

  loadProducersWinInterval(): void {
    this.loading.producers = true;
    this.movieService.getProducersWinInterval().subscribe({
      next: (response) => {
        this.maxWinIntervalProducers = response.max;
        this.minWinIntervalProducers = response.min;
        this.loading.producers = false;
      },
      error: (error) => {
        console.error('Error loading producers win intervals', error);
        this.loading.producers = false;
      }
    });
  }

  searchMoviesByYear(): void {
    if (!this.searchYear) {
      this.movieWinnersByYear = [];
      return;
    }

    this.loading.moviesByYear = true;
    this.movieService.getMovies(0, 15, this.searchYear, true).subscribe({
      next: (response) => {
        this.movieWinnersByYear = response.content;
        this.loading.moviesByYear = false;
      },
      error: (error) => {
        console.error('Error loading movie winners by year', error);
        this.loading.moviesByYear = false;
        this.movieWinnersByYear = [];
      }
    });
  }
}
