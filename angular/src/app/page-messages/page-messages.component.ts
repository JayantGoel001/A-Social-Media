import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ApiService } from '../api.service';
import { UserDataService } from "../user-data.service";
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
          private centralUserData:UserDataService,
          private api:ApiService
        ) { }

  ngOnInit(): void {
      this.title.setTitle("Your Messages");

      this.api.resetMessageNotifications();

      if (history.state.data && history.state.data.msgId) {
          this.activeMessage.fromId = history.state.data.msgId;
      }

      let userDataEvent =
      this.centralUserData.getUserData.subscribe((user)=>{
            this.activeMessage.fromId =
            this.activeMessage.fromId || user.messages[0].from_id;
            this.messages = user.messages;
            this.userName = user.name;
            this.userId = user._id;
            this.usersProfileImage = user.profile_image;
            this.setActiveMessage(this.activeMessage.fromId);
      });
      this.subscriptions.push(userDataEvent);
  }

  public activeMessage ={
      fromId:"",
      fromName:"",
      fromProfilePicture:"",
      messages:[]
  }

  public messages = [];
  public usersProfileImage = "default_avatar";
  public userName = "";
  public userId = "";
  public subscriptions = [];

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
              this.activeMessage.fromId = message.content;
          }
      }
      console.log(this.activeMessage);

   }
}
