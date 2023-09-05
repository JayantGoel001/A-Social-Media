import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import {AutoUnsubscribe} from "../unsubscribe";
import {EventEmitterService} from "../event-emitter.service";

@Component({
	selector: 'app-page-searches',
	templateUrl: './page-searches.component.html',
	styleUrls: ['./page-searches.component.css']
})

@AutoUnsubscribe
export class PageSearchesComponent implements OnInit {

	public results:Array<any> = [];
	public searchQuery = this.route.snapshot.params.query;
	public subscriptions:any = [];

	public user:any;

	constructor(
		private api:ApiService,
		private route:ActivatedRoute,
		private title:Title,
		@Inject(DOCUMENT) private document : Document,
		private userData:EventEmitterService
	) {  }

	ngOnInit(): void {
		this.title.setTitle("Search Results");
		let userDataEvent = this.userData.getUserData.subscribe((data)=>{
			this.route.params.subscribe(params=>{
				this.searchQuery = params.query;
				this.user = data;
				this.getResults();
			});
		});
		this.subscriptions.push(userDataEvent);
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}
	}

	private getResults(){

		let requestObject = {
			method:"GET",
			location:`api/search-results?query=${this.searchQuery}`
		}

		this.api.makeRequest(requestObject).then((results:any)=>{
			this.results = results.results;

			for (const result of this.results) {
				if (result.friends.includes(this.user._id)){
					result.isFriend = true;
				}

				if (result.friendRequests.includes(this.user._id)){
					result.haveSentFriendRequest = true;
				}

				if (this.user.friendRequests.includes(result._id)){
					result.haveReceivedFriendRequest = true;
				}
			}
		});
	}
}
