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
            let buyStockajax = this.$.ajax;
            
           buyStockajax.contentType = "application/json";
           buyStockajax.url = "http://10.117.189.29:8089/rmisecurity/stmt/"+ this.selectedUser+ "/stockname";
            this.requestType = 'summary';
            buyStockajax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
        this.$.messageHandle.toggle();
        switch(this.requestType){
            case 'summary':
             this.isActive = false;
                console.log("details rendered", event.response);
                this.responseData = event.detail.__data.response;
                break;
            case 'buyStock':
                this.toastMessage = "This transaction is successful"
                this.$.messageHandle.toggle();

               console.log("response message",event.response.message);
                
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
            <paper-dialog id="dialog">
            <h2>Dialog Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </paper-dialog>
            
        `
    }

}
customElements.define("create-account", CreateAccount);