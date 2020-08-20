import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    constructor() { }

    tokenName = "--token-ASM";
    postThemeName = "--post-theme-ASM";
    /**
     * set
     */
    private set(key,value) {
        if (localStorage) {
            localStorage.setItem(key,value);
        }
        else{
            alert('Browser does not support localStorage API.');
        }
    }

    /**
     * get
     */
    private get(key) {
        if (localStorage) {
            if (key in localStorage) {
                return localStorage.getItem(key);
            }
        }
        else{
            alert('Browser does not support the localStorage API.');
        }
    }

    /**
     * setToken
     */
    public setToken(token) {
        this.set(this.tokenName,token);
    }
    /**
     * getToken
     */
    public getToken() {
        return this.get(this.tokenName);
    }

    /**
     * getParsedToken
     */
    public getParsedToken() {
        let token = this.getToken();
        return JSON.parse(atob(token.split(".")[1]));
    }
    /**
     * removeToken
     */
    public removeToken() {
        localStorage.removeItem(this.tokenName);
    }

    /**
     * setPostTheme
     */
    public setPostTheme(theme) {
        this.set(this.postThemeName,theme);
    }

    /**
     * getPostTheme
     */
    public getPostTheme() {
        return this.get(this.postThemeName);
    }
}
