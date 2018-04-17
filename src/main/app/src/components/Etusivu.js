import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Etusivu extends Component {

    constructor(props) {
        super(props);
        super(props);
        this.state = { keyword : '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({keyword: event.target.value});
    }

    render() {
        return (
            <div class="container-fluid" id="call-to-action">
                <div class="jumbotron">
                    <div class="container">
                        <div class="row">
                            <div class="col-xs-12 col-md-8 header-search main">
                                <div class="search">
                                    <input id="regular-input" class="oph-input" type="text" placeholder="Etsi ja vertaile koulutuksia ja oppilaitoksia" onChange={this.handleChange}/>
                                    <Link to={{ pathname: '/haku', state: this.state }} class="search-button"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Etusivu;