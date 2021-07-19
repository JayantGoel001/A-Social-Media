import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	private readonly tokenName = "--token-ASM";
	private readonly theme = "--theme";
	private localStorage = window.localStorage;

	constructor() {  }

	private set(key:string,value:any){
		if (this.localStorage){
			this.localStorage.setItem(key,value);
		}else {
			alert("Browser does not support the LocalStorage API");
		}
	}

	private get(key:string) : any{
		if (this.localStorage){
			if (key in this.localStorage) {
				return this.localStorage.getItem(key);
			}
		}else {
			alert("Browser does not support the LocalStorage API");
		}
	}

	public setToken(token:string){
		this.set(this.tokenName,token);
	}

	public getToken(){
		return this.get(this.tokenName);
	}

	public removeToken(){
		localStorage.removeItem(this.tokenName);
	}

	public getParsedToken():any{
		return JSON.parse(atob(this.getToken().split(".")[1]));
	}

	public setPostTheme(theme:string){
		this.set(this.theme,theme);
	}

	public getPostTheme():string{
		return this.get(this.theme);
	}
}
