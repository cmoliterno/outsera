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
        console.error('Erro ao carregar anos com múltiplos vencedores', error);
        this.loading.years = false;
      }
    });
  }

  loadStudiosWithMostWins(): void {
    this.loading.studios = true;
    this.movieService.getStudiosWithWinCount().subscribe({
      next: (response) => {
        // Ordenar por número de vitórias em ordem decrescente e pegar os primeiros 3
        this.studiosWithMostWins = response.studios
          .sort((a, b) => b.winCount - a.winCount)
          .slice(0, 3);
        this.loading.studios = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estúdios com mais vitórias', error);
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
        console.error('Erro ao carregar intervalo de vitórias dos produtores', error);
        this.loading.producers = false;
      }
    });
  }

  searchMoviesByYear(): void {
    if (this.searchYear) {
      this.loading.moviesByYear = true;
      this.movieService.getMoviesByYear(this.searchYear, true).subscribe({
        next: (response) => {
          this.movieWinnersByYear = response.content;
          this.loading.moviesByYear = false;
        },
        error: (error) => {
          console.error('Erro ao carregar filmes vencedores por ano', error);
          this.loading.moviesByYear = false;
        }
      });
    } else {
      this.movieWinnersByYear = [];
    }
  }
}
