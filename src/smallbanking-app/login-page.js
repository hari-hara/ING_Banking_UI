import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { sharedStyles } from './shared-styles.js';
class LoginPage extends PolymerElement{
    constructor(){
        super();
    }
    connectedCallback(){
        super.connectedCallback();
        // this.$.stockBrokerage.addEventListener('change', function(event){
        //     console.log("getting triggered"); 
        //     console.log(event.target.value);
        // }.bind(this));
    }
    ready(){
        super.ready();
        this.isVisible = true;
    }
    loginForm(event){
        console.log(this);

        if(this.$.loginform.validate()) {
            console.log("entered values are",this.userName, this.passWord);
            let ajaxCall = this.$.ajaxRequest;
            ajaxCall.url = "http://localhost:3000/loginResponse";
            //ajaxCall.body = {"userName": this.userName, "password": this.passWord};
            ajaxCall.generateRequest(); 
        }
    }
    handleResponse(event){
        this.data = event.detail.response;
        console.log("response data: ",this.data);
        if(this.data.message === "Valid User"){
            sessionStorage.setItem("userData",JSON.stringify(this.userName));

            this.dispatchEvent(new CustomEvent('loggedInuser', {bubbles: true, composed: true, detail:{'sessionUser':this.userName, 'sessionRole': this.userRole}}));

            //this.dispatchEvent(new CustomEvent('dataUpdate' , {bubbles: true, composed: true, detail: {'name':'Sabri'}}));
            document.querySelector("smallbanking-app").set('route.path', '/view-account');
        }
    }
    static get properties(){
        return {
            pageTitle:{
                type: String,
                value: "This is for Login page"
            },
            selectedUser:{
                type: String
            }
            
            
        }
    }
    
    handleError(event){
        this.$.messageHandle.toggle();
        this.toastMessage = "This API call is failed";
    }
    static get template(){
        return html `
            ${sharedStyles}
            <h2>[[pageTitle]]</h2>
            <section class="col-12 offset-md-4 col-sm-4 mt-4 border p-2 rounded">
                <h2>This is login screen</h2>
                <iron-form id="loginform">
                    <form>
                        <paper-input label="userName" id="userName" required value={{userName}} auto-validate error-message="Cannot be Empty"></paper-input>
                        <paper-input label="Password" id="passWord" type="password" required value={{passWord}} auto-validate error-message="Cannot be Empty"></paper-input>
                        <paper-button raised id="loginBtn" on-click="loginForm">Login</paper-button>
                    </form>
                </iron-form>
            </section>
            <iron-ajax
                id="ajaxRequest"
                method="post"
                handle-as="json"
                on-response="handleResponse"
                debounce-duration="300"
                content-type="application/json">
            </iron-ajax>
            <paper-spinner active={{isActive}}></paper-spinner><br/>
        `
    }

}
customElements.define("login-page", LoginPage);