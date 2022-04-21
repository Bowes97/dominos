import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDiscountRequest, IDiscountResponse } from 'src/app/shared/interface/discount/discount.interface';
import { DiscountService } from 'src/app/shared/services/discount/discount.service';

@Component({
  selector: 'app-discounts-details',
  templateUrl: './discounts-details.component.html',
  styleUrls: ['./discounts-details.component.scss']
})
export class DiscountsDetailsComponent implements OnInit {

  public eventsSubscriptions!: Subscription;
  public currentDiscount: Array<IDiscountResponse> = [];
  public mainTime!: string;

  constructor(
    private acrivetedRoute: ActivatedRoute,
    private discountService: DiscountService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCurrentDiscount();
  }

  loadCurrentDiscount(): void {
    const path = String(this.acrivetedRoute.snapshot.paramMap.get('path'));
    this.discountService.getByOneFB(path).then(data => {
      this.currentDiscount = [];
      data.forEach((doc) => {
        const discount = { id: doc.id, ...doc.data() as IDiscountRequest };
        this.currentDiscount.push(discount);
      })
      this.currentDiscount.forEach((doc) => {
        this.mainTime = '';
        let time = doc.time.toLocaleString().slice(18, 28) as any;
        const date = new Date(time * 1000);
        const main = date.toLocaleDateString("uk-UA")
        this.mainTime = main;
      })
    })
  }

}
