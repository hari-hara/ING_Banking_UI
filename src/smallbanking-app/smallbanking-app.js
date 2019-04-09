import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@vaadin/vaadin-accordion/vaadin-accordion.js';

import { sharedStyles } from './shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class SmallbankingApp extends PolymerElement {
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'smallbanking-app'
      },
      page:{
        type: String,
        observer: '_pageChanged'
      },
      isLoggedin: {
        type: Boolean,
        value: false,
        observer: '_checkUser'
      }
    };
  }
  _checkUser(){
    if(sessionStorage.length == 0)
    { 
      return false
    }else{
      return true
    }
  }
  static get observers(){
    
    return ['_routeChanged(routeData.page)'];
    
  }
  _routeChanged(page){
    this.page = (page || ('login'))
    //this.page = page || this.isLoggedin ? 'admin' : 'login'; 
  }
  _pageChanged(newPage, oldPage){
    this.isActive = true;
    switch(newPage){
      case 'login':
        
        import('./login-page.js');
        this.isActive = false;
        break;
      case 'create-account':
        if(sessionStorage.length > 0){
          import('./create-account.js');
        }else{
          import('./login-page.js');
        }
        
        this.isActive = false;
        break;
      case 'view-account':
        if(sessionStorage.length > 0){
          import('./view-account.js');
        }else{
          import('./login-page.js');
        }
        
        this.isActive = false;
        break;
      case 'make-transaction':
        if(sessionStorage.length > 0){
          import('./make-transaction.js');
        }else{
          import('./login-page.js');
        }
        
        this.isActive = false;
        break;  
      default:
        this.page =  'login';   
    }
  }
  
  connectedCallback(){
    super.connectedCallback();
      if(sessionStorage.length > 0){
        let res = JSON.parse(sessionStorage.userData);
        if(res[1] == "admin"){
          this.isLoggedinAdmin = true;
            this.isNotLoggedin = false;
            this.isNormaluser = false; 
        }else{
          this.isNormaluser = true;
            this.isLoggedinAdmin = false;
            this.isNotLoggedin = false;
        }
      }else{
        this.isNotLoggedin = true;
      }
      
      this.addEventListener('loggedInuser', (e) => {
          console.log(e.detail);
          //this.isLoggedin = true;
          if(e.detail.sessionRole === "admin"){
            this.isLoggedinAdmin = true;
            this.isNotLoggedin = false;
            this.isNormaluser = false; 
          }else{
            this.isNormaluser = true;
            this.isLoggedinAdmin = false;
            this.isNotLoggedin = false;
          }
      });
  }
  
  clearSession(){
    sessionStorage.clear();
    if(sessionStorage.length == 0){
      this.isLoggedin = false;
      this.set('route.path', '/login');
      this.isNotLoggedin = true;
      this.isLoggedinAdmin = false;
      this.isNormaluser = false;
      //document.querySelector('smallbanking-app').setAttribute('route.path', '/login');
    }
  }
  static get template() {
    return html`
      ${sharedStyles}
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="container">
        <h2>Hello [[prop1]]!</h2>
        <app-location route="{{route}}" use-hash-as-path></app-location>
        <app-route
            route="{{route}}"
            pattern="/:page"
            data="{{routeData}}"
            tail="{{subroute}}">
        </app-route>
        <app-route
            route="{{subroute}}"
            pattern="/:id"
            data="{{subrouteData}}">
        </app-route>
        <div class="container-fluid" style="background-color: #ff6200 !important;">
          <nav class="navbar navbar-expand-lg navbar-light bg-light container" style="background-color: #ff6200 !important;">
            <a class="navbar-brand" href="#"></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <template is="dom-if" if={{isNotLoggedin}}>
                <li class="nav-item"><a class="nav-link" href="#/login">Login</a></li>
              </template>
              <template is="dom-if" if={{isLoggedinAdmin}}>
                <li class="nav-item"><a class="nav-link" href="#/create-account">Create Account</a></li>
                <li class="nav-item"><paper-button raised on-click="clearSession">LogOut</paper-button></li>
              </template>
              <template is="dom-if" if={{isNormaluser}}>
                <li class="nav-item"><a class="nav-link" href="#/view-account">View Account</a></li>
                <li class="nav-item"><a class="nav-link" href="#/make-transaction">Make Transaction</a></li>
                <li class="nav-item"><paper-button raised on-click="clearSession">LogOut</paper-button></li>
              </template>

              <!--
                <li class="nav-item"><a class="nav-link" href="#/login">Login</a></li>
                <li class="nav-item"><a class="nav-link" href="#/create-account">Create Account</a></li>
                <li class="nav-item"><paper-button raised on-click="clearSession">LogOut</paper-button></li>
                <li class="nav-item"><a class="nav-link" href="#/view-account">View Account</a></li>
                <li class="nav-item"><a class="nav-link" href="#/make-transaction">Make Transaction</a></li>
                <li class="nav-item"><paper-button raised on-click="clearSession">LogOut</paper-button></li>
              -->
            </ul>
            </div>
          </nav> 
        </div>
        <div class="container">
            <div class="d-flex justify-content-center">
              <paper-spinner active={{isActive}}></paper-spinner>
            </div> 
          <iron-pages selected=[[page]] attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
            <login-page name="login"></login-page>
            <create-account name="create-account"></create-account>
            <view-account name="view-account"></view-account>
            <make-transaction name="make-transaction"></make-transaction>
          </iron-pages>
        </div>
      </div>
    `;
  }
}

window.customElements.define('smallbanking-app', SmallbankingApp);
