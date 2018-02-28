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

class Error extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            solution: props.solution
        }

    }

    render () {
        return (
            <div className="uk-section uk-section-default" >
                <div className="uk-container" style={{maxWidth: 600 + 'px'}}>
                    <p className="uk-text-lead">Error occurred, don't panic, we will fix it in a minute</p>
                    <div dangerouslySetInnerHTML={{__html: this.state.message }}></div>
                    <div dangerouslySetInnerHTML={{__html: this.state.solution }}></div>
                </div>
            </div>
        )
    }
}

export default Error
