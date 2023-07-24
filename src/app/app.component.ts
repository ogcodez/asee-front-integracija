import { Component, OnInit } from '@angular/core';
import { FinancialService } from './financial.service';
import camelcaseKeys from 'camelcase-keys';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public transactions: any;

constructor(
  private fService: FinancialService
){}

ngOnInit(){
  this.fetch();
}
  public fetch() {
    this.fService.getTransactions().subscribe((object) => {
      this.transactions = camelcaseKeys(object.items.map((obj: any) => ({
        ...obj,
        checked: false,
        catcode: '',
        splitBol: false,
        split: [{
          amount: '',
          catcode: ''
        }]
      })));
      this.fService.updateTransactionData(this.transactions);
      this.fService.setVisableTransactions(this.transactions)
    });
  }
}
