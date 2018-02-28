import React from 'react';
import {render} from 'react-dom';
import NewUserForm from '../components/new_user_form/index.jsx'
import Header from '../components/header/index.jsx'
import Error from "../components/error/index.jsx"
import HomePageContent from "../components/homepage_content/index.jsx"


class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checks: {
                is_metamask_installed: HomePage.check_metamask_installation(),
                is_network_id_is_correct: HomePage.check_network_id(),
                is_a_new_user_on_smart_contract: HomePage.check_user_existence_on_smart_contract(),
                is_a_new_user_on_server: false
            },
            user_data:{
                from_backend: null
            }
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        await this.update();
        window.homepage = this;
    }

    async update(){

        let user_info = await this.get_user_info_from_backend();
        if(user_info.code === 200){
            let checks = this.state.checks;
            checks.is_a_new_user_on_server = false;
            let user_data = this.state.user_data;
            user_data.from_backend = user_info.result;

            await this.setStateAsync({
                checks: checks,
                user_data: user_data
            });
        }else{
            let checks = this.state.checks;
            checks.is_a_new_user_on_server = true;

            await this.setStateAsync({
                checks: checks
            });
        }
    }


    static check_metamask_installation(){
        return window.web3_instance !== null
    }

    static check_network_id(){
        if(window.web3_instance){
            // Kovan test net has id 42
            return window.web3_instance.version.network === '42'
        }
        return false
    }

    static check_user_existence_on_smart_contract(){
        // true if there is a user
        // otherwise false
        if (HomePage.check_metamask_installation() && HomePage.check_network_id()){
            //TODO: load data from smart contract
            return true
        }
        return true
    }

    async get_user_info_from_backend(){
        if (HomePage.check_metamask_installation() && HomePage.check_network_id()){
            let url = "/api/get_user?address=" + window.web3_instance.eth.defaultAccount;
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
                return(
                    <div>
                        <Header
                            is_a_new_user={this.state.checks.is_a_new_user_on_server}
                            is_telegram_connected={this.state.user_data.from_backend.telegram !== null}
                            telegram_alias={this.state.user_data.from_backend.telegram.alias}
                        />
                        <HomePageContent/>
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
        return <div>Return </div>

    }
}


render(<HomePage/>, document.getElementById('app'));