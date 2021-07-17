import {Component, Inject, OnInit} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import {UserDataService} from "../user-data.service";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-page-profile',
  templateUrl: './page-profile.component.html',
  styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

	public randomFriends :any = [];
	public totalFriends:number = 0;
	public posts:object[] = [];
	public profileImage:string = "default_avatar";
	public userName:string = "";
	public userEmail:string = "";

	public showPosts :number = 6;
	public canAddUser:boolean = false;
	public canSendMessage:boolean = true;

	constructor(
		private title: Title,
		@Inject(DOCUMENT) private document : Document,
		private userData:UserDataService,
		private api:ApiService,
		private route:ActivatedRoute
	) {

	}

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Profile");
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}

		let paramID = this.route.snapshot.params.userID;

		this.userData.getUserData.subscribe((user)=>{
			if (user._id.toString() === paramID.toString()) {
				this.setComponentValues(user);
			} else {

			}
		});
	}

	public showMorePosts() {
		this.showPosts+=6;
	}

	public backToTop() {
		this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
	}

	public setComponentValues(user:any){
		this.randomFriends = user.randomFriends;
		this.profileImage = user.profileImage;
		this.userEmail = user.email;
		this.totalFriends = user.friends.length;
		this.userName = user.name;
		this.posts = user.posts;
	}
}
