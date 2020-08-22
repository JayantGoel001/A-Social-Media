import { Component, OnInit, Inject } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { UserDataService } from "../user-data.service";
import { ApiService } from "../api.service";

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.css']
})
export class PageProfileComponent implements OnInit {

    constructor(
        private title:Title,
        @Inject(DOCUMENT) private document:Document,
        private route:ActivatedRoute,
        private centralUserData:UserDataService,
        private api:ApiService) { }

    ngOnInit(): void {
        this.title.setTitle("Your Profile");
        this.document.getElementById("sidebarToggleTop").classList
        .add("d-none");

        let paramsId = this.route.snapshot.params.userid;
        this.centralUserData.getUserData.subscribe((user)=>{
            this.route.params.subscribe((params)=>{
                if (user._id==params.userid) {
                    this.setComponentValues(user);
                }
                else{
                    this.canSendMessage = true;
                    this.canAddUser = true;
                    let requestObject = {
                        location:`users/get-user-data/${paramsId}`,
                        method:"GET"
                    }

                    this.api.makeRequest(requestObject).then((user)=>{
                        if (user.statusCode == 200){
                            this.setComponentValues(user.user);
                        }
                    })
                }
            })
        })

    }

    public randomFriends:String[] = [];
    public totalFriends:Number = 0;
    public posts:Object[] = [];
    public showPosts:number = 6;
    public profilePicture:String = "default_avatar";
    public userName:String = "";
    public userEmail:String = "";

    public canAddUser:Boolean = false;
    public canSendMessage:Boolean = false;

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

    }

}
