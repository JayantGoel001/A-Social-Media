import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";
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
        private api:ApiService
        ) { }

    ngOnInit(): void {
        this.userName = this.storage.getParsedToken().name;
        this.userId = this.storage.getParsedToken()._id;
        let alertEvent = this.events.onAlertEvent.subscribe((msg)=>{
            this.alertMessage = msg;
        });

        let friendRequestsEvent =
        this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
            this.notifications.friendRequests--;
        });

        let userDataEvent = this.events.getUserData.subscribe((data)=>{

            this.notifications.friendRequests = data.friend_requests.length;
            this.notifications.messages = data.new_message_notifications.length;
            this.notifications.alerts=data.new_notifications;
            this.profilePicture = data.profile_image;

            this.setMessagePreview(data.messages,data.new_message_notifications);
        });

        let updateMessageEvent =
        this.events.updateSendMessageObjectEvent.subscribe((data)=>{
            this.sendMessageObject.id = data.id;
            this.sendMessageObject.name = data.name;
        });

        let requestObject = {
            location:`users/get-user-data/${this.userId}`,
            method:"GET"
        }

        this.api.makeRequest(requestObject).then((val)=>{
            this.events.getUserData.emit(val.user);
        });

        let resetMessageEvent =
        this.events.resetMessageNotificationEvent.subscribe(()=>{
            this.notifications.messages = 0;
        });

        this.subscriptions.push(
            alertEvent,
            friendRequestsEvent,
            userDataEvent,
            updateMessageEvent,
            resetMessageEvent
        );

    }

    public query:String = "";
    private subscriptions = [];
    public sendMessageObject = {
        id:"",
        name:"",
        content:""
    };

    public alertMessage:String = "";

    public userName:string = "";
    public userId :string = "";
    public profilePicture:string = "default_avatar";
    public messagePreview = [];
    public notifications = {
        alerts:0,
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
            this.events.onAlertEvent
            .emit("Message Not Sent. You must provide Some content.");
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

    private setMessagePreview(messages,messageNotification){
        for (let i = messages.length-1; i >=0 ; i--) {
            let lastMessage = messages[i].content[messages[i].content.length-1];
            let preview = {
                messengerName:messages[i].messengerName,
                messageContent:lastMessage.message,
                messengerImage: "",
                messengerID:messages[i].from_id,
                isNew:false
            }
            if (lastMessage.messenger==this.userId) {
                preview.messengerImage = this.profilePicture;
            }
            else{
                preview.messengerImage = messages[i].messengerProfileImage;
                if (messageNotification.includes(messages[i].from_id)) {
                    preview.isNew = true;
                }
            }

            if (preview.isNew) {
                this.messagePreview.unshift(preview);
            }else{
                this.messagePreview.push(preview);
            }
        }
    }

    /**
     * messageLink
     */
    public messageLink(messengeID) {
        this.router.navigate(['/messages'],
        {
            state:{
                data:{
                    msgId:messengeID
                }
            }
        });
    }
}
