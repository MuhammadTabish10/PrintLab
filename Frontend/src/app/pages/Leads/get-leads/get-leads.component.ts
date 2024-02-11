import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Lead } from 'src/app/Model/Lead';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { LeadService } from '../Service/lead.service';
import { Router } from '@angular/router';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';

@Component({
  selector: 'app-get-leads',
  templateUrl: './get-leads.component.html',
  styleUrls: ['./get-leads.component.css']
})
export class GetLeadsComponent {

  private destroy$ = new Subject<void>();
  leadSearchModal: boolean = false;
  searchResults: Lead[] = [];
  visible: boolean = false;
  leadList: Lead[] = [];

  lead: Lead = {
    about: {
      description: undefined,
      source: undefined,
    },
    leadAddress: [{
      postalCode: undefined,
      address: undefined,
      country: undefined,
      state: undefined,
      type: undefined,
      city: undefined,
      id: undefined,
    }],
    contact: [{
      landLine: undefined,
      jobTitle: undefined,
      website: undefined,
      mobile: undefined,
      email: undefined,
      role: undefined,
      name: undefined,
      id: undefined,
    }],
    leadStatusType: undefined,
    companyName: undefined,
    contactName: undefined,
    createdAt: undefined,
    status: undefined,
    id: undefined,
  };
  mode: string = 'Create Lead';
  rowId: number | undefined | null;



  constructor(
    private successMsgService: SuccessMessageService,
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getLeadList();
  }

  getLeadList(): void {
    this.leadService.getAllLeads().pipe(takeUntil(this.destroy$)).subscribe(
      (res: Lead[]) => {
        this.leadList = res;
        console.log(this.leadList);
      },
      (error: BackendErrorResponse) => this.errorHandleService.showError(error.error.error)
    );
  }


  edit(id: number) {
    this.router.navigate(['/create-lead'], { queryParams: { id: id } });
  }

  deleteLead(lead: Lead) {

    this.leadService.deleteLeadById(lead.id!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          const result = `Lead ${lead.id} deleted successfully`;
          this.successMsgService.showSuccess(result);
          this.getLeadList();
        },
        (error: BackendErrorResponse) => this.errorHandleService.showError(error.error.error)
      );
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showModal(lead?: Lead) {
    if (lead?.id) {
      this.mode = 'Update';
      this.lead.companyName = lead.companyName;
      this.lead.contactName = lead.contactName;
    }
    this.visible = true;
    this.rowId = lead ? lead.id : null;
    // this.searchCompanyAndContactName(lead!)
  }

  searchCompanyAndContactName(value: Lead) {
    this.searchResults = [];
    if (value.companyName && value.contactName) {
    this.leadService.searchLeads(this.lead.contactName!, this.lead.companyName!).subscribe(
      (res: Lead[]) => {
        if (res.length > 0) {
          this.leadSearchModal = true;
          this.searchResults = res.map(lead => {
            if (lead.createdAt && Array.isArray(lead.createdAt) && lead.createdAt.length === 7) {
              const createdAtDate = new Date(lead.createdAt[0], lead.createdAt[1] - 1, lead.createdAt[2], lead.createdAt[3], lead.createdAt[4], lead.createdAt[5]);
              const timeDiff = Date.now() - createdAtDate.getTime();
              const hours = Math.floor(timeDiff / (1000 * 60 * 60));
              const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
              const timeAgo = this.formatTimeAgo(hours, minutes);
              return { ...lead, createdAt: timeAgo };
            } else {
              console.error('Invalid createdAt value:', lead.createdAt);
              return lead;
            }
          });
        }else{
          this.leadSearchModal = false;
        }
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
    }
  }

  formatTimeAgo(hours: number, minutes: number): string {
    let timeAgo = '';
    if (hours > 0) {
      timeAgo += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
      timeAgo += `${minutes} min `;
    }
    timeAgo += 'ago';
    return timeAgo.trim();
  }

  closeNewLeadModal() {
    this.leadSearchModal = false;
    this.mode = 'Create Lead';
    this.visible = false;
    this.lead = {
      about: {
        description: undefined,
        source: undefined,
      },
      leadAddress: [{
        postalCode: undefined,
        address: undefined,
        country: undefined,
        state: undefined,
        type: undefined,
        city: undefined,
        id: undefined,
      }],
      contact: [{
        landLine: undefined,
        jobTitle: undefined,
        website: undefined,
        mobile: undefined,
        email: undefined,
        role: undefined,
        name: undefined,
        id: undefined,
      }],
      leadStatusType: undefined,
      companyName: undefined,
      contactName: undefined,
      createdAt: undefined,
      status: undefined,
      id: undefined,
    };
  }
  submit() {
    debugger
    const serviceToCall = this.rowId
      ? this.leadService.updateLead(this.rowId, this.lead)
      : this.leadService.postLead(this.lead);

    serviceToCall.subscribe(
      (res: Lead) => {
        debugger
        const successMsg = `Lead: ${this.lead.contactName} is successfully ${this.mode}d.`;
        this.successMsgService.showSuccess(successMsg);
        this.visible = false;
        setTimeout(() => {
          this.getLeadList();
        }, 2000);
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }
}


