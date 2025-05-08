import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post } from '../../services/post.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  providers: [DatePipe]
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(parseInt(id, 10));
    }
  }

  private loadPost(id: number): void {
    this.loading = true;
    this.postService.getPostById(id).subscribe({
      next: (response) => {
        this.post = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.error = 'Không thể tải bài viết. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  getSafeHtml(content?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content ?? '');
  }

  getPostDate(date?: string): Date {
    return new Date(date || '');
  }
}
