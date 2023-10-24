import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { CtpService } from 'src/app/services/ctp.service';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { NgZone } from '@angular/core';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { UpingService } from 'src/app/services/uping.service';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-add-product-rule',
  templateUrl: './add-product-rule.component.html',
  styleUrls: ['./add-product-rule.component.css'],
})
export class AddProductRuleComponent implements OnInit {
  productName: string = ''
  paperStock: any
  vendor: any
  brand: any
  madeIn: any
  dimensions: any
  gsm: any
  containers: Container[] = [];
  pressVendor: any
  press: any
  plateVendor: any
  plates: any
  productRule: any
  paperMarketArray: any = [];
  tableData: any[] = new Array(this.containers.length);
  filteredPapers: any;
  productProcessArray: any[] = [];
  vendorArray: any;
  vendorIndex: any;
  vendorValue: any;
  idFromQueryParam!: number
  pressMachineToUpdate: any;
  pressMachineArray: any = [];
  ctpArray: any = [];
  ctpVendors: any = [];
  buttonName: any;
  dimensionArray: any[] | undefined;
  selectedVendor: any;
  uppingArray: any
  upping: any
  qtyArray: any
  qty: any
  categoryArray: any;
  category: any;
  sideOptions: any;
  sideValue: any;
  frontColors: any;
  jobFront: any;
  backColors: any;
  jobBack: any;
  imposition: any;
  backNotApplied: boolean = false;
  impositionValue: boolean = true;
  valid: string = 'Valid';
  invalid: string = 'Please fill out this field.';
  disabled: boolean = false;

  constructor(
    private productRuleService: ProductRuleService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private pressMachine: PressMachineService,
    private ctpService: CtpService,
    private productField: ProductDefinitionService,
    private getUpping: UpingService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPressMachine(null);
    this.getCtp(null);
    this.getProductField();
    this.productRuleService.getProductRule('paper', null).subscribe((productRule: any) => {
      let paper = productRule.map((p: any) => {
        return {
          name: p
        };
      });
      this.addContainer(paper);
    }, err => {
      console.log(err);
    });

    this.route.queryParams.subscribe(param => {
      this.idFromQueryParam = +param['id'];
      if (Number.isNaN(this.idFromQueryParam)) {
        this.buttonName = 'Add';
      } else {
        this.productRuleService.getProductRuleById(this.idFromQueryParam).subscribe((res: any) => {
          this.productName = res?.title;
          this.category = this.categoryArray?.productFieldValuesList.find((el: any) => el.name.toLowerCase() === res?.category.toLowerCase());
          this.onCategoryChange(this.category)
          this.sideValue = this.sideOptions.productFieldValuesList.find((option: any) => option.name === res?.printSide)
          this.onChangeSide(this.sideValue)
          this.buttonName = 'Update';
          const observables = [];
          const sizeArray = JSON.parse(res?.size);
          const qtyArray = JSON.parse(res?.quantity);
          const frontColors = JSON.parse(res?.jobColorFront);
          const backColors = res?.jobColorBack ? JSON.parse(res?.jobColorBack) : null;
          for (let i = 0; i < res?.productRulePaperStockList.length; i++) {
            observables.push(this.getVendors(i, { name: res?.productRulePaperStockList[i].paperStock }));
            observables.push(this.getBrands(i, res?.productRulePaperStockList[i].vendor));
            observables.push(this.getMadeIn(i, { name: res?.productRulePaperStockList[i].brand }));
            observables.push(this.getDimensions(i, { name: res?.productRulePaperStockList[i].madeIn }));
            observables.push(this.getGsm(i, { name: res?.productRulePaperStockList[i].dimension }));
            for (let index = 0; index < res?.productRulePaperStockList.length; index++) {
              this.addContainer()
              break
            }
            forkJoin(observables).subscribe(
              (responses: any[]) => {

                let vendor = this.containers[i]?.allVendor.find((el: any) => el.id === res?.productRulePaperStockList[i].vendor.id);
                const gsmArray = JSON.parse(res?.productRulePaperStockList[i].gsm);
                const gsmMatches = this.containers[i].allGsm.filter((gsm: any) => gsmArray.includes(gsm.name));
                this.containers[i].vendor = vendor;
                this.containers[i].gsm = gsmMatches;

                this.upping = this.uppingArray?.filter((el: any) => sizeArray.includes(el.productSize));
                this.qty = this.qtyArray?.productFieldValuesList.filter((el: any) => qtyArray.includes(el.name));

                this.press = this.pressMachineArray.find((el: any) => {
                  const machine = el.machines.find((machine: any) => machine.id === res?.pressMachine.id);
                  return machine;
                })
                this.ctpArray = [res?.pressMachine.vendor]
                this.pressVendor = res?.pressMachine.vendor
                this.dimensionArray = [{ name: res?.ctp.plateDimension }]
                this.plates = { name: res?.ctp.plateDimension }
                this.ctpVendors = [res?.ctp]
                this.plateVendor = res?.ctp

                this.jobFront = this.frontColors.productFieldValuesList.filter((fColors: any) => frontColors.includes(fColors.name));
                this.jobBack = this.backColors.productFieldValuesList.filter((bColors: any) => backColors ? backColors.includes(bColors.name) : null);
                this.impositionValue = res?.impositionValue;
              },
              (err) => {
                console.log(err);
              }
            );
          }
          if (this.containers.length > 0) {
            this.containers.pop();
          }
        });
      }
    });
  }

