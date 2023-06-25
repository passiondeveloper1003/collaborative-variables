import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { CampaignComponent } from './components/campaign/campaign.component';
import { CampaignAddComponent } from './components/campaign-add/campaign-add.component';
import { CampaignJoinComponent } from './components/campaign-join/campaign-join.component';

const routes: Routes = [
  { path: 'campaigns/teacher/add', component: CampaignAddComponent },
  { path: 'campaigns/join', component: CampaignJoinComponent },
  { path: 'campaigns/teacher/join', component: CampaignJoinComponent },
  { path: 'campaign/:id', component: CampaignComponent },
  { path: 'campaign/teacher/:id', component: CampaignComponent },
  { path: '**', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
