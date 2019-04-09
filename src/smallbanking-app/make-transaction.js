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

class TradeAnalytics extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        
        super.ready();

        let paymentReportajax = this.$.ajax;
        paymentReportajax.method = "GET";
        paymentReportajax.contentType = "application/json";
        paymentReportajax.url = config.baseURL+"/rmisecurity/tradeAnalytics";
        paymentReportajax.generateRequest(); 
        
    }
    handleResponse(event){
        this.data = event.detail.response;
        
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is Product Analytics page"
            }
        }
    }
    handleError(event){
        this.$.messageHandle.toggle();
        //this.toastMessage = "Failed to make transaction";
    }
    static get template(){
        return html `
            <h2>[[pageTitle]]</h2>
            <svg id="svgImage" width="980" height="500"></svg><paper-spinner active={{isActive}}></paper-spinner><br/>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
            <iron-form id="transactionForm" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                
                <form>
                    <paper-dropdown-menu label="Select Category" name="selectCategory">
                        <paper-listbox slot="dropdown-content" selected="{{selectedCategory}}" attr-for-selected="name" selected-attribute="visible">
                            <template is="dom-repeat" items="[[spendCategory]]">
                                <paper-item name={{item}}>{{item}}</paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input label="Amount" required invalid="{{invalid}}" required error-message=[[amountValid]]  name="{{amount}}" value="{{amount}}"><div slot="prefix">$</div></paper-input>
                    <vaadin-date-picker label="Transaction Date" placeholder="Transaction Date" value="{{selectedDate}}"></vaadin-date-picker>
                    <paper-input label="description" required value="{{description}}"></paper-input>
                    <label id="paymentType">Payment Type:</label>
                    <paper-radio-group aria-labelledby="paymentType" name={{selectedType}} selected="{{selectedType}}">
                        <template is="dom-repeat" items={{paymentType}}>
                            <paper-radio-button name="{{item}}">{{item}}</paper-radio-button>
                        </template>
                    </paper-radio-group>
                    <paper-button label="Submit" required raised on-click="makeTransaction">Submit</paper-input>
                </form>
            </iron-form>
            
        `
    }

}
customElements.define("trade-analytics", TradeAnalytics);