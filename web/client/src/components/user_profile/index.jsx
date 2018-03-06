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

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_active_button: false,
            user_balance_on_blockchain: 0,
            user_balance_ether: 0,
            current_consumption: 2000
        };
        this.handleGetMoney = this.handleGetMoney.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        // TODO: load usual consumption and save this array to window.usual_consumption
        window.usual_consumption = 5;
        await this.getBalance();
        setInterval(async ()=> {
           await this.getBalance();
        }, 10000);
        window.profile = this;

    }

    async getBalance() {
        let balance = await to_promise(window.contract.getUserBalance, window.defaultAccount, {from: window.defaultAccount});
        let wei = await to_promise(window.web3.eth.getBalance, window.defaultAccount);
        let ether = window.web3.fromWei(wei.toString(), 'ether');
        await this.setStateAsync({user_balance_on_blockchain: balance.toString(), user_balance_ether: ether.toString()});
        console.log("balance " + balance.toString());
        if (Number(balance.toString()) !== 0) {
            await this.setStateAsync({show_active_button: true});
        }
        else await this.setStateAsync({show_active_button: false});
    }

    async update_user_consumption(){
        console.log("Updating user consumption...");
        try{
            console.log('--- current consumption is', this.state.current_consumption);
            await to_promise(window.contract.addNewSlot, this.state.current_consumption, {
                from: window.defaultAccount,
                gas: 3000000
            })
        }catch (err){
            console.error("Error occurred while updating user consumption");
            console.error(err);
        }
        console.log("Updating user consumtion finished.");
    }

    async handleGetMoney(event) {
        event.persist();
        console.log("Receive money has been called");

        await to_promise(window.contract.giveMoneyToUser, {from: window.defaultAccount, gas: 3000000});
        UIkit.notification({
            message: "Your reward has been transferred to your Ethereum account!",
            timeout: 6000,
            status: 'success',
            pos: 'bottom-center'
        });

        await this.setStateAsync({show_active_button: false});
        await this.getBalance();
    }

    handleRangeChange(event) {
        event.persist();
        this.setState({current_consumption: event.target.value})
    }

    render () {
        let slider = (<div className="uk-padding" style={{maxWidth: 600 + 'px'}}>
            <p className="uk-text-lead">Your current power consumption: {this.state.current_consumption} W</p>
            <p>Choose your consumption</p>
            <input className="uk-range"
                   onChange={this.handleRangeChange}
                   type="range"
                   defaultValue={2000}
                   min="0"
                   max={10000}
                   step="20"
            />
        </div>);
        if (this.state.show_active_button) {
            console.log("hey here");
            return (
                <div>
                    <div className="uk-padding">
                        <p className="uk-text-lead">Financial info</p>
                        <p className="uk-text-meta">This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                        <p>From Offers: {this.state.user_balance_on_blockchain}</p>
                        <p>Ether: {this.state.user_balance_ether}</p>
                        <button className="uk-button uk-button-primary" type="button" onClick={this.handleGetMoney}>Receive Money</button>
                    </div>
                    {slider}
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="uk-padding">
                        <p className="uk-text-lead">Financial info</p>
                        <p className="uk-text-meta">This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                        <p>From Offers: {this.state.user_balance_on_blockchain}</p>
                        <p>Ether: {this.state.user_balance_ether}</p>
                        <button className="uk-button uk-button-primary" disabled type="button">Receive Money</button>
                    </div>
                    {slider}
                </div>
            )
        }
    }
}

export default UserProfile