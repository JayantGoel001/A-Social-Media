(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/_app/app.component.ts":
/*!***************************************!*\
  !*** ./src/app/_app/app.component.ts ***!
  \***************************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");



class AppComponent {
    constructor() {
        this.title = 'angular';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL19hcHAvYXBwLmNvbXBvbmVudC5jc3MifQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-root',
                templateUrl: './app.component.html',
                styleUrls: ['./app.component.css']
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/api.service.ts":
/*!********************************!*\
  !*** ./src/app/api.service.ts ***!
  \********************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./event-emitter.service */ "./src/app/event-emitter.service.ts");






class ApiService {
    constructor(http, storage, events) {
        this.http = http;
        this.storage = storage;
        this.events = events;
        this.baseUrl = "http://localhost:3000";
    }
    // private baseUrl = environment.baseUrl;
    successHandler(value) {
        return value;
    }
    errorHandler(value) {
        return value;
    }
    makeRequest(requestObject) {
        let method = requestObject.method.toLowerCase();
        if (!method) {
            return console.log("No method Specified in the request object.");
        }
        let body = requestObject.body || {};
        let location = requestObject.location;
        if (!location) {
            return console.log("No location Specified in the request object");
        }
        let url = `${this.baseUrl}/${location}`;
        let httpOptions = {};
        if (this.storage.getToken()) {
            httpOptions = {
                headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
                    'Authorization': `Bearer ${this.storage.getToken()}`
                })
            };
        }
        if (method == "get") {
            return this.http.get(url, httpOptions).toPromise()
                .then(this.successHandler).catch(this.errorHandler);
        }
        if (method == "post") {
            return this.http.post(url, body, httpOptions).toPromise()
                .then(this.successHandler).catch(this.errorHandler);
        }
        console.log("Could not make the request.Make Sure a method of GET or Post is Supplied");
    }
    makeFriendRequest(to) {
        let from = this.storage.getParsedToken()._id;
        let requestObject = {
            location: `users/make-friend-request/${from}/${to}`,
            method: "POST"
        };
        return new Promise((resolve, reject) => {
            this.makeRequest(requestObject).then((val) => {
                if (val.statusCode === 201) {
                    this.events.onAlertEvent.emit("Succesfully sent a friend request.");
                }
                else {
                    this.events.onAlertEvent.emit("Something went wrong. We could not send friend request.Perhaps you already sent a friend request to this user.");
                }
                resolve(val);
            });
        });
    }
    resolveFriendRequest(resolution, id) {
        let to = this.storage.getParsedToken()._id;
        return new Promise((resolve, reject) => {
            let requestObject = {
                location: `users/resolve-friend-request/${id}/${to}?resolution=${resolution}`,
                method: "POST"
            };
            this.makeRequest(requestObject).then((val) => {
                if (val.statusCode === 201) {
                    this.events.updateNumberOfFriendRequestsEvent.emit();
                    let resolutioned = (resolution == "accept") ? "Accepted" : "Declined";
                    this.events.onAlertEvent.emit(`Succesfully ${resolutioned} friend request.`);
                }
                else {
                    this.events.onAlertEvent.emit(`Something went Wrong and we could not handle your friend request.`);
                }
                resolve(val);
            });
        });
    }
    /**
     * sendMessage
     */
    sendMessage(sendMessageObject, showAlerts = true) {
        if (!sendMessageObject.content && showAlerts) {
            this.events.onAlertEvent.emit("Message Not Sent. You must provide Some content.");
            return;
        }
        let requestObject = {
            location: `users/send-message/${sendMessageObject.id}`,
            method: "POST",
            body: {
                content: sendMessageObject.content
            }
        };
        return new Promise((resolve, reject) => {
            this.makeRequest(requestObject).then((val) => {
                console.log(val);
                if (val.statusCode == 201 && showAlerts) {
                    this.events.onAlertEvent.emit("Succesfully sent a message.");
                }
                resolve(val);
            });
        });
    }
    /**
     * resetMessageNotifications
     */
    resetMessageNotifications() {
        let requestObject = {
            location: `users/reset-message-notifications`,
            method: "POST"
        };
        return new Promise((resolve, reject) => {
            this.makeRequest(requestObject).then((val) => {
                if (val.statusCode == 201) {
                    this.events.resetMessageNotificationEvent.emit();
                }
                resolve();
            });
        });
    }
}
ApiService.ɵfac = function ApiService_Factory(t) { return new (t || ApiService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_3__["EventEmitterService"])); };
ApiService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ApiService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_3__["EventEmitterService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _page_register_page_register_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page-register/page-register.component */ "./src/app/page-register/page-register.component.ts");
/* harmony import */ var _page_login_page_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./page-login/page-login.component */ "./src/app/page-login/page-login.component.ts");
/* harmony import */ var _page_feed_page_feed_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./page-feed/page-feed.component */ "./src/app/page-feed/page-feed.component.ts");
/* harmony import */ var _page_profile_page_profile_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page-profile/page-profile.component */ "./src/app/page-profile/page-profile.component.ts");
/* harmony import */ var _page_messages_page_messages_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page-messages/page-messages.component */ "./src/app/page-messages/page-messages.component.ts");
/* harmony import */ var _page_searches_page_searches_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./page-searches/page-searches.component */ "./src/app/page-searches/page-searches.component.ts");
/* harmony import */ var _page_friend_requests_page_friend_requests_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./page-friend-requests/page-friend-requests.component */ "./src/app/page-friend-requests/page-friend-requests.component.ts");












const routes = [
    {
        path: "",
        redirectTo: "/feed",
        pathMatch: "full"
    },
    {
        path: "register",
        component: _page_register_page_register_component__WEBPACK_IMPORTED_MODULE_3__["PageRegisterComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]]
    },
    {
        path: "login",
        component: _page_login_page_login_component__WEBPACK_IMPORTED_MODULE_4__["PageLoginComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]]
    },
    {
        path: "feed",
        component: _page_feed_page_feed_component__WEBPACK_IMPORTED_MODULE_5__["PageFeedComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]],
        data: {
            loggedIn: true
        }
    },
    {
        path: "profile/:userid",
        component: _page_profile_page_profile_component__WEBPACK_IMPORTED_MODULE_6__["PageProfileComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]],
        data: {
            loggedIn: true
        }
    },
    {
        path: "messages",
        component: _page_messages_page_messages_component__WEBPACK_IMPORTED_MODULE_7__["PageMessagesComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]],
        data: {
            loggedIn: true
        }
    },
    {
        path: "search-results",
        component: _page_searches_page_searches_component__WEBPACK_IMPORTED_MODULE_8__["PageSearchesComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]],
        data: {
            loggedIn: true
        }
    },
    {
        path: "friend-requests",
        component: _page_friend_requests_page_friend_requests_component__WEBPACK_IMPORTED_MODULE_9__["PageFriendRequestsComponent"],
        canActivate: [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"]],
        data: {
            loggedIn: true
        }
    }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AppRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_app/app.component */ "./src/app/_app/app.component.ts");
/* harmony import */ var _page_register_page_register_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./page-register/page-register.component */ "./src/app/page-register/page-register.component.ts");
/* harmony import */ var _page_login_page_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page-login/page-login.component */ "./src/app/page-login/page-login.component.ts");
/* harmony import */ var _page_feed_page_feed_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./page-feed/page-feed.component */ "./src/app/page-feed/page-feed.component.ts");
/* harmony import */ var _page_profile_page_profile_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./page-profile/page-profile.component */ "./src/app/page-profile/page-profile.component.ts");
/* harmony import */ var _page_messages_page_messages_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./page-messages/page-messages.component */ "./src/app/page-messages/page-messages.component.ts");
/* harmony import */ var _page_searches_page_searches_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./page-searches/page-searches.component */ "./src/app/page-searches/page-searches.component.ts");
/* harmony import */ var _page_friend_requests_page_friend_requests_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./page-friend-requests/page-friend-requests.component */ "./src/app/page-friend-requests/page-friend-requests.component.ts");
/* harmony import */ var _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./result-request/result-request.component */ "./src/app/result-request/result-request.component.ts");
/* harmony import */ var _post_post_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./post/post.component */ "./src/app/post/post.component.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sidebar/sidebar.component */ "./src/app/sidebar/sidebar.component.ts");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./form-bg/form-bg.component */ "./src/app/form-bg/form-bg.component.ts");



















class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
        _page_register_page_register_component__WEBPACK_IMPORTED_MODULE_6__["PageRegisterComponent"],
        _page_login_page_login_component__WEBPACK_IMPORTED_MODULE_7__["PageLoginComponent"],
        _page_feed_page_feed_component__WEBPACK_IMPORTED_MODULE_8__["PageFeedComponent"],
        _page_profile_page_profile_component__WEBPACK_IMPORTED_MODULE_9__["PageProfileComponent"],
        _page_messages_page_messages_component__WEBPACK_IMPORTED_MODULE_10__["PageMessagesComponent"],
        _page_searches_page_searches_component__WEBPACK_IMPORTED_MODULE_11__["PageSearchesComponent"],
        _page_friend_requests_page_friend_requests_component__WEBPACK_IMPORTED_MODULE_12__["PageFriendRequestsComponent"],
        _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_13__["ResultRequestComponent"],
        _post_post_component__WEBPACK_IMPORTED_MODULE_14__["PostComponent"],
        _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_15__["SidebarComponent"],
        _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_16__["TopbarComponent"],
        _form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_17__["FormBgComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](AppModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _app_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
                    _page_register_page_register_component__WEBPACK_IMPORTED_MODULE_6__["PageRegisterComponent"],
                    _page_login_page_login_component__WEBPACK_IMPORTED_MODULE_7__["PageLoginComponent"],
                    _page_feed_page_feed_component__WEBPACK_IMPORTED_MODULE_8__["PageFeedComponent"],
                    _page_profile_page_profile_component__WEBPACK_IMPORTED_MODULE_9__["PageProfileComponent"],
                    _page_messages_page_messages_component__WEBPACK_IMPORTED_MODULE_10__["PageMessagesComponent"],
                    _page_searches_page_searches_component__WEBPACK_IMPORTED_MODULE_11__["PageSearchesComponent"],
                    _page_friend_requests_page_friend_requests_component__WEBPACK_IMPORTED_MODULE_12__["PageFriendRequestsComponent"],
                    _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_13__["ResultRequestComponent"],
                    _post_post_component__WEBPACK_IMPORTED_MODULE_14__["PostComponent"],
                    _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_15__["SidebarComponent"],
                    _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_16__["TopbarComponent"],
                    _form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_17__["FormBgComponent"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                    _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                    _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ReactiveFormsModule"]
                ],
                providers: [],
                bootstrap: [_app_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/auth.service.ts":
/*!*********************************!*\
  !*** ./src/app/auth.service.ts ***!
  \*********************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./local-storage.service */ "./src/app/local-storage.service.ts");




class AuthService {
    constructor(router, storage) {
        this.router = router;
        this.storage = storage;
    }
    canActivate(route, state) {
        const loggedIn = this.isLoggedIn();
        let activate = loggedIn;
        let redirect = "/feed";
        if (route.data.loggedIn) {
            activate = !activate;
            redirect = "/register";
        }
        if (!activate) {
            return true;
        }
        else {
            this.router.navigate([redirect]);
            return false;
        }
    }
    isLoggedIn() {
        if (this.storage.getToken()) {
            return true;
        }
        return false;
    }
    /**
     * logout
     */
    logout() {
        this.storage.removeToken();
        this.router.navigate(['/login']);
    }
}
AuthService.ɵfac = function AuthService_Factory(t) { return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"])); };
AuthService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/event-emitter.service.ts":
/*!******************************************!*\
  !*** ./src/app/event-emitter.service.ts ***!
  \******************************************/
/*! exports provided: EventEmitterService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventEmitterService", function() { return EventEmitterService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class EventEmitterService {
    constructor() {
        this.onAlertEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.updateNumberOfFriendRequestsEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.updateSendMessageObjectEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.resetMessageNotificationEvent = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.getUserData = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
    }
}
EventEmitterService.ɵfac = function EventEmitterService_Factory(t) { return new (t || EventEmitterService)(); };
EventEmitterService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: EventEmitterService, factory: EventEmitterService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](EventEmitterService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/form-bg/form-bg.component.ts":
/*!**********************************************!*\
  !*** ./src/app/form-bg/form-bg.component.ts ***!
  \**********************************************/
/*! exports provided: FormBgComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormBgComponent", function() { return FormBgComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class FormBgComponent {
    constructor() { }
    ngOnInit() {
    }
}
FormBgComponent.ɵfac = function FormBgComponent_Factory(t) { return new (t || FormBgComponent)(); };
FormBgComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FormBgComponent, selectors: [["app-form-bg"]], decls: 2, vars: 0, consts: [[1, "message-cutout"]], template: function FormBgComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "div", 0);
    } }, styles: [".message-cutout[_ngcontent-%COMP%] {\r\n    position: fixed;\r\n    background-color: white;\r\n    opacity: .08;\r\n    width: 470px;\r\n    height: 300px;\r\n    z-index: 1;\r\n}\r\n.message-cutout[_ngcontent-%COMP%]:nth-of-type(1) {\r\n    -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);\r\n            clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%);\r\n    top: 100px;\r\n    right: 80px;\r\n}\r\n.message-cutout[_ngcontent-%COMP%]:nth-of-type(2) {\r\n    -webkit-clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 75%, 25% 100%, 25% 75%, 0% 75%);\r\n            clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 50% 75%, 25% 100%, 25% 75%, 0% 75%);\r\n    top: 140px;\r\n    left: 140px;\r\n}\r\n@media (max-width: 1440px) {\r\n\r\n    .message-cutout[_ngcontent-%COMP%] {\r\n        width: 370px;\r\n        height: 250px;\r\n    }\r\n\r\n}\r\n@media (max-width: 992px) {\r\n\r\n    .message-cutout[_ngcontent-%COMP%] { display: none; }\r\n\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZm9ybS1iZy9mb3JtLWJnLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxlQUFlO0lBQ2YsdUJBQXVCO0lBQ3ZCLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtJQUNiLFVBQVU7QUFDZDtBQUNBO0lBQ0ksd0ZBQWdGO1lBQWhGLGdGQUFnRjtJQUNoRixVQUFVO0lBQ1YsV0FBVztBQUNmO0FBQ0E7SUFDSSx3RkFBZ0Y7WUFBaEYsZ0ZBQWdGO0lBQ2hGLFVBQVU7SUFDVixXQUFXO0FBQ2Y7QUFFQTs7SUFFSTtRQUNJLFlBQVk7UUFDWixhQUFhO0lBQ2pCOztBQUVKO0FBRUE7O0lBRUksa0JBQWtCLGFBQWEsRUFBRTs7QUFFckMiLCJmaWxlIjoic3JjL2FwcC9mb3JtLWJnL2Zvcm0tYmcuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tZXNzYWdlLWN1dG91dCB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgIG9wYWNpdHk6IC4wODtcclxuICAgIHdpZHRoOiA0NzBweDtcclxuICAgIGhlaWdodDogMzAwcHg7XHJcbiAgICB6LWluZGV4OiAxO1xyXG59XHJcbi5tZXNzYWdlLWN1dG91dDpudGgtb2YtdHlwZSgxKSB7XHJcbiAgICBjbGlwLXBhdGg6IHBvbHlnb24oMCUgMCUsIDEwMCUgMCUsIDEwMCUgNzUlLCA3NSUgNzUlLCA3NSUgMTAwJSwgNTAlIDc1JSwgMCUgNzUlKTtcclxuICAgIHRvcDogMTAwcHg7XHJcbiAgICByaWdodDogODBweDtcclxufVxyXG4ubWVzc2FnZS1jdXRvdXQ6bnRoLW9mLXR5cGUoMikge1xyXG4gICAgY2xpcC1wYXRoOiBwb2x5Z29uKDAlIDAlLCAxMDAlIDAlLCAxMDAlIDc1JSwgNTAlIDc1JSwgMjUlIDEwMCUsIDI1JSA3NSUsIDAlIDc1JSk7XHJcbiAgICB0b3A6IDE0MHB4O1xyXG4gICAgbGVmdDogMTQwcHg7XHJcbn1cclxuXHJcbkBtZWRpYSAobWF4LXdpZHRoOiAxNDQwcHgpIHtcclxuXHJcbiAgICAubWVzc2FnZS1jdXRvdXQge1xyXG4gICAgICAgIHdpZHRoOiAzNzBweDtcclxuICAgICAgICBoZWlnaHQ6IDI1MHB4O1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuQG1lZGlhIChtYXgtd2lkdGg6IDk5MnB4KSB7XHJcblxyXG4gICAgLm1lc3NhZ2UtY3V0b3V0IHsgZGlzcGxheTogbm9uZTsgfVxyXG5cclxufVxyXG4iXX0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FormBgComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-form-bg',
                templateUrl: './form-bg.component.html',
                styleUrls: ['./form-bg.component.css']
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/local-storage.service.ts":
/*!******************************************!*\
  !*** ./src/app/local-storage.service.ts ***!
  \******************************************/
/*! exports provided: LocalStorageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalStorageService", function() { return LocalStorageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");


class LocalStorageService {
    constructor() {
        this.tokenName = "--token-ASM";
        this.postThemeName = "--post-theme-ASM";
    }
    /**
     * set
     */
    set(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
        else {
            alert('Browser does not support localStorage API.');
        }
    }
    /**
     * get
     */
    get(key) {
        if (localStorage) {
            if (key in localStorage) {
                return localStorage.getItem(key);
            }
        }
        else {
            alert('Browser does not support the localStorage API.');
        }
    }
    /**
     * setToken
     */
    setToken(token) {
        this.set(this.tokenName, token);
    }
    /**
     * getToken
     */
    getToken() {
        return this.get(this.tokenName);
    }
    /**
     * getParsedToken
     */
    getParsedToken() {
        let token = this.getToken();
        return JSON.parse(atob(token.split(".")[1]));
    }
    /**
     * removeToken
     */
    removeToken() {
        localStorage.removeItem(this.tokenName);
    }
    /**
     * setPostTheme
     */
    setPostTheme(theme) {
        this.set(this.postThemeName, theme);
    }
    /**
     * getPostTheme
     */
    getPostTheme() {
        return this.get(this.postThemeName);
    }
}
LocalStorageService.ɵfac = function LocalStorageService_Factory(t) { return new (t || LocalStorageService)(); };
LocalStorageService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LocalStorageService, factory: LocalStorageService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LocalStorageService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();


/***/ }),

