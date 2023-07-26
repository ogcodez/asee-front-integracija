import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinancialService } from '../financial.service';
import camelcaseKeys from 'camelcase-keys';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../category/category.component';

@Component({
  selector: 'app-split',
  templateUrl: './split.component.html',
  styleUrls: ['./split.component.css']
})
export class SplitComponent {

  public category: Category[] = [];
  public mainCategory: Category[] = [];
  public subCategory: Category[] = [];
  public splits: any[] = [{}, {}];
  splitForms: FormGroup[] = [];


  constructor(
    public dialogRef: MatDialogRef<SplitComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fService: FinancialService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.getCategories();
    this.splits.forEach((split) => {
      this.createForm(split);
    });
  }

  createForm(split: any) {
    const formGroup = this.formBuilder.group({
      chosenCategory: [split.chosenCategory, Validators.required],
      chosenSubCategory: [split.chosenSubCategory],
      amount: [split.amount, Validators.required]
    });

    this.splitForms.push(formGroup);
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
    })
  }

  validateForm() {
    this.splitForms.forEach((obj: any) => {
      if (obj.invalid) {
        return false
      } else {
        return true
      }
    })
  }

  // Creates an array of subcategories based on the chosen category
  public onCategorySelected(split: any): void {
    if (split.chosenCategory) {
      split.subCategory = this.category.filter((obj: any) => {
        return obj.parentCode === split.chosenCategory?.code;
      });
    } else {
      split.chosenSubCategory = undefined;
    }
  }

  // Add a split window
  public addSplit() {
    const newSplit = {
      chosenCategory: undefined,
      chosenSubCategory: undefined,
      amount: undefined
    };
    this.splits.push(newSplit);
    this.createForm(newSplit);
  }

  // Remove a split window
  public removeSplit() {
    this.splits.pop();
    if (this.splits.length < 2) {
      this.splits.push({});
    }
  }

  // Update the splits of a transaction
  public onSubmit() {
    let transaction = this.data;
    let total: number = 0; // Initialize total to 0
    let bol = true;

    this.splits.forEach((split) => {
      total += parseFloat(split.amount); // Convert split.amount to a number and add it to total
      if (split.chosenCategory === undefined) {
        bol = false;
      }
    });

    if (parseFloat(transaction.amount) === total && bol) {
      transaction.splits = this.splits.map(({ amount, chosenCategory, chosenSubCategory }) => {
        const splits = {
          amount,
          catcode: chosenSubCategory ? chosenSubCategory.code : chosenCategory ? chosenCategory.code : null,
        };
        return splits;
      });

      let newTran = this.fService.getTransactionData().map((obj: any) => {
        if (obj.id === transaction.id) {
          return transaction;
        } else {
          return obj;
        }
      });

      this.fService.updateTransactionData(newTran);
      this.fService.setVisableTransactions(newTran);
      this.fService.splitTransaction(transaction.id,transaction).subscribe((res)=>{
        console.log(res)
      })
      this.dialogRef.close();
    } else if (!bol) {
      this._snackBar.open('Choose categories for split amounts', 'okay');
      this.splitForms.forEach((formGroup) => {
          const control = formGroup.get('chosenCategory');
          control?.setErrors({ notChosen: true });
          control?.markAsTouched();
      });
    } else {
      this._snackBar.open('Sum of split amounts is not equal to the total amount', 'okay');
      this.splitForms.forEach((formGroup) => {
        const amountControl = formGroup.get('amount');
        amountControl?.setErrors({ notEqual: true });
        amountControl?.markAsTouched();
      });
      }
  }


}

