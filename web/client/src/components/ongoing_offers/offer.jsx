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

class Offer extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        // TODO: implement it
        // if started - uk-text-success
        // otherwise no class is required
        let status = <td className="">Not started</td>

        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.from}</td>
                <td>{this.props.to}</td>
                <td>{this.props.expected_power_consumption} kW</td>
                {status}
            </tr>
        )
    }
}

export default Offer


/*
 <div className="uk-width-1-3">
 <div className="uk-card uk-card-hover uk-card-default uk-card-body uk-clearfix">
 <h3 className="uk-card-title">#{this.props.id}</h3>
 <p>
 {this.props.description}
 </p>
 <p>
 <b>From:</b> {this.props.from} <br/>
 <b>To:</b> {this.props.to}<br/>
 <b>Residual power:</b> {this.props.residual_power} kW<br/>
 <b>Total power:</b> {this.props.total_power} kW<br/>
 <b>Total reward:</b> {this.props.total_reward} wei
 </p>
 <span className="uk-text-small uk-text-muted">{this.props.number_of_users} users in business</span>
 <p className="uk-button uk-button-primary uk-align-right "
 href={"#modal-section-" + this.props.id}
 uk-toggle="">More</p>
 </div>


 </div>
 */