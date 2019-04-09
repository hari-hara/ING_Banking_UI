import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';
import { sharedStyles } from './shared-styles.js';
class BankStatement extends PolymerElement{
    constructor(){
        super();
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is transaction history page"
            }
        }
    }
    getTransactions(event){
        if(this.$.transactionFilters.validate()){
            //this.$.transactionForm.submit();
           console.log(this.selectedFromDate, this.selectedToDate);
           let makePaymentajax = this.$.ajax;
           makePaymentajax.method = "GET";
           makePaymentajax.contentType = "application/json";
           makePaymentajax.url = "http://localhost:3000/newtransactionHistory";
           makePaymentajax.generateRequest(); 
        }
    }
    handleResponse(event){
        this.data = event.detail.__data.response;
        console.log(this.data);
        console.log("checking category scope",this.selectedCategory);
        switch(this.selectedCategory){
            case 'current':
                let dates = this.data.sort(function(a,b){return (new Date(b.details[0].date)) - (new Date(a.details[0].date))});
                this.filteredResults = dates.slice(0,4);
                    
                break;
            case 'monthly':

                break;
            case 'periodically':
                this.filteredResults = this.data.filter((dates) => {
                    return (dates.details[0].date >= this.__data.selectedFromDate && dates.details[0].date <= this.__data.selectedToDate)
                });
                break;
            case 'total':
                //this.filteredResults = event.detail.__data.response;
                this.responseArray = event.detail.__data.response;
                this._getAllResults();
                break;            
        }

        
        console.log(this.filteredResults);
    }
    _getAllResults(event){
        //this.pageNumber++;
        console.log();
        this.isPrevDisabled = true;
        this.isNextDisabled = false;
        let start, end;
        start = 0;
        end = start + 3;
        if(event){
            switch(event.target.innerHTML){
                case 'Next':
                    //this.pageNumber++;
                    this.pageNumber++;
                    start = this.pageNumber * 3.
                    end = start+3;
                    this.isPrevDisabled = false;
                    this.isNextDisabled = end > this.responseArray.length ? true : false;
                    break;
                case 'Previous':

                    this.pageNumber--;
                    start = this.pageNumber * 3.
                    end = start+3;
                    this.isPrevDisabled = this.pageNumber === 0 ? true : false;
                    this.isNextDisabled = false;
                    break;
                default:
                    start = 0;
                    end = start + 3;
                    break;        
            }
        }
        
        this.filteredResults = this.responseArray.slice(start,end);
        console.log('RESULTS - ',this.filteredResults);
    }
    _checkCategoryType(event){
        console.log();
        console.log("its working");
        switch(this.selectedCategory){
            case "current":
                this.isMonthly = false;
                this.isPeriodically = false;
                break;
            case "monthly":
                this.isMonthly = true;
                this.isPeriodically = false;
                break;
            case "periodically":
                this.isMonthly = false;
                this.isPeriodically = true;
                break;
            case "total":
                this.isMonthly = false;
                this.isPeriodically = false;
                break;        
            default:
            this.selectedCategory == "current"
        }
        
    }
    filterResults(){

    }
    _loadMoreData() {
        console.log('lower-threshold triggered');
        // load async stuff. e.g. XHR
        setTimeout(() => {
          this.$.ironScrollTheshold.clearTriggers();
        });
    }
    static get template(){
        return html `
        ${sharedStyles}
            <h2 class="my-3">[[pageTitle]]</h2>
            <iron-ajax
                id="ajax"
                handle-as="json"
                on-response="handleResponse"
                debounce-duration="300">
            </iron-ajax>
            
            <table class="table mt-5">
                <thead>
                    <tr>
                        <th>From Account No</th>
                        <th>To Account No</th>
                        <th>Transaction Amount</th>
                        <th>Transaction Type</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                {{filteredResults}}
                    <iron-scroll-threshold id="ironScrollTheshold" on-lower-threshold="_loadMoreData">
                        <tbody id="scrollable-element" style="overflow: auto;height: 200px;">
                        <template scroll-target="scrollable-element" is="dom-repeat" items=[[filteredResults]]>
                                <template is="dom-repeat" items=[[item.details]]  as="historyResults">
                                    <tr>
                                        <td scope="row">{{item.id}}</td>
                                        <td>{{historyResults.date}}</td>
                                        <td>{{historyResults.amount}}</td>
                                        <td>{{historyResults.payment-type}}</td>
                                        <td>{{historyResults.description}}</td>
                                    </tr>
                                </template>
                        </template>
                        </tbody>
                    <iron-scroll-threshold>
            </table><br/>
            <div class="row">
                <div class="float-left">
                    <paper-button raised disabled="[[isPrevDisabled]]" on-click="_getAllResults">Previous</paper-button>
                    <paper-button raised disabled="[[isNextDisabled]]" on-click="_getAllResults">Next</paper-button>
                </div>
                <div class="float-left">
                
                </div>
            </div>
        `
    }

}
customElements.define("bank-statement", BankStatement);