/***/ "./src/app/page-feed/page-feed.component.ts":
/*!**************************************************!*\
  !*** ./src/app/page-feed/page-feed.component.ts ***!
  \**************************************************/
/*! exports provided: PageFeedComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageFeedComponent", function() { return PageFeedComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../sidebar/sidebar.component */ "./src/app/sidebar/sidebar.component.ts");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _post_post_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../post/post.component */ "./src/app/post/post.component.ts");











function PageFeedComponent_div_29_app_post_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", ctx_r5.bestiePosts[0]);
} }
function PageFeedComponent_div_29_app_post_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", ctx_r6.bestiePosts[1]);
} }
function PageFeedComponent_div_29_app_post_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", ctx_r7.bestiePosts[2]);
} }
function PageFeedComponent_div_29_app_post_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", ctx_r8.bestiePosts[3]);
} }
function PageFeedComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "My Besties");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PageFeedComponent_div_29_app_post_5_Template, 1, 1, "app-post", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, PageFeedComponent_div_29_app_post_7_Template, 1, 1, "app-post", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, PageFeedComponent_div_29_app_post_9_Template, 1, 1, "app-post", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, PageFeedComponent_div_29_app_post_11_Template, 1, 1, "app-post", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "hr", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.bestiePosts[0]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.bestiePosts[1]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.bestiePosts[2]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.bestiePosts[3]);
} }
function PageFeedComponent_app_post_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const post_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", post_r9);
} }
function PageFeedComponent_app_post_34_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const post_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", post_r10);
} }
function PageFeedComponent_app_post_36_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const post_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", post_r11);
} }
function PageFeedComponent_app_post_38_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-post", 31);
} if (rf & 2) {
    const post_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("post", post_r12);
} }
const _c0 = function (a0) { return { "active": a0 }; };
class PageFeedComponent {
    constructor(api, title, storage, events) {
        this.api = api;
        this.title = title;
        this.storage = storage;
        this.events = events;
        /**
         * newPostContent
         */
        this.newPostContent = "";
        this.newPostTheme = this.storage.getPostTheme() || "primary";
        this.posts = {
            col1: [],
            col2: [],
            col3: [],
            col4: [],
        };
        this.bestiePosts = [];
    }
    ngOnInit() {
        this.title.setTitle("A Social Media - Feed");
        let requestObject = {
            location: "users/generate-feed",
            method: "GET"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 200) {
                this.bestiePosts = val.bestiePosts;
                let fullCol1 = val.posts.filter((val, i) => i % 4 == 0);
                let fullCol2 = val.posts.filter((val, i) => i % 4 == 1);
                let fullCol3 = val.posts.filter((val, i) => i % 4 == 2);
                let fullCol4 = val.posts.filter((val, i) => i % 4 == 3);
                let cols = [fullCol1, fullCol2, fullCol3, fullCol4];
                this.addPostToFeed(cols, 0, 0);
            }
            else {
                this.events.onAlertEvent.emit("Something went wrong, your post  could not be created.");
            }
        });
    }
    /**
     * changeTheme
     */
    changeTheme(newTheme) {
        this.newPostTheme = newTheme;
        this.storage.setPostTheme(newTheme);
    }
    /**
     * createPost
     */
    createPost() {
        if (this.newPostContent.length == 0) {
            return this.events.onAlertEvent.emit("No Content For Your Post was Provided.");
        }
        let requestObject = {
            location: "users/create-post",
            method: "POST",
            body: {
                theme: this.newPostTheme,
                content: this.newPostContent
            }
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 201) {
                val.post.ago = "Now";
                this.posts.col1.unshift(val.post);
            }
            else {
                this.events.onAlertEvent.emit("Something went wrong, your post  could not be created.");
            }
            this.newPostContent = "";
        });
    }
    addPostToFeed(array, colNumber, delay) {
        setTimeout(() => {
            if (array[colNumber].length) {
                this.posts["col" + (colNumber + 1)].push(array[colNumber].splice(0, 1)[0]);
                colNumber = ++colNumber % 4;
                this.addPostToFeed(array, colNumber, 100);
            }
        }, delay);
    }
}
PageFeedComponent.ɵfac = function PageFeedComponent_Factory(t) { return new (t || PageFeedComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"])); };
PageFeedComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PageFeedComponent, selectors: [["app-page-feed"]], decls: 39, vars: 32, consts: [["id", "wrapper"], ["id", "accordionSidebar", 1, "navbar-nav", "bg-gradient-primary", "sidebar", "auto-toggle", "sidebar-dark", "accordion"], ["id", "content-wrapper", 1, "d-flex", "flex-column"], ["id", "content"], [1, "container-fluid"], [1, "h3", "mb-4", "text-gray-800", "text-center", "text-md-left"], [1, "w-100", "w-xl-50", "mb-4"], [1, "create-post", "shadow", "rounded-pill"], ["href", "#create-post", "data-toggle", "collapse", "role", "button", 1, "d-block", "link", "rounded-pill", "card-header", "py-3", "bg-white"], [1, "m-0", "font-weight-bold", "h5", "font-weight-600", "text-center", "text-md-left"], ["id", "create-post", 1, "collapse", "mb-5"], [1, "mt-3", "ml-4", "d-flex", "align-items-center", "flex-wrap", "flex-md-nowrap", "justify-content-center", "justify-content-md-start"], [1, "theme", "h5", "m-0", "mr-3", "d-inline-block"], [1, "bg-primary", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-success", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-info", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-warning", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-danger", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-purple", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-pink", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], [1, "bg-orange", "mx-1", "my-2", "hov-scale", "rounded-circle", "color-preview", "d-inline-block", 3, "ngClass", "click"], ["action", "", "method", "post", 1, "mt-3", "w-100", 3, "submit"], ["name", "content", "rows", "8", "cols", "80", "placeholder", "Tell us what's up.", "spellcheck", "false", "required", "", 1, "text-white-placeholder", "h5", "p-3", "w-100", "rounded", "text-white", 3, "ngClass", "ngModel", "ngModelChange"], ["type", "submit", "value", "Create Post", 1, "w-50", "mx-auto", "d-block", "mx-md-0", "rounded-pill", "hov-scale", "py-1", "px-3", "btn", "btn-lg", "text-white", 3, "ngClass"], [4, "ngIf"], [1, "row", "mb-5", "pb-5"], [1, "col-xl-3", "col-lg-6"], [3, "post", 4, "ngFor", "ngForOf"], [1, "text-center", "text-x1-left", "text-uppercase", "text-primary", "h4", "font-weight-900", "mt-5", "mb-0"], [3, "post", 4, "ngIf"], [1, "divider", "w-40"], [3, "post"]], template: function PageFeedComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ul", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "app-sidebar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-topbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h1", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Your Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "a", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Create A Post");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Color:");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "span", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_18_listener() { return ctx.changeTheme("primary"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_19_listener() { return ctx.changeTheme("success"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "span", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_20_listener() { return ctx.changeTheme("info"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "span", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_21_listener() { return ctx.changeTheme("warning"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "span", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_22_listener() { return ctx.changeTheme("danger"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "span", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_23_listener() { return ctx.changeTheme("purple"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_24_listener() { return ctx.changeTheme("pink"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "span", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PageFeedComponent_Template_span_click_25_listener() { return ctx.changeTheme("orange"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "form", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function PageFeedComponent_Template_form_submit_26_listener() { return ctx.createPost(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "textarea", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageFeedComponent_Template_textarea_ngModelChange_27_listener($event) { return ctx.newPostContent = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](28, "input", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](29, PageFeedComponent_div_29_Template, 13, 4, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](32, PageFeedComponent_app_post_32_Template, 1, 1, "app-post", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](34, PageFeedComponent_app_post_34_Template, 1, 1, "app-post", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](36, PageFeedComponent_app_post_36_Template, 1, 1, "app-post", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](38, PageFeedComponent_app_post_38_Template, 1, 1, "app-post", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](16, _c0, ctx.newPostTheme == "primary"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](18, _c0, ctx.newPostTheme == "success"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](20, _c0, ctx.newPostTheme == "info"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](22, _c0, ctx.newPostTheme == "warning"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](24, _c0, ctx.newPostTheme == "danger"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](26, _c0, ctx.newPostTheme == "purple"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](28, _c0, ctx.newPostTheme == "pink"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](30, _c0, ctx.newPostTheme == "orange"));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "bg-" + ctx.newPostTheme)("ngModel", ctx.newPostContent);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "bg-" + ctx.newPostTheme);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.bestiePosts.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.posts.col1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.posts.col2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.posts.col3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.posts.col4);
    } }, directives: [_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_5__["SidebarComponent"], _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_6__["TopbarComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgClass"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_7__["NgForOf"], _post_post_component__WEBPACK_IMPORTED_MODULE_9__["PostComponent"]], styles: [".color-preview[_ngcontent-%COMP%] { width: 30px; height: 30px; }\r\n.color-preview.active[_ngcontent-%COMP%] { transform: scale(1.2); }\r\n@media (min-width: 1200px) { .w-xl-50[_ngcontent-%COMP%] { width: 50% !important; } }\r\n@media (max-width: 768px) { .theme[_ngcontent-%COMP%] { width: 100% !important; text-align: center; } }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZS1mZWVkL3BhZ2UtZmVlZC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlCQUFpQixXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQzVDLHdCQUF3QixxQkFBcUIsRUFBRTtBQUMvQyw2QkFBNkIsV0FBVyxxQkFBcUIsRUFBRSxFQUFFO0FBQ2pFLDRCQUE0QixTQUFTLHNCQUFzQixFQUFFLGtCQUFrQixFQUFFLEVBQUUiLCJmaWxlIjoic3JjL2FwcC9wYWdlLWZlZWQvcGFnZS1mZWVkLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuY29sb3ItcHJldmlldyB7IHdpZHRoOiAzMHB4OyBoZWlnaHQ6IDMwcHg7IH1cclxuLmNvbG9yLXByZXZpZXcuYWN0aXZlIHsgdHJhbnNmb3JtOiBzY2FsZSgxLjIpOyB9XHJcbkBtZWRpYSAobWluLXdpZHRoOiAxMjAwcHgpIHsgLncteGwtNTAgeyB3aWR0aDogNTAlICFpbXBvcnRhbnQ7IH0gfVxyXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHsgLnRoZW1lIHsgd2lkdGg6IDEwMCUgIWltcG9ydGFudDsgdGV4dC1hbGlnbjogY2VudGVyOyB9IH1cclxuIl19 */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PageFeedComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-page-feed',
                templateUrl: './page-feed.component.html',
                styleUrls: ['./page-feed.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["Title"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_3__["LocalStorageService"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-friend-requests/page-friend-requests.component.ts":
/*!************************************************************************!*\
  !*** ./src/app/page-friend-requests/page-friend-requests.component.ts ***!
  \************************************************************************/
/*! exports provided: PageFriendRequestsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageFriendRequestsComponent", function() { return PageFriendRequestsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../result-request/result-request.component */ "./src/app/result-request/result-request.component.ts");












function PageFriendRequestsComponent_app_result_request_9_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "app-result-request", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("resultRequestChange", function PageFriendRequestsComponent_app_result_request_9_Template_app_result_request_resultRequestChange_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r2.updateFriendRequests($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const user_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("resultRequest", user_r1);
} }
let PageFriendRequestsComponent = class PageFriendRequestsComponent {
    constructor(events, api, title, document) {
        this.events = events;
        this.api = api;
        this.title = title;
        this.document = document;
        this.userData = {};
        this.friendRequests = [];
        this.subscriptions = [];
    }
    ngOnInit() {
        this.title.setTitle("Friend Request");
        this.document.getElementById("sidebarToggleTop").classList.add("d-none");
        let userDataEvent = this.events.getUserData.subscribe((data) => {
            this.userData = data;
            let array = JSON.stringify(data.friend_requests);
            let requestObject = {
                location: `users/get-friend-requests?friend_requests=${array}`,
                method: "GET"
            };
            this.api.makeRequest(requestObject).then((val) => {
                if (val.statusCode === 200) {
                    this.friendRequests = val.users;
                    console.log(this.friendRequests);
                }
            });
        });
        this.subscriptions.push(userDataEvent);
    }
    updateFriendRequests(id) {
        console.log("Remove this", id);
        let arr = this.friendRequests;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]._id == id) {
                arr.splice(i, 1);
                break;
            }
        }
    }
};
PageFriendRequestsComponent.ɵfac = function PageFriendRequestsComponent_Factory(t) { return new (t || PageFriendRequestsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_5__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"])); };
PageFriendRequestsComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PageFriendRequestsComponent, selectors: [["app-page-friend-requests"]], decls: 16, vars: 1, consts: [["id", "wrapper"], ["id", "content-wrapper", 1, "d-flex", "flex-column"], ["id", "content", 1, "min-vh-100"], [1, "container-fluid"], [1, "h4", "mb-4", "text-gray-800", "text-center", "text-md-left", "font-weight-300"], [1, "row", "mb-5"], [1, "col-xl-6", "col-lg-8"], ["use", "request", 3, "resultRequest", "resultRequestChange", 4, "ngFor", "ngForOf"], [1, "col-xl-6", "d-lg-none", "d-xl-block", 2, "margin-top", "14vh"], [1, "display-2", "font-weight-800", "text-center", 2, "opacity", ".2"], [1, "h1", "font-weight-400", "text-center"], ["routerLink", "/feed", "href", "", 1, "link", "text-center", "text-uppercase"], ["use", "request", 3, "resultRequest", "resultRequestChange"]], template: function PageFriendRequestsComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "app-topbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "h1", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Friend Requests");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, PageFriendRequestsComponent_app_result_request_9_Template, 1, 1, "app-result-request", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h3", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, " A Social Media ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "h2", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Back to Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.friendRequests);
    } }, directives: [_topbar_topbar_component__WEBPACK_IMPORTED_MODULE_7__["TopbarComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_8__["RouterLinkWithHref"], _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_9__["ResultRequestComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2UtZnJpZW5kLXJlcXVlc3RzL3BhZ2UtZnJpZW5kLXJlcXVlc3RzLmNvbXBvbmVudC5jc3MifQ== */"] });
PageFriendRequestsComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_3__["AutoUnsubscribe"]
], PageFriendRequestsComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PageFriendRequestsComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-page-friend-requests',
                templateUrl: './page-friend-requests.component.html',
                styleUrls: ['./page-friend-requests.component.css']
            }]
    }], function () { return [{ type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"] }, { type: _api_service__WEBPACK_IMPORTED_MODULE_5__["ApiService"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["Title"] }, { type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"]]
            }] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-login/page-login.component.ts":
