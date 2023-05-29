import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { UserAuthService } from '../services/user-auth.service';

@Injectable({
 providedIn: 'root'
})
export class homeGuard {

 constructor(private auth: UserAuthService, private router: Router) {}
 canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
 const isvalidtoken = this.auth.verifyToken(localStorage.getItem('token'));
 console.log(isvalidtoken);
 if (isvalidtoken) {
 // validate token here
 return true;
 } else {
 this.router.navigate(['/login']);
 return false;
 }
 }
}
