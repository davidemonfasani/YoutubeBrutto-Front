import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { VideoComponent } from './pages/video/video.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AppbarComponent } from './components/appbar/appbar.component';
import { VideocontainerComponent } from './components/videocontainer/videocontainer.component';
import { CommentoComponent } from './components/commento/commento.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HistoryComponent } from './pages/history/history.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    VideoComponent,
    ProfileComponent,
    RegisterComponent,
    AppbarComponent,
    VideocontainerComponent,
    CommentoComponent,
    SidebarComponent,
    HistoryComponent,
    LoginComponent,
    SubscriptionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
