
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

class HistoryOffers extends React.Component {
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
                <div className="uk-child-width-expand@m uk-text-center " uk-grid="">
                    <div uk-spinner=""></div>
                    <p className="uk-padding uk-text-muted">History is being loaded...</p>
                </div>
            )
        }
        if(this.state.no_offers){
            return (
                <div className="uk-child-width-expand@m uk-text-center " uk-grid="">
                    <p className="uk-padding uk-text-muted">You haven't finished any offer yet. May be it's time to choose one?</p>
                </div>
            )
        }else{
            let offers = [];
            this.props.offers.map((item) => {
                let t = <Offer
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    expected_power_consumption={item.expected_power_consumption}
                    real_power_consumption={item.real_power_consumption}
                    reward={item.reward}
                />;
                offers.push(t);
            });
            return (
                <div className="uk-width-4-5">
                    <table className="uk-table uk-table-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Expected power consumption limit</th>
                                <th>Real power consumption limit</th>
                                <th>Reward</th>
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

export default HistoryOffers