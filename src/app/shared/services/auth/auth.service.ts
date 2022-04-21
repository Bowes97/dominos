import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { reload } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser$ = new Subject<boolean>();

  constructor(
    private auth: Auth,
    private router: Router
  ) { }

  logOut(): void {
    signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['discounts']);
      this.currentUser$.next(false);
    })
  }

}


