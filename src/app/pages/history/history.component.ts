import { Component, OnInit } from '@angular/core';
import { IProfileRequest, IProfileResponse } from 'src/app/shared/interface/profile/profile.interface';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public historyTable: Array<IProfileResponse> = [];

  constructor(
    private profileService: ProfileService,
  ) { }

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    let user;
    user = JSON.parse(localStorage.getItem('user') as string);
    let email = user.email;
    this.profileService.getOrdersFB(email).then(data => {
      this.historyTable = [];
      data.forEach((doc) => {
        const history = { id: doc.id, ...doc.data() as IProfileRequest };
        this.historyTable.push(history)
      });
    })
  }

}
