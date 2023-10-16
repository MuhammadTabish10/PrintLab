import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { CtpService } from 'src/app/services/ctp.service';
import { PressMachineService } from 'src/app/services/press-machine.service';
import { ProductRuleService } from 'src/app/services/product-rule.service';
import { NgZone } from '@angular/core';

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
  // updateMode: boolean = false;

  constructor(
    private productRuleService: ProductRuleService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private pressMachine: PressMachineService,
    private ctpService: CtpService,
    private ngZone: NgZone) { }

  // ngOnInit(): void {
  //   this.getPressMachine(null);
  //   this.productRuleService.getProductRule('paper', null).subscribe((productRule: any) => {
  //     let paper = productRule.map((p: any) => {
  //       return {
  //         name: p
  //       }
  //     })
  //     this.addContainer(paper);
  //   }, err => {
  //     console.log(err);
  //   })
  //   this.route.queryParams.subscribe(param => {
  //     this.idFromQueryParam = +param['id']
  //     if (Number.isNaN(this.idFromQueryParam)) {
  //       this.buttonName = 'Add'
  //     } else {
  //       this.productRuleService.getProductRuleById(this.idFromQueryParam).subscribe((res: any) => {
  //         this.productName = res.productName


  //         for (let i = 0; i < this.containers.length; i++) {
  //           this.containers[i].paper = { name: res.paperStock }
  //           // this.changePaper(i, { name: res.paperStock })
  //           this.containers[i].allVendor = [{ name: "Nadeem & Sons" }]
  //           this.containers[i].vendor = { name: res.vendor.name }
  //           this.containers[i].allBrand = [{ name: "Pindo" }]
  //           this.containers[i].brand = { name: res.brand }
  //           this.containers[i].allMadeIn = [{ name: "Indonesia" }]
  //           this.containers[i].madeIn = { name: res.madeIn }
  //         }
  //
  //         this.press = this.pressMachineArray.find((el: any) => el.name === res?.pressMachine.name)
  //         this.pressVendor = this.pressMachineArray.find((el: any) => el.vendor === res?.pressMachine.vendor)
  //       }, error => {
  //         console.log(error);
  //       })
  //     }
  //   })
  // }

  ngOnInit(): void {
    this.getPressMachine(null);
    this.getCtp(null);
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
          this.buttonName = 'Update';
          for (let i = 0; i < this.containers.length; i++) {
            const observables = [];
            observables.push(this.getVendors(i, { name: res.paperStock }));
            observables.push(this.getBrands(i, res.vendor));
            observables.push(this.getMadeIn(i, { name: res.brand }));
            observables.push(this.getDimensions(i, { name: res.madeIn }));
            observables.push(this.getGsm(i, { name: res.dimension }));
            forkJoin(observables).subscribe(
              (responses: any[]) => {
                let vendor = responses[i].find((el: any) => el.id === res.vendor.id);
                const gsmArray = JSON.parse(res.gsm);
                const gsmMatches = this.containers[i].allGsm.filter((gsm: any) => gsmArray.includes(gsm.name));
                this.containers[i].vendor = vendor;
                this.containers[i].gsm = gsmMatches;
                this.press = this.pressMachineArray.find((el: any) => el.id === res.pressMachine.id);
                this.ctpArray = [this.pressMachineArray.find((el: any) => el.id === res.pressMachine.id)]
                this.pressVendor = this.ctpArray.find((el: any) => el.vendor.id === res.pressMachine.vendor.id);
                this.plates = this.ctpArray.find((el: any) => el.id === res.pressMachine.id);
                this.ctpVendors = [this.ctpVendors.find((el: any) => el.id === res.ctp.id)]
                this.plateVendor = this.ctpVendors.find((el: any) => el.vendor.id === res.ctp.vendor.id);
              },
              (err) => {
                console.log(err);
              }
            );
          }
        });
      }
    });
  }

  changePaper(i: any, value: any) {

    this.containers[i].paper = value;
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
    debugger
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
    debugger
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
      this.filteredPapers = this.containers[i].allPaper.filter((papers: any) => {
        return papers.name != value.name;
      });

      if (i < this.containers.length - 1) {
        for (let index = i + 1; index <= this.containers.length; index++) {
          this.pop();
        }
      }

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

      debugger;

      console.log(pressNameToMachinesArray);
      this.pressMachineArray = pressNameToMachinesArray


      const machinesForSelectedPress = pressNameToMachinesArray.find(item =>
        item.machines.some(machine => value?.machines.some((selectedMachine: any) => selectedMachine.id === machine.id))
      );

      const selectedMachines = machinesForSelectedPress?.machines;

      const vendors = selectedMachines?.map(machine => machine.vendor);
      console.log(vendors);
      this.ctpArray = vendors;

      const dimension = (selectedMachines?.map(machine => ({ name: machine.plateDimension })) || []);

      const uniqueDimensionSet = new Set(dimension.map(item => item.name));

      const uniqueDimension = Array.from(uniqueDimensionSet);

      const uniqueDimensionObjects = Array.from(uniqueDimensionSet).map(name => ({ name }));

      console.log(uniqueDimensionObjects);
      this.dimensionArray = uniqueDimensionObjects;

    }, error => {
      console.log(error);
    });
  }

  getCtp(value: any) {
    this.ctpService.getCtp().subscribe(res => {
      this.ctpVendors = res;
      if (!this.idFromQueryParam) {
        debugger
        this.ctpVendors = [this.ctpVendors.find((el: any) => el.plateDimension === value?.name)]
      }
    }, error => {
      console.log(error);
    });
  }

  addProductRule() {
    debugger
    const payload = {
      title: this.productName,
      produtRulePaper: this.containers.map((container: any) => ({
        paperStock: container.paper.name,
        brand: container.brand.name,
        madeIn: container.madeIn.name,
        dimension: container.dimension.name,
        gsm: JSON.stringify(container.gsm.map((gsm: any) => (gsm.name))),
        vendor: { id: container.vendor.id },
      })),
      pressMachine: {
        id: this.press.id,
      },
      ctp: {
        id: this.plates.id,
      },
    };

    if (!this.idFromQueryParam) {
      console.log(payload);
      // this.productRuleService.postProductRule(payload).subscribe(
      //   (res) => {
      //     this.router.navigate(['/ProductRule']);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    } else {
      // this.productRuleService.updateProductRule(this.idFromQueryParam, payload).subscribe(
      //   (res) => {
      //     this.router.navigate(['/ProductRule']);
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
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
