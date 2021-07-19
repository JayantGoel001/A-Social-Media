import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorageService} from "./local-storage.service";


@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(
		private router : Router,
		private localStorage : LocalStorageService
	) {  }

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
			this.router.navigate([redirect]).then(_ => {  });
			return false;
		}
	}

	public isLoggedIn(){
		return !!this.localStorage.getToken();
	}

	public logOut(){
		this.localStorage.removeToken();
		this.router.navigate(["/login"]).then(_ => {  });
	}
}
