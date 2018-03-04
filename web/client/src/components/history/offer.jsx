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
        let status;
        if(this.props.real_power_consumption - this.props.expected_power_consumption <= 0){
            status = <td className="uk-text-success">Succeed</td>
        }else{
            status = <td className="uk-text-danger">Failed</td>
        }

        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.from}</td>
                <td>{this.props.to}</td>
                <td>{this.props.expected_power_consumption} W</td>
                <td>{this.props.real_power_consumption} W</td>
                <td>{this.props.reward} gwei</td>
                {status}
            </tr>
        )
    }
}

export default Offer


