import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FinancialService } from '../financial.service';
import camelcaseKeys from 'camelcase-keys';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SplitComponent } from '../split/split.component';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-table',
  templateUrl: './financialOverview.component.html',
  styleUrls: ['./financialOverview.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class FinancialOverviewComponent implements OnInit {
  public visableTransactions: any;
  public multiple = false;
  public categories: any;
  public multipleTransactions = new Set();
  public dateChange = false;


  constructor(
    private fService: FinancialService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetch();
    this.fService.getDateChange().subscribe(() => {
      this.visableTransactions = this.fService.getVisableTransactions();
    });
  }


  // Fetch all transactions(add a property CHECKED, CATCODE and SPLIT), categories
  public fetch() {
    this.fService.getCategories().subscribe((data) => {
      this.visableTransactions = this.fService.getVisableTransactions();
      this.categories = camelcaseKeys(data.items);
    })
  }

  // Show all transactions
  public all() {
    if (this.fService.getFromDate()?.getTime() != undefined && this.fService.getToDate()?.getTime() != undefined) {
      this.visableTransactions = this.fService.getVisableTransactions().filter((obj: any) => {
        return new Date(obj.date).getTime() >= this.fService.getFromDate()!.getTime() && new Date(obj.date).getTime() <= this.fService.getToDate()!.getTime();
      });
    } else {
      this.visableTransactions = this.fService.getVisableTransactions();
    }
    
  }

  // Show deposit transactions
  public incoming() {
    this.visableTransactions = this.fService.getVisableTransactions().filter((obj: any) => {
      if (this.fService.getFromDate()?.getTime() != undefined && this.fService.getToDate()?.getTime() != undefined) {
        return obj.kind === "dep" && new Date(obj.date).getTime() >= this.fService.getFromDate()!.getTime() && new Date(obj.date).getTime() <= this.fService.getToDate()!.getTime();
      }
      else {
        return obj.kind === "dep"
      }
    });
  }

  // Show payment transactions
  public outgoing() {
    this.visableTransactions = this.fService.getVisableTransactions().filter((obj: any) => {
      if (this.fService.getFromDate()?.getTime() != undefined && this.fService.getToDate()?.getTime() != undefined) {
        return obj.kind === "pmt" && new Date(obj.date).getTime() >= this.fService.getFromDate()!.getTime() && new Date(obj.date).getTime() <= this.fService.getToDate()!.getTime();
      } else {
        return obj.kind === "pmt"
      }
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
