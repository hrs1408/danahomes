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

  // Pagination variables
  currentPage = 1;
  pageSize = 5;
  
  // Filter variables
  selectedNewsType: string = 'all';
  filteredPosts: Post[] = [];

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
        this.posts = response.data.reverse(); // Reverse array to show newest posts first
        this.filteredPosts = this.posts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = 'Không thể tải tin tức. Vui lòng thử lại sau.';
        this.loading = false;
      },
    });
  }

  filterByType(type: string) {
    this.selectedNewsType = type;
    
    if (type === 'all') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => 
        post.post_type === type
      );
    }
    
    this.currentPage = 1; // Reset to first page
  }

  // Getter for paginated posts
  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPosts.slice(startIndex, endIndex);
  }

  // Getter for total pages
  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
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

  readMore(postId: any): void {
    this.router.navigate(['/news', postId]);
  }
}
