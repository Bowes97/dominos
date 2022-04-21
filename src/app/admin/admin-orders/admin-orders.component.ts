import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IOrderResponse } from 'src/app/shared/interface/order/order.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  public person!: string;
  public adminOrders: Array<IOrderResponse> = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllFB().subscribe(data => {
      this.adminOrders = data as IOrderResponse[];
    }, err => {
      console.log(err);
    })
  }

  deleteOrder(order: IOrderResponse): void {
    this.orderService.deleteFB(order as any).then(data => {
      this.loadOrders();
      this.toastr.success('Order successfully deleted!');
    }, err => {
      console.log('delete order error', err);
      this.toastr.error(err.message);
    });
  }
}
