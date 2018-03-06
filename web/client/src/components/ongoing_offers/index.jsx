
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
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    render () {

        if(this.props.is_loading){
            return (
                <div className="uk-grid uk-child-width-expand@m uk-text-center " uk-grid="">
                    <div uk-spinner=""></div>
                </div>
            )
        }else if(this.props.offers.length === 0){
            return (
                <div className="uk-grid uk-child-width-expand@m uk-text-center " uk-grid="">
                    <p className="uk-padding uk-text-muted">You don't have any on-going offers yet.</p>
                </div>
            )
        }else{
            let offers = [];
            // TODO: implement expected power consumption logic
            console.log(this.props);


            this.props.offers.map((item) => {
                let expected_power_cons = [];
                for(let i = Number(item.from); i < Number(item.to); i++){
                    expected_power_cons.push(window.usual_consumption[i%24])
                }
                let min_cons = Math.min.apply(null, expected_power_cons);
                let t = <Offer
                    key={item.id}
                    id={item.id}
                    from={item.from}
                    to={item.to}
                    expected_power_consumption={min_cons}
                    is_accepted={item.is_accepted}
                    is_started={item.is_started}
                    promisedPower={item.promisedPower}
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
                                <th>Power consumption limit</th>
                                <th>Expected reward</th>
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