  changePaper(i: any, value: any) {
    this.containers[i].paper = value;
    this.cd.detectChanges();
    this.filteredPapers = this.containers[i].allPaper.filter((papers: any) => {
      return papers.name != value.name;
    });


    if (i < this.containers.length - 1) {
      for (let index = i + 1; index < this.containers.length; index++) {
        this.pop();
      }
    }

    this.productRuleService.getProductRule('vendor', { paperStock: value.name }).subscribe((v: any) => {
      let vendors = v.map((vend: any) => {
        return {
          name: vend.name,
          id: vend.id
        }
      });
      this.containers[i].allVendor = vendors;

    }, err => {

    });
  }


  changeVendor(i: any, value: any) {
    this.containers[i].vendor = value;
    this.productRuleService.getProductRule('brand',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id }
      }).subscribe((b: any) => {
        const brands = b.map((brand: any) => {
          return {
            name: brand
          }
        });
        this.containers[i].allBrand = brands;
      }, err => {
        console.log(err);
      });
  }

  changeBrand(i: any, value: any) {
    console.log('changeBrand function called with index', i, 'and value', value);

    this.containers[i].brand = value;
    this.productRuleService.getProductRule('madein',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name
      }).subscribe((m: any) => {
        const madeIn = m.map((made: any) => {
          return {
            name: made
          }
        });
        this.containers[i].allMadeIn = madeIn;
      }, err => {
        console.log(err);
      });
  }

  changeMadeIn(i: any, value: any) {

    this.containers[i].madeIn = value;
    this.productRuleService.getProductRule('dimension',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name
      }).subscribe((d: any) => {
        const dimensions = d.map((dimen: any) => {

          return {
            name: dimen
          }
        });
        this.containers[i].allDimension = dimensions;
      }, err => {
        console.log(err);
      });
  }

  changeDimension(i: any, value: any) {

    this.containers[i].allGsm = null;
    this.containers[i].gsm = null;
    this.containers[i].dimension = value;
    this.productRuleService.getProductRule('gsm',
      {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name,
        dimension: this.containers[i].dimension.name
      }).subscribe((g: any) => {
        const gsm = g.map((gs: any) => {

          return {
            name: gs
          }
        });
        this.containers[i].allGsm = gsm;
      }, err => {
        console.log(err);
      });
  }


  addContainer(paper?: any) {
    if (this.containers.length === 0) {
      let newContainer: Container = {
        allPaper: paper,
        paper: null,
        vendor: null,
        brand: null,
        madeIn: null,
        dimension: null,
        gsm: null
      };
      this.containers.push(newContainer);
    } else {

      let newContainer: Container = {
        allPaper: this.filteredPapers ? this.filteredPapers : this.containers[0].allPaper,
        paper: null,
        vendor: null,
        brand: null,
        madeIn: null,
        dimension: null,
        gsm: null
      };
      this.containers.push(newContainer);
    }
  }

  getVendors(i: any, value: any): Observable<any> {

    return new Observable((observer) => {

      this.containers[i].paper = value;
      this.filteredPapers = this.containers[i]?.allPaper?.filter((papers: any) => {
        return papers.name != value.name;
      });

      // if (i < this.containers.length - 1) {
      //   for (let index = i + 1; index <= this.containers.length; index++) {
      //     this.pop();
      //   }
      // }

      this.productRuleService.getProductRule('vendor', { paperStock: value.name }).subscribe(
        (v: any) => {

          let vendors = v.map((vend: any) => {

            return {
              name: vend.name,
              id: vend.id
            };
          });
          this.containers[i].allVendor = vendors;
          observer.next(vendors);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  getBrands(i: any, value: any): Observable<any> {
    return new Observable((observer) => {

      this.containers[i].vendor = value;
      this.productRuleService.getProductRule('brand', {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id }
      }).subscribe(
        (b: any) => {

          const brands = b.map((brand: any) => {
            return {
              name: brand
            };
          });
          this.containers[i].allBrand = brands;
          observer.next(brands);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  getMadeIn(i: any, value: any): Observable<any> {
    return new Observable((observer) => {
      this.containers[i].brand = value;
      this.productRuleService.getProductRule('madein', {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name
      }).subscribe(
        (m: any) => {

          const madeIn = m.map((made: any) => {
            return {
              name: made
            };
          });
          this.containers[i].allMadeIn = madeIn;
          observer.next(madeIn);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  getDimensions(i: any, value: any): Observable<any> {
    return new Observable((observer) => {
      this.containers[i].madeIn = value;
      this.productRuleService.getProductRule('dimension', {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name
      }).subscribe(
        (d: any) => {

          const dimensions = d.map((dimen: any) => {
            return {
              name: dimen
            };
          });
          this.containers[i].allDimension = dimensions;
          observer.next(dimensions);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  getGsm(i: any, value: any): Observable<any> {
    return new Observable((observer) => {
      this.containers[i].dimension = value;
      this.productRuleService.getProductRule('gsm', {
        paperStock: this.containers[i].paper.name,
        vendor: { id: this.containers[i].vendor.id },
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name,
        dimension: this.containers[i].dimension.name
      }).subscribe(
        (g: any) => {

          const gsm = g.map((gs: any) => {
            return {
              name: gs
            };
          });
          this.containers[i].allGsm = gsm;
          observer.next(gsm);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  pop() {

    this.containers.pop();
  }

  deleteContainer(index: any) {
    this.containers.splice(index, 1);
  }
  go(i: any) {

    if (i >= 0 && i < this.containers.length) {
      let obj = {
        paperStock: this.containers[i].paper.name,
        vendorId: this.containers[i].vendor.id,
        brand: this.containers[i].brand.name,
        madeIn: this.containers[i].madeIn.name,
        dimension: this.containers[i].dimension.name,
        gsm: this.containers[i].gsm.map((gsm: any) => parseInt(gsm.name, 10))
      }

      this.productRuleService.queryProductRule(obj).subscribe(res => {
        console.log(res);
        this.tableData[i] = res
        this.tableData[i].forEach((el: any) => {

          const dateArray = el.timeStamp;
          el.timeStamp = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
          el.timeStamp = this.datePipe.transform(el.timeStamp, 'EEEE, MMMM d, yyyy, h:mm a');
        });
      }, error => {
        console.log(error);
      })
    }
  }

  getPressMachine(value: any) {
    this.pressMachine.getPressMachine().subscribe(res => {
      this.pressMachineArray = res;
      const pressNameToMachines: { [key: string]: any[] } = {};
      for (const pressMachine of this.pressMachineArray) {
        const pressName = pressMachine.name;

        if (!pressNameToMachines[pressName]) {
          pressNameToMachines[pressName] = [];
        }
        pressNameToMachines[pressName].push(pressMachine);
      }
      const pressNameToMachinesArray = Object.keys(pressNameToMachines).map(key => ({ name: key, machines: pressNameToMachines[key] }));
      this.pressMachineArray = pressNameToMachinesArray
      const machinesForSelectedPress = pressNameToMachinesArray.find(item =>
        item.machines.some(machine => value?.machines.some((selectedMachine: any) => selectedMachine.id === machine.id))
      );
      const selectedMachines = machinesForSelectedPress?.machines;
      const vendors = selectedMachines?.map(machine => machine.vendor);
      this.ctpArray = vendors;
      const dimension = (selectedMachines?.map(machine => ({ name: machine.plateDimension })) || []);
      const uniqueDimensionSet = new Set(dimension.map(item => item.name));
      const uniqueDimension = Array.from(uniqueDimensionSet);
      const uniqueDimensionObjects = Array.from(uniqueDimensionSet).map(name => ({ name }));
      this.dimensionArray = uniqueDimensionObjects;

    }, error => {
      console.log(error);
    });
  }

  getMachineAndVendorId(value: any) {
    this.selectedVendor = value;
  }

  getCtp(value: any) {
    this.ctpService.getCtp().subscribe(res => {
      this.ctpVendors = res;
      if (!this.idFromQueryParam) {

        this.ctpVendors = [this.ctpVendors.find((el: any) => el.plateDimension === value?.name)]
      }
    }, error => {
      console.log(error);
    });
  }

  addProductRule() {
    debugger
    const PressId = !this.idFromQueryParam ? this.press.machines.find((el: any) => el.vendor.name === this.selectedVendor.name) : null
    const updatePressId = this.press.machines.find((el: any) => el.vendor.name === this.pressVendor.name)
    const ctpId = this.ctpVendors.find((el: any) => el.plateDimension === this.plates.name)
    const payload = {
      title: this.productName,
      category: this.category.name,
      size: JSON.stringify(this.upping.map((uping: any) => (uping.productSize))),
      quantity: JSON.stringify(this.qty.map((qtys: any) => (qtys.name))),
      printSide: this.sideValue.name,
      jobColorFront: JSON.stringify(this.jobFront.map((color: any) => (color.name))),
      jobColorBack: this.jobBack != null ? JSON.stringify(this.jobBack.map((color: any) => (color.name))) : null,
      impositionValue: this.impositionValue,
      productRulePaperStockList: this.containers.map((container: any) => ({
        id: container.paper.id,
        paperStock: container.paper.name,
        brand: container.brand.name,
        madeIn: container.madeIn.name,
        dimension: container.dimension.name,
        gsm: JSON.stringify(container.gsm.map((gsm: any) => (gsm.name))),
        vendor: { id: container.vendor.id },
      })),
      pressMachine: {
        id: PressId ? PressId.id : updatePressId.id
      },
      ctp: {
        id: ctpId.id
      },
    };

    if (!this.idFromQueryParam) {
      this.productRuleService.postProductRule(payload).subscribe(
        (res) => {
          this.router.navigate(['/ProductRule']);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.productRuleService.updateProductRule(this.idFromQueryParam, payload).subscribe(
        (res) => {
          this.router.navigate(['/ProductRule']);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getProductField() {
    this.productField.getProductField().subscribe(
      (response: any) => {
        this.qtyArray = response.find((el: any) => el.name.toLowerCase() === 'quantity'.toLowerCase());
        this.sideOptions = response.find((el: any) => el.name.toLowerCase() === 'Print Side'.toLowerCase());
        this.categoryArray = response.find((el: any) => el.name.toLowerCase() === 'Category'.toLowerCase());
        this.frontColors = response.find((el: any) => el.name.toLowerCase() === 'JobColor(Front)'.toLowerCase());
        this.backColors = response.find((el: any) => el.name.toLowerCase() === 'JobColor(Back)'.toLowerCase());

      },
      (error) => {
        console.error("Error:", error);
      }
    );
  }
  onChangeSide(value: any) {
    if (value.name === "DOUBLE_SIDED") {

      this.backNotApplied = true;
      this.imposition = true;
    } else {
      this.backNotApplied = false;
      this.imposition = false;
    }
  }
  onCheck(value: any) {
    this.impositionValue = value;
  }

  onCategoryChange(value: any) {
    this.getUpping.getUping().subscribe(
      (response: any) => {
        this.uppingArray = response.filter((el: any) => el.category.toLowerCase() === value.name.toLowerCase());
        this.uppingArray = this.uppingArray.map((el: any) => ({
          productSize: `${"[" + el.productSize + "]"}, ${" [Inch : " + el.inch + "]"}, ${" [Mm : " + el.mm + "]"}`
        }));
        console.log(this.uppingArray);
      }, (error: any) => {
        console.log(error);

      });
  }

  toggleEnabledDisabled(i: any, value: any) {

    if (value.length === 0) {
      this.containers[i].gsm = null;
    } else {
      this.containers[i].gsm = value
      console.log(this.containers[i].gsm);
    }
  }

  onUpingChange(value: any) {

    if (value.length === 0) {
      this.upping = null;
    } else {
      this.upping = value
    }
  }

  onQtyChange(value: any) {

    if (value.length === 0) {
      this.qty = null;
    } else {
      this.qty = value
    }
  }

  onFrontColorChange(value: any) {

    if (value.length === 0) {
      this.jobFront = null;
    } else {
      this.jobFront = value
    }
  }

  onBackColorChange(value: any) {

    if (value.length === 0) {
      this.jobBack = null;
    } else {
      this.jobBack = value
    }
  }
}
export interface Container {
  paper?: any;
  allPaper?: any;
  vendor?: any
  allVendor?: any
  brand?: any
  allBrand?: any
  madeIn?: any
  allMadeIn?: any
  dimension?: any
  allDimension?: any
  gsm?: any
  allGsm?: any
}
