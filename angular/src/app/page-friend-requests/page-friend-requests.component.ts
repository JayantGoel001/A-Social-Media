import { Component, OnInit } from '@angular/core';
import { UserDataService } from "../user-data.service";
import { ApiService } from '../api.service';
@Component({
    selector: 'app-page-friend-requests',
    templateUrl: './page-friend-requests.component.html',
    styleUrls: ['./page-friend-requests.component.css']
})
export class PageFriendRequestsComponent implements OnInit {

    constructor(
        private centralUserData:UserDataService,
        private api:ApiService
    ) { }

    ngOnInit() {
        this.centralUserData.getUserData.subscribe((data)=>{
            this.userData = data;
            console.log(this.userData);

            let array = JSON.stringify(data.friend_requests);

            let requestObject = {
                location:`users/get-friend-requests?friend_requests=${array}`,
                type:"GET",
                authorize:true
            }

            this.api.makeRequest(requestObject).then((val)=>{
                console.log(val);
            });
        });
     }

    public userData:Object = {};
}
