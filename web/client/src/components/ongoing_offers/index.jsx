
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
import Offer from "./offer.jsx"

class OngoingOffers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            no_offers: this.props.offers.length === 0
        }
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    render () {

        if(this.props.is_loading){
            return (
                <div className="uk-child-width-expand@m uk-text-center ">
                    <div uk-spinner=""></div>
                    <p className="uk-padding uk-text-muted">Future offers that you have accepted are being loaded...</p>
                </div>
            )
        }
        if(this.state.no_offers){
            return (
                <div className="uk-child-width-expand@m uk-text-center ">
                    <p className="uk-padding uk-text-muted">You don't have any on-going offers yet.</p>
                </div>
            )
        }else{
            let offers = [];
            // TODO: how to computer expected reward (depends on smart contract)
            this.props.offers.map((item) => {
                let t = <Offer
                    key={item.id}
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    expected_power_consumption={item.expected_power_consumption}
                />;
                offers.push(t);
            });
            return (
                <div className="uk-width-3-5">
                    <table className="uk-table uk-table-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Power consumption limit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers}
                        </tbody>
                    </table>
                </div>)
        }

    }
}

export default OngoingOffers