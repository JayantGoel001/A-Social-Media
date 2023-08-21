import {Component, Inject, OnInit} from '@angular/core';
import { Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import {ApiService} from "../api.service";
import {EventEmitterService} from "../event-emitter.service";
import {AutoUnsubscribe} from "../unsubscribe";

@Component({
	selector: 'app-page-profile',
	templateUrl: './page-profile.component.html',
	styleUrls: ['./page-profile.component.css']
})

@AutoUnsubscribe
export class PageProfileComponent implements OnInit {

	public randomFriends :any = [];
	public totalFriends:number = 0;
	public posts:object[] = [];
	public profileImage:string = "default_avatar";

	public userName:string = "";
	public userEmail:string = "";
	public userID:string = "";

	public subscriptions :any= [];

	public showPosts :number = 6;
	public canAddUser:boolean = false;
	public canSendMessage:boolean = false;
	public haveSentFriendRequest:boolean = false;
	public haveReceivedFriendRequest:boolean = false;
	public isBestie : boolean = false;
	public isEnemy :boolean = false;
	public maxAmountOfBesties:boolean = false;

	private besties = [];
	private enemies = [];

	ngOnInit(): void {
		this.title.setTitle("A Social Media - Profile");
		if (this.document.getElementById("sidebarToggleTop")) {
			// @ts-ignore
			this.document.getElementById("sidebarToggleTop").classList.add("d-none");
		}

		let userDataEvent = this.events.getUserData.subscribe((user)=>{

			this.besties = user.besties;
			this.enemies = user.enemies;

			this.route.params.subscribe((params)=> {
				this.showPosts = 6;

				if (user.besties){
					this.isBestie = user.besties.some((val:any)=> val._id.toString() === params.userID.toString());
					this.maxAmountOfBesties = user.besties.length>=2;
				}

				if (user.enemies){
					this.isEnemy = user.enemies.some((val:any)=> val._id.toString() === params.userID.toString());
				}

				if (user._id.toString() === params.userID.toString()) {
					this.setComponentValues(user);
					this.resetBooleans();
				} else {
					this.canSendMessage = true;

					let requestObject = {
						location: "api/get-user-data/" + params.userID,
						method: "GET"
					}
					this.api.makeRequest(requestObject).then((val: any) => {
						if (val.statusCode === 200) {
							this.canAddUser = !user.friends.includes(val.user._id);
							this.haveReceivedFriendRequest = user.friendRequests.includes(val.user._id);
							this.haveSentFriendRequest = val.user.friendRequests.includes(user._id);

							if (this.canAddUser){
								this.showPosts = 0;
							}

							this.setComponentValues(val.user);
						}
					});
				}
			})
		});

		this.subscriptions.push(userDataEvent);
	}

	constructor(
		private title: Title,
		private api:ApiService,
		private route:ActivatedRoute,
		private events:EventEmitterService,
		@Inject(DOCUMENT) private document : Document,
	) {

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
		this.userID = user._id;
	}

	public accept(){
		this.api.resolveFriendRequest("accept",this.userID).then((val:any)=>{
			if (val.statusCode === 201){
				this.haveReceivedFriendRequest = false;
				this.canAddUser = false;
				this.totalFriends++;
				this.showPosts = 6;
			}
		});
	}
	public decline(){
		this.api.resolveFriendRequest("decline",this.userID).then((val:any)=>{
			if (val.statusCode === 201){
				this.haveReceivedFriendRequest = false;
			}
		});
	}

	public makeFriendRequest(){
		this.api.makeFriendRequest(this.userID).then((val:any)=>{
			if (val.statusCode === 201){
				this.haveSentFriendRequest =true;
			}
		})
	}

	private resetBooleans(){
		this.canAddUser = false;
		this.canSendMessage = false;
		this.haveSentFriendRequest = false;
		this.haveReceivedFriendRequest = false;
		this.isBestie = false;
		this.isEnemy = false;
		this.maxAmountOfBesties = false;
	}

	public updateSendMessageObject(id:string,name:string){
		this.events.updateSendMessageObjectEvent.emit({id, name});
	}

	public toggleBestie(){
		this.toggleRequest('besties');
	}

	public toggleEnemy(){
		this.toggleRequest('enemies');
	}

	public toggleRequest(toggle:any){

		const toggleValue = (ar: any) => {
			for (let i = 0; i < ar.length; i++) {
				if (ar[i]._id.toString() === this.userID.toString()){
					return ar.splice(i,1);
				}
			}
			ar.push({ _id : this.userID });
		}

		let requestObject = {
			location : `api/bestie-enemy-toggle/${this.userID}?toggle=${toggle}`,
			method : "POST"
		}

		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.statusCode === 201){
				if (toggle==="besties"){
					toggleValue.call(this,this.besties);
					this.maxAmountOfBesties = this.besties.length>=2;
					this.isBestie = !this.isBestie;
				}else {
					toggleValue.call(this,this.enemies);
					this.isEnemy = !this.isEnemy;
				}
			}
		});
	}
}
