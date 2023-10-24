import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaperStockService } from 'src/app/services/paper-stock.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-paper-stock',
  templateUrl: './paper-stock.component.html',
  styleUrls: ['./paper-stock.component.css']
})
export class PaperStockComponent implements OnInit, OnDestroy {
  allPaperStock: any[] = [];
  search: string = '';
  visible: boolean = false;
  brands: any = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private paperStockService: PaperStockService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getPaperStock();
  }

  getPaperStock() {
    this.paperStockService
      .getAllPaperStock()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (res: any) => {
          this.allPaperStock = res;
        },
        (error) => {
          this.handleError(error);
        }
      );
  }

  searchPaperStock(title: any) {
    const searchTerm = title.value.trim().toLowerCase();
    const searchWithUnderscores = searchTerm.replace(/\s+/g, '_');
    if (!searchTerm) {
      this.getPaperStock();
    } else {
      this.paperStockService
        .searchPaperStock(searchWithUnderscores)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          (res:any) => {
            this.allPaperStock = res;
          },
          (error) => {
            this.handleError(error);
          }
        );
    }
  }

  viewProduct(obj: any) {
    // Implement view functionality
  }

  editProduct(id: any) {
    this.router.navigate(['/addPaperStock'], { queryParams: { id: id } });
  }

  deleteProduct(id: any) {
    this.paperStockService
      .deletePaperStock(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.getPaperStock();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private handleError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error.error,
    });
    this.visible = true;
  }
}
