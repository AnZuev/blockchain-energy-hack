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

class CreateOfferForm extends React.Component {
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
        let reward = this.data.reward*1000000000;
        let power = this.data.power*1000;
        let from = this.data.from;
        let to = this.data.to;
        console.log(this.data);
        try{
            let offer_id = await to_promise(window.contract.addNewOffer, power, from, to, {value: reward, from: window.defaultAccount, gas: 3000000});
            console.log("Offer was created, tx hash", offer_id);
            window.homepage.hide_create_offer();
        }catch(e){
            alert("Error occurred while creating offer user to smart contract");
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

                            <legend className="uk-legend">New Offer</legend>
                            <div className="uk-margin">
                                <p><b>Balance: </b>{window.homepage.state.user_data.balance} ETH</p>
                            </div>
                            <div className="uk-margin">
                                <span>Power(kW):</span>
                                <input className="uk-input" name = 'power' type="number" onChange={this.handleInputChange}/>
                            </div>
                            <div className="uk-margin">
                                <span>Reward(gwei): </span>
                                <input className="uk-input" name = 'reward' type="number" onChange={this.handleInputChange}/>
                            </div>
                            <div className="uk-margin">
                                <span>Start time:</span>
                                <input className="uk-input" name = 'from' type="number" onChange={this.handleInputChange}/>
                            </div>
                            <div className="uk-margin">
                                <span>Finish time:</span>
                                <input className="uk-input" name = 'to' type="number" onChange={this.handleInputChange}/>
                            </div>

                            <div className="uk-margin">
                                <div className="uk-button uk-button-primary uk-align-right" onClick={this.handleSubmit}>Create</div>
                                <div className="uk-clearfix"></div>
                            </div>

                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateOfferForm
