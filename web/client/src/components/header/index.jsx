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

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0
        };

        this.handle_create_offer = this.handle_create_offer.bind(this);
        this.handle_connect_telegram = this.handle_connect_telegram.bind(this);
    }

    async componentDidMount(){
        let time = (await to_promise(window.contract.getTime)).toString();
        window.time = Number(time);
        await this.setStateAsync({time: time});
        this.init_time_update();
        console.log(time);
    }

    init_time_update(){
        setInterval(async () => {
            try{
                console.log("updating time...");
                let time = (await to_promise(window.contract.getTime)).toString();
                let prev_time = window.time;
                window.time = Number(time);
                if(prev_time !== window.time){
                    await window.profile.update_user_consumption();
                }
                await this.setStateAsync({time: time});
                console.log(time);
            }catch(err){
                console.error("Time updating failed");
                console.error(err);
            }
        }, 5000);
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }


    handle_create_offer(){
        window.homepage.show_create_offer();
    }

    handle_connect_telegram(){
        // TODO: implement
        window.homepage.show_telegram_form();
    }
    render () {
        if(this.props.is_a_new_user){
            return (
                <div className="uk-navbar-container" uk-navbar=""  id="header">
                    <div className="uk-navbar-left">
                        <a href="" className="uk-navbar-item uk-logo">P2P Energy Network</a>
                    </div>
                </div>
            )
        }
        if(this.props.is_telegram_connected){
            return (
                <div className="uk-navbar-container" uk-navbar=""  id="header">
                    <div className="uk-navbar-left">
                        <a href="" className="uk-navbar-item uk-logo">P2P Energy Network</a>
                    </div>
                    <div className="uk-navbar-right">
                        <div className="uk-navbar-item">
                            Your telegram: @{this.props.telegram_alias}
                        </div>
                        <div className="uk-navbar-item">
                            <div className="uk-button uk-button-primary" onClick={this.handle_create_offer}>Create offer</div>
                        </div>
                        <div className="uk-navbar-item">Time: {this.state.time}</div>
                    </div>


                </div>
            )
        }else{
            return (
                <div className="uk-navbar-container" uk-navbar=""  id="header">
                    <div className="uk-navbar-left">
                        <a href="" className="uk-navbar-item uk-logo">P2P Energy Network</a>
                    </div>
                    <div className="uk-navbar-right">
                        <div className="uk-navbar-item">
                            <div className="uk-button uk-button-primary" onClick={this.handle_connect_telegram}>Connect telegram</div>
                        </div>
                        <div className="uk-navbar-item">
                            <div className="uk-button uk-button-primary" onClick={this.handle_create_offer}>Create offer</div>
                        </div>

                        <div className="uk-navbar-item">Time: {this.state.time}</div>

                    </div>
                </div>
            )
        }

    }
}

export default Header
