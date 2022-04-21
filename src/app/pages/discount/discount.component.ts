import { Component, OnInit } from '@angular/core';
import { IDiscountResponse } from 'src/app/shared/interface/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  public userDiscounts: Array<IDiscountResponse> = [];

  constructor(
    private discountService: DiscountService,
  ) { }

  ngOnInit(): void {
    this.loadDiscount();
  }

  loadDiscount(): void {
    this.discountService.getAllFB().subscribe(data => {
      this.userDiscounts = data as IDiscountResponse[];
      this.userDiscounts.forEach((doc) => {
        let time = doc.time.toLocaleString().slice(18, 28) as any;
        const date = new Date(time * 1000);
        const main = date.toLocaleDateString("uk-UA") as any;
        doc.time = main;
      });
    }, err => {
      console.log('Load discount error', err);
    })
  }
}
