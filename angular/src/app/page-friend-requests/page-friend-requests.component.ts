import { Component, OnInit } from '@angular/core';
import { UserDataService } from "../user-data.service";
import { ApiService } from '../api.service';
import { Title } from "@angular/platform-browser";

@Component({
    selector: 'app-page-friend-requests',
    templateUrl: './page-friend-requests.component.html',
    styleUrls: ['./page-friend-requests.component.css']
})
export class PageFriendRequestsComponent implements OnInit {

    constructor(
        private centralUserData:UserDataService,
        private api:ApiService,private title:Title
    ) { }

    ngOnInit() {
        this.title.setTitle("Friend Request");
        this.centralUserData.getUserData.subscribe((data)=>{
            this.userData = data;

            let array = JSON.stringify(data.friend_requests);

            let requestObject = {
                location:`users/get-friend-requests?friend_requests=${array}`,
                type:"GET",
                authorize:true
            }

            this.api.makeRequest(requestObject).then((val)=>{
                if (val.statusCode === 200) {
                    this.friendRequests = val.users;
                    console.log(this.friendRequests);

                }
            });
        });
     }

    public userData:Object = {};
    public friendRequests = [];

    private updateFriendRequests(id) {
        console.log("Remove this",id);
        let arr = this.friendRequests;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]._id == id) {
                arr.splice(i,1);
                break;
            }
        }
    }
}
