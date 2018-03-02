import React from 'react';
import {render} from 'react-dom';
import NewUserForm from '../components/new_user_form/index.jsx'
import Header from '../components/header/index.jsx'
import Error from "../components/error/index.jsx"
import HomePageContent from "../components/homepage_content/index.jsx"
import CreateOfferForm from "../components/create_offer_form/index.jsx"



class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checks: {
                is_metamask_installed: HomePage.check_metamask_installation(),
                is_network_id_is_correct: HomePage.check_network_id(),
                is_a_new_user_on_smart_contract: true,
                is_a_new_user_on_server: false
            },
            user_data:{
                from_backend: null,
                from_smart_contract: null
            },
            show_create_offer: false
        };
    }

    async load_contract_abi(){
        let url = "/api/get_contract";
        let response = await fetch(url);
        let json_response = await response.json();
        let contract_abi = json_response.result.contract.abi;
        let contract_address = json_response.result.address;
        window.contract = window.web3.eth.contract(contract_abi).at(contract_address);
        console.log("Contract has been loaded");
    }

    show_create_offer(){
        this.state.show_create_offer = true;
    }

    hide_create_offer(){
        this.state.show_create_offer = false;
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        await this.load_contract_abi();
        await this.update();
        window.homepage = this;
    }

    async update(){
        let is_a_new_user_on_smart_contract;
        try{
             is_a_new_user_on_smart_contract = await HomePage.check_user_existence_on_smart_contract();
        }catch (err){
            console.log(err);
            return;
        }
        let user_info = await this.get_user_info_from_backend();
        if(user_info.code === 200){
            let checks = this.state.checks;
            checks.is_a_new_user_on_server = false;
            checks.is_a_new_user_on_smart_contract = is_a_new_user_on_smart_contract;
            let user_data = this.state.user_data;
            user_data.from_backend = user_info.result;
            let wei = await to_promise(window.web3.eth.getBalance, window.defaultAccount);
            user_data.balance = window.web3.fromWei(wei.toString(), 'ether');
            user_data.address = window.defaultAccount;
            await this.setStateAsync({
                checks: checks,
                user_data: user_data
            });
        }else{
            let checks = this.state.checks;
            checks.is_a_new_user_on_server = true;
            checks.is_a_new_user_on_smart_contract = is_a_new_user_on_smart_contract;
            await this.setStateAsync({
                checks: checks
            });
        }
    }

    static check_metamask_installation(){
        return window.web3_instance !== null
    }

    static check_network_id(){
        if(window.web3){
            // Kovan test net has id 42
            //return window.web3_instance.version.network === '42'
            return true;
        }
        return false
    }

    static async check_user_existence_on_smart_contract(){
        // true if there is a user
        // otherwise false
        if (HomePage.check_metamask_installation() && HomePage.check_network_id()) {
            //TODO: load data from smart contract
            return (await to_promise(window.contract.checkUserExistence));
        }
        return false
    }

    async get_user_info_from_backend(){
        if (HomePage.check_metamask_installation() && HomePage.check_network_id()){
            let url = "/api/get_user?address=" + window.web3.eth.defaultAccount;
            let response = await fetch(url);
            return await response.json();
        }
        return {error: true, code: 404, result: null}
    }

    render () {


        if(!this.state.checks.is_metamask_installed){
            return (
                <div>
                    <Header
                        is_a_new_user={this.state.checks.is_a_new_user_on_server}
                    />
                    <Error
                        message = "It seems that you don't have plugin MetaMask in your Google Chrome Browser"
                        solution = "To fix this issue you just need to download it <a href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'>here</a>"
                    />
                </div>
            )
        }
        if(!this.state.checks.is_network_id_is_correct){
            return (
                <div>
                    <Header
                        is_a_new_user={this.state.checks.is_a_new_user_on_server}
                    />
                    <Error
                        message = "It seems that you are connected to Kovan Test Network."
                        solution = "Just change the network to Kovan Test Network in MetaMask:)"
                    />
                </div>
            )
        }
        if(this.state.checks.is_a_new_user_on_server){
            return(
                <div>
                    <Header
                        is_a_new_user={this.state.checks.is_a_new_user_on_server}
                        is_telegram_connected={false}
                    />
                    <NewUserForm/>
                </div>
            )
        }
        if (this.state.user_data.from_backend){
            if(this.state.user_data.from_backend.telegram){
                if(this.state.show_create_offer){
                    return(
                        <div>
                            <Header
                                is_a_new_user={this.state.checks.is_a_new_user_on_server}
                                is_telegram_connected={this.state.user_data.from_backend.telegram !== null}
                                telegram_alias={this.state.user_data.from_backend.telegram.alias}
                            />
                            <CreateOfferForm/>
                        </div>
                    )
                }else{
                    return (
                        <div>
                            <Header
                                is_a_new_user={this.state.checks.is_a_new_user_on_server}
                                is_telegram_connected={this.state.user_data.from_backend.telegram !== null}
                                telegram_alias={this.state.user_data.from_backend.telegram.alias}
                            />
                            <HomePageContent/>
                        </div>
                    )
                }

            }else{
                if(this.state.show_create_offer){
                    return(
                        <div>
                            <Header
                                is_a_new_user={this.state.checks.is_a_new_user_on_server}
                                is_telegram_connected={this.state.user_data.from_backend.telegram !== null}
                                telegram_alias={this.state.user_data.from_backend.telegram.alias}
                            />
                            <CreateOfferForm/>
                        </div>
                    )
                }else{
                    return(
                        <div>
                            <Header
                                is_a_new_user={this.state.checks.is_a_new_user_on_server}
                                is_telegram_connected={this.state.user_data.from_backend.telegram !== null}
                            />
                            <HomePageContent/>
                        </div>
                    )
                }

            }
        }
        return <div>Return </div>

    }
}


render(<HomePage/>, document.getElementById('app'));