import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { LoginComponent } from './admin/components/login/login.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { AssessmentDetailsComponent } from './admin/components/assessment-details/assessment-details.component';
import { NewAssessmentComponent } from './admin/components/new-assessment/new-assessment.component';
import { FormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { HttpClientModule } from '@angular/common/http';
import { ShowResultComponent } from './components/show-result/show-result.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    AssessmentListComponent,
    LoginComponent,
    AdminDashboardComponent,
    AssessmentDetailsComponent,
    NewAssessmentComponent,
    ShowResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    UiSwitchModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
