import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
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
    ProjectByCityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
