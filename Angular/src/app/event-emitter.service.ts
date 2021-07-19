import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EventEmitterService {

	public onAlertEvent : EventEmitter<string> = new EventEmitter<string>();
	public updateNumberOfFriendRequestEvent : EventEmitter<string> = new EventEmitter<string>();
	public updateSendMessageObjectEvent : EventEmitter<object> = new EventEmitter<object>();
	public resetSendMessageObjectEvent : EventEmitter<string> = new EventEmitter<string>();
	public getUserData : EventEmitter<any> = new EventEmitter<any>();

	constructor() {

	}

}
