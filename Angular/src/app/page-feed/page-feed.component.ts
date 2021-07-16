import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import { Title } from "@angular/platform-browser";
import {LocalStorageService} from "../local-storage.service";
import {EventEmitterService} from "../event-emitter.service";

@Component({
	selector: 'app-page-feed',
	templateUrl: './page-feed.component.html',
	styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

	public newPostContent : string = "";
	public newPostTheme : string =  "primary";
	public posts = [[], [], [], []];

	constructor(
		private api:ApiService,
		private title:Title,
		private localStorage:LocalStorageService,
		private events:EventEmitterService
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Feed");
		let requestObject = {
			type: "GET",
			location : "users/generate-feed",
			authorize : true
		}
		this.api.makeRequest(requestObject).then((val:any)=>{
			if(val.statusCode===200) {
				for (let i = 0; i < 4; i++) {
					this.posts[i] = val.posts.filter((_: any, x: number) => x % 4 == i);
				}
			}else {
				this.events.onAlertEvent.emit("Something went wrong.")
			}
		});

		if (this.localStorage.getPostTheme()){
			this.newPostTheme = this.localStorage.getPostTheme();
		}
	}

	public changeTheme(theme:string){
		this.newPostTheme = theme;
		this.localStorage.setPostTheme(this.newPostTheme);
	}

	public createPost(){
		if (this.newPostContent.length===0){
			return this.events.onAlertEvent.emit("No Content for your post was provided.");
		}

		let requestOption = {
			type : "POST",
			location: "users/create-post",
			body : {
				theme : this.newPostTheme,
				content : this.newPostContent
			},
			authorize: true
		}
		this.api.makeRequest(requestOption).then((val:any)=>{
			if (val.statusCode===201) {
				this.events.onAlertEvent.emit(val.message);
				this.newPostContent = "";
				val.post.timeAgo = "now";
				// @ts-ignore
				this.posts[0].unshift(val.post);
			}else {
				this.events.onAlertEvent.emit("Something went wrong.");
			}
		})
	}
}
