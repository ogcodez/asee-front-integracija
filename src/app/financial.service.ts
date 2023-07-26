import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private url = 'http://localhost:5161/'
  private dateChange = new BehaviorSubject<any>(Boolean);
  private transactionData: any[] = [];  
  private visableTransactions: any[] = [];  
  private fromDate?: Date;
  private toDate?: Date;



  constructor(
    private http: HttpClient
  ) { }

  public getSpending(catcode: any){
    return this.http.get(this.url)
  }

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
    return this.http.post(this.url+"transactions/"+id+"categorize", body);
  }

  // Split a transaction
  public splitTransaction(id: any, body: any): Observable<any>  {
    return this.http.post(this.url+"transactions/"+id+"/split", body);
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

  formatDateToUrl(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is 0-indexed, so we add 1 to get the correct month number
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public filterDate(startDate: Date, endDate: Date): Observable<any>{
    const formattedStartDate = this.formatDateToUrl(startDate);
    const formattedEndDate = this.formatDateToUrl(endDate);
    const encodedStartDate = encodeURIComponent(formattedStartDate!);
    const encodedEndDate = encodeURIComponent(formattedEndDate!);
    return this.http.get(this.url + `transactions?start-date=${encodedStartDate}&end-date=${encodedEndDate}`);
  }
}


