import React, { Component } from 'react';
import Hakurajain from './Hakurajain';
import {observer, inject} from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import {translate} from 'react-i18next';
import Media from 'react-media';
import '../../assets/styles/components/_hakupalkki.scss';

@translate()
@inject ("hakuehtoStore")
@observer
class Hakupalkki extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event.target.value) {
            this.props.hakuehtoStore.keyword = event.target.value
        } else {
            this.props.hakuehtoStore.keyword = ''
        }
    }

    handleSubmit(event) {
        this.handleChange(event);
        event.preventDefault();
        this.props.hakuehtoStore.closeRajain();
        this.props.history.push(this.props.hakuehtoStore.createHakuUrl);
    }

    closeRajain() {
        this.props.hakuehtoStore.closeRajain();
    }

    render() {
        const {t} = this.props;
        const link = '/haku/' + this.props.hakuehtoStore.keyword;
        const search = this.props.hakuehtoStore.searchParams;
        const value = this.props.hakuehtoStore.keyword ? this.props.hakuehtoStore.keyword : '';
        return (
            <React.Fragment>
                <div className="container-fluid" id={this.props.main ? "call-to-action" : "call-to-action-secondary"}>
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className={"col-12 header-search" + (this.props.main ? " main" : "")}>
                                    <div className="search">
                                        <input id="regular-input" className="oph-input" aia-label={t('haku.kehoite')} type="search"
                                               placeholder={t('haku.kehoite')}
                                               value={value}
                                               onChange={this.handleChange}
                                               onKeyPress={(e) => { if(e.key === 'Enter'){ this.handleSubmit(e)}}}/>
                                        <Link role="button" aria-label={t('haku.etsi')} to={{
                                            pathname: link,
                                            search: search
                                        }} className="search-button" onClick={() => {this.closeRajain()}}>
                                            <Media query="(max-width: 768px)">
                                             {
                                                 matches => matches ? ("") : (t('haku.etsi'))
                                             }
                                            </Media>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Hakurajain shareVisibility={this.props.isRajainVisible}/>
            </React.Fragment>
        );
    }
}

export default withRouter(Hakupalkki);
