import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialOverviewComponent } from './financialOverview/financialOverview.component';

const routes: Routes = [
  {
    path: "",
    component: FinancialOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
