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

class NewUserForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors:{
                type: "",
                title: ""
            }
        };

        this.data = {
            type: 'consumer'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }
    async handleSubmit(event){
        let type = this.data.type;
        let title = this.data.title;
        this.setState({
            errors:{
                type: "",
                title: ""
            }
        });

        if (['consumer', 'factory'].indexOf(type) < 0){
            // wrong type assigned
            this.setState({
                errors:{
                    type: "Please, select one of the options above!"
                }
            })
        }
        if(title.length < 2){
            // title is too short
            this.setState({
                errors:{
                    title: "Please, give us something meaningful!"
                }
            })
        }

        // TODO: allow user to set his power consumption
        let usualConsumption = [
            3000, 3000, 3000, 3000, 3000, 3000,
            4000, 5000, 10000, 8000, 8000, 7000,
            7000, 7000, 7000, 8000, 8000, 10000,
            9000, 8000, 6000, 6000, 4000, 3000,
        ];



        try{
            await to_promise(window.contract.addNewUser, title, type, usualConsumption, {from: window.defaultAccount, gas: 3000000});
            console.log("User has been added to smart contract!");
            let response = await fetch("/api/add_new_user", {
                method: 'POST',
                body: JSON.stringify({
                    type: type,
                    title: title,
                    address: window.defaultAccount
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

                            <legend className="uk-legend">It seems like your are a new user</legend>

                            <div className="uk-margin">
                                <input className="uk-input" name = 'title' type="text" placeholder="How to name you?" onChange={this.handleInputChange}/>
                                <span className="uk-text-danger">{this.state.errors.title}</span>
                            </div>

                            <div className="uk-margin">
                                <select className="uk-select" name = 'type' onChange={this.handleInputChange}>
                                    <option value="consumer">Ordinary User</option>
                                    <option value="factory">Factory</option>
                                </select>
                                <span className="uk-text-danger">{this.state.errors.type}</span>
                            </div>

                            <div className="uk-margin">
                                <div className="uk-button uk-button-primary uk-align-right" onClick={this.handleSubmit}>Let's start</div>
                                <div className="uk-clearfix"></div>
                            </div>

                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }
}

export default NewUserForm
