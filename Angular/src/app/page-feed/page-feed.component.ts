import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";
import { Title } from "@angular/platform-browser";
import {LocalStorageService} from "../local-storage.service";

@Component({
	selector: 'app-page-feed',
	templateUrl: './page-feed.component.html',
	styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

	public newPostContent : string = "";
	public newPostTheme : string =  "primary";

	constructor(private api:ApiService,private title:Title,private localStorage:LocalStorageService) {  }

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Feed");
		let requestObject = {
			type: "GET",
			location : "users/generate-feed",
			authorize : true
		}
		this.api.makeRequest(requestObject).then((val:any)=>{

		});
		if (this.localStorage.getPostTheme()){
			this.newPostTheme = this.localStorage.getPostTheme();
		}
	}

	public changeTheme(theme:string){
		this.newPostTheme = theme;
		this.localStorage.setPostTheme(this.newPostTheme);
	}
}
