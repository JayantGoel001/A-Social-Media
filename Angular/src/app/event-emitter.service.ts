import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class EventEmitterService {

	onAlertEvent : EventEmitter<string> = new EventEmitter<string>();
	updateNumberOfFriendRequestEvent : EventEmitter<string> = new EventEmitter<string>();

	constructor() {  }

}
