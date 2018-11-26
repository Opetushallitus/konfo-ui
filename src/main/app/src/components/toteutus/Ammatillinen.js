import React, { Component } from 'react';
import ToteutusInfoBox from './ToteutusInfoBox';
import { Localizer as l } from '../../tools/Utils';
import {translate} from 'react-i18next'
import {inject} from "mobx-react";
import ToteutusHeader from "./ToteutusHeader";
import SlideDropdown from '../common/SlideDropdown';
import ToteutusSidebar from "./ToteutusSidebar";

@translate()
@inject("hakuStore")
class Ammatillinen extends Component {

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
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
        // laajuus, kesto, maksullinen, tutkintonimike
        const opintojenLaajuusarvo = l.localize(this.props.koulutus.opintojenLaajuusarvo, '-');
        const opintojenLaajuusyksikko = l.localize(this.props.koulutus.opintojenLaajuusyksikko);
        fields.push([t('koulutus.laajuus'), opintojenLaajuusarvo && (opintojenLaajuusarvo + " " + opintojenLaajuusyksikko)]);
        const suunniteltuKesto = this.props.koulutus.suunniteltuKestoArvo;
        const suunniteltuKestoTyyppi = l.localize(this.props.koulutus.suunniteltuKestoTyyppi);
        fields.push([t('koulutus.kesto'), suunniteltuKesto + " " + suunniteltuKestoTyyppi]);

        fields.push([t('koulutus.maksullinen'), this.props.koulutus.opintojenMaksullisuus ? t('kyllä') : t('ei')]);
        fields.push([t('koulutus.tutkintonimikkeet'), this.props.koulutus.tutkintonimikes ? this.props.koulutus.tutkintonimikes.map(t => l.localize(t) + " ") : '-']);

        return fields;
    }

    render() {
        const osaamisalat = l.localize(this.props.koulutus.koulutusohjelma, undefined);
        const tutkinnonOsat = l.localize(this.props.koulutus.kuvausKomo.KOULUTUKSEN_RAKENNE, undefined);
        const erikoistumisalat = l.localize(this.props.koulutus.kuvausKomo.TAVOITTEET, undefined);
        const {t} = this.props;
        return (
            <React.Fragment>
                <div className="col-12 col-md-12 col-lg-8 col-xl-9 left-column">
                    <ToteutusHeader komoOid={this.props.koulutus.komoOid}
                                    nimi={this.props.koulutus.searchData.nimi}
                                    organisaatio={this.props.koulutus.organisaatio.nimi}/>
                    <ToteutusInfoBox fields={this.parseInfoBoxFieldsTwoSided()}/>
                    {osaamisalat && 
                        <SlideDropdown toteutus={true} content={osaamisalat} title={t('koulutus.osaamisalat')}/>
                    }
                    {tutkinnonOsat &&
                        <SlideDropdown toteutus={true} content={tutkinnonOsat} title="Koulutuksen sisältö ja tavoitteet"/>
                    }
                    {erikoistumisalat &&
                        <SlideDropdown toteutus={true} content={erikoistumisalat} title="Pääaineen tai erikoistumisalan valinta"/>
                    }
                </div>
                <ToteutusSidebar organisaatio={this.props.organisaatio} koulutus={this.props.koulutus} educationType={this.educationType}/>
            </React.Fragment>
        );
    }
}

export default Ammatillinen;