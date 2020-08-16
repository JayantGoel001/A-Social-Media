import { Injectable } from '@angular/core';
import { CanActivate,Router,RouterStateSnapshot,ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router:Router) { }
    
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot) : boolean{
        const loggedIn = this.isLoggedIn();
        let activate = loggedIn;
        let redirect = "/feed";

        if (route.data.loggedIn) {
            activate = !activate;
            redirect = "/register";
        }

        if (!activate) {
            return true;
        }
        else{
            this.router.navigate([redirect]);
            return false;
        }
    }

    isLoggedIn(){
        return false;
    }
}
