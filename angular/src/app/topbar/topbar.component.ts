import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { AlertsService } from "../alerts.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(public auth:AuthService,public router:Router,
                public storage:LocalStorageService,public alert:AlertsService) { }

    ngOnInit(): void {
        this.userName = this.storage.getParsedToken().name;

        this.alert.onAlertEvent.subscribe((msg)=>{
            this.alertMessage = msg;
        });
    }

    public query:String = "";
    public userName:String = "";
    public alertMessage:String = "";

    /**
     * searchForFriend
     */
    public searchForFriends() {
        this.router.navigate(['/search-results',{query:this.query}]);
    }

}
