import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { AlertsService } from "../alerts.service";
import { UserDataService } from "../user-data.service";
import { ApiService } from '../api.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

    constructor(public auth:AuthService,public router:Router,
                public storage:LocalStorageService,public alert:AlertsService,
                private centralUserData:UserDataService,private api:ApiService) { }

    ngOnInit(): void {
        this.userName = this.storage.getParsedToken().name;
        this.userId = this.storage.getParsedToken()._id;
        this.alert.onAlertEvent.subscribe((msg)=>{
            this.alertMessage = msg;
        });
        this.centralUserData.getUserData.subscribe((data)=>{
            this.userData = data;
            this.numOfFriendsRequests = data.friend_requests.length;
        });
        let requestObject = {
            location:`users/get-user-data/${this.userId}`,
            type:"GET",
            authorize:true
        }

        this.api.makeRequest(requestObject).then((val)=>{
            console.log(val);
            this.centralUserData.getUserData.emit(val.user);
        })

    }

    public userData:object = {};
    public numOfFriendsRequests:number = 0;
    public userId :String = "";

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
