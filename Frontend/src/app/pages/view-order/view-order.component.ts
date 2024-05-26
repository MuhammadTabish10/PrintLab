import { ProductRuleService } from 'src/app/services/product-rule.service';
import { ErrorHandleService } from 'src/app/services/error-handle.service';
import { BackendErrorResponse } from 'src/app/Model/BackendErrorResponse';
import { GlobalVariables } from './../add-order/GlobalVariables';
import { OrdersService } from 'src/app/services/orders.service';
import { RequestBody } from './../product-rule/RequestBody';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductRule } from 'src/app/Model/ProductRule';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/Model/Order';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  productRule: ProductRule = { ...RequestBody.productRuleBody };
  order: Order = { ...GlobalVariables.order };
  idFromQueryParam: number | null | undefined;
  orderType: string | undefined | null;

  constructor(
    private productRuleService: ProductRuleService,
    private errorHandleService: ErrorHandleService,
    private orderService: OrdersService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.accessParams();
  }

  /**
   * Method to access query parameters from the route and fetch the order by ID.
   */
  private accessParams() {
    this.route.queryParams.subscribe(
      (param: Params) => {
        this.idFromQueryParam = +param['id'];
        this.orderType = param['orderType'];
        this.getOrderById(this.idFromQueryParam!);
      });
  }

  /**
   * Method to fetch order by ID and handle the response or error.
   * @param id - The ID of the order to fetch.
   */
  private getOrderById(id: number): void {
    this.orderService.getOrderById(id)
      .subscribe(
        (res: Order) => {
          this.order = res;
          this.handleOrderResponse(this.order);
        },
        (error: BackendErrorResponse) => {
          this.errorHandleService.showError(error.error.error);
        });
  }

  /**
   * Method to handle the order response based on the order type.
   * @param order - The order object.
   */
  private handleOrderResponse(order: Order): void {
    if (this.orderType === 'auto') {
      this.getProductRuleById(order.productRule!);
      this.parseForAuto(order);
    } else {
      this.getProductRuleByProductInOrder(order.product!);
    }
  }

  /**
   * Method to parse the size for orders of type 'auto'.
   * @param order - The order object.
   */
  private parseForAuto(order: Order): void {
    try {
      const parsedProperties = {
        sizeCategory: JSON.parse(order.sizeCategory!),
        size: JSON.parse(order.size!)
      };
      order.sizeCategory = parsedProperties.sizeCategory;

      // Ensure the parsed object has the 'inch' property
      if (parsedProperties.size && typeof parsedProperties.size === 'object' && 'inch' in parsedProperties.size) {
        order.size = parsedProperties.size.inch;
      } else {
        console.error('Parsed size does not contain inch property:', parsedProperties.size);
      }
    } catch (e) {
      console.error('Error parsing size:', e);
    }
  }

  /**
   * Method to fetch the product rule by ID.
   * @param id - The ID of the product rule to fetch.
   */
  private getProductRuleById(id: number): void {
    this.productRuleService.getProductRuleById(id).subscribe(
      res => {
        this.productRule = res;
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      });
  }

  /**
   * Method to fetch the product rule by the product in the order.
   * @param product - The product in the order.
   */
  private getProductRuleByProductInOrder(product: string): void {
    this.productRuleService.searchProduct(product).subscribe(
      (res: ProductRule[]) => {
        this.productRule = res[0];
      },
      (error: BackendErrorResponse) => {
        this.errorHandleService.showError(error.error.error);
      });
  }
}
