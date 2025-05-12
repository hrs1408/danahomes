import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { AboutComponent } from './pages/about/about.component';
import { NewsComponent } from './pages/news/news.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { ProductsComponent } from './pages/products/products.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'detail/:id', component: DetailComponent},
  {path: 'about', component: AboutComponent},
  {path: 'news', component: NewsComponent},
  {path: 'news/:id', component: PostDetailComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'products/:id', component: DetailComponent},
  {path: 'search', component: SearchResultsComponent},
  {path: 'contact', component: ContactFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ]
})
export class AppRoutingModule { }
