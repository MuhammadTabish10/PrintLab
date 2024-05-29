import { RequestBodyMasterCustomerStatement } from './RequestBody';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MasterCustomerStatement } from 'src/app/Model/MasterCustomerStatement';
import { MasterStatementsService } from 'src/app/services/master-statements.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { PaginatorState } from 'primeng/paginator';
import { PaginationResponse } from 'src/app/Model/PaginationResponse';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-master-customer-statement',
  templateUrl: './master-customer-statement.component.html',
  styleUrls: ['./master-customer-statement.component.css'],
  providers: [DatePipe]
})
export class MasterCustomerStatementComponent implements OnInit {
  statement: MasterCustomerStatement = { ...RequestBodyMasterCustomerStatement.class }
  statementFrom: string | undefined | null;
  statementTo: string | undefined | null;
  private destroy$ = new Subject<void>();
  dateFilter: {
    fromDate: Date | undefined | null,
    toDate: Date | undefined | null
  } = {
      fromDate: undefined,
      toDate: undefined
    }
  paginatedCustomerStatement: PaginationResponse<MasterCustomerStatement> | undefined | null;

  constructor(
    private masterStatementService: MasterStatementsService,
    private successHandleService: SuccessMessageService,
    private errorHandleService: ErrorHandleService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getAllMasterCustomerStatements();
  }

  getAllMasterCustomerStatements(pageState?: PaginatorState, statement?: MasterCustomerStatement): void {
    this.masterStatementService.getCustomerMasterStatements(pageState, statement).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (res: PaginationResponse<MasterCustomerStatement>) => {
        this.paginatedCustomerStatement = res;
      }, (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  public generateRecord(): void {
    if (this.dateFilter.fromDate && this.dateFilter.toDate) {
      this.statementFrom = this.datePipe.transform(this.dateFilter.fromDate, 'EEEE, d\'th\' MMMM y');
      this.statementTo = this.datePipe.transform(this.dateFilter.toDate, 'EEEE, d\'th\' MMMM y');
      this.statement.dateList = [this.dateFilter.fromDate, this.dateFilter.toDate];
      this.getAllMasterCustomerStatements(undefined, this.statement);
    }
  }
}
