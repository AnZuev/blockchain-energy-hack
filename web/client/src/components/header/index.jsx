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
                            Your telegram: {this.props.telegram_alias}
                        </div>
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
                            <div className="uk-button uk-button-primary">Connect telegram</div>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

export default Header
