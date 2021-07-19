import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import {ApiService} from "../api.service";
import {LocalStorageService} from "../local-storage.service";
import {EventEmitterService} from "../event-emitter.service";

@Component({
  selector: 'app-result-request',
  templateUrl: './result-request.component.html',
  styleUrls: ['./result-request.component.css']
})

export class ResultRequestComponent implements OnInit {
	@Input() resultRequest: any;
	@Input() use: any;
	@Output() resultRequestChange = new EventEmitter<any>();

	public haveSentFriendRequest:boolean = false;
	public haveReceivedFriendRequest:boolean = false;
	public isFriend:boolean = false;

	constructor(
		public api: ApiService,
		public localStorage:LocalStorageService,
		private events:EventEmitterService
	) {  }

	ngOnInit(): void {
		this.haveSentFriendRequest = this.resultRequest.haveSentFriendRequest || false;
		this.haveReceivedFriendRequest = this.resultRequest.haveReceivedFriendRequest || false;
		this.isFriend = this.resultRequest.isFriend || false;
	}

	public accept(){
		this.updateRequest();
		this.api.resolveFriendRequest("accept",this.resultRequest._id).then((val)=>{
			console.log(val);
		});
	}
	public decline(){
		this.updateRequest();
		this.api.resolveFriendRequest("decline",this.resultRequest._id).then((val)=>{
			console.log(val);
		});
	}
	public sendMessage(){

	}

	private updateRequest(){
		this.resultRequestChange.emit(this.resultRequest._id);
	}

	public updateSendMessageObject(id:string,name:string){
		this.events.updateSendMessageObjectEvent.emit({id, name});
	}

}
