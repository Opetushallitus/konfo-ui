package fi.oph.konfo.config;

import org.apache.catalina.connector.Connector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.embedded.tomcat.TomcatConnectorCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Servlet containeriin liittyvät konfiguraatiot. */
@Configuration
public class ServletContainerConfiguration {

  private static final Logger LOG = LoggerFactory.getLogger(ServletContainerConfiguration.class);

  /**
   * Konfiguraatio kun palvelua ajetaan HTTPS proxyn läpi. Käytännössä tämä muuttaa {@link
   * javax.servlet.ServletRequest#getScheme()} palauttamaan `https` jolloin palvelun kautta luodut
   * urlit muodostuvat oikein.
   *
   * <p>Aktivointi: `konfo-ui.uses-ssl-proxy` arvoon `true`.
   *
   * @return EmbeddedServletContainerCustomizer jonka Spring automaattisesti tunnistaa ja lisää
   *     servlet containerin konfigurointiin
   */
  @Bean
  @ConditionalOnProperty("konfo-ui.uses-ssl-proxy")
  public WebServerFactoryCustomizer sslProxyCustomizer() {
    LOG.info("Enabling HTTPS Proxu configuration");
    return (WebServerFactory container) -> {
      if (container instanceof ConfigurableServletWebServerFactory) {
        TomcatServletWebServerFactory tomcat = (TomcatServletWebServerFactory) container;
        tomcat.addConnectorCustomizers(
            (TomcatConnectorCustomizer)
                (Connector connector) -> {
                  connector.setScheme("https");
                  connector.setSecure(true);
                });
      }
    };
  }
}
