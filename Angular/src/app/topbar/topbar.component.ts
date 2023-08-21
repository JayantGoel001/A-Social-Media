import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";
import { ApiService } from "../api.service";
import { AutoUnsubscribe } from "../unsubscribe";

@Component({
	selector: 'app-topbar',
	templateUrl: './topbar.component.html',
	styleUrls: ['./topbar.component.css']
})
@AutoUnsubscribe
export class TopbarComponent implements OnInit {

	public userName: string = "";
	public userID: any;
	public profilePicture: string = "default_avatar";

	public alertMessage: string = "";
	public subscriptions: any = [];
	public messagePreview: any = [];
	public query: string = "";

	public sendMessageObject = {
		id: "",
		name: "",
		content: ""
	}

	public notifications: any = {
		alerts: 0,
		friendRequests: 0,
		messages: 0
	}
	public alertsArray: any = [];

	constructor(
		public auth: AuthService,
		private router: Router,
		private localStorage: LocalStorageService,
		private alerts: EventEmitterService,
		public api: ApiService
	) { }

	ngOnInit(): void {
		let parsedToken = this.localStorage.getParsedToken();
		this.userName = parsedToken.name;
		this.userID = parsedToken._id;

		let alertEvent = this.alerts.onAlertEvent.subscribe((message: string) => {
			this.alertMessage = message;
		});

		let friendAlert = this.alerts.updateNumberOfFriendRequestEvent.subscribe(() => {
			this.notifications.friendRequests--;
		});
		let userDataEvent = this.alerts.getUserData.subscribe((data) => {
			this.notifications.friendRequests = data.friendRequests.length;
			this.notifications.messages = data.latestMessageNotifications.length;
			this.notifications.alerts = data.latestNotifications;
			this.profilePicture = data.profileImage;
			this.setAlertNotificationData(data.notifications);
			this.setMessagePreview(data.messages, data.latestMessageNotifications);
		});

		let updateMessageEvent = this.alerts.updateSendMessageObjectEvent.subscribe((val: any) => {

			this.sendMessageObject.id = val.id;
			this.sendMessageObject.name = val.name;
		});

		let resetMessagesEvent = this.alerts.resetSendMessageObjectEvent.subscribe(() => {
			this.notifications.messages = 0;
		});

		let requestObject = {
			method: "GET",
			location: `api/get-user-data/${this.userID}`
		}
		this.api.makeRequest(requestObject).then((data: any) => {
			if (data && data.status === 404) {
				return this.auth.logOut();
			}
			if (data.statusCode === 200) {
				this.alerts.getUserData.emit(data.user);
			}
		})

		this.subscriptions.push(alertEvent, friendAlert, userDataEvent, updateMessageEvent, resetMessagesEvent);
	}

	public searchForFriends() {
		this.router.navigate(['/search-results', { query: this.query }]).then(_ => { });
	}

	public sendMessage() {
		this.api.sendMessage(this.sendMessageObject);
		this.sendMessageObject.content = "";
	}

	public resetMessageNotifications() {
		if (this.notifications.messages === 0) {
			return;
		}
		this.api.resetMessageNotifications().then(() => { });
	}

	private setMessagePreview(messages: any, messageNotifications: any) {
		for (let i = messages.length - 1; i >= 0; i--) {
			let lastMessage = messages[i].content[messages[i].content.length - 1];
			let preview = {
				messengerName: messages[i].messengerName,
				messageContent: lastMessage.message,
				messengerImage: "",
				messengerID: messages[i]._id,
				isNew: false
			}

			if (lastMessage.messenger.toString() === this.userID.toString()) {
				preview.messengerImage = this.profilePicture;
			} else {
				preview.messengerImage = messages[i].messengerProfileImage;
				if (messageNotifications.includes(messages[i].fromID)) {
					preview.isNew = true;
				}
			}
			if (preview.isNew) {
				this.messagePreview.unshift(preview);
			} else {
				this.messagePreview.push(preview);
			}
		}
	}

	public messageLink(messageID: string) {
		this.router.navigate(['/message'], { state: { data: { msgID: messageID } } }).then(() => {

		});
	}

	private setAlertNotificationData(notificationData: any) {
		for (const alert of notificationData) {
			let alertObj = JSON.parse(alert);

			let newAlert = {
				text: alertObj.alertText,
				icon: "",
				bgColor: "",
				href: ""
			}
			switch (alertObj.alertType) {
				case "new_friend":
					newAlert.icon = "fa-user-check";
					newAlert.bgColor = "bg-success";
					newAlert.href = `/profile/${alertObj.fromID}`;
					break
				case "liked_post":
					newAlert.icon = "fa-thumbs-up";
					newAlert.bgColor = "bg-purple";
					newAlert.href = `/profile/${this.userID}`;
					break
				case "commented_post":
					newAlert.icon = "fa-comment";
					newAlert.bgColor = "bg-primary";
					newAlert.href = `/profile/${this.userID}`;
					break

			}
			this.alertsArray.push(newAlert);
		}
	}

	public resetAlertNotifications() {
		if (this.notifications.alerts === 0) {
			return;
		}
		let requestObject = {
			location: `api/reset-alert-notifications`,
			method: "POST"
		}
		this.api.makeRequest(requestObject).then((val: any) => {
			if (val.statusCode === 201) {
				this.notifications.alerts = 0;
			}
		})
	}
}
