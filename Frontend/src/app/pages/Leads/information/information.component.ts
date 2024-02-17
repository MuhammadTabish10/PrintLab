import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Lead, LeadAbout, LeadAddress, LeadContact, LeadContactDetails } from 'src/app/Model/Lead';
import { ProductField } from 'src/app/Model/ProductField';
import { LeadService } from '../Service/lead.service';
import { ProductDefinitionService } from 'src/app/services/product-definition.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { SuccessMessageService } from 'src/app/services/success-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  leadContactDetails: ProductField | undefined | null;
  leadAddressStatus: ProductField | undefined | null;
  leadAddressTypes: ProductField | undefined | null;
  leadContactRole: ProductField | undefined | null;
  leadAboutSource: ProductField | undefined | null;
  idFromQueryParam: number | undefined | null;
  selectedDetails!: LeadContactDetails[];
  private destroy$ = new Subject<void>();
  addressList: LeadAddress[] = [];
  contactList: LeadContact[] = [];
  contactModal: boolean = false;
  addressModal: boolean = false;
  deleteFlag: boolean = false;
  aboutModal: boolean = false;
  aboutList: LeadAbout[] = [];
  options: boolean = false;
  mode: string = 'Save';


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

  address: LeadAddress = {
    addressCont: undefined,
    postalCode: undefined,
    address: undefined,
    country: undefined,
    state: undefined,
    city: undefined,
    type: undefined,
    id: undefined,
  };

  about: LeadAbout = {
    description: undefined,
    source: undefined,
  };

  contact: LeadContact = {
    landLine: undefined,
    jobTitle: undefined,
    website: undefined,
    mobile: undefined,
    email: undefined,
    role: undefined,
    name: undefined,
    id: undefined,
  };
  selectedDetail: LeadContactDetails = {
    landLine: undefined,
    website: undefined,
    mobile: undefined,
    email: undefined,
  };


  constructor(
    private productFieldService: ProductDefinitionService,
    private errorHandleService: ErrorHandleService,
    private successMsg: SuccessMessageService,
    private leadService: LeadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeProductFieldData();
    this.handleQueryParams();
  }

  private handleQueryParams(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(
      (param) => {
        this.idFromQueryParam = +param['id'] || null;
        if (this.idFromQueryParam) {
          this.patchValues(this.idFromQueryParam);
        }
      },
      (error) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  private initializeProductFieldData(): void {
    this.getLeadContactDetails("LEAD_CONTACT_DETAILS");
    this.getLeadAddressStatus("LEAD_STATUS_TYPE");
    this.getLeadAddressTypes("LEAD_ADDRESS_TYPES");
    this.getLeadContactRole("LEAD_CONTACT_ROLES");
    this.getLeadAboutSource("LEAD_ABOUT_SOURCE");
  }

  private patchValues(id: number) {
    this.leadService.getLeadById(id).subscribe(
      (res: Lead) => {
        this.lead = res;
        res.leadAddress?.forEach((address: LeadAddress) => {
          if (address.address) {
            this.addressList.push(address!);
          }
        });
        if (this.lead.about?.source) {
          this.aboutList.push(this.lead.about);
        }
        res.contact?.forEach((contact: LeadContact) => {
          if (contact.role) {

            this.contactList.push(contact!);
          }
        });
      }, (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      });
  }

  editAddress(address: LeadAddress): void {
    this.showAddressModal();
    this.mode = "Update";
    this.address.postalCode = address.postalCode;
    this.address.address = address.address;
    this.address.country = address.country;
    this.address.state = address.state;
    this.address.type = address.type;
    this.address.city = address.city;
    this.address.id = address.id;
  }

  editAbout(about: LeadAbout): void {
    this.showAboutModal();
    this.mode = "Update";
    this.about.description = about.description;
    this.about.source = about.source;
  }

  editContact(contact: LeadContact): void {
    this.showContactModal();
    this.mode = "Update";
    this.selectedDetail.landLine = contact.landLine;
    this.selectedDetail.website = contact.website;
    this.selectedDetail.mobile = contact.mobile;
    this.selectedDetail.email = contact.email;
    this.contact.jobTitle = contact.jobTitle;
    this.contact.landLine = contact.landLine;
    this.contact.website = contact.website;
    this.contact.mobile = contact.mobile;
    this.contact.email = contact.email;
    this.contact.name = contact.name;
    this.contact.role = contact.role;
    this.contact.id = contact.id;
  }


  private getLeadAddressTypes(productName: string): void {
    this.productFieldService.searchProductField(productName).
      subscribe(
        (res: any) => {
          this.leadAddressTypes = res[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }

  private getLeadAddressStatus(productName: string): void {
    this.productFieldService.searchProductField(productName).
      subscribe(
        (res: any) => {
          this.leadAddressStatus = res[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }

  private getLeadAboutSource(productName: string): void {
    this.productFieldService.searchProductField(productName).
      subscribe(
        (res: any) => {
          this.leadAboutSource = res[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }

  private getLeadContactDetails(productName: string): void {
    this.productFieldService.searchProductField(productName).
      subscribe(
        (res: any) => {
          this.leadContactDetails = res[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }

  private getLeadContactRole(productName: string): void {
    this.productFieldService.searchProductField(productName).
      subscribe(
        (res: any) => {
          this.leadContactRole = res[0];
        }, (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        })
  }

  showAddressModal(): void {
    this.addressModal = true;
  }
  showAboutModal(): void {
    this.aboutModal = true;
  }
  showContactModal(): void {
    this.contactModal = true;
  }

  closeAddressModal(): void {
    this.mode = "Save";
    this.addressModal = false;
    this.address = {
      addressCont: undefined,
      postalCode: undefined,
      address: undefined,
      country: undefined,
      state: undefined,
      type: undefined,
      city: undefined,
      id: undefined,
    }
  }
  closeAboutModal(): void {
    this.mode = "Save";
    this.aboutModal = false;
    this.about = {
      description: undefined,
      source: undefined,
    }
  }
  closeContactModal(): void {
    this.mode = "Save";
    this.contactModal = false;
    this.contact = {
      landLine: undefined,
      jobTitle: undefined,
      website: undefined,
      mobile: undefined,
      email: undefined,
      role: undefined,
      name: undefined,
      id: undefined,
    }
    this.selectedDetail = {
      landLine: undefined,
      website: undefined,
      mobile: undefined,
      email: undefined,
    }
  }
  closeOptions(): void {
    this.options = false;
    this.selectedDetails = [];
  }

  submitAddress(): void {
    if (this.mode === "Update") {
      const index = this.lead.leadAddress.findIndex(item => item?.id === this.address.id);
      if (index !== -1) {
        this.lead.leadAddress.splice(index, 1, this.address);
      }
    }
    if (!this.deleteFlag && this.mode !== "Update") {
      this.lead.leadAddress.push(this.address);
    }
    this.updateLead("Address");
  }
  submitAbout(): void {
    if (this.mode === "Update" || !this.deleteFlag) {
      this.lead.about = this.about;
    }
    this.updateLead("About");
  }
  submitContact(): void {
    if (this.mode === "Update") {
      const findIndex = this.lead.contact.findIndex(item => item?.id === this.contact.id);
      if (findIndex !== -1) {
        this.lead.contact.splice(findIndex, 1, this.contact);
      }
    }
    if (!this.deleteFlag && this.mode !== "Update") {
      this.lead.contact.push(this.contact);
    }
    this.updateLead("Contact");
  }
  submitLeadStatusType(): void {
    this.updateLead("Status");
  }

  private updateLead(field: string): void {
    this.leadService.updateLead(this.idFromQueryParam!, this.lead).subscribe(
      (res: Lead) => {
        this.handleLeadUpdateSuccess(res, field);
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      }
    );
  }

  private handleLeadUpdateSuccess(res: Lead, field: string): void {
    const successMsg = `${field} in Lead ${this.lead.companyName} is successfully ${this.mode}d.`;
    this.patchValues(this.idFromQueryParam!);
    this.successMsg.showSuccess(successMsg);
    this.addressModal = false;
    this.contactModal = false;
    this.deleteFlag = false;
    this.clearLists();
  }

  private clearLists(): void {
    this.contactList = [];
    this.addressList = [];
    this.aboutList = [];
  }

  showOptions(): void {
    this.options = true;
  }

  getValue(selectedValues: string[]): void {
    this.resetSelectedDetail();
    selectedValues.forEach((value, i) => {
      switch (value.toUpperCase()) {
        case 'LANDLINE':
          this.selectedDetail.landLine = value;
          break;
        case 'MOBILE':
          this.selectedDetail.mobile = value;
          break;
        case 'WEBSITE':
          this.selectedDetail.website = value;
          break;
        case 'EMAIL':
          this.selectedDetail.email = value;
          break;
      }
    });
  }

  resetSelectedDetail(): void {
    this.selectedDetail = {
      landLine: null,
      website: null,
      mobile: null,
      email: null,
    };
  }

  deleteAddress(index: number) {
    this.deleteFlag = true;
    this.removeEmptyRowsIn("Address");
    this.lead.leadAddress.splice(index, 1);
    this.submitAddress();
  }
  deleteAbout(index: number) {
    this.deleteFlag = true;
    this.lead.about = null;
    this.submitAbout();
  }
  deleteContact(index: number) {
    this.deleteFlag = true;
    this.removeEmptyRowsIn("Contact");
    this.lead.contact.splice(index, 1);
    this.submitContact();
  }

  private removeEmptyRowsIn(determinEntity: string): void {
    if (determinEntity === "Address") {
      this.lead.leadAddress = this.lead.leadAddress.filter(address => !!address.type);
    } else {
      this.lead.contact = this.lead.contact.filter(contact => !!contact.role);
    }
  }

}



// Previous Code In Case Some Error occurs in new Code

// submitContact() {
//   if (this.mode === "Update") {
//     const findIndex = this.lead.contact.findIndex(item => item?.id === this.contact.id);
//     if (findIndex !== -1) {
//       this.lead.contact.splice(findIndex, 1, this.contact);
//     }
//     debugger
//   }
//   if (!this.deleteFlag && this.mode !== "Update") {
//     this.lead.contact.push(this.contact);
//   }
//   debugger
//   this.leadService.updateLead(this.idFromQueryParam!, this.lead)
//     .subscribe(
//       (res: Lead) => {
//         this.contactModal = false;
//         this.deleteFlag = false;
//         this.contactList = [];
//         this.addressList = [];
//         this.aboutList = [];
//         const successMsg = `Contact in Lead ${this.lead.contactName} is successfully ${this.mode}d.`;
//         this.successMsg.showSuccess(successMsg);
//         this.patchValues(this.idFromQueryParam!);
//       },
//       (error: BackendErrorResponse) => {
//         this.errorHandleService.showError(error.error.error);
//       }
//     );
// }

// submitAddress() {
//   if (this.mode === "Update") {
//     const findIndex = this.lead.leadAddress.findIndex(item => item?.id === this.address.id);
//     if (findIndex !== -1) {
//       this.lead.leadAddress.splice(findIndex, 1, this.address);
//     }
//     debugger
//   }
//   if (!this.deleteFlag && this.mode !== "Update") {
//     this.lead.leadAddress.push(this.address);
//   }
//   debugger
//   this.leadService.updateLead(this.idFromQueryParam!, this.lead)
//     .subscribe(
//       (res: Lead) => {
//         debugger
//         this.deleteFlag = false;
//         this.addressModal = false;
//         this.contactList = [];
//         this.addressList = [];
//         this.aboutList = [];
//         const successMsg = `Address in Lead ${this.lead.contactName} is successfully ${this.mode}d.`;
//         this.successMsg.showSuccess(successMsg);
//         this.patchValues(this.idFromQueryParam!);
//       },
//       (error: BackendErrorResponse) => {
//         this.errorHandleService.showError(error.error.error);
//       }
//     );
// }
// submitAbout() {
//   if (this.mode === "Update") {
//     this.lead.about = this.about;
//   }
//   if (!this.deleteFlag && this.mode !== "Update") {
//     this.lead.about = this.about;
//   }
//   this.leadService.updateLead(this.idFromQueryParam!, this.lead)
//     .subscribe(
//       (res: Lead) => {
//         this.aboutModal = false;
//         this.deleteFlag = false;
//         this.contactList = [];
//         this.addressList = [];
//         this.aboutList = [];
//         const successMsg = `About in Lead ${this.lead.contactName} is successfully ${this.mode}d.`;
//         this.successMsg.showSuccess(successMsg);
//         this.patchValues(this.idFromQueryParam!);
//       },
//       (error: BackendErrorResponse) => {
//         this.errorHandleService.showError(error.error.error);
//       }
//     );
// }
// deleteAddress(index: number) {
//   debugger
//   this.deleteFlag = true;
//   this.lead.leadAddress
//     .filter(address => !address.type)
//     .forEach(address => {
//       const index = this.lead.leadAddress.indexOf(address);
//       if (index > -1) {
//         this.lead.leadAddress.splice(index, 1);
//       }
//     });
//   debugger
//   this.lead.leadAddress.splice(index, 1)
//   this.submitAddress();
// }
// deleteAbout(index: number) {
//   this.deleteFlag = true;
//   this.lead.leadAddress.splice(index, 1);
//   debugger
//   this.submitAbout();
// }
// deleteContact(index: number) {
//   this.deleteFlag = true;
//   this.lead.contact
//     .filter(contact => !contact.role)
//     .forEach(contact => {
//       const index = this.lead.contact.indexOf(contact);
//       if (index > -1) {
//         this.lead.contact.splice(index, 1);
//       }
//     });
//   debugger
//   this.lead.contact.splice(index, 1)
//   this.submitContact();
// }
