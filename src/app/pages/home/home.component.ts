import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProductRequest, IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';
import { ProductService } from 'src/app/shared/services/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public work = true;
  public menu!: string;
  public discount: Array<any> = [];
  public products: Array<any> = [];
  public pizza = 'pizza'

  constructor(
    private discountSerive: DiscountService,
    private productSerive: ProductService,
  ) { }

  ngOnInit(): void {
    this.getInfo();
    this.getProducts();
  }

  getInfo(): void {
    this.discountSerive.getAllFB().subscribe(data => {
      this.discount = data;
    })
  }

  getProducts(): void {
    this.productSerive.getByCategoryFB(this.pizza).then(data => {
      this.products = [];

      data.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() as IProductRequest };
        this.products.push(product)

        console.log(this.products);
      })
    })
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

  works($event: any): void {
    let text = $event.target.innerHTML;
    if (text === "Середня" || text === "Велика") {
      this.work = false;
    } else {
      this.work = true;
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
