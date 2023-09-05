import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {LocalStorageService} from "../local-storage.service";
import {EventEmitterService} from "../event-emitter.service";

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {

	@Input() post: any;

	public userID:string = "";

	public fakeID : string = "fakeID";
	public fontSize : number = 18;

	public align : string = "left";
	public liked : boolean = false;
	public comment:string = "";

	constructor(
		private api:ApiService,
		private localStorage:LocalStorageService,
		private events : EventEmitterService
	) {

	}

	ngOnInit(): void {
		let removeLeadingNumber = (id:string)=>{
			let isNumber = (n:any)=>{
				n = Number(n);
				return !isNaN(n);
			}
			if (id && isNumber(id[0])){
				id = removeLeadingNumber(id.substr(1));
			}
			return id;
		}

		this.fakeID = removeLeadingNumber(this.post._id);
		this.userID = this.localStorage.getParsedToken()._id;

		if (this.post.likes.includes(this.userID)){
			this.liked = true;
		}

		if (this.post.content.length<40){
			this.fontSize = 22;
		}

		if (this.post.content.length<24){
			this.fontSize = 28;
			this.align = "center";
		}

		if (this.post.content.length<14){
			this.fontSize = 32;
		}

		if (this.post.content.length<8){
			this.fontSize = 44;
		}

		if (this.post.content.length<5){
			this.fontSize = 62;
		}

	}

	public likeButtonClicked(id:string){
		let requestObject = {
			location : `api/like-unlike/${this.post.ownerID}/${id}`,
			method : "POST"
		}

		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.statusCode === 201){
				if (this.post.likes.includes(this.userID)){
					this.post.likes.splice(this.post.likes.indexOf(this.userID),1);
					this.liked = false
				}else {
					this.post.likes.push(this.userID);
					this.liked = true;
				}
			}
		});
	}

	public postComment(){
		if (this.comment.length === 0){
			return;
		}

		let requestObject = {
			location : `api/post-comment/${this.post.ownerID}/${this.post._id}`,
			method : "POST",
			body : {
				content : this.comment
			}
		}

		this.api.makeRequest(requestObject).then((val:any)=>{
			if (val.statusCode === 201) {
				let updatedCommented = {
					...val.comment,
					name : val.commenterName,
					profileImage : val.commenterImage
				}
				this.post.comments.push(updatedCommented);
				this.comment = "";
			}else {
				this.events.onAlertEvent.emit(val.error);
			}
		})
	}
}
