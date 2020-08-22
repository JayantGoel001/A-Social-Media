import { Component, OnInit } from '@angular/core';
import { ApiService } from "../api.service";
import { Title } from "@angular/platform-browser";
import { LocalStorageService } from "../local-storage.service";
import { EventEmitterService } from "../event-emitter.service";

@Component({
    selector: 'app-page-feed',
    templateUrl: './page-feed.component.html',
    styleUrls: ['./page-feed.component.css']
})
export class PageFeedComponent implements OnInit {

    constructor(
        private api:ApiService,
        private title:Title,
        private storage:LocalStorageService,
        private events:EventEmitterService
    ) { }

    ngOnInit() {
        this.title.setTitle("A Social Media - Feed");
        let requestObject = {
            location:"users/generate-feed",
            method:"GET"
        }

        this.api.makeRequest(requestObject).then((val)=>{

            if (val.statusCode == 200) {
                let fullCol1= val.posts.filter((val,i) => i%4 == 0);
                let fullCol2= val.posts.filter((val,i) => i%4 == 1);
                let fullCol3= val.posts.filter((val,i) => i%4 == 2);
                let fullCol4= val.posts.filter((val,i) => i%4 == 3);

                let cols = [fullCol1,fullCol2,fullCol3,fullCol4];
                this.addPostToFeed(cols,0,0);
            }
            else{
                this.events.onAlertEvent.emit("Something went wrong, your post  could not be created.");
            }
        });
    }

    /**
     * newPostContent
     */
    public newPostContent:String = "";
    public newPostTheme:String = this.storage.getPostTheme() || "primary";
    public posts = {
        col1:[],
        col2:[],
        col3:[],
        col4:[],
    }
    /**
     * changeTheme
     */
    public changeTheme(newTheme) {
        this.newPostTheme = newTheme;
        this.storage.setPostTheme(newTheme);
    }

    /**
     * createPost
     */
    public createPost() {
        if (this.newPostContent.length==0) {
            return this.events.onAlertEvent.emit("No Content For Your Post was Provided.");
        }

        let requestObject = {
            location:"users/create-post",
            method:"POST",
            body:{
                theme:this.newPostTheme,
                content:this.newPostContent
            }
        }

        this.api.makeRequest(requestObject).then((val)=>{
            if (val.statusCode == 201) {
                val.post.ago = "Now";
                this.posts.col1.unshift(val.post);
            }
            else{
                this.events.onAlertEvent.emit("Something went wrong, your post  could not be created.");
            }
            this.newPostContent = "";
        })
    }

    private addPostToFeed(array,colNumber,delay){
        setTimeout(() => {
            if (array[colNumber].length) {
                this.posts["col"+(colNumber+1)].push(array[colNumber].splice(0,1)[0]);
                colNumber = ++colNumber%4;
                this.addPostToFeed(array,colNumber,100);
            }
        }, delay);
    }
}
