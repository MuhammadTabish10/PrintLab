import { PaginationResponse } from './../../../Model/PaginationResponse';
import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Lead } from 'src/app/Model/Lead';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { LeadService } from '../Service/lead.service';
import { Router } from '@angular/router';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { PaginatorState } from 'primeng/paginator';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { ProductField } from 'src/app/Model/ProductField';

export interface DistinctResults {
  lead_status_type: string;
}
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
  paginatedLeads: PaginationResponse<Lead> | undefined | null;
  type: string = "New Lead";

  lead: Lead = {
    about: {
      description: undefined,
      source: undefined,
    },
    leadAddress: [{
      addressCont: undefined,
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
  statusToFilter: ProductField | undefined | null;



  constructor(
    private productFieldService: ProductDefinitionService,
    private successMsgService: SuccessMessageService,
    private errorHandleService: ErrorHandleService,
    private leadService: LeadService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getLeadList();
    this.getAllStatusType("LEAD_STATUS_TYPE");
  }

  getLeadList(pageState?: PaginatorState, lead?: Lead): void {
    if (lead?.createdAt) {
      lead.createdAt = null;
    }
    this.leadService.getAllLeads(pageState, lead!).pipe(takeUntil(this.destroy$)).subscribe(
      (res: PaginationResponse<Lead>) => {
        this.paginatedLeads = res;
        if (res.content.length > 0) {
          this.leadSearchModal = true;
          this.paginatedLeads.content = res.content.map((lead: Lead) => {
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
        } else {
          this.leadSearchModal = false;
          this.paginatedLeads.content = [];
        }
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
          const result = `Lead ${lead.companyName} deleted successfully`;
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
      this.type = 'Edit Lead';
      this.mode = 'Update';
      this.lead.companyName = lead.companyName;
      this.lead.contactName = lead.contactName;
      this.getLeadList(undefined, lead);
    } else {
      this.leadSearchModal = false;
    }
    this.visible = true;
    this.rowId = lead ? lead.id : null;
  }

  formatTimeAgo(hours: number, minutes: number): string {
    let timeAgo = '';
    let days = 0;

    if (hours >= 24) {
      days = Math.floor(hours / 24);
      hours = hours % 24;
    }

    if (days > 0) {
      timeAgo += `${days} day${days !== 1 ? 's' : ''} `;
    } else if (hours > 0) {
      timeAgo += `${hours} hour${hours !== 1 ? 's' : ''} `;
    }

    if (minutes > 0 && days === 0) {
      timeAgo += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
    } else if (minutes === 0 && days === 0) {
      timeAgo += `just now`;
    }

    timeAgo += minutes === 0 && days === 0 ? '' : 'ago';
    return timeAgo.trim();
  }


  closeNewLeadModal() {
    this.leadSearchModal = false;
    this.type = 'New Lead';
    this.mode = 'Create Lead';
    this.visible = false;

    this.lead = {
      about: {
        description: undefined,
        source: undefined,
      },
      leadAddress: [{
        addressCont: undefined,
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
    this.getLeadList(undefined, undefined);
  }
  submit() {

    const serviceToCall = this.rowId
      ? this.leadService.updateLead(this.rowId, this.lead)
      : this.leadService.postLead(this.lead);

    serviceToCall.subscribe(
      (res: Lead) => {

        const successMsg = `Lead: ${this.lead.contactName} is successfully Created.`;
        this.successMsgService.showSuccess(successMsg);
        this.visible = false;
        setTimeout(() => {
          this.router.navigate(['/create-lead'], { queryParams: { id: res.id } });
        }, 2000);
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  getAllStatusType(fieldName: string) {
    this.productFieldService.searchProductField(fieldName).subscribe(
      (res: any) => {
        this.statusToFilter = res[0];
      }, (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      })
  }
  clear() {
    this.getLeadList();
  }
}

// previous Code
// searchCompanyAndContactName(value: Lead) {
//   this.searchResults = [];
//   
//   if (value.companyName) {
//     this.leadService.searchLeads(this.lead.companyName!).subscribe(
//       (res: Lead[]) => {
//         if (res.length > 0) {
//           
//           this.leadSearchModal = true;
//           this.paginatedLeads = res;
//           this.searchResults = res.map(lead => {
//             if (lead.createdAt && Array.isArray(lead.createdAt) && lead.createdAt.length === 7) {
//               const createdAtDate = new Date(lead.createdAt[0], lead.createdAt[1] - 1, lead.createdAt[2], lead.createdAt[3], lead.createdAt[4], lead.createdAt[5]);
//               const timeDiff = Date.now() - createdAtDate.getTime();
//               const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//               const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//               const timeAgo = this.formatTimeAgo(hours, minutes);
//               return { ...lead, createdAt: timeAgo };
//             } else {
//               console.error('Invalid createdAt value:', lead.createdAt);
//               return lead;
//             }
//           });
//         } else {
//           this.leadSearchModal = false;
//           this.paginatedLeads = [];
//         }
//       },
//       (error: BackendErrorResponse) => {
//         this.errorHandleService.showError(error.error.error);
//       }
//     );
//   } else {
//     this.getLeadList();
//   }
// }