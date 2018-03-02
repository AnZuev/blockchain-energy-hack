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
import AvailableOffersGrid from '../available_offers_grid/index.jsx'
import OngoingOffers from '../ongoing_offers/index.jsx'
import History from "../history/index.jsx"


class HomePageContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:{
                available_offers: false,
                on_going_offers: false,
                history: false,
                profile: false
            },
            data:{
                available_offers: [],
                on_going_offers: [
                    {
                        id: 1,
                        from: "28.02.2018 18:00",
                        to: "28.02.2018 20:00",
                        expected_power_consumption: 4
                    },
                    {
                        id: 2,
                        from: "29.02.2018 14:00",
                        to: "29.02.2018 18:00",
                        expected_power_consumption: 3
                    }
                ],
                history: [
                    {
                        id: 1,
                        from: "28.02.2018 18:00",
                        to: "28.02.2018 20:00",
                        expected_power_consumption: 4.2,
                        real_power_consumption: 4.4,
                        reward: 0
                    },
                    {
                        id: 2,
                        from: "29.02.2018 14:00",
                        to: "29.02.2018 18:00",
                        expected_power_consumption: 5,
                        real_power_consumption: 4.4,
                        reward: 32
                    }
                ],
                profile: []
            }
        }
    }

    async componentDidMount(){
        //TODO: load everything
        await this.get_on_going_offers();
        await this.get_available_offers();
        await this.get_history();
        await this.get_profile();
        window.homepage_content = this;
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async get_on_going_offers(){
        let loading = this.state.loading;
        loading.on_going_offers = true;
        await this.setStateAsync({loading: loading});
        //TODO: loading
        loading.on_going_offers = false;
        await this.setStateAsync({loading: loading});

    }
    async get_available_offers(){
        let loading = this.state.loading;
        let data = this.state.data;
        loading.available_offers = true;
        await this.setStateAsync({loading: loading});

        try{
            let available_offers_ids = await to_promise(window.contract.getAvailableOffers, -1);
            let available_offers = [];
            console.info("Available offers loaded", available_offers);
            available_offers_ids.map(async (item) => {
                let offer = await to_promise(window.contract.getOfferInfo, item);
                available_offers.push(offer);
            })
        }catch(err){
            console.error("Error occurred while getting available offers");
            console.error(err);
        }
        //TODO: loading
        loading.available_offers = false;
        await this.setStateAsync({loading: loading, data: data});
    }
    async get_history(){
        let loading = this.state.loading;
        loading.history = true;
        await this.setStateAsync({loading: loading});
        //TODO: loading
        loading.history = false;
        await this.setStateAsync({loading: loading});
    }
    async get_profile(){
        let loading = this.state.loading;
        loading.profile = true;
        await this.setStateAsync({loading: loading});
        //TODO: loading
        loading.profile = false;
        await this.setStateAsync({loading: loading});
    }

    render () {
        return (
            <div>
                <div>
                    <div className="uk-padding">
                        <ul className="uk-tab" uk-switcher="animation: uk-animation-slide-left-medium, uk-animation-slide-right-medium">
                            <li><a href="#">On-going offers</a></li>
                            <li><a href="#">Available offers</a></li>
                            <li><a href="#">History</a></li>
                            <li><a href="#">Profile</a></li>
                        </ul>
                        <ul className="uk-switcher uk-margin">
                            <li>
                                <OngoingOffers
                                    offers={this.state.data.on_going_offers}
                                    is_loading={this.state.loading.on_going_offers}
                                />
                            </li>
                            <li>
                                <AvailableOffersGrid
                                    offers={this.state.data.available_offers}
                                    is_loading={this.state.loading.available_offers}
                                />
                            </li>
                            <li>
                                <History
                                    offers={this.state.data.history}
                                    is_loading={this.state.loading.history}
                                />
                            </li>
                            <li>
                                Profile
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default HomePageContent