import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalItems: number = 0;
  @Input() maxPagesToShow: number = 5;

  @Output() pageChange = new EventEmitter<number>();

  /**
   * Générer les numéros de pages à afficher
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];

    let startPage = Math.max(1, this.currentPage - Math.floor(this.maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + this.maxPagesToShow - 1);

    if (endPage - startPage < this.maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - this.maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Aller à la page précédente
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  /**
   * Aller à la page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  /**
   * Émettre le changement de page
   */
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
