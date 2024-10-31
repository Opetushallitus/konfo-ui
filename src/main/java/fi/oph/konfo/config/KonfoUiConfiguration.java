package fi.oph.konfo.config;

import fi.vm.sade.properties.OphProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class KonfoUiConfiguration extends OphProperties {

  private PublicConfiguration publicConfiguration = new PublicConfiguration();

  @Autowired
  public KonfoUiConfiguration(Environment environment) {
    addFiles("/konfo-ui-oph.properties");
    this.addOverride("host-oppija", environment.getRequiredProperty("host.host-oppija"));
    this.addOverride(
        "host-old-oppija-fi", environment.getRequiredProperty("host.old-oppija-base-url-fi"));
    this.addOverride(
        "host-old-oppija-sv", environment.getRequiredProperty("host.old-oppija-base-url-sv"));
    this.addOverride(
        "host-old-oppija-en", environment.getRequiredProperty("host.old-oppija-base-url-en"));
    this.addOverride("kartta.host", environment.getRequiredProperty("kartta.host"));
    this.addOverride("kartta.pid", environment.getRequiredProperty("kartta.pid"));
    this.addOverride("konfo-bucket", environment.getRequiredProperty("bucket.url"));
    this.addOverride(
        "eperusteet-service.base-url",
        environment.getRequiredProperty("host.host-eperusteet-service"));

    this.frontProperties.setProperty(
        "konfo-backend.base-url", this.require("konfo-backend.base-url"));
    this.frontProperties.setProperty(
        "konfo-backend.old-oppija-fi", this.require("konfo-backend.old-oppija-fi"));
    this.frontProperties.setProperty(
        "konfo-backend.old-oppija-sv", this.require("konfo-backend.old-oppija-sv"));
    this.frontProperties.setProperty(
        "konfo-backend.old-oppija-en", this.require("konfo-backend.old-oppija-en"));
    this.frontProperties.setProperty(
        "konfo-backend.search.hakukohteet", this.require("konfo-backend.search.hakukohteet"));
    this.frontProperties.setProperty(
        "konfo-backend.search.koulutukset", this.require("konfo-backend.search.koulutukset"));
    this.frontProperties.setProperty(
        "konfo-backend.search.oppilaitokset", this.require("konfo-backend.search.oppilaitokset"));
    this.frontProperties.setProperty(
        "konfo-backend.search.autocomplete", this.require("konfo-backend.search.autocomplete"));
    this.frontProperties.setProperty(
        "konfo-backend.koulutus", this.require("konfo-backend.koulutus"));
    this.frontProperties.setProperty(
        "konfo-backend.toteutus", this.require("konfo-backend.toteutus"));
    this.frontProperties.setProperty(
        "konfo-backend.valintaperusteet", this.require("konfo-backend.valintaperusteet"));
    this.frontProperties.setProperty(
        "konfo-backend.oppilaitos", this.require("konfo-backend.oppilaitos"));
    this.frontProperties.setProperty(
        "konfo-backend.oppilaitosOsa", this.require("konfo-backend.oppilaitosOsa"));
    this.frontProperties.setProperty(
        "konfo-backend.kuvaus.osaamisalat", this.require("konfo-backend.kuvaus.osaamisalat"));

    this.frontProperties.setProperty(
        "konfo-backend.koulutus.jarjestajat", this.require("konfo-backend.koulutus.jarjestajat"));
    this.frontProperties.setProperty(
        "konfo-backend.oppilaitos.tarjonta", this.require("konfo-backend.oppilaitos.tarjonta"));
    this.frontProperties.setProperty(
        "konfo-backend.osaamismerkki", this.require("konfo-backend.osaamismerkki"));
    this.frontProperties.setProperty(
        "konfo-backend.hakukohde", this.require("konfo-backend.hakukohde"));
    this.frontProperties.setProperty("konfo-backend.haku", this.require("konfo-backend.haku"));
    this.frontProperties.setProperty(
        "konfo-backend.koulutus.kuvaus", this.require("konfo-backend.koulutus.kuvaus"));
    this.frontProperties.setProperty(
        "konfo-backend.eperuste.kuvaus", this.require("konfo-backend.eperuste.kuvaus"));

    this.frontProperties.setProperty(
        "konfo-backend.content", this.require("konfo-backend.content"));
    this.frontProperties.setProperty("kartta.base-url", this.require("kartta.base-url"));
    this.frontProperties.setProperty("kartta.publish-url", this.require("kartta.publish-url"));
    this.frontProperties.setProperty(
        "eperusteet-service.eperuste.kuvaus", this.require("eperusteet-service.eperuste.kuvaus"));
    this.frontProperties.setProperty(
        "eperusteet-service.eperuste.tiedot", this.require("eperusteet-service.eperuste.tiedot"));
    this.frontProperties.setProperty(
        "eperusteet-service.osaamismerkki", this.require("eperusteet-service.osaamismerkki"));
    this.frontProperties.setProperty("oma-opintopolku", this.require("oma-opintopolku"));
    this.frontProperties.setProperty(
        "konfo-backend.haku.demo", this.require("konfo-backend.haku.demo"));
    this.frontProperties.setProperty(
        "konfo-backend.koodisto.koodit", this.require("konfo-backend.koodisto.koodit"));
    this.frontProperties.setProperty(
        "konfo-backend.suosikit", this.require("konfo-backend.suosikit"));
    this.frontProperties.setProperty(
        "konfo-backend.suosikit-vertailu", this.require("konfo-backend.suosikit-vertailu"));
    this.frontProperties.setProperty("ataru.hakemus-haku", this.require("ataru.hakemus-haku"));

    publicConfiguration.naytaFiltterienHakutulosLuvut =
        Boolean.parseBoolean(
            environment.getRequiredProperty("konfo-ui.nayta-filtterien-hakutulos-luvut"));
  }

  public PublicConfiguration getPublicConfiguration() {
    return publicConfiguration;
  }
}
