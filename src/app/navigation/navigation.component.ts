import { Component, EventEmitter, Output } from '@angular/core';
import { FinancialService } from '../financial.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FinancialOverviewComponent } from '../financialOverview/financialOverview.component';
import camelcaseKeys from 'camelcase-keys';

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
    let startDate = this.dateForm.controls.fromDate.value!
    let endDate = this.dateForm.controls.toDate.value!
    this.fService.filterDate(startDate, endDate).subscribe((obj) => {
      this.fService.setVisableTransactions(camelcaseKeys(obj.items))
      this.resetTrans.emit();
    }

    );

  }
  reset() {
    this.fService.setVisableTransactions(
      this.fService.getTransactionData()
    );
    this.resetTrans.emit();
  }
}
