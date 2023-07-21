import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinancialService } from '../financial.service';
import camelcaseKeys from 'camelcase-keys';

export interface Category {
  code: string;
  parentCode: string;
  name: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  public category: Category[] = [];
  public mainCategory: Category[] = [];
  public subCategory: Category[] = [];
  public chosenCategory?: Category;
  public chosenSubCategory?: Category;
  public splits = 2;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fService: FinancialService
  ) { }


  ngOnInit(): void {
    this.getCategories();
  }

  // Fetch all categories and arrange them in main category array
  private getCategories() {
    this.fService.getCategories().subscribe((object) => {
      this.category = camelcaseKeys(object.items);
      camelcaseKeys(object.items.filter((obj: any) => {
        if (!(obj.code >= 0)) {
          this.mainCategory.push(obj);
        }
      }));
      if (this.data.size >= 1 && this.data[0].catcode) {
        this.getCategory(this.data[0].catcode);
      } else if (this.data.catcode) {
        this.getCategory(this.data.catcode);
      }
      this.onCategorySelected();
      console.log(this.chosenCategory); // Now this should log the correct value.
    });
  }

  public getCategory(catcode: string){
    if(Number(catcode) >= 0){
      this.chosenSubCategory = this.category.find((obj: any) => obj.code.toString() === catcode.toString());
      this.chosenCategory = this.category.find((obj: any) => obj.code.toString() === this.chosenSubCategory?.parentCode.toString());
    }else{
      this.chosenCategory = this.category.find((obj: any) => obj.code.toString() === catcode.toString());
    }
  }

  compareCategories(cat1: Category, cat2: Category): boolean {
    return cat1 && cat2 ? cat1.code === cat2.code : cat1 === cat2;
  }

  // Creates an array of subcategories based on the chosen category
  public onCategorySelected(): void {
    if (this.chosenCategory) {
      this.subCategory = this.category.filter((obj: any) => {
        return obj.parentCode === this.chosenCategory?.code;
      });
    } else {
      this.chosenSubCategory = undefined;
    }
  }

  // Update the category of a transaction(s)
  onSubmit() {
    let newTran;
    let transaction: any;
    if (this.data.size >= 1) {
      transaction = [...this.data];
      transaction.forEach((item: any) => {
        item.catcode = this.chosenSubCategory ? this.chosenSubCategory.code.toString() : this.chosenCategory?.code;
        this.fService.setCategory(item.id, item).subscribe((res) => {
          console.log(res)
        });
        newTran = this.fService.getTransactionData().map((obj: any) => {
          if (obj.id === item.it) {
            return item;
          } else {
            return obj;
          }
        })
        this.fService.updateTransactionData(newTran);
      })
    } else {
      transaction = this.data;
      transaction.catcode = this.chosenSubCategory ? this.chosenSubCategory.code.toString() : this.chosenCategory?.code;
      this.fService.setCategory(transaction.id, transaction).subscribe((res) => {
        console.log(res)
      });
      newTran = this.fService.getTransactionData().map((obj: any) => {
        if (obj.id === transaction.id) {
          return transaction;
        } else {
          return obj;
        }
      })
      this.fService.updateTransactionData(newTran);
    }
    this.dialogRef.close();
  }
}

