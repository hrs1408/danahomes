import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactButtonsComponent } from './components/contact-buttons/contact-buttons.component';
import { FilterHomeComponent } from './components/filter-home/filter-home.component';
import { HttpClientModule } from '@angular/common/http';
import { PopularComponent } from './components/popular/popular.component';
import { register } from 'swiper/element/bundle';
import { LeaseComponent } from './components/lease/lease.component';
import { ProjectByCityComponent } from './components/project-by-city/project-by-city.component';
import { AboutComponent } from './pages/about/about.component';
import { NewsComponent } from './pages/news/news.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { ProductsComponent } from './pages/products/products.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LoanCalculatorComponent } from './components/loan-calculator/loan-calculator.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SaleComponent } from './components/sale/sale.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { FeaturedNewsComponent } from './components/featured-news/featured-news.component';
import { FeaturesComponent } from './components/features/features.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactModalComponent } from './components/contact-modal/contact-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SafeHtmlComponent } from './components/safe-html/safe-html.component';
// Register Swiper custom elements
register();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent,
    HeaderComponent,
    FooterComponent,
    ContactButtonsComponent,
    FilterHomeComponent,
    PopularComponent,
    LeaseComponent,
    ProjectByCityComponent,
    AboutComponent,
    NewsComponent,
    PostDetailComponent,
    ProductsComponent,
    LoanCalculatorComponent,
    SearchResultsComponent,
    SaleComponent,
    CompanyInfoComponent,
    FeaturedNewsComponent,
    FeaturesComponent,
    LoadingOverlayComponent,
    ContactFormComponent,
    ContactModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    FormsModule,
    NgbModule,
    SafeHtmlComponent
  ],
  providers: [
    provideClientHydration(),
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
