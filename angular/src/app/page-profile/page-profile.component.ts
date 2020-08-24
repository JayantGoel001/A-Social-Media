import { Component, OnInit, Inject } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { EventEmitterService } from "../event-emitter.service";
import { ApiService } from "../api.service";
import { AutoUnsubscribe } from '../unsubscribe';

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.css']
})
@AutoUnsubscribe
export class PageProfileComponent implements OnInit {

    constructor(
        public events:EventEmitterService,
        private title:Title,
        @Inject(DOCUMENT) private document:Document,
        private route:ActivatedRoute,
        private api:ApiService) { }

    ngOnInit(): void {
        this.title.setTitle("Your Profile");
        this.document.getElementById("sidebarToggleTop").classList
        .add("d-none");

        let paramsId = this.route.snapshot.params.userid;
        let userDataEvent = this.events.getUserData.subscribe((user)=>{
            this.route.params.subscribe((params)=>{
                this.showPosts = 6;
                if (user.besties.includes(params.userid)) {
                    this.isBestie = true;
                }
                if (user.enemies.includes(params.userid)) {
                    this.isEnemy = true;
                }

                this.maxAmountOfBesties =  user.besties.length>=2;

                if (user._id==params.userid) {
                    this.setComponentValues(user);
                    this.resetBoolean();
                }
                else{
                    this.canSendMessage = true;
                    this.canAddUser = true;
                    let requestObject = {
                        location:`users/get-user-data/${params.userid}`,
                        method:"GET"
                    }

                    this.api.makeRequest(requestObject).then((data)=>{
                        if (data.statusCode == 200){
                            this.canAddUser = user.friends.includes(data.user._id)?false:true;

                            this.haveReceivedFriendRequest = user.friend_requests.includes(data.user._id);

                            this.haveSentFriendRequest = data.user.friend_requests.includes(user._id);

                            if (this.canAddUser) {
                                this.showPosts = 0;
                            }
                            this.setComponentValues(data.user);
                        }
                    })
                }
            })
        })
        this.subscriptions.push(userDataEvent);

    }

    public randomFriends:String[] = [];
    public totalFriends:number = 0;
    public posts:Object[] = [];
    public showPosts:number = 6;
    public profilePicture:String = "default_avatar";
    public userName:String = "";
    public userEmail:String = "";
    public usersID :String = "";
    private subscriptions = [];
    public canAddUser:Boolean = false;
    public canSendMessage:Boolean = false;

    public haveSentFriendRequest:Boolean = false;
    public haveReceivedFriendRequest:Boolean = false;

    public isBestie:boolean = false;
    public isEnemy:boolean = false;
    public maxAmountOfBesties:boolean = false;

    /**
     * showMorePosts
     */
    public showMorePosts() {
        this.showPosts+=6;
    }

    /**
     * name
     */
    public backToTop() {
        this.document.body.scrollTop = this.document.documentElement.scrollTop=0;
    }

    /**
     * setComponentValues
     */
    public setComponentValues(user) {
        this.randomFriends = user.random_friend;
        this.profilePicture = user.profile_image;
        this.posts = user.posts;
        this.userName = user.name;
        this.userEmail = user.email;
        this.totalFriends = user.friends.length;
        this.usersID = user._id;
    }

    /**
     * accept
     */
    public accept() {
        this.api.resolveFriendRequest("accept",this.usersID).then((val:any)=>{
            if (val.statusCode == 201) {
                this.haveReceivedFriendRequest = false;
                this.canAddUser = false;
                this.totalFriends++;
                this.showPosts = 6;
            }
        });
    }

    /**
     * decline
     */
    public decline() {
        this.api.resolveFriendRequest("decline",this.usersID).then(
            (val:any)=>{
            if (val.statusCode == 201) {
                this.haveReceivedFriendRequest = false;
            }
        });


    }

    /**
     * makeFriendRequest
     */
    public makeFriendRequest() {
        this.api.makeFriendRequest(this.usersID).then((val:any)=>{
            if (val.statusCode == 201) {
                this.haveSentFriendRequest = true;
            }
        })
    }

    private resetBoolean() {
        this.canAddUser = false;
        this.canSendMessage = false;
        this.haveSentFriendRequest = false;
        this.haveReceivedFriendRequest = false;
        this.isBestie = false;
        this.isEnemy = false;
        this.maxAmountOfBesties = false;
    }

    /**
     * updateSendMessageObject
     */
    public updateSendMessageObject(id,name) {
        this.events.updateSendMessageObjectEvent.emit({id,name});
    }

    /**
     * toggleRequest
     */
    public toggleRequest(toggle) {
        let requestObject = {
            location:`users/bestie-enemy-toggle/${this.usersID}?toggle=${toggle}`,
            method:"POST"
        }
        this.api.makeRequest(requestObject).then((val)=>{
            if (val.statusCode==201) {
                if (toggle=="besties") {
                    this.isBestie = !this.isBestie;
                }
                else{
                    this.isEnemy = !this.isEnemy;
                }
            }
        })
    }
}
