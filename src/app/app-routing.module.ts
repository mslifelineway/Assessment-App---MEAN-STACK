import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentDetailsComponent } from './admin/components/assessment-details/assessment-details.component';
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './admin/components/login/login.component';
import { AssessmentListComponent } from './components/assessment-list/assessment-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { NewAssessmentComponent } from './admin/components/new-assessment/new-assessment.component';
import { ShowResultComponent } from './components/show-result/show-result.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent,

  },
  {
    path: "assessments",
    redirectTo: "home",
    pathMatch: "full",

  },
  {
    path: "assessments/:email",
    component: AssessmentListComponent,

  },
  {
    path: "dashboard",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "dashboard/:email/:assessmentId",
    component: DashboardComponent,
  },
  {
    path: "admin/login",
    component: LoginComponent
  },
  {
    path: "admin/dashboard",
    component: AdminDashboardComponent
  },
  {
    path: "assessment/show-details/:assessmentId",
    component: AssessmentDetailsComponent
  },
  {
    path: "admin/assessments/create-new-assessment",
    component: NewAssessmentComponent
  },
  {
    path: "assessments/:email/show-result",
    component: ShowResultComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
