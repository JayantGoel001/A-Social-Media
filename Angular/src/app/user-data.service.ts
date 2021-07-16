import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
	public getUserData : EventEmitter<any> = new EventEmitter<any>();

	constructor() {

	}

}
