/**
 * Part of blockchain-energy-hack
 * Created by Anton Zuev on 27/02/2018.
 *
 * Contacts:
 * - mail: anzuev@bk.ru
 * - telegram: @anzuev
 * - github: @AnZuev
 */

import React from 'react';

class ConnectTelegramForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors:{

            }
        };

        this.data = {

        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }
    async handleSubmit(event){
        let secretNumber = this.data.secretNumber;
        console.log(this.data);
        try{
            let offer_id = await to_promise(window.contract.addNewSecretNum, secretNumber, {from: window.defaultAccount, gas: 3000000});
            console.log("Secret number has been added");
            window.homepage.hide_telegram_form();
        }catch(e){
            alert("Error occurred while secret number was being added");
            console.log(e)
        }
        event.persist()

    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        this.data[name] = event.target.value;
    }
    render () {
        return (
            <div className="uk-section uk-section-default" id="newUserForm" >
                <div className="uk-container" style={{maxWidth: 600 + 'px'}}>
                    <form>
                        <fieldset className="uk-fieldset">

                            <legend className="uk-legend">Connect your Telegram account</legend>

                            <div className="uk-margin">
                                <span>Your secret number</span>
                                <input className="uk-input" name = 'secretNumber' onChange={this.handleInputChange}/>
                            </div>

                            <div className="uk-margin">
                                <div className="uk-button uk-button-primary uk-align-right" onClick={this.handleSubmit}>Connect</div>
                                <div className="uk-clearfix"></div>
                            </div>

                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default ConnectTelegramForm
