import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { sharedStyles } from './shared-styles.js';
class makeTransactions extends PolymerElement{
    constructor(){
        super();
    }
    ready(){
        super.ready();
        sessionStorage.getItem("userData");
        let sessionValue = JSON.parse(sessionStorage.getItem("userData"));
        super.ready();
        let viewAccountAjax = this.$.ajax;
        viewAccountAjax.method= "POST";
        viewAccountAjax.contentType = "application/json";
        viewAccountAjax.url = "http://10.117.189.199:8085/bank/transaction "
        // config.baseURL+"/bank/user/"+sessionValue[0]+"/summary";
        viewAccountAjax.body = {
            "accountno": "14",
            "toAccount": "15",
            "credit": "3000"
          };
         this.requestType = 'statement';
         viewAccountAjax.generateRequest();
        // this.$.transactionForm.addEventListener('iron-form-submit', function(event){
        //     console.log(event.detail);
        // }.bind(this));
    }
    _makePaymetProcess(event){
        console.log(event.details);
    }
    static get properties(){
        return{
            pageTitle:{
                type: String,
                value: "This page is to create transaction"
            },
            spendCategory:{
                type: Array,
                value: ["Medical","Travel","Loans","Utility Bills","Education","Shopping","Misc"]
            },
            paymentType:{
                type: Array,
                value: ["make","receive"]
            },
            selectedCategory:{
                type: String,
                value: ''
            },
            selectedType:{
                type: String,
                value: ''
            }
            
        }
    }
    handleResponse(event){
        this.$.messageHandle.toggle()
        this.toastMessage = "Transaction Successful";
    }
    __getSpendCategory(){
        var spendCategories = [
            {"categoryName": "Medical"},
            {"categoryName": "Travel"},
            {"categoryName": "Loans"},
            {"categoryName": "Utility Bills"},
            {"categoryName": "Education"},
            {"categoryName": "Shopping"},
            {"categoryName": "Misc"}
        ]
        return spendCategories;
    }
    handleError(event){
        this.$.messageHandle.toggle();
        this.toastMessage = "Failed to make transaction";
    }
    __getPaymentType(){
        var spendCategories = [
            {"selectedType": "make"},
            {"selectedType": "receive"}
        ]
        return spendCategories;
    }
    static get template(){
        return html `
        ${sharedStyles}
            <h2 class="my-3">This page is to create transaction</h2>
            <paper-toast id="messageHandle" text="[[toastMessage]]" horizontal-align="center" vertical-align="middle"></paper-toast>
            <iron-form id="transactionForm" class="col-md-4 offset-md-4 border border-secondary pt-3 pb-3">
                
                <form>
                <paper-input label="TO userAccountNo" id="userName" required value={{toUser}} auto-validate error-message="Cannot be Empty"></paper-input>
                <paper-input label="Amount" id="amount" required value={{amount}} auto-validate error-message="Cannot be Empty"></paper-input>
                    <paper-button label="Submit" required raised on-click="makeTransaction">Submit</paper-input>
                </form>
            </iron-form>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                on-error="handleError"
                debounce-duration="300">
            </iron-ajax>
        `
    }

}
customElements.define("make-transaction", makeTransactions);