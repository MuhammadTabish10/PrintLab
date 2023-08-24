import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersComponent } from '../orders/orders.component';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  editOrderForm!: FormGroup
  orderArray: any = []
  id: any

  constructor(private formbuilder: FormBuilder, private route: ActivatedRoute, private service: OrdersService, private router: Router) { }

  ngOnInit(): void {

    this.editOrderForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      price: ['', [Validators.required]],
      status: ['', [Validators.required]],
      date: ['', [Validators.required]]
    })
    this.id = Number(this.route.snapshot.paramMap.get("id"))
    this.getById(this.id);
  }

  getById(id: any) {
    this.service.getOrderById(id).subscribe(res => {
      this.orderArray.push(res)
      console.log(this.orderArray);
      this.editOrderForm.patchValue({
        name: this.orderArray[0].name,
        email: this.orderArray[0].email,
        price: this.orderArray[0].price,
        status: this.orderArray[0].status,
        date: this.convertToDate(this.orderArray[0].date)
      })
    })
  }

  convertToDate(dateStr: string): string {
    const dateObject = new Date(dateStr);
    if (!isNaN(dateObject.getTime())) {
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObject.getDate().toString().padStart(2, '0');
      return `${dateObject.getFullYear()}-${month}-${day}`;
    }
    return '';
  }

  submit(editForm: FormGroup) {
    debugger
    let order = {
      name: editForm.value.name,
      email: editForm.value.email,
      price: editForm.value.price,
      status: editForm.value.status,
      date: editForm.value.date
    }
    for (let i = 0; i < this.orderArray.length; i++) {
      if (order.name == this.orderArray[i].name &&
        order.email == this.orderArray[i].email &&
        order.price == this.orderArray[i].price &&
        order.status == this.orderArray[i].status &&
        order.date == this.orderArray[i].date
      ) {
        alert('Please update the value/values')
        break
      } else {
        this.service.updateOrder(this.id, order).subscribe()
        this.editOrderForm.reset()
        this.service.getOrders().subscribe(res => {
          let newOrderArray = res
          this.service.getNewOrders(newOrderArray)
        })
        this.router.navigateByUrl('/orders')
        break
      }
    }
  }

}