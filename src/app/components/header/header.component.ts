import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { IProductResponse } from 'src/app/shared/interface/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  public registerForm!: FormGroup;
  public loginForm!: FormGroup;
  public isUserLogin = false;
  public isAdminLogin = false;
  public loginSubscription!: Subscription;
  public count: number = 0;
  public total: number = 0;
  public basket: Array<IProductResponse> = [];
  public backetEmpty = true;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) {

  }

  ngOnInit(): void {
    this.initRegisterForm();
    this.initLoginForm();
    this.checkLogin();
    this.getAuthData();
    this.loadBasket();
    this.changeCount();
  }
  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      oneMorePassword: [null, Validators.required]
    })
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      emailLogin: [null, Validators.required],
      passwordLogin: [null, Validators.required]
    })
  }

  register(): void {
    console.log(this.registerForm.value);
    const { email, password, oneMorePassword } = this.registerForm.value;
    if (oneMorePassword === password) {
      this.emailSignUp(email, password).then(data => {
        this.toastr.success('User successfully register!')
        this.initRegisterForm();
      })
    }
  }
  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      order: [],
      pizza: '',
      dateOfBirth: '',
      role: 'USER'
    }
    let data = await setDoc(doc(this.afs, "users", credential.user.uid), user);
    return data;

  }
  login(): void {
    const { emailLogin, passwordLogin } = this.loginForm.value;
    this.loginSingn(emailLogin, passwordLogin).then(() => {
      this.toastr.success('User successfully login!')
    }).catch(err => {
      console.log(err);
    })
    this.initLoginForm();
  }

  async loginSingn(emailLogin: string, passwordLogin: string): Promise<any> {
    const credential = await signInWithEmailAndPassword(this.auth, emailLogin, passwordLogin);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user))
      if (user && user['role'] === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else if (user && user['role'] === 'USER') {
        this.router.navigate(['/profile']);
      } else if (!user) {
        this.router.navigate(['/home'])
      }
      this.authService.currentUser$.next(true);
    })

  }

  getAuthData(): void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user') as string);
      if (user && user.role === 'ADMIN') {
        this.isAdminLogin = true;
        this.isUserLogin = false;
      } else if (user && user.role === 'USER') {
        this.isAdminLogin = false;
        this.isUserLogin = true;
      } else {
        this.isAdminLogin = false;
        this.isUserLogin = false;
      }
    } else {
      this.isAdminLogin = false;
      this.isUserLogin = false;
    }
  }
  checkLogin(): void {
    this.authService.currentUser$.subscribe(() => {
      this.getAuthData();
    })
  }
  signOut(): void {
    this.authService.logOut();
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
      this.backetEmpty = false;
    } else {
      this.count = this.basket.reduce((total, prod) => total + prod.count, 0)
      this.total = this.basket.reduce((total, prod) => total + prod.count * prod.price, 0)
      this.backetEmpty = true;
    }
  }

  changeCount(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket()
    })
  }

  refresh(): void {
    window.location.reload();

  }
}