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
import { PropertyConsignmentComponent } from './pages/property-consignment/property-consignment.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'chi-tiet/:slug', component: DetailComponent},
  {path: 'gioi-thieu', component: AboutComponent},
  {path: 'tin-tuc', component: NewsComponent},
  {path: 'tin-tuc/:id', component: PostDetailComponent},
  {path: 'san-pham', component: ProductsComponent},
  {path: 'san-pham/:slug', component: DetailComponent},
  {path: 'tim-kiem', component: SearchResultsComponent},
  {path: 'lien-he', component: ContactFormComponent},
  {path: 'ky-gui-bat-dong-san', component: PropertyConsignmentComponent},
  // Redirect old routes to new Vietnamese routes for backward compatibility
  {path: 'detail/:slug', redirectTo: 'chi-tiet/:slug', pathMatch: 'full'},
  {path: 'about', redirectTo: 'gioi-thieu', pathMatch: 'full'},
  {path: 'news', redirectTo: 'tin-tuc', pathMatch: 'full'},
  {path: 'news/:id', redirectTo: 'tin-tuc/:id', pathMatch: 'full'},
  {path: 'products', redirectTo: 'san-pham', pathMatch: 'full'},
  {path: 'products/:slug', redirectTo: 'san-pham/:slug', pathMatch: 'full'},
  {path: 'search', redirectTo: 'tim-kiem', pathMatch: 'full'},
  {path: 'contact', redirectTo: 'lien-he', pathMatch: 'full'},
  {path: 'property-consignment', redirectTo: 'ky-gui-bat-dong-san', pathMatch: 'full'},
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
