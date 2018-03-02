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

        // TODO: allow user to set his power consumption
        let usualConsumption = [
            4, 4, 4, 4, 4, 4,
            5, 5, 5, 7, 7, 7,
            7, 7, 4, 5, 4, 4,
            4, 4, 3, 3, 2, 1
        ];

        try{
            await to_promise(window.contract.addNewUser, type, usualConsumption);
            console.log("User has been added to smart contract!");
            let response = await fetch("/api/add_new_user", {
                method: 'POST',
                body: JSON.stringify({
                    type: type,
                    title: title,
                    address: window.web3.eth.defaultAccount
                }),
                headers: new Headers()
            });
            let json = await response.json();
            if(json.error){
                alert("Error occurred while adding user to a server");
                console.log(json)
            }else{
                console.log("User has been added to the server!");
                await window.homepage.update()
            }
        }catch(e){
            alert("Error occurred while adding user to smart contract");
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
                                <p>Balance: {window.homepage.state.user_data.balance}</p>
                            </div>
                            <div className="uk-margin">
                                <span>Power:</span>
                                <input className="uk-input" name = 'power' type="number" onChange={this.handleInputChange}/>
                            </div>
                            <div className="uk-margin">
                                <span>Reward: </span>
                                <input className="uk-input" name = 'power' type="number" onChange={this.handleInputChange}/>
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
