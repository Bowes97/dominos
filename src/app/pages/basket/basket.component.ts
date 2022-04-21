import { Component, OnInit } from '@angular/core';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {

  public orderForm!: FormGroup;
  public personalOrderForm!: FormGroup;
  public basket: Array<IProductResponse> = [];
  public count = 0;
  public total = 0;
  public existPerson!: boolean;
  public nameP!: string;
  public emailP!: string;
  public phoneNumberP!: string;
  public addressP!: string;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private personalFB: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.exist();
    this.loadProfile();
    this.initOrderForm();
    this.initPersonalOrderForm();
  }

  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string)
    } else {
      this.basket = [];
    }
    this.countProducts();
  }

  countProducts(): void {
    if (this.basket.length === 0) {
      this.count = 0;
      this.total = 0;
    } else {
      this.count = this.basket.reduce((total, prod) => total + prod.count, 0)
      this.total = this.basket.reduce((total, prod) => total + prod.count * prod.price, 0)
    }
  }

  changeCount(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket()
    })
  }

  changeCounts(product: IProductResponse, status: boolean): void {
    if (status) {
      ++product.count;
    }
    else if (!status && product.count > 0) {
      --product.count;
    }
  }

  addProduct(product: IProductResponse): void {
    let basket: IProductResponse[] = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string)
      if (basket.some(prod => prod.id === product.id)) {
        const index = basket.findIndex(prod => prod.id === product.id);
        basket[index].count = product.count;
      }
      else {
        basket.push(product)
      }
    }
    else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.countProducts()
    this.orderService.changeBasket.next(true);
  }

  deleteProduct(product: IProductResponse): void {
    if (confirm('Are you sure?')) {
      const index = this.basket.findIndex(p => p.id === product.id);
      this.basket.splice(index, 1);
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.orderService.changeBasket.next(true);
    }
  }

  removeProduct(product: IProductResponse): void {
    if (product.count === 1) {
      const index = this.basket.findIndex(p => p.id === product.id);
      this.basket.splice(index, 1);
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.orderService.changeBasket.next(true);
    }
  }

  exist(): void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      this.existPerson = true;
    } else {
      this.existPerson = false;
    }
  }

  loadProfile(): void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      let user;
      user = JSON.parse(localStorage.getItem('user') as string)
      this.nameP = user.firstName;
      this.emailP = user.email;
      this.addressP = user.address;
      this.phoneNumberP = user.phoneNumber;
    }
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      comment: [null, Validators.required],
      payment: [null, Validators.required],
      email: [null, Validators.required]
    })
  }

  initPersonalOrderForm(): void {
    this.personalOrderForm = this.personalFB.group({
      nameP: [this.nameP, Validators.required],
      phoneNumberP: [this.phoneNumberP, Validators.required],
      addressP: [this.addressP, Validators.required],
      commentP: [null, Validators.required],
      paymentP: [null, Validators.required],
      emailP: [this.emailP, Validators.required]
    })
  }

  changePayment(e: any) {
    this.orderForm.patchValue({
      payment: e.value,
    })
  }

  confirmOrder(): void {
    const order = {
      ...this.orderForm.value,
      basket: this.basket,
      price: this.total,
      status: 'PENDING'
    }
    this.orderService.createFB(order).then(() => {
      localStorage.removeItem('basket')
      this.orderService.changeBasket.next(true)
      this.loadBasket();
      this.toastr.success('Ваше замовлення прийнято!')
    }).catch(err => {
      this.toastr.error("Будь ласка перевірте данні!")
    })
  }

  confirmOrderPersonal(): void {
    const order = {
      ...this.personalOrderForm.value,
      basket: this.basket,
      price: this.total,
      status: 'PENDING'
    }
    this.orderService.createFB(order).then(() => {
      localStorage.removeItem('basket')
      this.orderService.changeBasket.next(true)
      this.loadBasket();
      this.toastr.success('Ваше замовлення прийнято!')
    }).catch(err => {
      this.toastr.error("Будь ласка перевірте данні!")
    })
  }
}
