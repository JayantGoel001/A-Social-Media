import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import {ApiService} from "../api.service";
import {AutoUnsubscribe} from "../unsubscribe";
import {EventEmitterService} from "../event-emitter.service";

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
		public userData:EventEmitterService
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
	public newMessage:string = "";

	ngOnInit(): void {
		this.title.setTitle("Your Messages");
		this.api.resetMessageNotifications().then(()=>{

		});
		if (history.state.data && history.state.data.msgID){
			this.activeMessage.fromID = history.state.data.msgID;
		}
		let userDataEvent = this.userData.getUserData.subscribe((val)=>{
			if (val.messages.length===0){
				return;
			}
			this.activeMessage.fromID = this.activeMessage.fromID || val.messages[0].fromID;
			this.messages = val.messages.reverse();
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
						const lastMessengerID = groups[groups.length - 1].id;
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

	public sendMessage(){
		if (!this.newMessage){
			return;
		}

		let obj = {
			content : this.newMessage,
			id : this.activeMessage.fromID
		}

		this.api.sendMessage(obj,false)?.then((val:any)=>{
			if (val.statusCode === 201) {
				let groups = this.activeMessage.messageGroups;
				if (groups[groups.length-1].isMe){
					groups[groups.length-1].messages.push(this.newMessage);
				}else {
					let newGroup = {
						image : this.userProfileImage,
						name : this.userName,
						id : this.userID,
						messages : [this.newMessage],
						isMe : true
					}
					groups.push(newGroup);
				}

				for (const message of this.messages) {
					if (message.fromID.toString() === this.activeMessage.fromID.toString()){
						let newContent = {
							message : this.newMessage,
							messenger : this.userID
						}
						message.content.push(newContent);
					}
				}
				this.newMessage = "";
			}
		});
	}
	public deleteMessage(id:string){
		let requestObject = {
			location : `api/delete-messages/${id}`,
			method : "POST"
		}

		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.statusCode === 201){
				for (let i = 0;i<this.messages.length;i++) {
					if (this.messages[i]._id.toString() === id.toString()){
						this.messages.splice(i,1);
						if (!this.messages.length){
							return;
						}
						this.setActiveMessage(this.messages[0].fromID);
						break;
					}
				}
			}
		});
	}
}
