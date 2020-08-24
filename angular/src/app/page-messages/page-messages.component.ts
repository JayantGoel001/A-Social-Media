import { Component, OnInit, ChangeDetectorRef,AfterContentChecked } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ApiService } from '../api.service';
import { EventEmitterService } from "../event-emitter.service";
import { AutoUnsubscribe } from '../unsubscribe';

@Component({
    selector: 'app-page-messages',
    templateUrl: './page-messages.component.html',
    styleUrls: ['./page-messages.component.css']
})

@AutoUnsubscribe
export class PageMessagesComponent implements OnInit {

    constructor(
        private title:Title,
        private api:ApiService,
        private cdRef:ChangeDetectorRef,
        public events:EventEmitterService,
    ) { }

    ngOnInit(): void {
        this.title.setTitle("Your Messages");

        this.api.resetMessageNotifications();

        if (history.state.data && history.state.data.msgId) {
            this.activeMessage.fromId = history.state.data.msgId;
        }

        let userDataEvent =
        this.events.getUserData.subscribe((user)=>{
            setTimeout(() => {
                if (!user.messages) {
                    return ;
                }
                this.activeMessage.fromId =
                this.activeMessage.fromId || user.messages[0].from_id;
                this.messages = user.messages.reverse();
                this.userName = user.name;
                this.userId = user._id;
                this.usersProfileImage = user.profile_image;
                this.setActiveMessage(this.activeMessage.fromId);
            }, 0);
        });
        this.subscriptions.push(userDataEvent);
    }

    public activeMessage ={
        fromId:"",
        fromName:"",
        fromProfilePicture:"",
        messageGroups:[]
    }

    public messages = [];
    public usersProfileImage = "default_avatar";
    public userName = "";
    public userId = "";
    public subscriptions = [];
    public newMessages = "";

    /**
    * setActiveMessage
    */
    public setActiveMessage(id) {
        for(let message of this.messages)
        {
            if(message.from_id == id){
                this.activeMessage.fromId = message.from_id;
                this.activeMessage.fromName = message.messengerName;
                this.activeMessage.fromProfilePicture =
                message.messengerProfileImage;
                let groups = (this.activeMessage.messageGroups = []);
                for(let content of message.content){
                    let me = (content.messenger == this.userId);
                    if (groups.length) {
                        var lastMessengerId = groups[groups.length-1].id;

                        if (content.messenger == lastMessengerId) {
                            groups[groups.length-1].messages.
                            push(content.message);
                            continue;
                        }
                    }

                    let group = {
                        image:me?
                        this.usersProfileImage:message.messengerProfileImage,
                        name:me?"Me":message.messengerName,
                        id:content.messenger,
                        messages:[content.message],
                        isMe:me
                    }
                    groups.push(group);
                }
            }
        }
        this.cdRef.detectChanges();
    }

    /**
    * sendMessage
    */
    public sendMessage() {
        if (!this.newMessages) {
            return;
        }

        let obj ={
            content:this.newMessages,
            id:this.activeMessage.fromId
        }
        this.api.sendMessage(obj,false).then((val:any)=>{
            if (val.statusCode == 201) {
                let groups = this.activeMessage.messageGroups;
                if (groups[groups.length-1].isMe) {
                    groups[groups.length-1].messages.push(this.newMessages);
                }
                else{
                    let newGroup = {
                        image:this.usersProfileImage,
                        name:this.userName,
                        id:this.userId,
                        messages:[this.newMessages],
                        isMe:true
                    }
                    groups.push(newGroup);
                }
            }
            for(let message of this.messages){
                if (message.from_id == this.activeMessage.fromId) {
                    let newContent = {
                        message:this.newMessages,
                        messenger:this.userId
                    }
                    message.content.push(newContent);
                }
            }
            this.newMessages = "";
        });


    }

    ngAfterContentChecked() {

        this.cdRef.detectChanges();

    }

    /**
     * deleteMessage
     */
    public deleteMessage(msgId) {
        let requestObject = {
            location:`users/delete-message/${msgId}`,
            method:"POST"
        }
        this.api.makeRequest(requestObject).then((val)=>{
            if (val.statusCode == 201) {
                for (let i = 0; i < this.messages.length; i++) {
                    if (this.messages[i]._id == msgId) {
                        this.messages.splice(i,1);
                        this.setActiveMessage(this.messages[0].from_id);
                        break;
                    }
                }
            }
        });
    }
}
