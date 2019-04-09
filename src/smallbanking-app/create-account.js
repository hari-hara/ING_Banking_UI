import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-input/paper-input.js';
import { sharedStyles } from './shared-styles.js';

class CreateAccount extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();
        sessionStorage.getItem("userData");

    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Create Account page"
            }
        }
    }
    createAccount(event){
        this.isActive = true;
        if(this.$.createAccount.validate()){
            let createAccountAjax = this.$.ajax;
            createAccountAjax.method = "POST";
            createAccountAjax.contentType = "application/json";
            createAccountAjax.url = config.baseURL+"/bank/user";
            createAccountAjax.body = {"username": this.userName, "totalAmount": this.amount};
            this.requestType = 'createAccount';
            createAccountAjax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
        
        switch(this.requestType){
            case 'createAccount':
             this.isActive = false;
                console.log("details rendered", event.response);
                this.responseData = event.detail.response;
                this.toastMessage = "account"+ this.responseData.userName+ "with account No:" + this.responseData.accountno+ "is successfully created";
                this.$.messageHandle.toggle();
                break;    
        }
       
       //this.set('responseData', event.detail.response['Global Quote']);
       
    }
    handleError(event){
        this.$.messageHandle.toggle();
        //this.toastMessage = "Failed to make transaction";
    }
    static get template(){
        return html `
            <h2>[[pageTitle]]</h2>
            <iron-form id="createAccount" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                <form>
                    <paper-input label="userName" id="userName" required value={{userName}} auto-validate error-message="Cannot be Empty"></paper-input>
                    <paper-input label="Amount" id="amount" required value={{amount}} auto-validate error-message="Cannot be Empty"></paper-input>
                    <paper-button label="Submit" required raised on-click="createAccount">Submit</paper-input>
                   
                </form>
            </iron-form>
            <paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            <paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            
        `
    }

}
customElements.define("create-account", CreateAccount);