/*!****************************************************!*\
  !*** ./src/app/page-login/page-login.component.ts ***!
  \****************************************************/
/*! exports provided: PageLoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageLoginComponent", function() { return PageLoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../form-bg/form-bg.component */ "./src/app/form-bg/form-bg.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");









function PageLoginComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.formError);
} }
class PageLoginComponent {
    constructor(api, storage, router, title) {
        this.api = api;
        this.storage = storage;
        this.router = router;
        this.title = title;
        /**
        * formSubmit
        */
        this.formError = "";
        this.credentials = {
            email: '',
            password: ''
        };
    }
    ngOnInit() {
        this.title.setTitle("Login");
    }
    formSubmit() {
        this.formError = "";
        if (!this.credentials.email ||
            !this.credentials.password) {
            return this.formError = "All Fields are Required";
        }
        if (!this.formError) {
            this.login();
        }
    }
    login() {
        let requestOption = {
            method: "POST",
            location: "users/login",
            body: this.credentials
        };
        this.api.makeRequest(requestOption).then((val) => {
            if (val.token) {
                this.storage.setToken(val.token);
                this.router.navigate(['/']);
                return;
            }
            if (val.message) {
                this.formError = val.message;
            }
        });
    }
}
PageLoginComponent.ɵfac = function PageLoginComponent_Factory(t) { return new (t || PageLoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["Title"])); };
PageLoginComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PageLoginComponent, selectors: [["app-page-login"]], decls: 22, vars: 3, consts: [[1, "bg-gradient-primary", "min-vh-100"], [1, "bg-2"], [1, "container"], [1, "text-white", "pt-6", "pt-sm-16vh"], ["class", "alert alert-primary text-primary mb-5", 4, "ngIf"], [1, "font-weight-800", "text-center", "display-4"], [1, "resp", "h4", "w-50", "mx-auto", "text-center", 2, "line-height", "150%"], [1, "font-weight-300", "mt-4", "text-center"], [1, "login-form", "w-100", "w-md-50", "mx-auto", "user", "mt-5", 3, "submit"], [1, "form-group"], ["type", "email", "id", "exampleInputEmail", "aria-describedby", "emailHelp", "placeholder", "Email Address", "name", "email", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], ["type", "password", "id", "exampleInputPassword", "placeholder", "Password", "name", "password", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], ["type", "submit", "value", "Login", 1, "btn", "btn-primary", "btn-user", "btn-block"], [1, "text-center", "p-5", "m-0"], ["routerLink", "/register", 1, "text-white", "link"], [1, "alert", "alert-primary", "text-primary", "mb-5"]], template: function PageLoginComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-form-bg");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PageLoginComponent_div_5_Template, 2, 1, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h1", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "A Social Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " A social media website for real people. Definitely no fake users on this site. None at all.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h2", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Login");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "form", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function PageLoginComponent_Template_form_submit_12_listener() { return ctx.formSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "input", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageLoginComponent_Template_input_ngModelChange_14_listener($event) { return ctx.credentials.email = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageLoginComponent_Template_input_ngModelChange_16_listener($event) { return ctx.credentials.password = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](17, "input", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "h4", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Don't already have an account? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "a", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Register");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.formError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.password);
    } }, directives: [_form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_5__["FormBgComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgModel"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2UtbG9naW4vcGFnZS1sb2dpbi5jb21wb25lbnQuY3NzIn0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PageLoginComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-page-login',
                templateUrl: './page-login.component.html',
                styleUrls: ['./page-login.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["Title"] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-messages/page-messages.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/page-messages/page-messages.component.ts ***!
  \**********************************************************/
/*! exports provided: PageMessagesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageMessagesComponent", function() { return PageMessagesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../sidebar/sidebar.component */ "./src/app/sidebar/sidebar.component.ts");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");












function PageMessagesComponent_h2_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h2", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "You currently have no messages!!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageMessagesComponent_div_13_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageMessagesComponent_div_13_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5); const message_r3 = ctx.$implicit; const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r4.setActiveMessage(message_r3.from_id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "a");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "img", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "a", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "i", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageMessagesComponent_div_13_Template_i_click_9_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r5); const message_r3 = ctx.$implicit; const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r6.deleteMessage(message_r3._id); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/images/", message_r3.messengerProfileImage, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](message_r3.messengerName);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", message_r3.content[message_r3.content.length - 1].message, " ");
} }
function PageMessagesComponent_div_15_div_3_span_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "a", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const group_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", group_r9.id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](group_r9.name);
} }
function PageMessagesComponent_div_15_div_3_span_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "a", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const group_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", group_r9.id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](group_r9.name);
} }
function PageMessagesComponent_div_15_div_3_div_6_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const message_r15 = ctx.$implicit;
    const group_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", group_r9.isMe ? "w-max ml-auto mr-5" : "w-75 ml-5");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", group_r9.isMe ? "w-max ml-auto bg-success" : "bg-primary");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](message_r15);
} }
const _c0 = function (a0) { return { "ml-auto w-max": a0 }; };
function PageMessagesComponent_div_15_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, PageMessagesComponent_div_15_div_3_span_2_Template, 3, 2, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "a", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, PageMessagesComponent_div_15_div_3_span_5_Template, 3, 2, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, PageMessagesComponent_div_15_div_3_div_6_Template, 3, 3, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const group_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction1"](6, _c0, group_r9.isMe));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", group_r9.isMe);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", group_r9.id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/images/", group_r9.image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !group_r9.isMe);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", group_r9.messages);
} }
function PageMessagesComponent_div_15_Template(rf, ctx) { if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 24, 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, PageMessagesComponent_div_15_div_3_Template, 7, 8, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "form", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("submit", function PageMessagesComponent_div_15_Template_form_submit_5_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r17.sendMessage(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "textarea", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function PageMessagesComponent_div_15_Template_textarea_ngModelChange_6_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r18); const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r19.newMessages = $event; });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](2);
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("scrollTop", _r7.scrollHeight);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.activeMessage.messageGroups);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx_r2.newMessages);
} }
let PageMessagesComponent = class PageMessagesComponent {
    constructor(title, api, cdRef, events) {
        this.title = title;
        this.api = api;
        this.cdRef = cdRef;
        this.events = events;
        this.activeMessage = {
            fromId: "",
            fromName: "",
            fromProfilePicture: "",
            messageGroups: []
        };
        this.messages = [];
        this.usersProfileImage = "default_avatar";
        this.userName = "";
        this.userId = "";
        this.subscriptions = [];
        this.newMessages = "";
    }
    ngOnInit() {
        this.title.setTitle("Your Messages");
        this.api.resetMessageNotifications();
        if (history.state.data && history.state.data.msgId) {
            this.activeMessage.fromId = history.state.data.msgId;
        }
        let userDataEvent = this.events.getUserData.subscribe((user) => {
            setTimeout(() => {
                if (!user.messages.length) {
                    return;
                }
                this.activeMessage.fromId =
                    this.activeMessage.fromId || user.messages[0].from_id;
                this.messages = user.messages.reverse();
                this.userName = user.name;
                this.userId = user._id;
                this.usersProfileImage = user.profile_image;
                this.setActiveMessage(this.activeMessage.fromId);
            }, 0);
        });
        this.subscriptions.push(userDataEvent);
    }
    /**
    * setActiveMessage
    */
    setActiveMessage(id) {
        for (let message of this.messages) {
            if (message.from_id == id) {
                this.activeMessage.fromId = message.from_id;
                this.activeMessage.fromName = message.messengerName;
                this.activeMessage.fromProfilePicture =
                    message.messengerProfileImage;
                let groups = (this.activeMessage.messageGroups = []);
                for (let content of message.content) {
                    let me = (content.messenger == this.userId);
                    if (groups.length) {
                        var lastMessengerId = groups[groups.length - 1].id;
                        if (content.messenger == lastMessengerId) {
                            groups[groups.length - 1].messages.
                                push(content.message);
                            continue;
                        }
                    }
                    let group = {
                        image: me ?
                            this.usersProfileImage : message.messengerProfileImage,
                        name: me ? "Me" : message.messengerName,
                        id: content.messenger,
                        messages: [content.message],
                        isMe: me
                    };
                    groups.push(group);
                }
            }
        }
        this.cdRef.detectChanges();
    }
    /**
    * sendMessage
    */
    sendMessage() {
        if (!this.newMessages) {
            return;
        }
        let obj = {
            content: this.newMessages,
            id: this.activeMessage.fromId
        };
        this.api.sendMessage(obj, false).then((val) => {
            if (val.statusCode == 201) {
                let groups = this.activeMessage.messageGroups;
                if (groups[groups.length - 1].isMe) {
                    groups[groups.length - 1].messages.push(this.newMessages);
                }
                else {
                    let newGroup = {
                        image: this.usersProfileImage,
                        name: this.userName,
                        id: this.userId,
                        messages: [this.newMessages],
                        isMe: true
                    };
                    groups.push(newGroup);
                }
            }
            for (let message of this.messages) {
                if (message.from_id == this.activeMessage.fromId) {
                    let newContent = {
                        message: this.newMessages,
                        messenger: this.userId
                    };
                    message.content.push(newContent);
                }
            }
            this.newMessages = "";
        });
    }
    ngAfterContentChecked() {
        this.cdRef.detectChanges();
    }
    /**
     * deleteMessage
     */
    deleteMessage(msgId) {
        let requestObject = {
            location: `users/delete-message/${msgId}`,
            method: "POST"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 201) {
                for (let i = 0; i < this.messages.length; i++) {
                    if (this.messages[i]._id == msgId) {
                        this.messages.splice(i, 1);
                        if (!this.messages.length) {
                            return;
                        }
                        this.setActiveMessage(this.messages[0].from_id);
                        break;
                    }
                }
            }
        });
    }
};
PageMessagesComponent.ɵfac = function PageMessagesComponent_Factory(t) { return new (t || PageMessagesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_5__["EventEmitterService"])); };
PageMessagesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PageMessagesComponent, selectors: [["app-page-messages"]], decls: 16, vars: 3, consts: [["id", "wrapper"], ["id", "accordionSidebar", 1, "navbar-nav", "bg-gradient-primary", "sidebar", "auto-toggle", "sidebar-dark", "accordion"], ["id", "content-wrapper", 1, "d-flex", "flex-column"], ["id", "content"], [1, "container-fluid", "p-0", "p-sm-4"], [1, "h3", "mb-4", "text-gray-800", "text-center", "text-md-left"], ["class", "h4 ml-3 font-weight-300", 4, "ngIf"], [1, "row", "mb-5"], [1, "col-xl-4", "col-lg-5"], [1, "message-list", "mb-5", "custom-scroll", "pr-3"], ["class", "message p-3 pr-5 my-4 bg-white", 3, "click", 4, "ngFor", "ngForOf"], [1, "col-xl-7", "col-lg-7"], ["class", "message-window shadow bg-white d-flex flex-column justify-content-between", 4, "ngIf"], [1, "h4", "ml-3", "font-weight-300"], [1, "message", "p-3", "pr-5", "my-4", "bg-white", 3, "click"], [1, "messenger"], [1, "d-flex", "justify-content-between", "align-items-center"], [1, ""], [1, "rounded-circle", "profile-img-md", 3, "src"], [1, "ml-3"], [1, "text-primary", "link"], [1, "link", "mb-2", "fas", "fa-trash-alt", 3, "click"], [1, "mt-2", "text-truncate"], [1, "message-window", "shadow", "bg-white", "d-flex", "flex-column", "justify-content-between"], [1, "message-content", "p-3", "grow-1", "custom-scroll", 3, "scrollTop"], ["scrollMe", ""], ["class", "messenger mb-5", 4, "ngFor", "ngForOf"], ["action", "index.html", "method", "post", 3, "submit"], ["placeholder", "Your message...", "name", "name", "rows", "4", "required", "", 1, "w-100", "border-top", "p-3", "custom-scroll", 3, "ngModel", "ngModelChange"], ["type", "submit", "value", "Send Message", 1, "w-100", "p-2", "border-0", "btn-primary"], [1, "messenger", "mb-5"], [1, "mb-2", 3, "ngClass"], ["class", "mr-3", 4, "ngIf"], [3, "routerLink"], [1, "rounded-circle", "profile-img-sm", 3, "src"], ["class", "ml-3", 4, "ngIf"], ["class", "mb-2", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "mr-3"], [1, "link", 3, "routerLink"], [1, "text-white", "p-2", "px-4", "d-inline", "rounded-pill", "message-style", 3, "ngClass"]], template: function PageMessagesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "ul", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "app-sidebar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "app-topbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "h1", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8, "Your Messages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, PageMessagesComponent_h2_9_Template, 2, 0, "h2", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, PageMessagesComponent_div_13_Template, 12, 3, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, PageMessagesComponent_div_15_Template, 8, 3, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.messages.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.messages);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.messages.length);
    } }, directives: [_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_6__["SidebarComponent"], _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_7__["TopbarComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_9__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_8__["NgClass"], _angular_router__WEBPACK_IMPORTED_MODULE_10__["RouterLinkWithHref"]], styles: [".message[_ngcontent-%COMP%] { background-color: #F5F5F5 !important; cursor: pointer;}\r\n.message[_ngcontent-%COMP%]:hover{ background-color: #EEEEEE }\r\n.message-container[_ngcontent-%COMP%] { max-width: 75%; }\r\n.message-style[_ngcontent-%COMP%] {\r\n    line-height: 300%;\r\n    background-color: #F5F5F5;\r\n    box-decoration-break: clone;\r\n    -webkit-box-decoration-break: clone;\r\n}\r\n.message[_ngcontent-%COMP%]:first-of-type { margin-top: 0 !important; }\r\n.message[_ngcontent-%COMP%]:last-of-type { margin-bottom: 0 !important; }\r\n.message-window[_ngcontent-%COMP%] { height: 74vh; }\r\n.message-list[_ngcontent-%COMP%], .message-content[_ngcontent-%COMP%] {\r\n    height: 74vh;\r\n    overflow-y: scroll;\r\n}\r\n@media (max-width: 992px) {\r\n    .message-list[_ngcontent-%COMP%] { height: 26vh; }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZS1tZXNzYWdlcy9wYWdlLW1lc3NhZ2VzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxvQ0FBb0MsRUFBRSxlQUFlLENBQUM7QUFDakUsZ0JBQWdCLDBCQUEwQjtBQUMxQyxxQkFBcUIsY0FBYyxFQUFFO0FBQ3JDO0lBQ0ksaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QiwyQkFBMkI7SUFDM0IsbUNBQW1DO0FBQ3ZDO0FBRUEseUJBQXlCLHdCQUF3QixFQUFFO0FBQ25ELHdCQUF3QiwyQkFBMkIsRUFBRTtBQUVyRCxrQkFBa0IsWUFBWSxFQUFFO0FBRWhDO0lBQ0ksWUFBWTtJQUNaLGtCQUFrQjtBQUN0QjtBQUVBO0lBQ0ksZ0JBQWdCLFlBQVksRUFBRTtBQUNsQyIsImZpbGUiOiJzcmMvYXBwL3BhZ2UtbWVzc2FnZXMvcGFnZS1tZXNzYWdlcy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1lc3NhZ2UgeyBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1ICFpbXBvcnRhbnQ7IGN1cnNvcjogcG9pbnRlcjt9XHJcbi5tZXNzYWdlOmhvdmVyeyBiYWNrZ3JvdW5kLWNvbG9yOiAjRUVFRUVFIH1cclxuLm1lc3NhZ2UtY29udGFpbmVyIHsgbWF4LXdpZHRoOiA3NSU7IH1cclxuLm1lc3NhZ2Utc3R5bGUge1xyXG4gICAgbGluZS1oZWlnaHQ6IDMwMCU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjVGNUY1O1xyXG4gICAgYm94LWRlY29yYXRpb24tYnJlYWs6IGNsb25lO1xyXG4gICAgLXdlYmtpdC1ib3gtZGVjb3JhdGlvbi1icmVhazogY2xvbmU7XHJcbn1cclxuXHJcbi5tZXNzYWdlOmZpcnN0LW9mLXR5cGUgeyBtYXJnaW4tdG9wOiAwICFpbXBvcnRhbnQ7IH1cclxuLm1lc3NhZ2U6bGFzdC1vZi10eXBlIHsgbWFyZ2luLWJvdHRvbTogMCAhaW1wb3J0YW50OyB9XHJcblxyXG4ubWVzc2FnZS13aW5kb3cgeyBoZWlnaHQ6IDc0dmg7IH1cclxuXHJcbi5tZXNzYWdlLWxpc3QsIC5tZXNzYWdlLWNvbnRlbnQge1xyXG4gICAgaGVpZ2h0OiA3NHZoO1xyXG4gICAgb3ZlcmZsb3cteTogc2Nyb2xsO1xyXG59XHJcblxyXG5AbWVkaWEgKG1heC13aWR0aDogOTkycHgpIHtcclxuICAgIC5tZXNzYWdlLWxpc3QgeyBoZWlnaHQ6IDI2dmg7IH1cclxufVxyXG4iXX0= */"] });
PageMessagesComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_2__["AutoUnsubscribe"]
], PageMessagesComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PageMessagesComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-page-messages',
                templateUrl: './page-messages.component.html',
                styleUrls: ['./page-messages.component.css']
            }]
    }], function () { return [{ type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["Title"] }, { type: _api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_5__["EventEmitterService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-profile/page-profile.component.ts":
/*!********************************************************!*\
  !*** ./src/app/page-profile/page-profile.component.ts ***!
  \********************************************************/
/*! exports provided: PageProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageProfileComponent", function() { return PageProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _post_post_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../post/post.component */ "./src/app/post/post.component.ts");












function PageProfileComponent_div_17_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "hr", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "h6", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "This User has sent you a friend Request.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_17_Template_button_click_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r10.accept(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Accept");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_17_Template_button_click_6_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r12.decline(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Decline");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "hr", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_button_18_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Friend Request Pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_button_19_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r13.makeFriendRequest(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Add Friend");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_button_20_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_button_20_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r16); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r15.updateSendMessageObject(ctx_r15.usersID, ctx_r15.userName); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Send Message");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_div_26_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h5", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "a", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const friend_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", friend_r18._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/images/", friend_r18.profile_image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", friend_r18._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](friend_r18.name);
} }
function PageProfileComponent_div_26_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, PageProfileComponent_div_26_div_2_Template, 6, 4, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r4.randomFriends);
} }
function PageProfileComponent_div_27_div_1_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_27_div_1_div_1_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r25); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3); return ctx_r24.toggleRequest("besties"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Make Bestie");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_div_27_div_1_div_2_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " You are only allowed two Besties. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_div_27_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, PageProfileComponent_div_27_div_1_div_1_Template, 2, 0, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, PageProfileComponent_div_27_div_1_div_2_Template, 2, 0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_27_div_1_Template_div_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27); const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r26.toggleRequest("enemies"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Declare Enemy");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r19.maxAmountOfBesties);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r19.maxAmountOfBesties);
} }
function PageProfileComponent_div_27_div_2_Template(rf, ctx) { if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_27_div_2_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r29); const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r28.toggleRequest("besties"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Besties!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Click To Undo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" You And ", ctx_r20.userName, " are ");
} }
function PageProfileComponent_div_27_div_3_Template(rf, ctx) { if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_27_div_3_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r31); const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2); return ctx_r30.toggleRequest("enemies"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Enemies!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, " Click To Undo ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" You And ", ctx_r21.userName, " are ");
} }
function PageProfileComponent_div_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, PageProfileComponent_div_27_div_1_Template, 5, 2, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, PageProfileComponent_div_27_div_2_Template, 6, 1, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, PageProfileComponent_div_27_div_3_Template, 6, 1, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r5.isBestie && !ctx_r5.isEnemy);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r5.isBestie);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r5.isEnemy);
} }
function PageProfileComponent_app_post_31_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-post", 61);
} if (rf & 2) {
    const post_r32 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("post", post_r32);
} }
function PageProfileComponent_a_32_Template(rf, ctx) { if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_a_32_Template_a_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r34); const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r33.showMorePosts(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Load More");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function PageProfileComponent_h3_33_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h3", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Add ", ctx_r8.userName, " as a friend to see their latest posts.");
} }
function PageProfileComponent_div_34_Template(rf, ctx) { if (rf & 1) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "a", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function PageProfileComponent_div_34_Template_a_click_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r36); const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r35.backToTop(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Back To Top");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("No More Posts, you've stalked ", ctx_r9.userName, " completely.");
} }
let PageProfileComponent = class PageProfileComponent {
    constructor(events, title, document, route, api) {
        this.events = events;
        this.title = title;
        this.document = document;
        this.route = route;
        this.api = api;
        this.randomFriends = [];
        this.totalFriends = 0;
        this.posts = [];
        this.showPosts = 6;
        this.profilePicture = "default_avatar";
        this.userName = "";
        this.userEmail = "";
        this.usersID = "";
        this.subscriptions = [];
        this.canAddUser = false;
        this.canSendMessage = false;
        this.haveSentFriendRequest = false;
        this.haveReceivedFriendRequest = false;
        this.isBestie = false;
        this.isEnemy = false;
        this.maxAmountOfBesties = false;
        this.besties = [];
        this.enemies = [];
    }
    ngOnInit() {
        this.title.setTitle("Your Profile");
        this.document.getElementById("sidebarToggleTop").classList
            .add("d-none");
        let paramsId = this.route.snapshot.params.userid;
        let userDataEvent = this.events.getUserData.subscribe((user) => {
            this.besties = user.besties;
            this.enemies = user.enemies;
            this.route.params.subscribe((params) => {
                this.showPosts = 6;
                this.isBestie = user.besties.some((val) => val._id == params.userid);
                this.isEnemy = user.enemies.some((val) => val._id == params.userid);
                this.maxAmountOfBesties = user.besties.length >= 2;
                if (user._id == params.userid) {
                    this.setComponentValues(user);
                    this.resetBoolean();
                }
                else {
                    this.canSendMessage = true;
                    this.canAddUser = true;
                    let requestObject = {
                        location: `users/get-user-data/${params.userid}`,
                        method: "GET"
                    };
                    this.api.makeRequest(requestObject).then((data) => {
                        if (data.statusCode == 200) {
                            this.canAddUser = user.friends.includes(data.user._id) ? false : true;
                            this.haveReceivedFriendRequest = user.friend_requests.includes(data.user._id);
                            this.haveSentFriendRequest = data.user.friend_requests.includes(user._id);
                            if (this.canAddUser) {
                                this.showPosts = 0;
                            }
                            this.setComponentValues(data.user);
                        }
                    });
                }
            });
        });
        this.subscriptions.push(userDataEvent);
    }
    /**
     * showMorePosts
     */
    showMorePosts() {
        this.showPosts += 6;
    }
    /**
     * name
     */
    backToTop() {
        this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
    }
    /**
     * setComponentValues
     */
    setComponentValues(user) {
        this.randomFriends = user.random_friend;
        this.profilePicture = user.profile_image;
        this.posts = user.posts;
        this.userName = user.name;
        this.userEmail = user.email;
        this.totalFriends = user.friends.length;
        this.usersID = user._id;
    }
    /**
     * accept
     */
    accept() {
        this.api.resolveFriendRequest("accept", this.usersID).then((val) => {
            if (val.statusCode == 201) {
                this.haveReceivedFriendRequest = false;
                this.canAddUser = false;
                this.totalFriends++;
                this.showPosts = 6;
            }
        });
    }
    /**
     * decline
     */
    decline() {
        this.api.resolveFriendRequest("decline", this.usersID).then((val) => {
            if (val.statusCode == 201) {
                this.haveReceivedFriendRequest = false;
            }
        });
    }
    /**
     * makeFriendRequest
     */
    makeFriendRequest() {
        this.api.makeFriendRequest(this.usersID).then((val) => {
            if (val.statusCode == 201) {
                this.haveSentFriendRequest = true;
            }
        });
    }
    resetBoolean() {
        this.canAddUser = false;
        this.canSendMessage = false;
        this.haveSentFriendRequest = false;
        this.haveReceivedFriendRequest = false;
        this.isBestie = false;
        this.isEnemy = false;
        this.maxAmountOfBesties = false;
    }
    /**
     * updateSendMessageObject
     */
    updateSendMessageObject(id, name) {
        this.events.updateSendMessageObjectEvent.emit({ id, name });
    }
    /**
     * toggleRequest
     */
    toggleRequest(toggle) {
        function toggleValue(array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i]._id == this.usersID) {
                    return array.splice(i, 1);
                }
            }
            array.push({ _id: this.usersID });
        }
        let requestObject = {
            location: `users/bestie-enemy-toggle/${this.usersID}?toggle=${toggle}`,
            method: "POST"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 201) {
                if (toggle == "besties") {
                    toggleValue.call(this, this.besties);
                    this.maxAmountOfBesties = this.besties.length >= 2;
                    this.isBestie = !this.isBestie;
                }
                else {
                    toggleValue.call(this, this.enemies);
                    this.isEnemy = !this.isEnemy;
                }
            }
        });
    }
};
PageProfileComponent.ɵfac = function PageProfileComponent_Factory(t) { return new (t || PageProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_7__["ApiService"])); };
PageProfileComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PageProfileComponent, selectors: [["app-page-profile"]], decls: 46, vars: 14, consts: [["id", "wrapper"], ["id", "content-wrapper", 1, "d-flex", "flex-column"], ["id", "content", 1, "min-vh-100"], [1, "container-fluid"], [1, "row", "mb-5", "grow-1"], ["id", "me", 1, "col-lg-4", "col-md-6", "mt-5", "mt-md-0"], [1, "rounded-0", "shadow", "card"], [1, "rounded-0", "card-header", "p-0", "bg-white", "border-0"], [1, "bg-purple", "position-relative", "pt-4", "profile-img", "d-flex", "justify-content-center"], [1, "border", "border-thick", "rounded-circle", "profile-img-lg", 3, "src"], [1, "card-body", "bg-purple", "text-center"], [1, "text-white"], [1, "w-50", "h6", "mx-auto", "text-white"], [1, "my-4"], ["class", "my-4", 4, "ngIf"], ["class", "btn btn-warning rounded-pill m-1", 4, "ngIf"], ["class", "btn btn-light text-primary rounded-pill m-1", 3, "click", 4, "ngIf"], ["class", "btn btn-info rounded-pill m-1", "data-toggle", "modal", "data-target", "#staticBackdrop", 3, "click", 4, "ngIf"], [1, "w-25", "my-4", "bg-white"], [1, "h4", "text-white"], ["id", "friends-list", "class", "card shadow rounded-0 mt-4 pb-3", 4, "ngIf"], ["class", "text-center mt-5", 4, "ngIf"], ["id", "recent-posts", 1, "col-lg-5", "col-md-6", "mt-5", "mt-md-0"], [1, "text-success", "shadow", "py-3", "text-center", "bg-white", "rounded-pill"], [3, "post", 4, "ngFor", "ngForOf"], ["class", "bg-success d-block mt-4 py-3 text-center rounded-pill text-white link h5", 3, "click", 4, "ngIf"], ["class", "text-center w-75 mx-auto mt-5 text-purple", 4, "ngIf"], [4, "ngIf"], ["id", "big-links", 1, "col-lg-3", "col--12", "mt-5", "mt-lg-0"], [1, "shadow", "card", "border-0", "rounded-0", "big-link", "bg-success", "text-white"], ["routerLink", "/feed", 1, "text-white", "link", "font-weight-500", "text-center", "display-3"], [1, "fas", "fa-list", "fa-sm", "fa-fw", "mr-2"], [1, "mt-3", "shadow", "card", "border-0", "rounded-0", "big-link", "bg-primary", "text-white"], ["routerLink", "/messages", 1, "text-white", "link", "font-weight-500", "text-center", "display-3"], [1, "fas", "fa-envelope", "fa-fw"], [1, "text-white", "font-weight-200"], [1, "btn", "btn-sm", "btn-success", "rounded-pill", "m-1", "px-4", 3, "click"], [1, "btn", "btn-sm", "btn-danger", "rounded-pill", "m-1", "px-4", 3, "click"], [1, "btn", "btn-warning", "rounded-pill", "m-1"], [1, "btn", "btn-light", "text-primary", "rounded-pill", "m-1", 3, "click"], ["data-toggle", "modal", "data-target", "#staticBackdrop", 1, "btn", "btn-info", "rounded-pill", "m-1", 3, "click"], ["id", "friends-list", 1, "card", "shadow", "rounded-0", "mt-4", "pb-3"], [1, "row", "m-0"], ["class", "col-xl-4 col-6 mt-5", 4, "ngFor", "ngForOf"], [1, "col-xl-4", "col-6", "mt-5"], [1, "friend"], [3, "routerLink", "src"], [1, "text-center", "pb-1"], [1, "link", "text-purple", "font-weight-400", 3, "routerLink"], [1, "text-center", "mt-5"], ["class", "hov-scale h2 font-weight-300 link text-primary m-1", 3, "click", 4, "ngIf"], ["class", "hov-scale h2 font-weight-300 link text-danger m-1", 3, "click", 4, "ngIf"], ["class", "hov-scale h1 font-weight-900 px-4 link text-primary m-1", 3, "click", 4, "ngIf"], ["class", "w-75 mx-auto hov-scale h4 font-weight-500 p-2 px-4 link text-primary m-1", 4, "ngIf"], [1, "hov-scale", "h1", "font-weight-900", "px-4", "link", "text-danger", "m-1", 3, "click"], [1, "hov-scale", "h1", "font-weight-900", "px-4", "link", "text-primary", "m-1", 3, "click"], [1, "w-75", "mx-auto", "hov-scale", "h4", "font-weight-500", "p-2", "px-4", "link", "text-primary", "m-1"], [1, "hov-scale", "h2", "font-weight-300", "link", "text-primary", "m-1", 3, "click"], [1, "font-weight-900"], [1, "h6", "mt-2", "text-uppercase", "text-dark"], [1, "hov-scale", "h2", "font-weight-300", "link", "text-danger", "m-1", 3, "click"], [3, "post"], [1, "bg-success", "d-block", "mt-4", "py-3", "text-center", "rounded-pill", "text-white", "link", "h5", 3, "click"], [1, "text-center", "w-75", "mx-auto", "mt-5", "text-purple"], [1, "mt-5", "text-primary", "text-center"], [1, "link", "h4", "text-center", "d-block", "max", "mx-auto", "my-3", 3, "click"]], template: function PageProfileComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "app-topbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](10, "img", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "h3", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "p", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](17, PageProfileComponent_div_17_Template, 9, 0, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, PageProfileComponent_button_18_Template, 2, 0, "button", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, PageProfileComponent_button_19_Template, 2, 0, "button", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](20, PageProfileComponent_button_20_Template, 2, 0, "button", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](21, "hr", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](22, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, " Friends: ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](26, PageProfileComponent_div_26_Template, 3, 1, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, PageProfileComponent_div_27_Template, 4, 3, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "h3", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, "Recent Posts");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](31, PageProfileComponent_app_post_31_Template, 1, 1, "app-post", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](32, PageProfileComponent_a_32_Template, 2, 0, "a", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](33, PageProfileComponent_h3_33_Template, 2, 1, "h3", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](34, PageProfileComponent_div_34_Template, 5, 1, "div", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "div", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "a", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](38, " Feed ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](39, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](40, "i", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "div", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "a", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, " Messages ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](44, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "i", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/images/", ctx.profilePicture, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.userName);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("I'm just a normal person, I like cats & ", ctx.userEmail, ". I also went skydiving once.");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.haveReceivedFriendRequest);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.haveSentFriendRequest);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.canAddUser && !ctx.haveSentFriendRequest && !ctx.haveReceivedFriendRequest);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.canSendMessage);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.totalFriends);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.randomFriends.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.canAddUser && ctx.canSendMessage);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.posts.slice(0, ctx.showPosts));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.posts.length && ctx.showPosts && ctx.showPosts < ctx.posts.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.showPosts);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.posts.length && ctx.showPosts >= ctx.posts.length);
    } }, directives: [_topbar_topbar_component__WEBPACK_IMPORTED_MODULE_8__["TopbarComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterLinkWithHref"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterLink"], _post_post_component__WEBPACK_IMPORTED_MODULE_9__["PostComponent"]], styles: [".profile-img[_ngcontent-%COMP%]::before {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 100%;\r\n    top: 0;\r\n    bottom: 50px;\r\n    background-color: white;\r\n    z-index: 0;\r\n}\r\n\r\n.profile-img[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] { z-index: 1; }\r\n\r\n.border-thick[_ngcontent-%COMP%] { border: 10px solid white !important; }\r\n\r\n.friend[_ngcontent-%COMP%] {\r\n    cursor: pointer;\r\n    transition: transform .4s;\r\n}\r\n\r\n.friend[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\r\n    width: 78%;\r\n    border-radius: 18px;\r\n    display: block;\r\n    margin: 0 auto 10px;\r\n}\r\n\r\n@media (max-width: 992px) { #about-me[_ngcontent-%COMP%], #big-links[_ngcontent-%COMP%] { order: 3; } }\r\n\r\n@media (max-width: 768px) { #me[_ngcontent-%COMP%] { order: -1; } }\r\n\r\n@media (max-width: 1500px) { #big-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { font-size: 40px !important; } }\r\n\r\n#recent-posts[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%] { transition: transform .4s; }\r\n\r\n#recent-posts[_ngcontent-%COMP%]   .card[_ngcontent-%COMP%]:hover { transform: scale(1.05); }\r\n\r\n#big-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] { padding-top: 92px; padding-bottom: 92px; }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZS1wcm9maWxlL3BhZ2UtcHJvZmlsZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksV0FBVztJQUNYLGtCQUFrQjtJQUNsQixXQUFXO0lBQ1gsTUFBTTtJQUNOLFlBQVk7SUFDWix1QkFBdUI7SUFDdkIsVUFBVTtBQUNkOztBQUVBLGlCQUFpQixVQUFVLEVBQUU7O0FBQzdCLGdCQUFnQixtQ0FBbUMsRUFBRTs7QUFHckQ7SUFDSSxlQUFlO0lBQ2YseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksVUFBVTtJQUNWLG1CQUFtQjtJQUNuQixjQUFjO0lBQ2QsbUJBQW1CO0FBQ3ZCOztBQUNBLDRCQUE0Qix3QkFBd0IsUUFBUSxFQUFFLEVBQUU7O0FBQ2hFLDRCQUE0QixNQUFNLFNBQVMsRUFBRSxFQUFFOztBQUMvQyw2QkFBNkIsZUFBZSwwQkFBMEIsRUFBRSxFQUFFOztBQUUxRSxzQkFBc0IseUJBQXlCLEVBQUU7O0FBQ2pELDRCQUE0QixzQkFBc0IsRUFBRTs7QUFDcEQsZUFBZSxpQkFBaUIsRUFBRSxvQkFBb0IsRUFBRSIsImZpbGUiOiJzcmMvYXBwL3BhZ2UtcHJvZmlsZS9wYWdlLXByb2ZpbGUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wcm9maWxlLWltZzo6YmVmb3JlIHtcclxuICAgIGNvbnRlbnQ6IFwiXCI7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIHRvcDogMDtcclxuICAgIGJvdHRvbTogNTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gICAgei1pbmRleDogMDtcclxufVxyXG5cclxuLnByb2ZpbGUtaW1nICogeyB6LWluZGV4OiAxOyB9XHJcbi5ib3JkZXItdGhpY2sgeyBib3JkZXI6IDEwcHggc29saWQgd2hpdGUgIWltcG9ydGFudDsgfVxyXG5cclxuXHJcbi5mcmllbmQge1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIC40cztcclxufVxyXG5cclxuLmZyaWVuZCBpbWcge1xyXG4gICAgd2lkdGg6IDc4JTtcclxuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XHJcbiAgICBkaXNwbGF5OiBibG9jaztcclxuICAgIG1hcmdpbjogMCBhdXRvIDEwcHg7XHJcbn1cclxuQG1lZGlhIChtYXgtd2lkdGg6IDk5MnB4KSB7ICNhYm91dC1tZSwgI2JpZy1saW5rcyB7IG9yZGVyOiAzOyB9IH1cclxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7ICNtZSB7IG9yZGVyOiAtMTsgfSB9XHJcbkBtZWRpYSAobWF4LXdpZHRoOiAxNTAwcHgpIHsgI2JpZy1saW5rcyBhIHsgZm9udC1zaXplOiA0MHB4ICFpbXBvcnRhbnQ7IH0gfVxyXG5cclxuI3JlY2VudC1wb3N0cyAuY2FyZCB7IHRyYW5zaXRpb246IHRyYW5zZm9ybSAuNHM7IH1cclxuI3JlY2VudC1wb3N0cyAuY2FyZDpob3ZlciB7IHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7IH1cclxuI2JpZy1saW5rcyBhIHsgcGFkZGluZy10b3A6IDkycHg7IHBhZGRpbmctYm90dG9tOiA5MnB4OyB9XHJcbiJdfQ== */"] });
PageProfileComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_3__["AutoUnsubscribe"]
], PageProfileComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PageProfileComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-page-profile',
                templateUrl: './page-profile.component.html',
                styleUrls: ['./page-profile.component.css']
            }]
    }], function () { return [{ type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["Title"] }, { type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"]]
            }] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"] }, { type: _api_service__WEBPACK_IMPORTED_MODULE_7__["ApiService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-register/page-register.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/page-register/page-register.component.ts ***!
  \**********************************************************/
/*! exports provided: PageRegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageRegisterComponent", function() { return PageRegisterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../form-bg/form-bg.component */ "./src/app/form-bg/form-bg.component.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");









function PageRegisterComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.formError);
} }
class PageRegisterComponent {
    constructor(api, storage, router, title) {
        this.api = api;
        this.storage = storage;
        this.router = router;
        this.title = title;
        this.formError = "";
        this.credentials = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirm: ''
        };
    }
    ngOnInit() {
        this.title.setTitle("Register");
    }
    formSubmit() {
        this.formError = "";
        if (!this.credentials.first_name ||
            !this.credentials.last_name ||
            !this.credentials.email ||
            !this.credentials.password ||
            !this.credentials.password_confirm) {
            return this.formError = "All Fields are Required";
        }
        var re = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
        if (!re.test(this.credentials.email)) {
            return this.formError = "Please enter a valid email address.";
        }
        if (this.credentials.password !== this.credentials.password_confirm) {
            return this.formError = "Password dont match.";
        }
        this.register();
    }
    register() {
        let requestObject = {
            method: "POST",
            location: "users/register",
            body: this.credentials
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.token) {
                this.storage.setToken(val.token);
                this.router.navigate(['/']);
                console.log("RegisteredIN");
                return;
            }
            if (val.message) {
                this.formError = val.message;
            }
        });
    }
}
PageRegisterComponent.ɵfac = function PageRegisterComponent_Factory(t) { return new (t || PageRegisterComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["Title"])); };
PageRegisterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PageRegisterComponent, selectors: [["app-page-register"]], decls: 30, vars: 6, consts: [[1, "bg-gradient-primary", "min-vh-100"], [1, "bg-2"], [1, "container"], [1, "text-white", "pt-6", "pt-sm-16vh"], ["class", "alert alert-primary text-primary mb-5", 4, "ngIf"], [1, "font-weight-800", "text-center", "display-4"], [1, "resp", "h4", "w-50", "mx-auto", "text-center", 2, "line-height", "150%"], [1, "font-weight-300", "mt-4", "text-center"], [1, "register-form", "user", "mt-5", 3, "submit"], [1, "form-group", "row"], [1, "col-sm-6", "mb-3", "mb-sm-0"], ["type", "text", "id", "exampleFirstName", "placeholder", "First Name", "name", "first_name", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], [1, "col-sm-6"], ["type", "text", "id", "exampleLastName", "placeholder", "Last Name", "name", "last_name", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], [1, "form-group"], ["type", "email", "id", "exampleInputEmail", "placeholder", "Email Address", "name", "email", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], ["type", "password", "id", "exampleInputPassword", "placeholder", "Password", "name", "password", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], ["type", "password", "id", "exampleRepeatPassword", "placeholder", "Confirm Password", "name", "password_confirm", 1, "form-control", "form-control-user", 3, "ngModel", "ngModelChange"], ["type", "submit", "value", "Register an account", 1, "btn", "btn-primary", "btn-user", "btn-block"], [1, "text-center", "p-5", "m-0"], ["routerLink", "/login", 1, "text-white", "link"], [1, "alert", "alert-primary", "text-primary", "mb-5"]], template: function PageRegisterComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "app-form-bg");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, PageRegisterComponent_div_5_Template, 2, 1, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "h1", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, "A Social Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "A social media website for real people. Definitely no fake users on this site. None at all.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h2", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Register an account.");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "form", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function PageRegisterComponent_Template_form_submit_12_listener() { return ctx.formSubmit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "input", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageRegisterComponent_Template_input_ngModelChange_15_listener($event) { return ctx.credentials.first_name = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "input", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageRegisterComponent_Template_input_ngModelChange_17_listener($event) { return ctx.credentials.last_name = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "input", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageRegisterComponent_Template_input_ngModelChange_19_listener($event) { return ctx.credentials.email = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "input", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageRegisterComponent_Template_input_ngModelChange_22_listener($event) { return ctx.credentials.password = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "input", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PageRegisterComponent_Template_input_ngModelChange_24_listener($event) { return ctx.credentials.password_confirm = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](25, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "h4", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "Already have an account? ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "a", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Login");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.formError);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.first_name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.last_name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.email);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.password);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.credentials.password_confirm);
    } }, directives: [_form_bg_form_bg_component__WEBPACK_IMPORTED_MODULE_5__["FormBgComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__["NgModel"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2UtcmVnaXN0ZXIvcGFnZS1yZWdpc3Rlci5jb21wb25lbnQuY3NzIn0= */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PageRegisterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-page-register',
                templateUrl: './page-register.component.html',
                styleUrls: ['./page-register.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["Title"] }]; }, null); })();


/***/ }),

/***/ "./src/app/page-searches/page-searches.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/page-searches/page-searches.component.ts ***!
  \**********************************************************/
/*! exports provided: PageSearchesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageSearchesComponent", function() { return PageSearchesComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _topbar_topbar_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../topbar/topbar.component */ "./src/app/topbar/topbar.component.ts");
/* harmony import */ var _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../result-request/result-request.component */ "./src/app/result-request/result-request.component.ts");












function PageSearchesComponent_app_result_request_11_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-result-request", 13);
} if (rf & 2) {
    const result_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("resultRequest", result_r1);
} }
let PageSearchesComponent = class PageSearchesComponent {
    constructor(api, route, title, events, document) {
        this.api = api;
        this.route = route;
        this.title = title;
        this.events = events;
        this.document = document;
        this.query = this.route.snapshot.params.query;
        this.subscriptions = [];
    }
    ngOnInit() {
        this.title.setTitle("Search Page");
        this.document.getElementById("sidebarToggleTop").classList.add("d-none");
        let userDataEvent = this.events.getUserData.subscribe((data) => {
            this.route.params.subscribe(params => {
                this.query = params.query;
                this.user = data;
                this.getResults();
            });
        });
        this.subscriptions.push(userDataEvent);
    }
    getResults() {
        let requestObject = {
            location: `users/get-search-results?query=${this.query}`,
            method: "GET"
        };
        this.api.makeRequest(requestObject).then((val, err) => {
            this.results = val.results;
            for (let result of this.results) {
                if (result.friends.includes(this.user._id)) {
                    result.isFriend = true;
                }
                if (result.friend_requests.includes(this.user._id)) {
                    result.haveSentFriendRequest = true;
                }
                if (this.user.friend_requests.includes(result._id)) {
                    result.haveReceivedFriendRequest = true;
                }
            }
        });
    }
};
PageSearchesComponent.ɵfac = function PageSearchesComponent_Factory(t) { return new (t || PageSearchesComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_7__["EventEmitterService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"])); };
PageSearchesComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: PageSearchesComponent, selectors: [["app-page-searches"]], decls: 18, vars: 2, consts: [["id", "wrapper"], ["id", "content-wrapper", 1, "d-flex", "flex-column"], ["id", "content", 1, "min-vh-100"], [1, "container-fluid"], [1, "h4", "mb-4", "text-gray-800", "text-center", "text-md-left", "font-weight-300"], [1, "font-weight-700"], [1, "row", "mb-5"], [1, "col-xl-6", "col-lg-8"], ["use", "result", 3, "resultRequest", 4, "ngFor", "ngForOf"], [1, "col-xl-6", "d-lg-none", "d-xl-block", 2, "margin-top", "14vh"], [1, "display-2", "font-weight-800", "text-center", 2, "opacity", ".2"], [1, "h1", "font-weight-400", "text-center"], ["routerLink", "/feed", "href", "", 1, "link", "text-center", "text-uppercase"], ["use", "result", 3, "resultRequest"]], template: function PageSearchesComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "app-topbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "h1", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Search Results for ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, PageSearchesComponent_app_result_request_11_Template, 1, 1, "app-result-request", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "h3", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " A Social Media ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "h2", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "a", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "Back to Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\"", ctx.query, "\"");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.results);
    } }, directives: [_topbar_topbar_component__WEBPACK_IMPORTED_MODULE_8__["TopbarComponent"], _angular_common__WEBPACK_IMPORTED_MODULE_2__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLinkWithHref"], _result_request_result_request_component__WEBPACK_IMPORTED_MODULE_9__["ResultRequestComponent"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3BhZ2Utc2VhcmNoZXMvcGFnZS1zZWFyY2hlcy5jb21wb25lbnQuY3NzIn0= */"] });
PageSearchesComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_3__["AutoUnsubscribe"]
], PageSearchesComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](PageSearchesComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-page-searches',
                templateUrl: './page-searches.component.html',
                styleUrls: ['./page-searches.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__["ActivatedRoute"] }, { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__["Title"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_7__["EventEmitterService"] }, { type: Document, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"],
                args: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["DOCUMENT"]]
            }] }]; }, null); })();


/***/ }),

/***/ "./src/app/post/post.component.ts":
/*!****************************************!*\
  !*** ./src/app/post/post.component.ts ***!
  \****************************************/
/*! exports provided: PostComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostComponent", function() { return PostComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");







function PostComponent_div_28_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Be The First to Comments on this post.");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function PostComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const comment_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", comment_r2.commenter_id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("src", "assets/images/", comment_r2.commenter_profile_image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", comment_r2.commenter_id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", comment_r2.commenter_name, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", comment_r2.commenter_content, " ");
} }
const _c0 = function (a0, a1) { return { "font-size": a0, "text-align": a1 }; };
const _c1 = function (a0) { return { "liked": a0 }; };
class PostComponent {
    constructor(api, storage) {
        this.api = api;
        this.storage = storage;
        this.fakeId = "fakeid";
        this.fontSize = 18;
        this.align = 'left';
        this.liked = false;
        this.userid = "";
        this.comment = "";
    }
    ngOnInit() {
        function removeLeadingNumber(str) {
            function isNumber(n) {
                n = Number(n);
                if (!isNaN(n)) {
                    return true;
                }
                return false;
            }
            if (str && isNumber(str[0])) {
                str = removeLeadingNumber(str.substr(1));
            }
            return str;
        }
        this.fakeId = removeLeadingNumber(this.post._id);
        if (this.post.content.length < 40) {
            this.fontSize = 22;
        }
        if (this.post.content.length < 24) {
            this.fontSize = 28;
            this.align = 'center';
        }
        if (this.post.content.length < 14) {
            this.fontSize = 32;
        }
        if (this.post.content.length < 8) {
            this.fontSize = 44;
        }
        if (this.post.content.length < 5) {
            this.fontSize = 62;
        }
        this.userid = this.storage.getParsedToken()._id;
        if (this.post.likes.includes(this.userid)) {
            this.liked = true;
        }
    }
    /**
     * likeButtonClicked
     */
    likeButtonClicked(postid) {
        let requestObject = {
            location: `users/like-unlike/${this.post.ownerid}/${this.post._id}`,
            method: "POST"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (this.post.likes.includes(this.userid)) {
                this.post.likes.splice(this.post.likes.indexOf(this.userid), 1);
                this.liked = false;
            }
            else {
                this.post.likes.push(this.userid);
                this.liked = true;
            }
        });
    }
    /**
     * postComment
     */
    postComment() {
        if (this.comment.length == 0) {
            return;
        }
        let requestObject = {
            location: `users/post-comment/${this.post.ownerid}/${this.post._id}`,
            method: "POST",
            body: {
                content: this.comment
            }
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 201) {
                let newComment = Object.assign(Object.assign({}, val.comment), { commenter_name: val.commenter.name, commenter_profile_image: val.commenter.profile_image });
                this.post.comments.push(newComment);
                this.comment = "";
            }
        });
    }
}
PostComponent.ɵfac = function PostComponent_Factory(t) { return new (t || PostComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"])); };
PostComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PostComponent, selectors: [["app-post"]], inputs: { post: "post" }, decls: 30, vars: 25, consts: [[1, "card", "mt-4"], [1, "card-header", "rounded-0", 3, "ngClass"], [3, "routerLink"], [1, "profile-img-sm", "rounded-circle", 3, "src"], [1, "ml-3", "h5"], [1, "link", "font-weight-700", "text-white", 3, "routerLink"], [1, "card-body"], [1, "card-text", "post-body", "h5", 3, "ngStyle"], [1, "d-flex", "justify-content-between", "py-2"], [1, "text-muted"], [1, "like-icon", 3, "click"], [3, "ngClass"], [1, "ml-3", "badge", "badge-pill", "text-white", 3, "ngClass"], ["data-toggle", "collapse", "role", "button", 1, "d-block", "card-header", "py-3", 3, "href"], [1, "m-0", "font-weight-bold", 3, "ngClass"], [1, "collapse", 3, "id"], ["action", "", "method", "post", 1, "mb-2", 3, "submit"], [1, "form-group"], ["name", "comment", "type", "text", "placeholder", "Leave a comment.", 1, "rounded-pill", "form-control", 3, "ngModel", "ngModelChange"], [1, "comment-list"], ["class", "text-center mt-2", 4, "ngIf"], ["class", "comment p-3 my-2 rounded", 4, "ngFor", "ngForOf"], [1, "text-center", "mt-2"], [1, "comment", "p-3", "my-2", "rounded"], [1, "comment-user"], [1, "rounded-circle", "profile-img-sm", 3, "src"], [1, "ml-2"], [1, "link", 3, "routerLink"], [1, "comment-body", "pl-3", "mt-2"]], template: function PostComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "small", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PostComponent_Template_a_click_14_listener() { return ctx.likeButtonClicked(ctx.post._id); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "i", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "span", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "a", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "h6", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "Comments");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "form", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("submit", function PostComponent_Template_form_submit_24_listener() { return ctx.postComment(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "div", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "input", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function PostComponent_Template_input_ngModelChange_26_listener($event) { return ctx.comment = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](28, PostComponent_div_28_Template, 2, 0, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](29, PostComponent_div_29_Template, 9, 5, "div", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "bg-" + ctx.post.theme);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.post.ownerid, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("src", "assets/images/", ctx.post.ownerProfileImage, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.post.ownerid, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.post.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction2"](20, _c0, ctx.fontSize + "px", ctx.align));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.post.content);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.post.ago);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMapInterpolate1"]("text-", ctx.post.theme, " hov-scale fas fa-thumbs-up");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](23, _c1, ctx.liked == true));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "bg-" + ctx.post.theme);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.post.likes.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("href", "#" + ctx.fakeId, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", "text-" + ctx.post.theme);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("id", ctx.fakeId);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.comment);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.post && !ctx.post.comments.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.post.comments);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgClass"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgStyle"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__["NgModel"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"]], styles: ["@keyframes fade-in {\r\n    0%{\r\n        opacity: 0;\r\n    }\r\n    100%{\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n.card-text[_ngcontent-%COMP%]{\r\n    line-height: 170%,normal;\r\n    color: #585858;\r\n}\r\n\r\n.card[_ngcontent-%COMP%]{\r\n    transition: transform 0.6s;\r\n    animation-name: fade-in;\r\n    animation-duration: 0.8s;\r\n}\r\n\r\n.card[_ngcontent-%COMP%]:hover{\r\n    transform: scale(1.05);\r\n}\r\n\r\n.like-icon[_ngcontent-%COMP%]{\r\n    cursor:pointer;\r\n}\r\n\r\n.liked[_ngcontent-%COMP%]{\r\n    transform: scale(1.8) translateX(-3px);\r\n}\r\n\r\n.comment-body[_ngcontent-%COMP%]{\r\n    color: #585858;\r\n}\r\n\r\n.comment[_ngcontent-%COMP%] { background-color: #F5F5F5 !important; }\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcG9zdC9wb3N0LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSTtRQUNJLFVBQVU7SUFDZDtJQUNBO1FBQ0ksVUFBVTtJQUNkO0FBQ0o7O0FBRUE7SUFDSSx3QkFBd0I7SUFDeEIsY0FBYztBQUNsQjs7QUFFQTtJQUNJLDBCQUEwQjtJQUMxQix1QkFBdUI7SUFDdkIsd0JBQXdCO0FBQzVCOztBQUNBO0lBQ0ksc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFDQTtJQUNJLHNDQUFzQztBQUMxQzs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUEsV0FBVyxvQ0FBb0MsRUFBRSIsImZpbGUiOiJzcmMvYXBwL3Bvc3QvcG9zdC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGtleWZyYW1lcyBmYWRlLWluIHtcclxuICAgIDAle1xyXG4gICAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICB9XHJcbiAgICAxMDAle1xyXG4gICAgICAgIG9wYWNpdHk6IDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbi5jYXJkLXRleHR7XHJcbiAgICBsaW5lLWhlaWdodDogMTcwJSxub3JtYWw7XHJcbiAgICBjb2xvcjogIzU4NTg1ODtcclxufVxyXG5cclxuLmNhcmR7XHJcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC42cztcclxuICAgIGFuaW1hdGlvbi1uYW1lOiBmYWRlLWluO1xyXG4gICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjhzO1xyXG59XHJcbi5jYXJkOmhvdmVye1xyXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcclxufVxyXG5cclxuLmxpa2UtaWNvbntcclxuICAgIGN1cnNvcjpwb2ludGVyO1xyXG59XHJcbi5saWtlZHtcclxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS44KSB0cmFuc2xhdGVYKC0zcHgpO1xyXG59XHJcblxyXG4uY29tbWVudC1ib2R5e1xyXG4gICAgY29sb3I6ICM1ODU4NTg7XHJcbn1cclxuXHJcbi5jb21tZW50IHsgYmFja2dyb3VuZC1jb2xvcjogI0Y1RjVGNSAhaW1wb3J0YW50OyB9XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](PostComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-post',
                templateUrl: './post.component.html',
                styleUrls: ['./post.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }]; }, { post: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/result-request/result-request.component.ts":
/*!************************************************************!*\
  !*** ./src/app/result-request/result-request.component.ts ***!
  \************************************************************/
/*! exports provided: ResultRequestComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResultRequestComponent", function() { return ResultRequestComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");







function ResultRequestComponent_button_8_Template(rf, ctx) { if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ResultRequestComponent_button_8_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6); const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r5.api.makeFriendRequest(ctx_r5.resultRequest._id); return ctx_r5.haveSentFriendRequest = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Add Friend");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ResultRequestComponent_button_9_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Friend Request Pending");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ResultRequestComponent_button_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "View Profile");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx_r2.resultRequest._id, "");
} }
function ResultRequestComponent_button_11_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ResultRequestComponent_button_11_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8); const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r7.Accept(); ctx_r7.haveReceivedFriendRequest = false; return ctx_r7.isFriend = true; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " Accept");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
function ResultRequestComponent_button_14_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ResultRequestComponent_button_14_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10); const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); ctx_r9.Decline(); return ctx_r9.haveReceivedFriendRequest = false; });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "Decline");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} }
class ResultRequestComponent {
    constructor(api, storage, events) {
        this.api = api;
        this.storage = storage;
        this.events = events;
        this.resultRequestChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.haveSentFriendRequest = false;
        this.haveReceivedFriendRequest = false;
        this.isFriend = false;
    }
    ngOnInit() {
        if (this.resultRequest.haveSentFriendRequest) {
            this.haveSentFriendRequest = true;
        }
        if (this.resultRequest.haveReceivedFriendRequest) {
            this.haveReceivedFriendRequest = true;
        }
        if (this.resultRequest.isFriend) {
            this.isFriend = true;
        }
    }
    /**
     * Accept
     */
    Accept() {
        this.updateRequest();
        var id = this.resultRequest._id;
        this.api.resolveFriendRequest("accept", id).then((val) => {
            console.log(val);
        });
    }
    Decline() {
        this.updateRequest();
        var id = this.resultRequest._id;
        this.api.resolveFriendRequest("decline", id).then((val) => {
            console.log(val);
        });
    }
    updateRequest() {
        this.resultRequestChange.emit(this.resultRequest._id);
    }
    updateSendMessageObject(id, name) {
        this.events.updateSendMessageObjectEvent.emit({ id, name });
    }
}
ResultRequestComponent.ɵfac = function ResultRequestComponent_Factory(t) { return new (t || ResultRequestComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_3__["EventEmitterService"])); };
ResultRequestComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ResultRequestComponent, selectors: [["app-result-request"]], inputs: { resultRequest: "resultRequest", use: "use" }, outputs: { resultRequestChange: "resultRequestChange" }, decls: 15, vars: 9, consts: [[1, "result-request", "d-flex", "my-3", "align-items-center", "bg-white", "shadow"], [1, "p-4", "w-max", 3, "routerLink"], [1, "profile-img-md", "rounded", 3, "src"], [1, ""], [1, "link", 3, "routerLink"], [1, "ml-auto", "mr-3", "mt-3", "align-self-start"], ["class", "btn btn-sm btn-primary rounded-pill", 3, "click", 4, "ngIf"], ["class", "btn btn-sm btn-warning rounded-pill ml-1", 4, "ngIf"], ["class", "btn btn-sm btn-info rounded-pill ml-1", 3, "routerLink", 4, "ngIf"], ["class", "btn btn-sm btn-primary rounded-pill ml-1", 3, "click", 4, "ngIf"], ["data-toggle", "modal", "data-target", "#staticBackdrop", 1, "btn", "btn-sm", "btn-success", "rounded-pill", "ml-1", 3, "click"], ["class", "btn btn-sm btn-danger rounded-pill ml-1", 3, "click", 4, "ngIf"], [1, "btn", "btn-sm", "btn-primary", "rounded-pill", 3, "click"], [1, "btn", "btn-sm", "btn-warning", "rounded-pill", "ml-1"], [1, "btn", "btn-sm", "btn-info", "rounded-pill", "ml-1", 3, "routerLink"], [1, "btn", "btn-sm", "btn-primary", "rounded-pill", "ml-1", 3, "click"], [1, "btn", "btn-sm", "btn-danger", "rounded-pill", "ml-1", 3, "click"]], template: function ResultRequestComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "a", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "h5");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, ResultRequestComponent_button_8_Template, 2, 0, "button", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, ResultRequestComponent_button_9_Template, 2, 0, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, ResultRequestComponent_button_10_Template, 2, 1, "button", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, ResultRequestComponent_button_11_Template, 2, 0, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ResultRequestComponent_Template_button_click_12_listener() { return ctx.updateSendMessageObject(ctx.resultRequest._id, ctx.resultRequest.name); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Send Message");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](14, ResultRequestComponent_button_14_Template, 2, 0, "button", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.resultRequest._id, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("src", "assets/images/", ctx.resultRequest.profile_image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.resultRequest._id, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.resultRequest.name);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.use == "result" && !ctx.haveSentFriendRequest && !ctx.haveReceivedFriendRequest && !ctx.isFriend);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.haveSentFriendRequest);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.isFriend);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.use == "request" || ctx.haveReceivedFriendRequest);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.use == "request" || ctx.haveReceivedFriendRequest);
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLink"]], styles: [".result-request[_ngcontent-%COMP%] { transition: all .2s; }\r\n.result-request[_ngcontent-%COMP%]:hover { background-color: #4E73DF !important; }\r\n.result-request[_ngcontent-%COMP%]:hover   *[_ngcontent-%COMP%] { color: white !important; }\r\n.result-request[_ngcontent-%COMP%]:hover   .btn[_ngcontent-%COMP%]:first-of-type {\r\n    background-color: white !important;\r\n    color: #4E73DF !important;\r\n    border: none !important\r\n}\r\n.result-request[_ngcontent-%COMP%]:hover   .btn[_ngcontent-%COMP%]:first-of-type:hover {\r\n    opacity: .6;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcmVzdWx0LXJlcXVlc3QvcmVzdWx0LXJlcXVlc3QuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxrQkFBa0IsbUJBQW1CLEVBQUU7QUFDdkMsd0JBQXdCLG9DQUFvQyxFQUFFO0FBQzlELDBCQUEwQix1QkFBdUIsRUFBRTtBQUVuRDtJQUNJLGtDQUFrQztJQUNsQyx5QkFBeUI7SUFDekI7QUFDSjtBQUVBO0lBQ0ksV0FBVztBQUNmIiwiZmlsZSI6InNyYy9hcHAvcmVzdWx0LXJlcXVlc3QvcmVzdWx0LXJlcXVlc3QuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5yZXN1bHQtcmVxdWVzdCB7IHRyYW5zaXRpb246IGFsbCAuMnM7IH1cclxuLnJlc3VsdC1yZXF1ZXN0OmhvdmVyIHsgYmFja2dyb3VuZC1jb2xvcjogIzRFNzNERiAhaW1wb3J0YW50OyB9XHJcbi5yZXN1bHQtcmVxdWVzdDpob3ZlciAqIHsgY29sb3I6IHdoaXRlICFpbXBvcnRhbnQ7IH1cclxuXHJcbi5yZXN1bHQtcmVxdWVzdDpob3ZlciAuYnRuOmZpcnN0LW9mLXR5cGUge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGUgIWltcG9ydGFudDtcclxuICAgIGNvbG9yOiAjNEU3M0RGICFpbXBvcnRhbnQ7XHJcbiAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudFxyXG59XHJcblxyXG4ucmVzdWx0LXJlcXVlc3Q6aG92ZXIgLmJ0bjpmaXJzdC1vZi10eXBlOmhvdmVyIHtcclxuICAgIG9wYWNpdHk6IC42O1xyXG59XHJcbiJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResultRequestComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-result-request',
                templateUrl: './result-request.component.html',
                styleUrls: ['./result-request.component.css']
            }]
    }], function () { return [{ type: _api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_2__["LocalStorageService"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_3__["EventEmitterService"] }]; }, { resultRequest: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], resultRequestChange: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], use: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "./src/app/sidebar/sidebar.component.ts":
