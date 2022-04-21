import { Component, OnInit } from '@angular/core';
import { IProductRequest, IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { ProfileService } from 'src/app/shared/services/profile/profile.service';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IProfileRequest, IProfileResponse } from 'src/app/shared/interface/profile/profile.interface';
import { IOrderResponse } from 'src/app/shared/interface/order/order.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm!: FormGroup;
  public model!: NgbDateStruct;
  public email!: string;
  public pizza = 'pizza';
  public products: Array<any> = [];
  public user!: any;
  public currentProfileId!: number | string;
  public arrProfile: Array<IProfileResponse> = [];

  constructor(
    private profileService: ProfileService,
    private productSerive: ProductService,
    private afs: Firestore,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.loadPizza();
    this.initProfile();

  }

  loadProfile(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string)
    this.email = this.user.email;
    this.profileService.getAllFBUsers().subscribe(data => {
      this.arrProfile = data as any;
    })
  }

  initProfile(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string)
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName],
      lastName: [this.user.lastName],
      email: [this.user.email],
      dateOfBirth: [this.user.dateOfBirth],
      role: ["USER"],
      phoneNumber: [this.user.phoneNumber],
      address: [this.user.address]
    })
    console.log(this.user);
  }

  loadPizza(): void {
    this.productSerive.getByCategoryFB(this.pizza).then(data => {
      this.products = [];
      data.forEach((doc) => {
        const product = { id: doc.id, ...doc.data() as IProductRequest };
        this.products.push(product)
      })
    })
  }


  updateInfo(user: IProfileResponse): void{
    this.profileService.getByEmailFB(user.email).then(data => {
      data.forEach((doc)=>{
        this.currentProfileId = doc.id;
      })
      this.profileService.updateUserFB(this.profileForm.value, this.currentProfileId).then(data => {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(this.profileForm.value))
        
      })
    })
  }
  
}
