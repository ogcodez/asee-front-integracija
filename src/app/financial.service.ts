import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private url = 'http://127.0.0.1:4010/'
  private dateChange = new BehaviorSubject<any>(Boolean);
  private transactionData: any[] = [];  
  private visableTransactions: any[] = [];  
  private fromDate?: Date;
  private toDate?: Date;



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

  // Method to get the transaction data as an observable
  getTransactionData() {
    return this.transactionData;
  }
  public getDateChange(): Observable<any[]> {
    return this.dateChange.asObservable();
  }

  public updateTransactionData(data: any[]) {
    this.transactionData = data;
  }

  public getVisableTransactions(){
    return this.visableTransactions;
  }

  public setVisableTransactions(data: any[]){
    this.visableTransactions = data;
  }

  setFromDate(date: Date | undefined) {
    this.fromDate = date;
  }

  getFromDate() {
    return this.fromDate;
  }

  setToDate(date: Date | undefined) {
    this.toDate = date;
    this.dateChange.next(true);
  }

  getToDate() {
    return this.toDate;
  }
}
