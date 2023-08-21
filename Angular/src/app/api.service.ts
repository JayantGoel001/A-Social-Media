import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {LocalStorageService} from "./local-storage.service";
import {EventEmitterService} from "./event-emitter.service";
import {environment} from "../environments/environment";

@Injectable({
	providedIn: 'root'
})

export class ApiService {
	private readonly baseURL:String  = environment.baseUrl;

	private successHandler = (value : any)=>{
		return value;
	}
	private errorHandler = (value : any)=>{
		return value;
	}
	constructor(
		private http : HttpClient,
		private localStorage:LocalStorageService,
		private alerts:EventEmitterService
	) {

	}

	public makeRequest(requestObject:any) : any{
		let method = requestObject.method.toLowerCase();
		if (!method){
			console.log("No method Specified in the Request Object");
			return;
		}
		let body = requestObject.body || {};
		let location = requestObject.location;

		if (!location){
			console.log("No Location specified in the Request Object.");
			return;
		}
		let url = `${this.baseURL}${location}`;

		let httpOption = {};

		if (this.localStorage.getToken()){
			httpOption = {
				headers : new HttpHeaders({
					'Authorization' :`Bearer ${this.localStorage.getToken()}`
				})
			}
		}

		if (method==="get"){
			return this.http.get(url,httpOption).toPromise().then(this.successHandler).catch(this.errorHandler);
		}else if (method==="post"){
			return this.http.post(url,body,httpOption).toPromise().then(this.successHandler).catch(this.errorHandler);
		}

		console.log("Could not make the request. Make sure a method of GET  or POST is supplied.");
	}

	public makeFriendRequest(to:string){
		let from = this.localStorage.getParsedToken()._id;
		let requestObject = {
			method : "POST",
			location : `api/send-friend-request/${from}/${to}`
		}
		return new Promise((resolve)=>{
			this.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode === 201){
					this.alerts.onAlertEvent.emit(val.message);
				}else {
					this.alerts.onAlertEvent.emit(val.error);
				}
				resolve(val);
			});
		});
	}

	public resolveFriendRequest(resolution:string,from:string){
		let to = this.localStorage.getParsedToken()._id;
		return new Promise((resolve)=>{
			let requestObject = {
				method : "POST",
				location : `api/resolve-friend-request/${from}/${to}?resolution=${resolution}`
			}
			this.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode===201) {
					this.alerts.updateNumberOfFriendRequestEvent.emit();
					let resolved = (resolution === "accept")?"accepted":"declined";
					this.alerts.onAlertEvent.emit(`Successfully ${resolved} Friend request`);
				}else {
					this.alerts.onAlertEvent.emit(`Successfully ${val.error} Friend request`);
				}
				resolve(val);
			});
		});
	}

	public sendMessage(sendMessageObject:any,showAlerts = true){
		if (sendMessageObject.content.length === 0 && showAlerts){
			this.alerts.onAlertEvent.emit("Message Not Sent. You must provide some content for your message.");
			return;
		}
		let requestObject = {
			method:"POST",
			location:`api/send-message/${sendMessageObject.id}`,
			body : {
				content : sendMessageObject.content
			}
		}
		return new Promise((resolve) => {
			this.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode === 201 && showAlerts){
					this.alerts.onAlertEvent.emit("Successfully sent a message.");
					sendMessageObject.content = "";
				}
				resolve(val);
			});
		});
	}

	public resetMessageNotifications(){
		let requestObj = {
			location :`api/reset-message-notifications`,
			method :"POST"
		}

		return new Promise((resolve)=>{
			this.makeRequest(requestObj).then((val:any)=>{
				if (val.statusCode === 201){
					this.alerts.resetSendMessageObjectEvent.emit();
				}
				resolve("Success");
			});
		});
	}
}
