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

  yearFilter: string = '';
  winnerFilter: string | null = null;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    const year = this.yearFilter ? parseInt(this.yearFilter) : undefined;
    const winner = this.parseWinnerFilter();

    this.movieService.getMovies(
      this.currentPage, 
      this.pageSize, 
      year, 
      winner
    ).subscribe({
      next: (response) => {
        this.movies = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        
        // Ajusta a página atual se estiver além do total de páginas
        if (this.currentPage >= this.totalPages) {
          this.currentPage = Math.max(0, this.totalPages - 1);
          if (this.totalPages > 0) {
            this.loadMovies();
            return;
          }
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies', error);
        this.loading = false;
        this.movies = [];
        this.totalElements = 0;
        this.totalPages = 0;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadMovies();
  }

  goToPage(page: number): void {
    const maxPages = Math.min(5, this.totalPages);
    if (page >= 0 && page < maxPages) {
      this.currentPage = page;
      this.loadMovies();
    }
  }

  private parseWinnerFilter(): boolean | undefined {
    if (this.winnerFilter === 'true') return true;
    if (this.winnerFilter === 'false') return false;
    return undefined;
  }

  get visiblePages(): number[] {
    const pages = [];
    const maxPages = Math.min(5, this.totalPages);
    for (let i = 0; i < maxPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
