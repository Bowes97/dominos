import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductRequest, IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { IDiscountResponse } from 'src/app/shared/interface/discount/discount.interface';
import { addSubtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class ProductComponent implements OnInit {

  public menu!: string;
  public products: Array<IProductResponse> = [];
  public currentCategoryName!: string;
  public eventsSubscriptions!: Subscription;
  public work = true;
  public searchPrice: Array<any> = [];
  public basketIs = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.eventsSubscriptions = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.activatedRoute.snapshot.paramMap.get('category');
        this.loadProducts(categoryName as string);
        this.menu = location.pathname.substring(6);
      }
    })
  }

  ngOnInit(): void {

  }

  loadProducts(name: string): void {
    this.productService.getByCategoryFB(name).then(data => {
      this.products = [];
      data.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() as IProductRequest };
        this.products.push(product)
      });
      this.currentCategoryName = this.products[0].category.name;
    }).catch(err => {
      console.log('Load products error', err);
    })
  }

  checkName($event: any) {
    console.log($event);
  }

  setZero($event: any) {
    $event.size = 0;
  }

  setOne($event: any) {
    $event.size = 1;
  }

  setTwo($event: any) {
    $event.size = 2;
  }

  boughtOne($event: any) {
    $event.bought = 1;
  }

  boughtZero($event: any) {
    if ($event.count === 0) {
      $event.bought = 0;
    }
  }

  onButtonGroupClick($event: any) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }
  }

  numbers(): void {
    this.productService.getAllFB().subscribe(data => {
      this.searchPrice = data;
      this.searchPrice.sort(function (a: any, b: any) {
        return a.price - b.price;
      })
    })
  }

  changeCount(product: IProductResponse, status: boolean): void {
    if (status) {
      ++product.count;
    }
    else if (!status && product.count > 0) {
      --product.count;
    }
  }

  plus(product: IProductResponse): void {
    product.count = 1;
  }

  addToBasket(product: IProductResponse): void {
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
      if (product.count === 0) {
        if (basket.some(prod => prod.id === product.id)) {
          const index = basket.findIndex(prod => prod.id === product.id);
          basket.splice(index, 1)
        }
      }
    }
    else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.existBasket();
    this.orderService.changeBasket.next(true);
  }

  existBasket(): void {
    let basket: IProductResponse[] = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string)
      if (basket.length === 0) {
        this.basketIs = false;
      } else {
        this.basketIs = true;
      }
    }
  }

  lowPrice(): void {
    this.products.sort(function (a: any, b: any) {
      return a.price - b.price;
    })
  }
  highPrice(): void {
    this.products.sort(function (a: any, b: any) {
      return b.price - a.price;
    })
  }


}







