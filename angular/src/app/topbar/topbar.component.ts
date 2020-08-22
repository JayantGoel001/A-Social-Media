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
    constructor(public auth:AuthService,public router:Router,
                public storage:LocalStorageService,
                public events:EventEmitterService,
                private centralUserData:UserDataService,private api:ApiService) { }

    ngOnInit(): void {
        this.userName = this.storage.getParsedToken().name;
        this.userId = this.storage.getParsedToken()._id;
        let alertEvent = this.events.onAlertEvent.subscribe((msg)=>{
            this.alertMessage = msg;
        });

        let friendRequestsEvent = this.events.updateNumberOfFriendRequestsEvent.subscribe((msg)=>{
            this.numOfFriendsRequests--;
        });

        let userDataEvent = this.centralUserData.getUserData.subscribe((data)=>{
            this.userData = data;
            if (data) {
                this.numOfFriendsRequests = data.friend_requests.length;
                this.profilePicture = data.profile_image;
            }
        });

        let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((data)=>{
            this.sendMessageObject.id = data._id;
            this.sendMessageObject.name = data.name;

        })

        let requestObject = {
            location:`users/get-user-data/${this.userId}`,
            method:"GET"
        }

        this.api.makeRequest(requestObject).then((val)=>{
            this.centralUserData.getUserData.emit(val.user);
        });

        this.subscriptions.push(alertEvent,friendRequestsEvent,userDataEvent,updateMessageEvent);
    }


    public userData:object = {};
    public numOfFriendsRequests:number = 0;
    public userId :String = "";

    public query:String = "";
    public userName:String = "";
    public alertMessage:String = "";
    public profilePicture:String = "default_avatar";
    private subscriptions = [];
    private sendMessageObject = {
        id:"",
        name:""
    };
    /**
     * searchForFriend
     */
    public searchForFriends() {
        this.router.navigate(['/search-results',{query:this.query}]);
    }


}
