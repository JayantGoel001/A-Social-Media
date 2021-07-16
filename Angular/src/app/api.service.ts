import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {LocalStorageService} from "./local-storage.service";
import {EventEmitterService} from "./event-emitter.service";

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private readonly baseURL:String  = "http://localhost:3000/";

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
		// if (process.env.NODE_ENV=="PRODUCTION"){
		// 	this.baseURL = ``;
		// }
	}
	public makeRequest(requestObject:any) : any{
		let type = requestObject.type.toLowerCase();
		if (!type){
			console.log("No type Specified in the Request Object");
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

		if (requestObject.authorize){
			httpOption = {
				headers : new HttpHeaders({
					'Authorization' :`Bearer ${this.localStorage.getToken()}`
				})
			}
		}

		if (type==="get"){
			return this.http.get(url,httpOption).toPromise().then(this.successHandler).catch(this.errorHandler);
		}else if (type==="post"){
			return this.http.post(url,body,httpOption).toPromise().then(this.successHandler).catch(this.errorHandler);
		}
		console.log("Could not make the request. Make sure a type of GET  or POST is supplied.");
	}

	public makeFriendRequest(to:string){
		let from = this.localStorage.getParsedToken()._id;
		let requestObject = {
			type : "POST",
			location : `users/send-friend-request/${from}/${to}`,
			authorize : true
		}
		this.makeRequest(requestObject).then((val:any)=>{
			if (val.message){
				this.alerts.onAlertEvent.emit(val.message);
			}else {
				this.alerts.onAlertEvent.emit(val.error);
			}
		});
	}

	public resolveFriendRequest(resolution:string,from:string){
		return new Promise(()=>{
			let to = this.localStorage.getParsedToken()._id;
			let requestObject = {
				type : "POST",
				location : `users/resolve-friend-request/${from}/${to}?resolution=${resolution}`,
				authorize: true
			}
			this.makeRequest(requestObject).then((val:any)=>{
				if (val.statusCode===201) {
					this.alerts.updateNumberOfFriendRequestEvent.emit();
					let resolved = (resolution === "accept")?"accepted":"declined";
					this.alerts.onAlertEvent.emit(`Successfully ${resolved} Friend request`);
				}else {
					this.alerts.onAlertEvent.emit(`Successfully ${val.error} Friend request`);
				}
			});
		});
	}
}
