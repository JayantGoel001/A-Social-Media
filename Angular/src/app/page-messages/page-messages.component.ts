import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import {ApiService} from "../api.service";
import {UserDataService} from "../user-data.service";
import {AutoUnsubscribe} from "../unsubscribe";

@Component({
	selector: 'app-page-messages',
	templateUrl: './page-messages.component.html',
	styleUrls: ['./page-messages.component.css']
})
@AutoUnsubscribe
export class PageMessagesComponent implements OnInit {

	constructor(
		private title: Title,
		private api:ApiService,
		public userData:UserDataService
	) {

	}

	public activeMessage:any= {
		fromID :"",
		fromName : "",
		fromProfilePicture : "",
		messageGroups: []
	}

	public messages:any = [];
	public userProfileImage = "default_avatar";
	public userName :string = "";
	public userID :string = "";
	public subscriptions :any = [];

	ngOnInit(): void {
		this.title.setTitle("Your Messages");
		this.api.resetMessageNotifications().then(()=>{

		});
		if (history.state.data && history.state.data.msgID){
			this.activeMessage.fromID = history.state.data.msgID;
		}
		let userDataEvent = this.userData.getUserData.subscribe((val)=>{
			this.activeMessage.fromID = this.activeMessage.fromID || val.messages[0].fromID;
			this.messages = val.messages;
			this.userName = val.name;
			this.userID = val._id;
			this.userProfileImage = val.profileImage;
			this.setActiveMessage(this.activeMessage.fromID);
		});
		this.subscriptions.push(userDataEvent);
	}

	public setActiveMessage(id:string){
		for (const message of this.messages) {
			if (message.fromID.toString() === id){
				this.activeMessage.fromID = message.fromID;
				this.activeMessage.fromName = message.messengerName;
				this.activeMessage.fromProfilePicture = message.messengerProfileImage;

				let groups:any= (this.activeMessage.messageGroups = []);
				for (const content of message.content) {
					let me = (content.messenger.toString() === this.userID.toString());

					if (groups.length) {
						var lastMessengerID = groups[groups.length - 1].id;
						if (content.messenger.toString() === lastMessengerID.toString()) {
							groups[groups.length - 1].messages.push(content.message);
							continue;
						}
					}
					let group:any = {
						image: me ? this.userProfileImage : message.messengerProfileImage,
						name: me ? "Me" : message.messengerName,
						id: content.messenger,
						messages: [content.message],
						isMe: me
					}
					groups.push(group);
				}
			}
		}
	}
}
