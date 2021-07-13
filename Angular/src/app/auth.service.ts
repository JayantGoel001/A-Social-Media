import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(private router : Router) {

	}
	public canActivate(route :ActivatedRouteSnapshot, state : RouterStateSnapshot ) : boolean{
		let activate = this.isLoggedIn();
		let redirect = "/feed";
		if (route.data && route.data.loggedIn){
			activate = !activate;
			redirect = "/register";
		}
		if (!activate){
			return true;
		}else {
			this.router.navigate([redirect]).then(r => {  });
			return false;
		}
	}
	public isLoggedIn(){
		return false;
	}
}
