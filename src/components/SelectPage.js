import React from 'react';
import {withRouter} from 'react-router';
import Chips from 'react-chips';

import { fetchTopics, updateTopics } from '../actions/api';

class SelectPageComponent extends React.Component {

    constructor() {
        super();

        if(!(sessionStorage.getItem('token'))) {
            this.props.history.push('/');
        }

        this.state = {
            chips: [],
            chipset: [],

        };

        // Call Fetch Topics
        fetchTopics()
            .then(response => this.setState({ ...this.state, chipset: response }));
    }

    onChange = chips => {
        this.setState({ chips });
    }

    handleSubmit() {
        let selection = [];
        selection = this.state.chipset.filter(x => this.state.chips.indexOf(x.name) > -1);
        updateTopics({topic_ids: selection.map(x => x.id)})
            .then(response => {
                if (response.status === 200) {
                    this.props.history.push('/read');
                }
            });
    }

    render() {
        return (
            <div className="container">
                <div className="login-card">
                    <div className="login-card-content">
                        <h1 className="app-name">The Daily Fool</h1>
                        <div className="login-form">
                            <h5 className="mb-5 select-interests">Select your Interests</h5>
                            <Chips
                                value={this.state.chips}
                                onChange={this.onChange}
                                suggestions={this.state.chipset.map(x => x.name)}
                            />
                        </div>
                        <div className="mt-4 mb-4 ml-auto mr-auto">
                            <button onClick={() => this.handleSubmit()} className="login-button button btn-primary">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (withRouter)(SelectPageComponent);