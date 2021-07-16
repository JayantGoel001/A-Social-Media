import {Component, Inject, OnInit} from '@angular/core';
import {UserDataService} from "../user-data.service";
import {ApiService} from "../api.service";
import { Title } from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";

@Component({
	selector: 'app-page-friend-requests',
	templateUrl: './page-friend-requests.component.html',
	styleUrls: ['./page-friend-requests.component.css']
})
export class PageFriendRequestsComponent implements OnInit {

	public friendRequests:any

	constructor(private userData :UserDataService,private api:ApiService,private title:Title,@Inject(DOCUMENT) private document : Document) {  }

	ngOnInit(): void {
		this.title.setTitle("Friend Requests");
		this.userData.getUserData.subscribe((data:any)=>{
			let array = JSON.stringify(data.friendRequests);
			let requestObject = {
				type: "GET",
				location : `users/get-friend-requests?friend_requests=${array}`,
				authorize : true
			}
			this.api.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode===200) {
					this.friendRequests = val.data;
				}
			})
		});
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}
	}

	public updateFriendRequest(id:string){
		for (let i=0;i<this.friendRequests.length;i++) {
			if (this.friendRequests[i]._id === id){
				this.friendRequests.splice(i,1);
				break;
			}
		}
	}
}
