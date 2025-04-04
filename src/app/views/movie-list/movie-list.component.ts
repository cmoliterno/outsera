import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/movie.model';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 15;
  loading: boolean = false;

  // Filtros
  yearFilter: number | null = null;
  winnerFilter: string | null = null;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    const winnerValue = this.parseWinnerFilter();

    this.movieService.getMovies(
      this.currentPage, 
      this.pageSize, 
      this.yearFilter || undefined, 
      winnerValue
    ).subscribe({
      next: (response) => {
        this.movies = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar filmes', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadMovies();
  }

  resetFilters(): void {
    this.yearFilter = null;
    this.winnerFilter = null;
    this.currentPage = 0;
    this.loadMovies();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadMovies();
    }
  }

  parseWinnerFilter(): boolean | undefined {
    if (this.winnerFilter === 'true') {
      return true;
    } else if (this.winnerFilter === 'false') {
      return false;
    }
    return undefined;
  }

  getPageArray(): number[] {
    const pagesArray = [];
    const maxPages = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    
    return pagesArray;
  }
}
