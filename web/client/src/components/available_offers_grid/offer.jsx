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
import ModalSection from "./accept_offer_modal.jsx"

class Offer extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        let note = (<p>
            Created by <b>{this.props.initiator_name}</b>
        </p>);

        if(this.props.initiator === window.defaultAccount){
            note = (
                <p className="uk-text-muted">This is your offer</p>
            )
        }
        if(this.props.is_accepted){
            note = (
                <p>You are in</p>
            )
        }
        let button = <p>You can't accept this offer anymore</p>;
        if(this.props.residual_power > 0){
            button = <p className="uk-button uk-button-primary uk-align-right "
                        href={"#modal-section-" + this.props.id}
                        uk-toggle="">More</p>;
        }
        return (
            <div>
                    <div className="uk-card uk-card-hover uk-card-default uk-card-body uk-clearfix">
                        <h3 className="uk-card-title">#{this.props.id}</h3>

                        <p>
                            <b>From:</b> {this.props.from} <br/>
                            <b>To:</b> {this.props.to}<br/>
                            <b>Remaining power:</b> {this.props.residual_power} W<br/>
                            <b>Total power:</b> {this.props.total_power} W<br/>
                            <b>Total reward:</b> {this.props.total_reward/1000000000} gwei <br/>
                        </p>
                        {note}
                        <span className="uk-text-small uk-text-muted">{this.props.number_of_users} users in business</span>
                        {button}
                    </div>

                    <ModalSection
                        id={this.props.id}
                        from={this.props.from}
                        to={this.props.to}
                        residual_power={this.props.residual_power}
                        total_power={this.props.total_power}
                        total_reward={this.props.total_reward}
                        usual_power_consumption={5000}
                        parent={this}
                    />
                </div>
        )

    }
}

export default Offer