
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
        let offers = [];
        for(let i = 0; i < 5; i++){
            let id = 100 + i;
            let descr = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
             sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.`;

            let t = <Offer
                id={id}
                description={descr}
                residual_power ={20}
                total_power = {35}
                number_of_users={2 + (i%4)*2}
                from="25.02.2018 16:00"
                to="25.02.2017 18:00"
                total_reward={500}
                key={id}
            />;
            offers.push(t)
        }
        if(this.props.is_loading){
            return (
                <div className="uk-child-width-expand@m uk-text-center " uk-grid="">
                    <div uk-spinner=""></div>
                    <p className="uk-padding uk-text-muted">Available offers are being loaded...</p>
                </div>
            )
        }
        if(this.state.no_offers){
            return (
                <div className="uk-child-width-expand@m uk-text-center " uk-grid="">
                    <p className="uk-padding uk-text-muted">Available offers are going to be here very soon...</p>
                </div>
            )
        }else{
            return (
                <div className="uk-child-width-expand@m uk-text-left " uk-grid="">
                    {offers}
                </div>
            )
        }

    }
}

export default AvailableOffersGrid