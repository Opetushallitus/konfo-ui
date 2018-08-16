import React, { Component } from 'react';
import Hakunavigaatio from '../hakutulos/Hakunavigaatio';
import {observer, inject} from 'mobx-react';
import OskariKartta from "./OskariKartta";
import renderHTML from 'react-render-html';
import {translate} from 'react-i18next';
import { Localizer as l } from "../../tools/Utils";


@inject("restStore")
@inject("navigaatioStore")
@translate()
@observer
class Oppilaitos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oppilaitos: undefined
        };
    }

    async componentDidMount() {
        await this.getOppilaitosTiedot();
    }

    async componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        await this.getOppilaitosTiedot();
    }

    getOppilaitosTiedot() {
        this.props.navigaatioStore.setOid(this.props.match.params.oid);
        this.props.restStore.getOppilaitos(this.props.navigaatioStore.oid, (o) => {
            this.setState({
                oppilaitos: o
            })
        });
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getEmailFromYhteystiedot() {
        const data = this.state.oppilaitos.yhteystiedot;

        for (let row in data){
            if (row.email) {
                return row.email;
            }
        }
        return this.props.t("oppilaitos.ei-sähköpostiosoitetta");
    }

    //Todo: Selvitä, onko tämä ylipäänsä järkevää
    getPuhelinFromYhteystiedot() {
        const data = this.state.oppilaitos.yhteystiedot;

        for (let row in data){
            if(row.tyyppi === "puhelin" && row.numero) {
                return this.props.t("oppilaitos.puhelin") + ": " + row.numero;
            }
        }
        return "";
    }

    getKotisivuFromYhteystiedot() {
        const data = this.state.oppilaitos.yhteystiedot;

        for (let row in data){
            if(row.www) {
                return (
                    <a href={row.www}><i className='fa fa-external-link'> </i>{this.props.t('oppilaitos.verkkosivu')}</a>
                )
            }
        }
        return "";
    }

    parseKayntiOsoite() {
        const t = this.props.t;
        if(!this.state.oppilaitos.kayntiosoite) {
            return null;
        }
        return (<div><ul>
            <li><i>{t("oppilaitos.käyntiosoite")}</i></li>
            <li>{this.state.oppilaitos.kayntiosoite.osoite ? this.state.oppilaitos.kayntiosoite.osoite : t("oppilaitos.ei-käyntiosoitetta")}</li>
            <li>{this.state.oppilaitos.kayntiosoite.postinumeroUri ? this.state.oppilaitos.kayntiosoite.postinumeroUri+" " : t("oppilaitos.ei-postinumeroa")}
                {this.state.oppilaitos.kayntiosoite.postitoimipaikka ? this.state.oppilaitos.kayntiosoite.postitoimipaikka : t("oppilaitos.ei-postitoimipaikkaa")}</li>
        </ul>
        </div>);
    }

    parsePostiOsoite() {
        const t = this.props.t;
        if(!this.state.oppilaitos.postiosoite) {
            return null;
        }
        return (<div><ul>
            <li><i>{t("oppilaitos.postiosoite")}</i></li>
            <li>{this.state.oppilaitos.postiosoite.osoite ? this.state.oppilaitos.postiosoite.osoite : t("oppilaitos.ei-käyntiosoitetta")}</li>
            <li>{this.state.oppilaitos.postiosoite.postinumeroUri ? this.state.oppilaitos.postiosoite.postinumeroUri+" " : t("oppilaitos.ei-postinumeroa")}
            {this.state.oppilaitos.postiosoite.postitoimipaikka ? this.state.oppilaitos.postiosoite.postitoimipaikka : t("oppilaitos.ei-postitoimipaikkaa")}</li>
        </ul>
        </div>);
    }

    safeParseYleiskuvaus() {
        const data = this.state.oppilaitos;
        const kieli = l.getLanguage();
        if(data && data.yleiskuvaus && data.yleiskuvaus["kieli_" + kieli + "#1"])
            return <div>{renderHTML(data.yleiskuvaus["kieli_" + kieli + "#1"])}</div>
        return "";
    }

    parseSome() {
        if (!this.state.oppilaitos.metadata || !this.state.oppilaitos.metadata.data)  {
            return <div className='social'/>;
        }
        const data = this.state.oppilaitos.metadata.data;
        let fb = "";
        let twitter = "";
        let insta = "";

        for (let i = 1; i < 10; i++) {
            const key = "sosiaalinenmedia_"+i+"#1";
            if(data[key]) {
                const k = data[key];
                const kieli = "kieli_" + l.getLanguage() + "#1";
                if(k[kieli]) {
                    if(k[kieli].indexOf('facebook') !== -1 ) {
                        fb = <li><a href={k[kieli]}><i className='fa fa-facebook-square fa-3x' /></a></li>
                    } else if (k[kieli].indexOf('twitter') !== -1) {
                        twitter = <li><a href={k[kieli]}><i className='fa fa-twitter-square fa-3x' /></a></li>
                    } else if (k[kieli].indexOf('instagram') !== -1) {
                        insta = <li><a href={k[kieli]}><i className='fa fa-instagram fa-3x' /></a></li>
                    }
                }

            }
        }
        return (
            <ul className='social'>
                {fb}
                {twitter}
                {insta}
            </ul>
        )

        //<img className='fb-icon' src={fbIcon} alt={"Facebook"}/>
        //<img className='twitter-icon' src={twitterIcon} alt={"Facebook"}/>
        //<img className='insta-icon' src={instaIcon} alt={"Facebook"}/>
    }

    luoKarttaJosOsoiteTiedossa() {
        const data = this.state.oppilaitos.kayntiosoite;
        if(data && data.osoite && data.postitoimipaikka) {
            return <OskariKartta osoite={data.osoite} postitoimipaikka={data.postitoimipaikka} />;
        }
        return null;
    }

    render() {
        if(!this.state.oppilaitos) {
            return null;
        }
        return (
            <React.Fragment>
                <div className='container'>
                    <div className='row info-page oppilaitos'>
                        <div className='col-xs-12 col-md-9 left-column'>
                            <h1 className='header'><i className='fa fa-circle'></i>{l.localize(this.state.oppilaitos.nimi, "", "fi")}</h1>
                            <div className='oppilaitos-yleiskuvaus'>
                                <div>{this.safeParseYleiskuvaus()}</div>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-3 right-column row-eq-height">
                            <div className='orgaanisaatio-yhteystiedot'>
                                <div className='col-md-12'>
                                    {this.parseKayntiOsoite()}
                                </div>
                                <div className='col-md-12'>
                                    {this.parsePostiOsoite()}
                                </div>
                                <div className='col-md-12'>
                                    <ul>
                                        <li>{this.getEmailFromYhteystiedot()}</li>
                                        <li>{this.getPuhelinFromYhteystiedot()}</li>
                                    </ul>
                                </div>
                                <div className='col-md-12'>
                                    {this.getKotisivuFromYhteystiedot()}
                                </div>
                                <div className='sosiaalinen-media col-md-12'>
                                    {this.parseSome()}
                                </div>
                                <div>
                                    {this.luoKarttaJosOsoiteTiedossa()}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <Hakunavigaatio/>
            </React.Fragment>
        );
    }
}

export default Oppilaitos;