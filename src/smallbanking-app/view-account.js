import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import { sharedStyles } from './shared-styles.js';

class ViewAccount extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        sessionStorage.getItem("userData");
        let sessionValue = JSON.parse(sessionStorage.getItem("userData"));
        super.ready();
        let viewAccountAjax = this.$.ajax;
        viewAccountAjax.contentType = "application/json";
        viewAccountAjax.url = config.baseURL+"/bank/user/"+sessionValue[0]+"/summary";
         this.requestType = 'summary';
         viewAccountAjax.generateRequest();

    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Account Summary page"
            }
        }
    }
    getSummary(event){
        this.isActive = true;
        if(this.$.getSummary.validate()){
            let buyStockajax = this.$.ajax;
            
           buyStockajax.contentType = "application/json";
           buyStockajax.url = "http://10.117.189.40/rmisecurity/stmt/"+ this.selectedUser+ "/stockname";
            this.requestType = 'summary';
            buyStockajax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
        switch(this.requestType){
            case 'summary':
                console.log(event.detail.response);
                this.responseData = event.detail.response;
                this.isActive = false;
                console.log("details rendered", event.response);
                //this.responseData = event.detail.__data.response;
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
			<!--<paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>-->
            
            <paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            
            <table class="table mt-5" border="1">
                <thead>
                    <tr>
                        <th>userName</th>
                        <th>Account No</th>
                        <th>Available Balance</th>
                    </tr>
                </thead>
                        <tbody id="scrollable-element" style="overflow: auto;height: 200px;">
                       
                       
                                    <tr>
                                        <td>{{responseData.userName}}</td>
                                        <td>{{responseData.accountno}}</td>
                                        <td>{{responseData.totalAmount}}</td>
                                        <td><paper-button label="statement" required raised on-click="getStatement">Get Statement</paper-input></td>
                                    </tr>
                       
                        </tbody>
                    
            </table><br/>
            
            
        `
    }

}
customElements.define("view-account", ViewAccount);