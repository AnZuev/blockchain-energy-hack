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
                on_going_offers: [],
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
        await this.get_offers();
        await this.get_available_offers();
        await this.get_profile();
        window.homepage_content = this;
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    // for ongoing and history
    async get_offers(){
        let loading = this.state.loading;
        loading.on_going_offers = true;
        loading.history = true;
        let data = this.state.data;
        await this.setStateAsync({loading: loading});

        try{
            let offers_id = await to_promise(window.contract.getOffersByUser, {from: window.defaultAccount, gas: 3000000});
            let ongoing_offers = [];
            let history = [];
            for(let i = 0; i < offers_id.length; i++){
                let item = offers_id[i];
                let offer_list = await to_promise(window.contract.getOfferInfo, item.toString(), {from: window.defaultAccount, gas: 3000000});
                //address initiator, uint neededPower, uint promisedPower, uint numOfPromisingUsers, uint reward, uint from, uint to
                let offer = {
                    id: item.toString(),
                    initiator: offer_list[0],
                    neededPower: offer_list[1].toString(),
                    promisedPower: offer_list[2].toString(),
                    numOfPromisingUsers: offer_list[3].toString(),
                    reward: offer_list[4].toString(),
                    from: Number(offer_list[5].toString()),
                    to: Number(offer_list[6].toString()),
                    initiator_name: offer_list[7]
                };
                if(offer.to < window.time){
                    history.push(offer)
                }else{
                    let promised_power = await to_promise(window.contract.getPromisedPower, offer.id, window.defaultAccount, {from: window.defaultAccount, gas: 3000000});
                    offer.expected_power_consumption = promised_power.toString();
                    ongoing_offers.push(offer);
                }
            }
            data.on_going_offers = ongoing_offers;
            data.history = history;
            console.log(data);

        }catch(err){
            console.error("Error occurred while getting ongoing offers");
            console.error(err);
        }

        loading.on_going_offers = false;
        loading.history = false;
        await this.setStateAsync({loading: loading});

    }
    async get_available_offers(){
        let loading = this.state.loading;
        let data = this.state.data;
        loading.available_offers = true;
        await this.setStateAsync({loading: loading});

        try{
            let available_offers_ids = await to_promise(window.contract.getAvailableOffers, 0, {from: window.defaultAccount, gas: 3000000});
            let available_offers = [];
            let user_offers = [];
            this.state.data.on_going_offers.map((item) => {
                user_offers.push(item.id);
            })

            console.info("Available offers loaded", available_offers);
            for(let i = 0; i < available_offers_ids.length; i++){
                let item = available_offers_ids[i];

                let offer_list = await to_promise(window.contract.getOfferInfo, item, {from: window.defaultAccount, gas: 3000000});
                //address initiator, uint neededPower, uint promisedPower, uint numOfPromisingUsers, uint reward, uint from, uint to
                let offer = {
                    id: item,
                    initiator: offer_list[0],
                    neededPower: offer_list[1].toString(),
                    promisedPower: offer_list[2].toString(),
                    numOfPromisingUsers: offer_list[3].toString(),
                    reward: offer_list[4].toString(),
                    from: offer_list[5].toString(),
                    to: offer_list[6].toString(),
                    initiator_name: offer_list[7],
                    is_accepted: false
                };
                if(user_offers.indexOf(item) >= 0){
                    offer.is_accepted = true;
                }
                available_offers.push(offer);
            }
            data.available_offers = available_offers;

        }catch(err){
            console.error("Error occurred while getting available offers");
            console.error(err);
        }
        //TODO: loading
        loading.available_offers = false;
        await this.setStateAsync({loading: loading, data: data});
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