import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialOverviewComponent } from './financialOverview/financialOverview.component';
import { SpendingComponent } from './spending/spending.component';

const routes: Routes = [
  {
    path: "",
    component: FinancialOverviewComponent
  },
  {
    path: "spending",
    component: SpendingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