/*!**********************************************!*\
  !*** ./src/app/sidebar/sidebar.component.ts ***!
  \**********************************************/
/*! exports provided: SidebarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidebarComponent", function() { return SidebarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");








function SidebarComponent_div_21_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " You have no besties :( ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function SidebarComponent_div_22_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "img", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "a", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const bestie_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", bestie_r3._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "/assets/images/", bestie_r3.profile_image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", bestie_r3._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](bestie_r3.name);
} }
function SidebarComponent_div_30_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "img", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "a", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const enemy_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", enemy_r4._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "/assets/images/", enemy_r4.profile_image, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", enemy_r4._id, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](enemy_r4.name);
} }
let SidebarComponent = class SidebarComponent {
    constructor(auth, events) {
        this.auth = auth;
        this.events = events;
        this.userId = "";
        this.subscriptions = [];
        this.besties = [];
        this.enemies = [];
    }
    ngOnInit() {
        let userDataEvent = this.events.getUserData.subscribe((user) => {
            this.userId = user._id;
            this.besties = user.besties;
            this.enemies = user.enemies;
        });
        this.subscriptions.push(userDataEvent);
    }
};
SidebarComponent.ɵfac = function SidebarComponent_Factory(t) { return new (t || SidebarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"])); };
SidebarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: SidebarComponent, selectors: [["app-sidebar"]], decls: 48, vars: 5, consts: [["href", "", "routerLink", "/feed", 1, "sidebar-brand", "d-flex", "align-items-center", "justify-content-center"], [1, "sidebar-brand-icon", "rotate-n-15"], [1, "fas", "fa-laugh-wink"], [1, "sidebar-brand-text", "mx-3"], [1, "sidebar-divider", "my-0"], [1, "nav-item", "active"], [1, "nav-link", 3, "routerLink"], [1, "far", "fa-address-card"], [1, "sidebar-divider"], [1, "sidebar-heading"], [1, "nav-item"], ["href", "#", "data-toggle", "collapse", "data-target", "#besties", 1, "nav-link", "collapsed", "w-100", "pr-md-5"], [1, "fas", "fa-user-friends"], ["id", "besties", "data-parent", "#accordionSidebar", 1, "collapse"], [1, "bg-white", "py-2", "collapse-inner", "rounded", "w-100"], ["class", "m-3", 4, "ngIf"], ["class", "m-3", 4, "ngFor", "ngForOf"], ["href", "#", "data-toggle", "collapse", "data-target", "#enemies", "aria-expanded", "true", "aria-controls", "collapseEnemies", 1, "nav-link", "collapsed", "w-100", "pr-md-5"], [1, "fas", "fa-skull-crossbones"], ["id", "enemies", "data-parent", "#accordionSidebar", 1, "collapse"], [1, "bg-white", "py-2", "collapse-inner", "rounded"], ["href", "#", "data-toggle", "collapse", "data-target", "#collapsePages", "aria-expanded", "true", "aria-controls", "collapsePages", 1, "nav-link", "collapsed", "w-100", "pr-md-5"], [1, "fas", "fa-fw", "fa-folder"], ["id", "collapsePages", "data-parent", "#accordionSidebar", 1, "quick", "collapse"], [1, "collapse-header"], [1, "collapse-item", 3, "routerLink"], ["href", "/feed", 1, "collapse-item"], ["href", "/messages", 1, "collapse-item"], ["data-toggle", "modal", "data-target", "#logoutModal", 1, "collapse-item", "mt-3", 3, "click"], [1, "m-3"], [1, "img-fluid", "rounded-circle", "profile-img-sm", "link", 3, "routerLink", "src"], [1, "h6", "ml-3"], [1, "link", "small", 3, "routerLink"], [1, "text-danger", "link", "small", 3, "routerLink"]], template: function SidebarComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "i", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "A Social Media");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "hr", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "li", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "a", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "i", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Profile");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "hr", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Friendships");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "li", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "i", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "Besties");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](21, SidebarComponent_div_21_Template, 2, 0, "div", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, SidebarComponent_div_22_Template, 5, 4, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](23, "li", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "a", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](25, "i", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "Enemies");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](30, SidebarComponent_div_30_Template, 5, 4, "div", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](31, "hr", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "li", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "a", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](34, "i", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Quick Actions");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](39, "h6", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "a", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](41, "Profile");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](42, "a", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "Feed");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "a", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, "Messages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "a", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function SidebarComponent_Template_a_click_46_listener() { return ctx.auth.logout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Sign Out");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.userId, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.besties.length);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.besties);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.enemies);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.userId, "");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterLink"]], styles: [".sidebar[_ngcontent-%COMP%] {\r\n    width: 16rem !important;\r\n    flex-shrink: 0;\r\n}\r\n@media (max-width: 768px) {\r\n    .sidebar[_ngcontent-%COMP%] { width: 6.5rem !important; }\r\n    .sidebar[class~=\"auto-toggle\"][_ngcontent-%COMP%] { display: none; }\r\n    #besties[_ngcontent-%COMP%], #enemies[_ngcontent-%COMP%], #finder[_ngcontent-%COMP%], .quick[_ngcontent-%COMP%] { width: 56vw !important; }\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2lkZWJhci9zaWRlYmFyLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSx1QkFBdUI7SUFDdkIsY0FBYztBQUNsQjtBQUNBO0lBQ0ksV0FBVyx3QkFBd0IsRUFBRTtJQUNyQyxpQ0FBaUMsYUFBYSxFQUFFO0lBQ2hELHNDQUFzQyxzQkFBc0IsRUFBRTtBQUNsRSIsImZpbGUiOiJzcmMvYXBwL3NpZGViYXIvc2lkZWJhci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNpZGViYXIge1xyXG4gICAgd2lkdGg6IDE2cmVtICFpbXBvcnRhbnQ7XHJcbiAgICBmbGV4LXNocmluazogMDtcclxufVxyXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcclxuICAgIC5zaWRlYmFyIHsgd2lkdGg6IDYuNXJlbSAhaW1wb3J0YW50OyB9XHJcbiAgICAuc2lkZWJhcltjbGFzc349XCJhdXRvLXRvZ2dsZVwiXSB7IGRpc3BsYXk6IG5vbmU7IH1cclxuICAgICNiZXN0aWVzLCAjZW5lbWllcywgI2ZpbmRlciwgLnF1aWNrIHsgd2lkdGg6IDU2dncgIWltcG9ydGFudDsgfVxyXG59XHJcbiJdfQ== */"] });
SidebarComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_2__["AutoUnsubscribe"]
], SidebarComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](SidebarComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-sidebar',
                templateUrl: './sidebar.component.html',
                styleUrls: ['./sidebar.component.css']
            }]
    }], function () { return [{ type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_4__["EventEmitterService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/topbar/topbar.component.ts":
/*!********************************************!*\
  !*** ./src/app/topbar/topbar.component.ts ***!
  \********************************************/
/*! exports provided: TopbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TopbarComponent", function() { return TopbarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _unsubscribe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../unsubscribe */ "./src/app/unsubscribe.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../auth.service */ "./src/app/auth.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
/* harmony import */ var _local_storage_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../local-storage.service */ "./src/app/local-storage.service.ts");
/* harmony import */ var _event_emitter_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../event-emitter.service */ "./src/app/event-emitter.service.ts");
/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../api.service */ "./src/app/api.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");











function TopbarComponent_span_23_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r0.notifications.friendRequests);
} }
function TopbarComponent_span_27_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r1.notifications.alerts);
} }
function TopbarComponent_a_32_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "i");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const alert_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("routerLink", alert_r6.href);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("icon-circle ", alert_r6.bgColor, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassMapInterpolate1"]("fas ", alert_r6.icon, " text-white");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](alert_r6.text);
} }
function TopbarComponent_span_37_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r3.notifications.messages);
} }
function TopbarComponent_a_42_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "NEW");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function TopbarComponent_a_42_Template(rf, ctx) { if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TopbarComponent_a_42_Template_a_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r10); const preview_r7 = ctx.$implicit; const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r9.messageLink(preview_r7.messengeID); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "img", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, TopbarComponent_a_42_div_3_Template, 2, 0, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const preview_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "/assets/images/", preview_r7.messengerImage, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", preview_r7.isNew);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](preview_r7.messageContent);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](preview_r7.messengerName);
} }
function TopbarComponent_div_62_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r5.alertMessage);
} }
let TopbarComponent = class TopbarComponent {
    constructor(auth, router, storage, events, api) {
        this.auth = auth;
        this.router = router;
        this.storage = storage;
        this.events = events;
        this.api = api;
        this.query = "";
        this.subscriptions = [];
        this.sendMessageObject = {
            id: "",
            name: "",
            content: ""
        };
        this.alertMessage = "";
        this.userName = "";
        this.userId = "";
        this.profilePicture = "default_avatar";
        this.messagePreview = [];
        this.alerts = [];
        this.notifications = {
            alerts: 0,
            friendRequests: 0,
            messages: 0
        };
    }
    ngOnInit() {
        this.userName = this.storage.getParsedToken().name;
        this.userId = this.storage.getParsedToken()._id;
        let alertEvent = this.events.onAlertEvent.subscribe((msg) => {
            this.alertMessage = msg;
        });
        let friendRequestsEvent = this.events.updateNumberOfFriendRequestsEvent.subscribe((msg) => {
            this.notifications.friendRequests--;
        });
        let userDataEvent = this.events.getUserData.subscribe((data) => {
            this.notifications.friendRequests = data.friend_requests.length;
            this.notifications.messages = data.new_message_notifications.length;
            this.notifications.alerts = data.new_notifications;
            this.profilePicture = data.profile_image;
            this.setAlerts(data.notifications);
            this.setMessagePreview(data.messages, data.new_message_notifications);
        });
        let updateMessageEvent = this.events.updateSendMessageObjectEvent.subscribe((data) => {
            this.sendMessageObject.id = data.id;
            this.sendMessageObject.name = data.name;
        });
        let resetMessageEvent = this.events.resetMessageNotificationEvent.subscribe(() => {
            this.notifications.messages = 0;
        });
        let requestObject = {
            location: `users/get-user-data/${this.userId}`,
            method: "GET"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.status == 404) {
                return this.auth.logout();
            }
            if (val.statusCode == 200) {
                this.events.getUserData.emit(val.user);
            }
        });
        this.subscriptions.push(alertEvent, friendRequestsEvent, userDataEvent, updateMessageEvent, resetMessageEvent);
    }
    /**
     * searchForFriend
     */
    searchForFriends() {
        this.router.navigate(['/search-results', { query: this.query }]);
    }
    /**
     * sendMessage
     */
    sendMessage() {
        if (!this.sendMessageObject.content) {
            this.events.onAlertEvent
                .emit("Message Not Sent. You must provide Some content.");
            return;
        }
        this.api.sendMessage(this.sendMessageObject);
        this.sendMessageObject.content = "";
    }
    setMessagePreview(messages, messageNotification) {
        for (let i = messages.length - 1; i >= 0; i--) {
            let lastMessage = messages[i].content[messages[i].content.length - 1];
            let preview = {
                messengerName: messages[i].messengerName,
                messageContent: lastMessage.message,
                messengerImage: "",
                messengerID: messages[i].from_id,
                isNew: false
            };
            if (lastMessage.messenger == this.userId) {
                preview.messengerImage = this.profilePicture;
            }
            else {
                preview.messengerImage = messages[i].messengerProfileImage;
                if (messageNotification.includes(messages[i].from_id)) {
                    preview.isNew = true;
                }
            }
            if (preview.isNew) {
                this.messagePreview.unshift(preview);
            }
            else {
                this.messagePreview.push(preview);
            }
        }
    }
    /**
     * messageLink
     */
    messageLink(messengeID) {
        this.router.navigate(['/messages'], {
            state: {
                data: {
                    msgId: messengeID
                }
            }
        });
    }
    /**
     * setAlerts
     */
    setAlerts(notificationsData) {
        for (let alert of notificationsData) {
            let alertObj = JSON.parse(alert);
            let newAlert = {
                text: alertObj.alert_text,
                icon: "",
                bgColor: "",
                href: ""
            };
            switch (alertObj.alert_type) {
                case "new_friend":
                    newAlert.icon = "fa-user-check";
                    newAlert.bgColor = "bg-success";
                    newAlert.href = `/profile/${alertObj.from_id}`;
                    break;
                case "liked_post":
                    newAlert.icon = "fa-thumbs-up";
                    newAlert.bgColor = "bg-purple";
                    newAlert.href = `/profile/${this.userId}`;
                    break;
                case "commented_post":
                    newAlert.icon = "fa-comment";
                    newAlert.bgColor = "bg-primary";
                    newAlert.href = `/profile/${this.userId}`;
                    break;
            }
            this.alerts.push(newAlert);
        }
    }
    /**
    * resetMessageNotifications
    */
    resetMessageNotifications() {
        if (this.notifications.messages == 0) {
            return;
        }
        this.api.resetMessageNotifications();
    }
    resetAlertNotifications() {
        if (this.notifications.alerts == 0) {
            return;
        }
        let requestObject = {
            location: `users/reset-alert-notifications`,
            method: "POST"
        };
        this.api.makeRequest(requestObject).then((val) => {
            if (val.statusCode == 201) {
                this.notifications.alerts = 0;
            }
        });
    }
};
TopbarComponent.ɵfac = function TopbarComponent_Factory(t) { return new (t || TopbarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_local_storage_service__WEBPACK_IMPORTED_MODULE_5__["LocalStorageService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_event_emitter_service__WEBPACK_IMPORTED_MODULE_6__["EventEmitterService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_api_service__WEBPACK_IMPORTED_MODULE_7__["ApiService"])); };
TopbarComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: TopbarComponent, selectors: [["app-topbar"]], decls: 80, vars: 13, consts: [[1, "navbar", "navbar-expand", "navbar-light", "bg-white", "topbar", "mb-4", "static-top", "shadow"], ["id", "sidebarToggleTop", 1, "btn", "btn-link", "d-md-none", "rounded-circle", "mr-3"], [1, "fa", "fa-bars"], [1, "d-none", "d-sm-inline-block", "form-inline", "mr-auto", "ml-md-3", "my-2", "my-md-0", "mw-100", "navbar-search", 3, "ngSubmit"], [1, "input-group"], ["name", "query", "type", "text", "placeholder", "Find Friends for...", "aria-label", "Search", "aria-describedby", "basic-addon2", 1, "form-control", "bg-light", "border-0", "small", 3, "ngModel", "ngModelChange"], [1, "input-group-append"], ["type", "submit", 1, "btn", "btn-primary"], [1, "fas", "fa-search", "fa-sm"], [1, "navbar-nav", "ml-auto"], [1, "nav-item", "dropdown", "no-arrow", "d-sm-none"], ["href", "#", "id", "searchDropdown", "role", "button", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "nav-link", "dropdown-toggle"], [1, "fas", "fa-search", "fa-fw"], ["aria-labelledby", "searchDropdown", 1, "dropdown-menu", "dropdown-menu-right", "p-3", "shadow", "animated--grow-in"], [1, "form-inline", "mr-auto", "w-100", "navbar-search", 3, "ngSubmit"], ["type", "text", "placeholder", "Find Friends...", "aria-label", "Search", "aria-describedby", "basic-addon2", "name", "query", 1, "form-control", "bg-light", "border-0", "small", 3, "ngModel", "ngModelChange"], [1, "nav-item", "dropdown", "no-arrow", "mx-1"], ["href", "", "routerLink", "/friend-requests", 1, "nav-link", "dropdown-toggle"], [1, "fas", "fa-users"], ["class", "badge badge-danger badge-counter", 4, "ngIf"], ["href", "#", "id", "alertsDropdown", "role", "button", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "nav-link", "dropdown-toggle", 3, "click"], [1, "fas", "fa-bell", "fa-fw"], ["aria-labelledby", "alertsDropdown", 1, "dropdown-list", "dropdown-menu", "dropdown-menu-right", "shadow", "animated--grow-in"], [1, "dropdown-header"], [1, "custom-scroll", "limit-h"], ["class", "dropdown-item d-flex align-items-center", 3, "routerLink", 4, "ngFor", "ngForOf"], ["href", "#", "id", "messagesDropdown", "role", "button", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "nav-link", "dropdown-toggle", 3, "click"], [1, "fas", "fa-envelope", "fa-fw"], ["aria-labelledby", "messagesDropdown", 1, "dropdown-list", "dropdown-menu", "dropdown-menu-right", "shadow", "animated--grow-in"], ["class", "link dropdown-item d-flex align-items-center", 3, "click", 4, "ngFor", "ngForOf"], ["href", "", "routerLink", "/messages", 1, "dropdown-item", "text-center", "small", "text-gray-500"], [1, "topbar-divider", "d-none", "d-sm-block"], [1, "nav-item", "dropdown", "no-arrow"], ["href", "#", "id", "userDropdown", "role", "button", "data-toggle", "dropdown", "aria-haspopup", "true", "aria-expanded", "false", 1, "nav-link", "dropdown-toggle"], [1, "mr-2", "d-none", "d-lg-inline", "text-gray-600", "small"], [1, "img-profile", "rounded-circle", 3, "src"], ["aria-labelledby", "userDropdown", 1, "dropdown-menu", "dropdown-menu-right", "shadow", "animated--grow-in"], ["href", "", 1, "dropdown-item", 3, "routerLink"], [1, "fas", "fa-user", "fa-sm", "fa-fw", "mr-2", "text-gray-400"], ["href", "", "routerLink", "/feed", 1, "dropdown-item"], [1, "fas", "fa-cogs", "fa-sm", "fa-fw", "mr-2", "text-gray-400"], [1, "dropdown-divider"], ["data-toggle", "modal", "data-target", "#logoutModal", "href", "", "routerLink", "/", 1, "dropdown-item", 3, "click"], [1, "fas", "fa-sign-out-alt", "fa-sm", "fa-fw", "mr-2", "text-gray-400"], ["class", "mx-4 alert alert-primary text-primary mb-4", 4, "ngIf"], ["id", "staticBackdrop", "data-backdrop", "static", "tabindex", "-1", "role", "dialog", 1, "modal", "fade", "p-0"], ["role", "document", 1, "modal-dialog", "w-100", "mx-auto"], [1, "modal-content"], [1, "modal-header"], ["id", "staticBackdropLabel", 1, "modal-title"], ["type", "button", "data-dismiss", "modal", 1, "close"], [1, "modal-body"], ["action", "index.html", "method", "post", "id", "send-message", 1, ""], ["name", "name", "placeholder", "Your message...", "rows", "6", "required", "", 1, "w-100", 3, "ngModel", "ngModelChange"], [1, "modal-footer"], ["type", "button", "data-dismiss", "modal", 1, "btn", "btn-secondary"], ["type", "submit", "form", "send-message", "data-dismiss", "modal", 1, "btn", "btn-primary", 3, "click"], [1, "badge", "badge-danger", "badge-counter"], [1, "dropdown-item", "d-flex", "align-items-center", 3, "routerLink"], [1, "mr-3"], [1, "link", "dropdown-item", "d-flex", "align-items-center", 3, "click"], [1, "dropdown-list-image", "mr-3"], ["alt", "", 1, "rounded-circle", 3, "src"], ["class", "new badge badge-success badge-counter", 4, "ngIf"], [1, "font-weight-700"], [1, "text-truncate"], [1, "small", "text-primary"], [1, "new", "badge", "badge-success", "badge-counter"], [1, "mx-4", "alert", "alert-primary", "text-primary", "mb-4"]], template: function TopbarComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "nav", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "i", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "form", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function TopbarComponent_Template_form_ngSubmit_3_listener() { return ctx.searchForFriends(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "input", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function TopbarComponent_Template_input_ngModelChange_5_listener($event) { return ctx.query = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "ul", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "li", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "a", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](12, "i", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "form", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function TopbarComponent_Template_form_ngSubmit_14_listener() { return ctx.searchForFriends(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "input", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function TopbarComponent_Template_input_ngModelChange_16_listener($event) { return ctx.query = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "i", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "li", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "a", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](22, "i", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, TopbarComponent_span_23_Template, 2, 1, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "li", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "a", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TopbarComponent_Template_a_click_25_listener() { return ctx.resetAlertNotifications(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "i", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, TopbarComponent_span_27_Template, 2, 1, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "h6", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Alerts Center ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](31, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](32, TopbarComponent_a_32_Template, 6, 8, "a", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](33, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "li", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "a", 26);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TopbarComponent_Template_a_click_35_listener() { return ctx.resetMessageNotifications(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](36, "i", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](37, TopbarComponent_span_37_Template, 2, 1, "span", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](38, "div", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "h6", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](40, " Message Center ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "div", 24);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](42, TopbarComponent_a_42_Template, 9, 4, "a", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "a", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](44, "Read More Messages");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](45, "div", 31);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "li", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](47, "a", 33);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "span", 34);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](49);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](50, "img", 35);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 36);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](52, "a", 37);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](53, "i", 38);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, " Profile ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "a", 39);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](56, "i", 40);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](57, " Feed ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](58, "div", 41);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "a", 42);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TopbarComponent_Template_a_click_59_listener() { return ctx.auth.logout(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](60, "i", 43);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](61, " Sign Out ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](62, TopbarComponent_div_62_Template, 2, 1, "div", 44);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](63, "div", 45);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "div", 46);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](65, "div", 47);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](66, "div", 48);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "h5", 49);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](68);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](69, "button", 50);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](70, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](71, "\u00D7");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](72, "div", 51);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "form", 52);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](74, "textarea", 53);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function TopbarComponent_Template_textarea_ngModelChange_74_listener($event) { return ctx.sendMessageObject.content = $event; });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](75, "div", 54);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](76, "button", 55);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](77, "Nevermind");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](78, "button", 56);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function TopbarComponent_Template_button_click_78_listener() { return ctx.sendMessage(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](79, "Send Message");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.query);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.query);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.notifications.friendRequests);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.notifications.alerts);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.alerts);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.notifications.messages);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.messagePreview);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.userName);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("src", "assets/images/", ctx.profilePicture, ".jpg", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate1"]("routerLink", "/profile/", ctx.userId, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.alertMessage);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Send Message to ", ctx.sendMessageObject.name, "");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.sendMessageObject.content);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_8__["ɵangular_packages_forms_forms_y"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgForm"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["NgModel"], _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterLinkWithHref"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgForOf"], _angular_forms__WEBPACK_IMPORTED_MODULE_8__["RequiredValidator"]], styles: ["#alerts[_ngcontent-%COMP%] {\r\n    max-height: 46vh;\r\n    overflow-y: auto;\r\n}\r\n.new[_ngcontent-%COMP%]{\r\n    position: relative;\r\n    bottom: 17px;\r\n    right: 12px;\r\n}\r\n.limit-h[_ngcontent-%COMP%]{\r\n    max-height: 400px;\r\n    overflow-y: auto;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdG9wYmFyL3RvcGJhci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksZ0JBQWdCO0lBQ2hCLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0ksa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixXQUFXO0FBQ2Y7QUFDQTtJQUNJLGlCQUFpQjtJQUNqQixnQkFBZ0I7QUFDcEIiLCJmaWxlIjoic3JjL2FwcC90b3BiYXIvdG9wYmFyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjYWxlcnRzIHtcclxuICAgIG1heC1oZWlnaHQ6IDQ2dmg7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcbi5uZXd7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICBib3R0b206IDE3cHg7XHJcbiAgICByaWdodDogMTJweDtcclxufVxyXG4ubGltaXQtaHtcclxuICAgIG1heC1oZWlnaHQ6IDQwMHB4O1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG4iXX0= */"] });
TopbarComponent = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    _unsubscribe__WEBPACK_IMPORTED_MODULE_2__["AutoUnsubscribe"]
], TopbarComponent);

