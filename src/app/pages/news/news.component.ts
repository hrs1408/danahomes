import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../services/post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error: string | null = null;

  // Thêm các biến phân trang
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  paginatedPosts: Post[] = [];

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        this.posts = response.data;
        this.totalPages = Math.ceil(this.posts.length / this.pageSize);
        this.updatePaginatedPosts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = 'Không thể tải tin tức. Vui lòng thử lại sau.';
        this.loading = false;
      },
    });
  }

  updatePaginatedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getExcerpt(content: string, maxLength: number = 200): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }

  getPostDate(post: Post): Date {
    return new Date(post.created_at || new Date());
  }

  readMore(postId: any) {
    {
      this.router.navigate(['/news', postId]);
    }
  }
}
