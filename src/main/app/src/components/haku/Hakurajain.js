import React, { Component } from 'react';
import Hakurajainvalinta from './Hakurajainvalinta';
import {observer, inject} from 'mobx-react';

@inject ("hakuStore")
@observer
class Hakurajain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rajainOpen: false,
            filterChanged: false
        }
    }

    handleKoulutusChange(filter) {
        if (filter) {
            if (this.props.hakuStore.filterKoulutus.indexOf(filter) === -1) {
                this.props.hakuStore.filterKoulutus.push(filter);
            } else {
                this.props.hakuStore.filterKoulutus
                    = this.props.hakuStore.filterKoulutus.filter((i) => i !== filter);
            }
            this.setState({filterChanged: true});
        }
    }

    handleKieliChange(filter) {
        if (filter) {
            if (this.props.hakuStore.filterKieli.indexOf(filter) === -1) {
                this.props.hakuStore.filterKieli.push(filter);
            } else {
                this.props.hakuStore.filterKieli
                    = this.props.hakuStore.filterKieli.filter((i) => i !== filter);
            }
            this.setState({filterChanged: true});
        }
    }

    handlePaikkakuntaChange(str) {
        this.props.hakuStore.filterPaikkakunta = str;
        this.setState({
            filterChanged: true,
        });
    }

    handleSubmit() {
        if (this.state.filterChanged) {
            this.setState({
                filterChanged: false,
                rajainOpen: false
            });
            this.props.filterAction();
        }
    }

    clearFilters() {
        if (this.props.hakuStore.filterSet) {
            this.props.hakuStore.filterKoulutus = [];
            this.props.hakuStore.filterPaikkakunta = "";
            this.setState({
                filterChanged: false,
                rajainOpen: false
            });
            this.props.filterAction();
        }
    }

    toggleRajain() {
        this.setState({rajainOpen: !this.state.rajainOpen});
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-xs-12">
                    <div className={"filter-button " + (this.state.rajainOpen ? "sulje" : "")} onClick={() => this.toggleRajain()} role="button">
                    </div>
                </div>
                {this.state.rajainOpen &&
                <div className="filters-layer">
                    <div className="filter-container open">
                        <div className="filter-options">
                            <div className="filters-main">
                                <div className="form-group">
                                    <h5>Koulutustyyppi</h5>
                                    <Hakurajainvalinta text="Lukio" checked={this.props.hakuStore.filterKoulutus.indexOf('lk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('lk')} color="1"/>
                                    <Hakurajainvalinta text="Ammatilliset tutkinnot" checked={this.props.hakuStore.filterKoulutus.indexOf('amm') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('amm')} color="2"/>
                                    <Hakurajainvalinta text="Korkeakoulut" checked={this.props.hakuStore.filterKoulutus.indexOf('kk') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('kk')} color="3"/>
                                    <Hakurajainvalinta text="Muut kurssit ja koulutukset" checked={this.props.hakuStore.filterKoulutus.indexOf('muu') !== -1}
                                                       handleChange={() => this.handleKoulutusChange('muu')} color="5"/>
                                </div>
                                <div className="form-group">
                                    <h5>Opetuskieli</h5>
                                    <Hakurajainvalinta text="Suomi" checked={this.props.hakuStore.filterKieli.indexOf('fi') !== -1}
                                                       handleChange={() => this.handleKieliChange('fi')}/>
                                    <Hakurajainvalinta text="Ruotsi" checked={this.props.hakuStore.filterKieli.indexOf('sv') !== -1}
                                                       handleChange={() => this.handleKieliChange('sv')}/>
                                    <Hakurajainvalinta text="Englanti" checked={this.props.hakuStore.filterKieli.indexOf('en') !== -1}
                                                       handleChange={() => this.handleKieliChange('en')}/>
                                </div>
                                <div className="form-group">
                                    <h5 className="filter-title">Paikkakunta</h5>
                                    <input className="oph-input" type="text" placeholder="Syötä paikkakunnan nimi"
                                           onChange={(e) =>this.handlePaikkakuntaChange(e.target.value)}
                                           defaultValue={this.props.hakuStore.filterPaikkakunta}
                                           onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit()}}}/>
                                </div>
                                <div className="form-group action-buttons">
                                    <a className="btn btn-primary" onClick={() => this.handleSubmit()}>HAE</a>
                                    <a className="clear-compare" onClick={() => this.clearFilters()}>Poista rajaukset</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </React.Fragment>
        );
    }
}

export default Hakurajain;