import { Injectable } from '@angular/core';
import { CanActivate,Router,RouterStateSnapshot,ActivatedRouteSnapshot } from "@angular/router";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private router:Router,private storage:LocalStorageService) { }

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
        if (this.storage.getToken()) {
            return true;
        }
        return false;
    }

    /**
     * logout
     */
    public logout() {
        this.storage.removeToken();
        this.router.navigate(['/login']);
    }
}
