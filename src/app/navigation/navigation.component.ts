import { Component, EventEmitter, Output } from '@angular/core';
import { FinancialService } from '../financial.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FinancialOverviewComponent } from '../financialOverview/financialOverview.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  dateForm = new FormGroup({
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
  });
  @Output() resetTrans = new EventEmitter<void>();

  constructor(
    private fService: FinancialService,
  ) { }
  filterData() {
    this.fService.setFromDate(this.dateForm.controls.fromDate.value!)
    this.fService.setToDate(this.dateForm.controls.toDate.value!)
    let data = this.fService.getVisableTransactions().filter((obj: any) =>
      new Date(obj.date).getTime() >= this.fService.getFromDate()!.getTime() && new Date(obj.date).getTime() <= this.fService.getToDate()!.getTime()
    );
    this.fService.setVisableTransactions(data)
    this.resetTrans.emit();
  }
  reset() {
    this.fService.setFromDate(undefined)
    this.fService.setToDate(undefined)
    this.fService.setVisableTransactions(
      this.fService.getTransactionData()
    );
    this.resetTrans.emit();
  }
}