/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](TopbarComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'app-topbar',
                templateUrl: './topbar.component.html',
                styleUrls: ['./topbar.component.css']
            }]
    }], function () { return [{ type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }, { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"] }, { type: _local_storage_service__WEBPACK_IMPORTED_MODULE_5__["LocalStorageService"] }, { type: _event_emitter_service__WEBPACK_IMPORTED_MODULE_6__["EventEmitterService"] }, { type: _api_service__WEBPACK_IMPORTED_MODULE_7__["ApiService"] }]; }, null); })();


/***/ }),

/***/ "./src/app/unsubscribe.ts":
/*!********************************!*\
  !*** ./src/app/unsubscribe.ts ***!
  \********************************/
/*! exports provided: AutoUnsubscribe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoUnsubscribe", function() { return AutoUnsubscribe; });
function AutoUnsubscribe(constructor) {
    const original = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function () {
        for (let prop in this) {
            if (prop == "subscriptions") {
                for (let sub of this[prop]) {
                    if (sub && (typeof sub.unsubscribe === "function")) {
                        sub.unsubscribe();
                    }
                }
                break;
            }
        }
        original && typeof original === "function" && original.apply(this, arguments);
    };
}


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    baseUrl: 'http://localhost:4200/',
    production: false
};
/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Web Development\A Social Media\angular\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map