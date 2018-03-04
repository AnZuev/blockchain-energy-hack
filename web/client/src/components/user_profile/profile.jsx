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

class ModalSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_active_button: false
        };
        this.handleGetMoney = this.handleGetMoney.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        await getBalance();
    }

    async getBalance() {
        let balance = await to_promise(window.contract.getUserBalance, window.defaultAccount, {from: window.defaultAccount, gas: 3000000});
        console.log(balance.toString());
        if (Number(balance.toString) !== 0) {
            await this.setStateAsync({show_active_button: true});
        }
        else await this.setStateAsync({show_active_button: false});
    }


    async handleGetMoney(event) {
        event.persist();
        console.log("Receive money has been called");

        await to_promise(window.contract.giveMoneyToUser, {from: window.defaultAccount, gas: 3000000});
        UIkit.notification({
            message: "Your reward has been transferred to your Ethereum account",
            timeout: 6000,
            status: 'success',
            pos: 'bottom-center'
        });

        await this.setStateAsync({show_active_button: false});
    }

    render () {
        if (this.state.show_active_button) {
            return (
                <div>
                    <p>This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                    <button className="uk-button uk-button-primary" type="button" onClick={this.handleGetMoney}>Receive Money</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <p>This is where you can receive money for all the offers you've responded to and fulfilled.</p>
                    <button className="uk-button uk-button-primary" disabled type="button">Receive Money</button>
                </div>
            )
        }
    }
}

export default ModalSection