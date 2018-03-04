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

class ModalSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            range_value: 1000,
            expected_power_consumption: Math.round((this.props.usual_power_consumption - 1) * 100)/100,
            error_message: "",
            loading: false
        };
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async handleSubmit(event){
        // TODO: make request to our smartcontract
        event.persist();
        console.log("ModalSection handle submit called");
        await this.setStateAsync({loading: true});
        let close_button = event.target.parentNode.firstChild;


        await to_promise(window.contract.respondToOffer, Number(this.props.id), this.state.range_value, {from: window.defaultAccount, gas: 3000000});
        await this.setStateAsync({loading: false});
        UIkit.notification({
            message: 'You can find your offer in On-Going offers',
            timeout: 5000,
            status: 'success',
            pos: 'bottom-center'
        });
        close_button.click();
        await window.homepage_content.get_offers();

    }

    handleRangeChange(event) {
        let expected_power_consumption = Math.round((this.props.usual_power_consumption - event.target.value) * 100)/100;
        let error_message = " ";
        if (expected_power_consumption < 1000){
            error_message = "We hope you know what you are doing...";
            if(expected_power_consumption <= 0){
                expected_power_consumption = 0;
                error_message = "No energy consumption. Well done...";
            }
        }
        this.setState({
            range_value: event.target.value,
            expected_power_consumption: expected_power_consumption,
            error_message: error_message
        });
    }
    render () {
        let body = (
            <div className="uk-modal-body">
                <p>
                    <b>From:</b> {this.props.from} <br/>
                    <b>To:</b> {this.props.to}<br/>
                </p>
                <div className="uk-margin">
                    <p>How much would you like to reduce power consumption for?</p>
                    <input className="uk-range"
                           onChange={this.handleRangeChange}
                           type="range"
                           defaultValue={this.state.range_value}
                           min="0"
                           max={this.props.usual_power_consumption}
                           step="20"

                    />
                    <p className="uk-text">
                        <b>Power reduce: </b>{this.state.range_value} W <br/>
                        <b>Expected power consumption: </b>{this.state.expected_power_consumption} W <br/>
                        <b>Expected reward: </b>{Math.round(this.props.total_reward * this.state.range_value/this.props.total_power/1000000000)} gwei <br/>
                        <span className="uk-text-danger">{this.state.error_message}</span>
                    </p>
                </div>
            </div>);

        let footer = (
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>Accept</button>
            </div>);
        if(this.state.loading) {
            footer = (<div className="uk-modal-footer uk-text-right uk-hidden">
                <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>Accept</button>
            </div>);
            body = (<div className="uk-modal-body uk-text-center">
                <div uk-spinner=""></div>
                <p className="uk-text-muted">Accepting offer...</p>
            </div>)
        }
        return (
            <div id={"modal-section-" + this.props.id} uk-modal="">
                <div className="uk-modal-dialog">
                    <button className="uk-modal-close-default" type="button" uk-close="" ></button>
                    <div className="uk-modal-header">
                        <h2 className="uk-modal-title">#{this.props.id}</h2>
                    </div>
                    {body}
                    {footer}
                </div>
            </div>
        )

    }
}

export default ModalSection