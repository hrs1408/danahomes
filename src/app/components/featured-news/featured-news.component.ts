import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-news',
  templateUrl: './featured-news.component.html',
  styleUrls: ['./featured-news.component.scss']
})
export class FeaturedNewsComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error: string | null = null;
  activeTab = 'featured'; // 'featured', 'news', 'fengshui'

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        this.posts = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.error = 'Không thể tải tin tức. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  getFilteredPosts(): Post[] {
    switch (this.activeTab) {
      case 'featured':
        return this.posts.filter(post => post.post_type === 'featured').slice(0, 4);
      case 'news':
        return this.posts.filter(post => post.post_type === 'news').slice(0, 4);
      case 'fengshui':
        return this.posts.filter(post => post.post_type === 'fengshui').slice(0, 4);
      default:
        return [];
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getPostDate(post: Post): Date {
    return new Date(post.created_at || new Date());
  }
  readMore(postId: number): void {
    this.router.navigate(['/tin-tuc', postId]);
  }

  getExcerpt(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 150) + '...';
  }

  getExcerpt2(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText || '';
    return text.substring(0, 100) + '...';
  }
  viewAllNews(): void {
    this.router.navigate(['/tin-tuc'], {
      queryParams: {
        type: this.activeTab
      }
    });
  }
}
