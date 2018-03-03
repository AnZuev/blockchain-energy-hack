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
        return (
            <div>
                    <div className="uk-card uk-card-hover uk-card-default uk-card-body uk-clearfix">
                        <h3 className="uk-card-title">#{this.props.id}</h3>

                        <p>
                            <b>From:</b> {this.props.from} <br/>
                            <b>To:</b> {this.props.to}<br/>
                            <b>Residual power:</b> {this.props.residual_power} kW<br/>
                            <b>Total power:</b> {this.props.total_power} kW<br/>
                            <b>Total reward:</b> {this.props.total_reward} wei <br/>
                            Created by <b>{this.props.initiator_name}</b>

                        </p>
                        <span className="uk-text-small uk-text-muted">{this.props.number_of_users} users in business</span>
                        <p className="uk-button uk-button-primary uk-align-right "
                           href={"#modal-section-" + this.props.id}
                           uk-toggle="">More</p>
                    </div>

                    <ModalSection
                        id={this.props.id}
                        from={this.props.from}
                        to={this.props.to}
                        residual_power={this.props.residual_power}
                        total_power={this.props.residual_power}
                        total_reward={this.props.total_reward}
                        usual_power_consumption={5}
                        parent={this}
                    />
                </div>
        )

    }
}

export default Offer