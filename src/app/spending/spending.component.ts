import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexPlotOptions,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import { ChartComponent } from "ng-apexcharts";
import { FinancialService } from '../financial.service';
import camelcaseKeys from 'camelcase-keys';
import { Category } from '../category/category.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart & { events?: any };
  fill: ApexFill;
  legend: ApexLegend;
};

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.css']
})
export class SpendingComponent implements AfterViewInit {
  @ViewChild("chart", { static: false }) chart?: ChartComponent;
  private transactions!: any[];
  public subCategories: any[] = [];
  public showSub?: any[];
  private sortedTran = new Set();
  public category: Category[] = [];
  private cat: any;
  public chartOptions: ChartOptions = {
    series: [
      {
        data: [],
      }
    ],
    fill: {
      colors: [
        "#3B93A5",
        "#F7B844",
        "#ADD8C7",
        "#EC3C65",
        "#CDD7B6",
        "#C1F666",
        "#D43F97",
        "#1E5D8C",
        "#421243",
        "#7F94B0",
        "#EF6537"
      ]
    },
 
    legend: {
      show: false
    },
    chart: {
      height: 350,
      type: "treemap",
      toolbar: {
        show:false
      },
      events: {
        click: (event: any, chartContext: any, config: any) => {
          this.cat = config.globals.initialSeries[parseInt(config.seriesIndex)].name;
          this.showSub = this.subCategories!.filter((obj: any) => {
            return obj.parent === this.cat;
          });

          this.cdr.detectChanges();
        }
      }
    },
  };

  constructor(
    private fService: FinancialService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.transactions = this.fService.getTransactionData();
    this.fService.getCategories().subscribe((object) => {
      this.category = camelcaseKeys(object.items);
      this.transactions.map((item: any) => {
        if (item.catcode) {
          if (Number(item.catcode) >= 0) {
            let subcat = this.category.find((obj) => obj.code.toString() === item.catcode.toString())
            let parentcat = this.category.find((obj) => obj.code.toString() === subcat?.parentCode.toString())
            this.subCategories?.push({
              ...item,
              name: this.getCategory(item.catcode),
              amount: parseFloat(item.amount.replace('€', '')).toFixed(2),
              parent: parentcat?.name
            })
            if (!Array.from(this.sortedTran).some((obj: any) => obj.name === parentcat?.name)) {
              this.sortedTran.add({
                name: parentcat?.name,
                amount: parseFloat(item.amount.replace('€', ''))
              })
            } else {
              const myArray = Array.from(this.sortedTran);
              myArray.forEach((obj: any) => {
                if (obj.name === parentcat?.name) {
                  obj.amount += parseFloat(item.amount.replace('€', ''))
                }
              });
              this.sortedTran.clear();
              myArray.forEach((obj) => this.sortedTran.add(obj));
            }
          } else {
            let cat = this.category.find((obj) => obj.code.toString() === item.catcode.toString())
            this.subCategories?.push({
              ...item,
              name: this.getCategory(item.catcode),
              amount: parseFloat(item.amount.replace('€', '')).toFixed(2),
              parent: cat?.name
            })
            if (!Array.from(this.sortedTran).some((obj: any) => obj.name === cat?.name)) {
              this.sortedTran.add({
                name: cat?.name,
                amount: parseFloat(item.amount.replace('€', ''))
              })
            }
            else {
              const myArray = Array.from(this.sortedTran);
              myArray.forEach((obj: any) => {
                if (obj.name === cat?.name) {
                  obj.amount += parseFloat(item.amount.replace('€', ''))
                }
              });
              this.sortedTran.clear();
              myArray.forEach((obj) => this.sortedTran.add(obj));
            }
          }
        }
      })
      const myArray = Array.from(this.sortedTran);
      this.chartOptions.series = myArray.map((obj: any, index: number) => {
        return {
          name: obj.name,
          data: [{ x: obj.name, y: Number(obj.amount).toFixed(2) }],
        };
      });
    });
  }

  public getCategory(catcode: string) {
    if (this.category && this.category.length > 0) {
      let x;
      x = this.category.find((item: any) => item.code.toString() === catcode);
      if (x) {
        return x.name;
      }
    }
    return 'No category';
  }

}
