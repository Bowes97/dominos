import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { O_DSYNC } from 'constants';
import { IProductRequest, IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  public secondLetter!: string;
  public currentProduct: Array<IProductResponse> = [];
  public category!: string;
  public dessertsCategories!: string;
  public arrdesserts: Array<IProductResponse> = [];
  public snackCategories!: string;
  public arrSnack: Array<IProductResponse> = [];
  public drinkCategories!: string;
  public arrDrinks: Array<IProductResponse> = [];
  public pizzaCategories!: string;
  public arrPizza: Array<IProductResponse> = [];

  constructor(
    private acrivetedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService,
  ) {
    this.secondLetter = location.pathname.slice(7, 8)
    this.category = location.pathname.slice(6, 7)
    this.dessertsCategories = location.pathname.slice(6, 14)
    this.snackCategories = location.pathname.slice(6, 11)
    this.drinkCategories = location.pathname.slice(6, 12)
    this.pizzaCategories = location.pathname.slice(6, 11)
  }

  ngOnInit(): void {
    this.loadCurrentProduct();
    this.loadArrdesserts();
    this.loadArrSnack();
    this.loadArrDrinks();
    this.loadArrPizza();
  }


  loadCurrentProduct(): void {
    const name = String(this.acrivetedRoute.snapshot.paramMap.get('name'));
    this.productService.getByNameFB(name).then(data => {
      this.currentProduct = [];
      data.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() as IProductRequest }
        this.currentProduct.push(product)
      })
    })
  }

  loadArrdesserts(): void {
    this.productService.getByCategoryFB(this.dessertsCategories).then(data => {
      this.arrdesserts = [];
      data.forEach((doc) => {
        const dessert = { id: doc.id, ...doc.data() as IProductRequest }
        if (this.arrdesserts.length <= 5) {
          this.arrdesserts.push(dessert)
        }
      })
    })
  }

  loadArrSnack(): void {
    this.productService.getByCategoryFB(this.snackCategories).then(data => {
      this.arrSnack = [];
      data.forEach((doc) => {
        const snack = { id: doc.id, ...doc.data() as IProductRequest }
        this.arrSnack.push(snack)
        this.arrPizza.splice(1, 100)
      })
    })
  }

  loadArrDrinks(): void {
    this.productService.getByCategoryFB(this.drinkCategories).then(data => {
      this.arrDrinks = [];
      data.forEach((doc) => {
        const snack = { id: doc.id, ...doc.data() as IProductRequest }
        this.arrDrinks.push(snack)
        this.arrDrinks.splice(5, 100)
      })
    })
  }

  loadArrPizza(): void {
    this.productService.getByCategoryFB(this.pizzaCategories).then(data => {
      this.arrPizza = [];
      data.forEach((doc) => {
        const pizza = { id: doc.id, ...doc.data() as IProductRequest }
        this.arrPizza.push(pizza)
        this.arrPizza.splice(5, 100)
      })
    })
  }

  reload(): any {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
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
    }
    else {
      basket.push(product)
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.orderService.changeBasket.next(true);
  }

  changeCount(product: IProductResponse): void {
    ++product.count
    this.toastr.success('Товар добавлено в кошик!')
  }
}