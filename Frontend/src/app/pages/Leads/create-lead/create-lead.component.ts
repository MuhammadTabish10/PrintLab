import { Component, OnInit } from '@angular/core';
import { Lead } from 'src/app/Model/Lead';
import { LeadService } from '../Service/lead.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ErrorHandleService } from 'src/app/services/error-handle.service';

@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.css']
})
export class CreateLeadComponent implements OnInit {
  idFromQueryParam: number | null | undefined;
  private destroy$ = new Subject<void>();
  lead: Lead | undefined | null;

  constructor(
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private route: ActivatedRoute,
  ) {

  }
  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      (param) => {
        this.idFromQueryParam = +param['id'] || null;
        if (this.idFromQueryParam) {
          this.getleadbyId(this.idFromQueryParam);
        }

      },
      (error) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  getleadbyId(id: number) {
    this.leadService.getLeadById(id).subscribe(
      (res: Lead) => {
        this.lead = res;
      });
  }
}
