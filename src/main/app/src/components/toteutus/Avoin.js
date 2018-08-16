import React, { Component } from 'react';
import { Localizer as l } from '../../tools/Utils';
import KoulutusInfoBoxTwoSided from './KoulutusInfoBoxTwoSided';
import {translate} from 'react-i18next';
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import KoulutusSection from "../koulutus/KoulutusSection";

@translate()
@inject("hakuStore")
class Avoin extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
    }

    parseKuvaus() {
        if(this.props.koulutus && this.props.koulutus.kuvausKomoto && this.props.koulutus.kuvausKomoto.SISALTO) {
            return l.localize(this.props.koulutus.kuvausKomoto.SISALTO);
        }

        if(this.props.koulutus && this.props.koulutus.kuvausKomo && this.props.koulutus.kuvausKomo.TAVOITTEET) {
            return l.localize(this.props.koulutus.kuvausKomo.TAVOITTEET);
        }
        return "";
    }

    parseInfoBoxFieldsTwoSided() {
        const {t} = this.props;
        const fields = {};
        fields.left = this.parseInfoBoxFieldsLeft();
        fields.otsikkoLeft = t('koulutus.tiedot');
        fields.hakuajat = this.props.koulutus.hakuajatFromBackend;
        fields.otsikkoRight = t('koulutus.hae-koulutukseen');
        return fields;
    }

    parseInfoBoxFieldsLeft() {
        const {t} = this.props;
        const fields = [];
        
        fields.push([t('koulutus.opintopisteet'), this.props.koulutus.opintopisteet ? this.props.koulutus.opintopisteet : ""]);
        fields.push([t('koulutus.koulutusohjelma'), l.localize(this.props.koulutus.koulutusohjelma)]);
        fields.push([t('koulutus.opetuskielet'), this.props.koulutus.opetuskielis ? this.props.koulutus.opetuskielis.map(kieli => l.localize(kieli)) : ""]);
        fields.push([t('koulutus.suoritustavat'), this.props.koulutus.opetusPaikkas ? this.props.koulutus.opetusPaikkas.map(paikka => l.localize(paikka)): ""]);
        fields.push([t('koulutus.toimipiste'), this.props.koulutus.toimipiste ? this.props.koulutus.toimipiste : ""]);
        fields.push([t('koulutus.ajoitus'), this.props.koulutus.ajoitus ? this.props.koulutus.ajoitus : ""]);
        fields.push([t('koulutus.opetusajat'), this.props.koulutus.opetusAikas? this.props.koulutus.opetusAikas.map(aika => l.localize(aika)) : ""]);

        console.log("Kenttiä:" + fields.length)
        return fields;
    }

    render() {
        const kuvaus = this.parseKuvaus();
        return (
            <div className="col-xs-12 col-md-9 left-column">
                <ToteutusHeader komoOid={this.props.koulutus.komoOid}
                                nimi={this.props.koulutus.searchData.nimi}
                                organisaatio={this.props.koulutus.organisaatio.nimi}/>
                <KoulutusInfoBoxTwoSided fields={this.parseInfoBoxFieldsTwoSided()}/>
                <KoulutusSection content={kuvaus} header="koulutus.yleiskuvaus"/>
            </div>);
    }
}

export default Avoin;