package fi.oph.konfo.config;

import ch.qos.logback.access.jetty.RequestLogImpl;
import org.eclipse.jetty.server.HttpConfiguration;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.RequestLog;
import org.eclipse.jetty.server.ServerConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.jetty.JettyServerCustomizer;
import org.springframework.boot.web.embedded.jetty.JettyServletWebServerFactory;
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
  public ConfigurableServletWebServerFactory webServerFactory(
      @Value("${konfo-ui.uses-ssl-proxy}") boolean sslProxy,
      @Autowired UrlConfiguration configuration) {
    JettyServletWebServerFactory factory = new JettyServletWebServerFactory();
    factory.addServerCustomizers(
        new JettyServerCustomizer() {
          @Override
          public void customize(org.eclipse.jetty.server.Server server) {
            if (sslProxy) {
              HttpConfiguration http = new HttpConfiguration();
              http.setSecureScheme("https");

              ServerConnector connector = new ServerConnector(server);
              connector.addConnectionFactory(new HttpConnectionFactory(http));

              server.addConnector(connector);
            }
            server.setRequestLog(requestLog());
          }

          private RequestLog requestLog() {
            RequestLogImpl requestLog = new RequestLogImpl();

            String logbackAccess = configuration.getOrElse("logback.access", null);
            if (logbackAccess != null) {
              requestLog.setFileName(logbackAccess);
            } else {
              System.out.println(
                  "JettyLauncher: Jetty access log is printed to console, use -Dlogback.access to set configuration file");
              requestLog.setResource("/logback-access.xml");
            }
            requestLog.start();
            return requestLog;
          }
        });
    return factory;
  }
}
