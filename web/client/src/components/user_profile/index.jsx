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
            user_balance_ether: 0
        };
        this.handleGetMoney = this.handleGetMoney.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        await this.getBalance();
        setInterval(async ()=> {
           await this.getBalance();
        }, 10000);
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

    render () {
        if (this.state.show_active_button) {
            console.log("hey here");
            return (
                <div>
                    <p>This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                    <p>From Offers: {this.state.user_balance_on_blockchain}</p>
                    <p>Ether: {this.state.user_balance_ether}</p>
                    <button className="uk-button uk-button-primary" type="button" onClick={this.handleGetMoney}>Receive Money</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <p>This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                    <p>From Offers: {this.state.user_balance_on_blockchain}</p>
                    <p>Ether: {this.state.user_balance_ether}</p>
                    <button className="uk-button uk-button-primary" disabled type="button">Receive Money</button>
                </div>
            )
        }
    }
}

export default UserProfile