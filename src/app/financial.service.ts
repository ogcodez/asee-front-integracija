import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private url = 'http://127.0.0.1:4010/'
  private transactionData: any;
  private formDataSubject = new Subject<any>();
  formData$ = this.formDataSubject.asObservable();



  constructor(
    private http: HttpClient
  ) { }

  // Fetch all transactions
  public getTransactions(): Observable<any> {
    return this.http.get(this.url + 'transactions');
  }

  // Fetch all categories
  public getCategories(): Observable<any> {
    return this.http.get(this.url + 'categories');
  }

  // Set a category for specific transaction
  public setCategory(id: any, body: any): Observable<any> {
    return this.http.post(this.url+"transaction/"+id+"/categorize", body);
  }

  // Split a transaction
  public splitTransaction(id: any, body: any): Observable<any>  {
    return this.http.post(this.url+"transaction/"+id+"/split", body);
  }

  // Method to update and emit the transaction data
  updateTransactionData(transactionData: any) {
    this.transactionData = transactionData;
  }

  // Method to get the transaction data as an observable
  getTransactionData() {
    return this.transactionData;
  }

  sendFormData(formData: any) {
    this.formDataSubject.next(formData);
  }
}
