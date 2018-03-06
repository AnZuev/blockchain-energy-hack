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

class Offer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_succeed: false
        }
    }

    async componentDidMount(){
        await this.get_status();
    }

    async get_status(){
        console.log("Getting status for the history offer with id", this.props.id);
        try{
            let result = await to_promise(window.contract.checkUserCons, window.defaultAccount, this.props.id, {
                from: window.defaultAccount,
                gas: 30000000
            });
            console.log(result);
            if(result){
                this.setState({
                    is_succeed: true
                })
            }
        }catch(err){
            console.error("An error has occurred while getting info about history offer with id", this.props.id);
            console.error(err);
        }
        console.log("Getting status of the history offer is finished");
    }

    render () {
        console.log(this.props);
        let status;
        if(this.state.is_succeed){
            status = <td className="uk-text-success">Succeed</td>
        }else{
            status = <td className="uk-text-danger">Failed</td>
        }

        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.from}</td>
                <td>{this.props.to}</td>
                <td>{this.props.reward*this.props.promised_power} gwei</td>
                {status}
            </tr>
        )
    }
}

export default Offer


