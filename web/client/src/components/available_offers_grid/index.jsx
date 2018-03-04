
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

class AvailableOffersGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }


    render () {
        console.log("Rendering available offers");

        /*
         initiator: offer_list[0],
         neededPower: offer_list[1].toString(),
         promisedPower: offer_list[2].toString(),
         numOfPromisingUsers: offer_list[3].toString(),
         reward: offer_list[4].toString(),
         from: offer_list[5].toString(),
         to: offer_list[6].toString(),
         initiator_name: offer_list[7]
         */
        let offers = [];
        this.props.offers.map((item) => {
            console.log(item);
            let t = <Offer
                id={item.id.toString()}
                initiator_name={item.initiator_name.toString()}
                residual_power ={item.neededPower*1.2 - item.promisedPower}
                total_power = {item.neededPower}
                number_of_users={item.numOfPromisingUsers}
                from={item.from}
                to={item.to}
                total_reward={item.reward}
                key={item.id.toString()}
            />;
            offers.push(t);
        });
        console.log(this.props);
        console.log(offers);
        if(this.props.is_loading){
            return (
                <div className="uk-grid uk-child-width-expand@m uk-text-center " uk-grid="">
                    <div uk-spinner="">{}</div>
                    <p className="uk-padding uk-text-muted">Available offers are being loaded...</p>
                </div>
            )
        }
        if(this.props.offers.length === 0){
            return (
                <div className="uk-grid uk-child-width-expand@m  uk-text-center" uk-grid="">
                    <p className="uk-padding uk-text-muted">Available offers are going to be here very soon...</p>
                </div>
            )
        }else{
            return (
                <div className="uk-grid uk-child-width-1-3@m uk-text-left" uk-grid="">
                    {offers}
                </div>
            )
        }

    }
}

export default AvailableOffersGrid