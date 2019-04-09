import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import { sharedStyles } from './shared-styles.js';

class StockSummary extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();

    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Stock Summary page"
            },
            users:{
                type: Array,
                value: ["user1", "user2", "user3"]
            },
        }
    }
    getSummary(event){
        this.isActive = true;
        if(this.$.getSummary.validate()){
            let buyStockajax = this.$.ajax;
            
           buyStockajax.contentType = "application/json";
           buyStockajax.url = config.baseURL+"/rmisecurity/stmt/"+ this.selectedUser+ "/stockname";
            this.requestType = 'summary';
            buyStockajax.generateRequest();
         }
    }
    handleResponse(event, requestType ){
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
			<paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            
            <paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            <paper-card heading="Emmental" image="http://placehold.it/350x150/FFC107/000000" alt="Emmental">
                <div class="card-content">
                    Emmentaler or Emmental is a yellow, medium-hard cheese that originated in the area around Emmental, Switzerland. It is one of the cheeses of Switzerland, and is sometimes known as Swiss cheese.
                    <table class="table mt-5">
                        <thead>
                            <tr>
                                <th>UserName</th>
                                <th>Account No</th>
                                <th>Total balance</th>
                            </tr>
                        </thead>
                                <tbody>
                                        <template is="dom-repeat" items=[[responseData]]  as="userResults">
                                            <tr>
                                                <td scope="row">{{userResults.userName}}</td>
                                                <td>{{userResults.accountId}}</td>
                                                <td>{{userResults.balance}}</td>
                                            </tr>
                                        </template>            
                                </tbody>
                    </table><br/>
                </div>
                <div class="card-actions">
                <paper-button label="Get Statement" required raised on-click="getStatement">Get Statement</paper-input>
                </div>
            </paper-card>

            
            
        `
    }

}
customElements.define("stock-summary", StockSummary);