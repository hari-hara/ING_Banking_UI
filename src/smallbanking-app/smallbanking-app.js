import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';

import { sharedStyles } from './shared-styles.js';

/**
 * @customElement
 * @polymer
 */
class SmallbankingApp extends PolymerElement {
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
              <li class="nav-item"><a class="nav-link" href="#/login">Login</a></li>
              <li class="nav-item"><a class="nav-link" href="#/create-account">Create Account</a></li>
              <li class="nav-item"><a class="nav-link" href="#/view-account">View Account</a></li>
              <li class="nav-item"><a class="nav-link" href="#/make-transaction">Make Transaction</a></li>
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
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'smallbanking-app'
      },
      page:{
        type: String,
        observer: '_pageChanged'
      }
    };
  }
  static get observers(){
    
    return ['_routeChanged(routeData.page)'];
    
  }
  _routeChanged(page){
    this.page = (page || ('login'))
  }
  _pageChanged(newPage, oldPage){
    this.isActive = true;
    switch(newPage){
      case 'login':
        import('./login-page.js');
        this.isActive = false;
        break;
      case 'create-account':
        import('./create-account.js');
        this.isActive = false;
        break;
      case 'view-account':
        import('./view-account.js');
        this.isActive = false;
        break;
      case 'make-transaction':
        import('./make-transaction.js');
        this.isActive = false;
        break;  
      default:
        this.page =  'login';   
    }
  }
}

window.customElements.define('smallbanking-app', SmallbankingApp);
