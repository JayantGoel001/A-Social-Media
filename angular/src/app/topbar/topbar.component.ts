import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";
import { UserDataService } from "../user-data.service";
import { ApiService } from '../api.service';
import { AutoUnsubscribe } from '../unsubscribe';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.css']
})

@AutoUnsubscribe
export class TopbarComponent implements OnInit {

    constructor(
        public auth:AuthService,public router:Router,
        public storage:LocalStorageService,
        public events:EventEmitterService,
        private centralUserData:UserDataService,
        private api:ApiService
        ) { }

    ngOnInit(): void {
        this.userName = this.storage.getParsedToken().name;
        this.userId = this.storage.getParsedToken()._id;
        let alertEvent = this.events.onAlertEvent.subscribe((msg)=>{
            this.alertMessage = msg;
        });

        let friendRequestsEvent = this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
            this.notifications.friendRequests--;
        });

        let userDataEvent = this.centralUserData.getUserData.subscribe((data)=>{
            this.notifications.friendRequests = data.friend_requests.length;
            this.notifications.messages = data.new_message_notifications.length;
            this.profilePicture = data.profile_image;
        });

        let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((data)=>{
            this.sendMessageObject.id = data.id;
            this.sendMessageObject.name = data.name;
        });

        let requestObject = {
            location:`users/get-user-data/${this.userId}`,
            method:"GET"
        }

        this.api.makeRequest(requestObject).then((val)=>{
            this.centralUserData.getUserData.emit(val.user);
        });

        this.subscriptions.push(alertEvent,friendRequestsEvent,userDataEvent,updateMessageEvent);

        let resetMessageEvent = this.events.resetMessageNotificationEvent.subscribe(()=>{
            this.notifications.messages = 0;
        })
    }

    public query:String = "";
    private subscriptions = [];
    public sendMessageObject = {
        id:"",
        name:"",
        content:""
    };

    public alertMessage:String = "";

    public userName:String = "";
    public userId :String = "";
    public profilePicture:String = "default_avatar";
    public messagePreview = [];
    public notifications = {
        alert:0,
        friendRequests:0,
        messages:0
    }

    /**
     * searchForFriend
     */
    public searchForFriends() {
        this.router.navigate(['/search-results',{query:this.query}]);
    }

    /**
     * sendMessage
     */
    public sendMessage() {
        if (!this.sendMessageObject.content) {
            this.events.onAlertEvent.emit("Message Not Sent. You must provide Some content.");
            return ;
        }
        this.api.sendMessage(this.sendMessageObject);
        this.sendMessageObject.content = "";
    }

    /**
     * resetMessageNotifications
     */
    public resetMessageNotifications() {
        this.api.resetMessageNotifications();
    }
}
