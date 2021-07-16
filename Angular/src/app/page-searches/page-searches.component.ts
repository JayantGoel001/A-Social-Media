import {Component, Inject, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {ActivatedRoute} from "@angular/router";
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import {UserDataService} from "../user-data.service";

@Component({
	selector: 'app-page-searches',
	templateUrl: './page-searches.component.html',
	styleUrls: ['./page-searches.component.css']
})
export class PageSearchesComponent implements OnInit {

	public results:Array<any> = [];
	public searchQuery = this.route.snapshot.params.query;
	private subscription: any;

	public user:any;

	constructor(private api:ApiService,private route:ActivatedRoute,private title:Title,@Inject(DOCUMENT) private document : Document,private userData:UserDataService) {  }

	ngOnInit(): void {
		this.title.setTitle("Search Results");
		this.subscription = this.route.params.subscribe(params=>{
			this.searchQuery = params.query;
			this.userData.getUserData.subscribe((data)=>{
				this.user = data;
				this.getResults();
			});
		});
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}

	}

	private getResults(){
		let requestObject = {
			type:"GET",
			location:`users/search-results?query=${this.searchQuery}`,
			authorize: true
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
