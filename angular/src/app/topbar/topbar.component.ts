import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(public auth:AuthService,public router:Router,public storage:LocalStorageService) { }

    ngOnInit(): void {
        let token = this.storage.getToken();

        let name = JSON.parse(atob(token.split(".")[1])).name;
        this.userName = name;

    }

    public query:String = "";
    public userName:String = "";

    /**
     * searchForFriend
     */
    public searchForFriends() {
        this.router.navigate(['/search-results',{query:this.query}]);
    }

}
