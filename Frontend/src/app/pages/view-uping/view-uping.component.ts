import { UpingService } from 'src/app/services/uping.service';
import { Component, OnInit } from '@angular/core';
import { Uping, UpingPaperSize } from 'src/app/Model/Uping';
import { PaperSize } from 'src/app/Model/PressMachine';
import { PaperSizeService } from 'src/app/services/paper-size.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductField } from 'src/app/Model/ProductField';
export interface Units {
  name: string | null | undefined;
}
export interface Labels {
  name: string | null | undefined;
}
@Component({
  selector: 'app-view-uping',
  templateUrl: './view-uping.component.html',
  styleUrls: ['./view-uping.component.css']
})
export class ViewUpingComponent implements OnInit {
  upingList: Uping[] = [];
  paperSizeList: PaperSize[] = [];
  categoryList: ProductField | undefined | null;
  units: Units[] = [];
  labels: Labels[] = [];
  selectedLabels: string[] = [];
  permissionList: { name: string }[] = [];
  isLoading: boolean = false;
  constructor(
    private productFieldService: ProductDefinitionService,
    private errorHandleService: ErrorHandleService,
    private paperSizeService: PaperSizeService,
    private upingService: UpingService,
  ) { }
  ngOnInit(): void {
    this.getAllCategory('CATEGORY');
    this.getAllPaperSizeLabels();
    this.getUpingList();

    this.units = [{
      name: 'MM'
    }, {
      name: 'Inch'
    }];

    this.labels = [{
      name: "Category"
    }, {
      name: "Name"
    }, {
      name: "Dimension"
    }];

    if (this.labels) {
      this.selectedLabels = this.labels.map(label => label.name!);
      this.permissions(this.selectedLabels);
    }
  }

  private getUpingList(): void {
    this.upingService.getUping().subscribe(
      res => {
        this.upingList = res as Uping[];
      }, (err: BackendErrorResponse) => {
        this.errorHandleService.showError(err.error.error);
      });
  }
  private getAllPaperSizeLabels() {
    this.paperSizeService.getPaperSize().subscribe(
      res => {
        this.paperSizeList = res as PaperSize[];
      }, (err: BackendErrorResponse) => {
        this.errorHandleService.showError(err.error.error);
      });
  }
  private getAllCategory(fieldName: string) {
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {

        this.categoryList = res[0];
      }, (err: BackendErrorResponse) => {
        this.errorHandleService.showError(err.error.error);
      });
  }
  async onCategoryChange(value: string[]) {
    if (value.length > 0) {
      this.upingList = [];
      for (const item of value) {
        try {
          const response = await this.upingService.searchUpingByCategory(item).toPromise();
          this.upingList = this.upingList.concat(response as Uping[]);
        } catch (error: any) {
          this.errorHandleService.showError(error.error.error);
        }
      }
    } else {
      this.getUpingList();
    }
  }


  checkLabelThenPutValue(paper: UpingPaperSize[]): number[] {
    const values: number[] = [];
    this.paperSizeList.forEach(item => {
      const matchingPaper = paper.find((paperItem: UpingPaperSize) => paperItem.paperSize.label === item.label);
      if (matchingPaper) {
        values.push(matchingPaper.value);
      } else {
        values.push(0);
      }
    });
    return values;
  }

  permissions(selectedValues: string[]) {

    this.selectedLabels = selectedValues;
  }

  get numberOfColumns(): number {
    return this.paperSizeList?.length + 1;
  }
}
