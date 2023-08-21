import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import { Title } from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {AutoUnsubscribe} from "../unsubscribe";
import {EventEmitterService} from "../event-emitter.service";

@Component({
	selector: 'app-page-friend-requests',
	templateUrl: './page-friend-requests.component.html',
	styleUrls: ['./page-friend-requests.component.css']
})
@AutoUnsubscribe
export class PageFriendRequestsComponent implements OnInit {

	public friendRequests:any;
	public subscriptions :any= [];

	constructor(
		private userData :EventEmitterService,
		private api:ApiService,
		private title:Title,
		@Inject(DOCUMENT) private document : Document
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("Friend Requests");
		let userDataEvent = this.userData.getUserData.subscribe((data:any)=>{
			let array = JSON.stringify(data.friendRequests);
			let requestObject = {
				method: "GET",
				location : `api/get-friend-requests?friend_requests=${array}`
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
		this.subscriptions.push(userDataEvent);
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
