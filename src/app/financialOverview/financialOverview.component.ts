import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../financial.service';
import camelcaseKeys from 'camelcase-keys';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SplitComponent } from '../split/split.component';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';



@Component({
  selector: 'app-table',
  templateUrl: './financialOverview.component.html',
  styleUrls: ['./financialOverview.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class FinancialOverviewComponent implements OnInit {
  public transactions: any;
  public visableTransactions: any;
  public multiple = false;
  public categories: any;
  public multipleTransactions = new Set();

  constructor(
    private fService: FinancialService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetch();
  }

  // Fetch all transactions(add a property CHECKED, CATCODE and SPLIT), categories
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
      this.visableTransactions = this.fService.getTransactionData();
    });
    this.fService.getCategories().subscribe((data) => {
      this.categories = camelcaseKeys(data.items);
    })
  }

  open(){

  }

  // Show all transactions
  public all() {
    this.visableTransactions = this.transactions;
  }

  // Show deposit transactions
  public incoming() {
    this.visableTransactions = this.transactions.filter((obj: any) => {
      return obj.kind === "dep";
    });
  }

  // Show payment transactions
  public outgoing() {
    this.visableTransactions = this.transactions.filter((obj: any) => {
      return obj.kind === "pmt";
    });
  }

  // Sort by date
  public sortDate() {
    this.visableTransactions.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
  }

  // Sort by category
  public sortCategory() {
    this.visableTransactions.sort((a: any, b: any) => {
      const codeA = a.catcode ? a.catcode.toString() : '';
      const codeB = b.catcode ? b.catcode.toString() : '';

      const categoryA = this.getCategory(codeA) || '';
      const categoryB = this.getCategory(codeB) || '';

      if (categoryA === 'No category' && categoryB !== 'No category') {
        return 1; // Move "No category" transactions to the end
      } else if (categoryA !== 'No category' && categoryB === 'No category') {
        return -1; // Move "No category" transactions to the end
      } else {
        return categoryA.localeCompare(categoryB);
      }
    });
  }



  // Add / Remove transaction from a SET
  public select(tran: any) {
    if (this.multipleTransactions.has(tran)) {
      this.multipleTransactions.delete(tran);
    } else {
      this.multipleTransactions.add(tran);
    }
  }

  // Show checkbox on transaction allowing to group in SET 
  public showCheckbox() {
    this.multiple = !this.multiple;
    this.visableTransactions.forEach((item: any) => {
      item.checked = false;
    })
    this.multipleTransactions.clear();
  }

  public getCategory(catcode: string): string | undefined {
    if (this.categories && this.categories.length > 0) {
      let category;
      if (Number(catcode) >= 0) {
        let sub = this.categories.find((item: any) => item.code.toString() === catcode);
        let cat = this.categories.find((item: any) => item.code.toString() === sub?.parentCode);
        if (cat && sub) {
          category = { name: `${cat.name}  > ${sub.name}` };
        }
      } else {
        category = this.categories.find((item: any) => item.code.toString() === catcode);
      }
      if (category) {
        return category.name;
      }
    }
    return 'No category';
  }

  // Open window for choosing / changing transaction category
  public changeCategory(tran: any) {
    tran.splitBol = false;
    this.dialog.open(DialogComponent, {
      width: '550px',
      height: 'auto',
      data: tran
    });
  }

  // Open window for spliting transaction
  public split(tran: any) {
    tran.splitBol = true;
    this.dialog.open(SplitComponent, {
      width: '550px',
      height: 'auto',
      data: tran
    });
  }
}
