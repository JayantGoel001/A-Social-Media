import { Component, OnInit } from '@angular/core';
import {UserDataService} from "../user-data.service";
import {ApiService} from "../api.service";

@Component({
	selector: 'app-page-friend-requests',
	templateUrl: './page-friend-requests.component.html',
	styleUrls: ['./page-friend-requests.component.css']
})
export class PageFriendRequestsComponent implements OnInit {

	public data:any

	constructor(private userData :UserDataService,private api:ApiService) {  }

	ngOnInit(): void {
		this.userData.getUserData.subscribe((data:any)=>{
			let array = JSON.stringify(data.friendRequests);
			let requestObject = {
				type: "GET",
				location : `users/get-friend-requests?friend_requests=${array}`,
				authorize : true
			}
			this.api.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode===200) {
					this.data = val.data;
				}
			})
		});
	}
}
