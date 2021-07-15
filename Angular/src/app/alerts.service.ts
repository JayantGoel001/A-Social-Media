import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

	onAlertEvent : EventEmitter<string> = new EventEmitter<string>();

	constructor() { }

}
