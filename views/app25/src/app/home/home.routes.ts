import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectdetailsComponent } from './projectdetails/projectdetails.component';
import { ProjectsettingsComponent } from './projectsettings/projectsettings.component';
import { SlumphistoryComponent } from './slumphistory/slumphistory.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProjectdashboardComponent } from './projectdashboard/projectdashboard.component';

// import { AuthGuard } from '../_guards';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingComponent},
      { path: 'notifications', component: NotificationsComponent},
      { path: 'projects', component: ProjectsComponent},
      { path: 'projects/:idproject', component: ProjectdetailsComponent},
      { path: 'projects/:idproject/settings', component: ProjectsettingsComponent},
      { path: 'projects/:idproject/slumphistory', component: SlumphistoryComponent},
      { path: 'projects/:idproject/dashboard', component: ProjectdashboardComponent}
    ]
  }
];