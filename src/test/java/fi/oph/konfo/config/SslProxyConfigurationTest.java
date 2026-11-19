package fi.oph.konfo.config;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Tuotantokonfiguraatiossa {@code konfo-ui.uses-ssl-proxy} on päällä: Tomcatin connector raportoi
 * pyynnöt HTTPS:nä ja logback-accessin valve kirjoittaa access-lokia.
 */
@SpringBootTest(
    webEnvironment = WebEnvironment.RANDOM_PORT,
    properties = "konfo-ui.uses-ssl-proxy=true")
@Import(SslProxyConfigurationTest.SchemeController.class)
class SslProxyConfigurationTest {

  private static final Path ACCESS_LOG;

  // Asetetaan ennen Spring-kontekstin käynnistystä: OphProperties lukee logback.access-arvon
  // system propertyista ja logback-access-test.xml lokitiedoston polun.
  static {
    try {
      ACCESS_LOG = Files.createTempFile("konfo-ui-access", ".log");
    } catch (IOException e) {
      throw new ExceptionInInitializerError(e);
    }
    System.setProperty("konfo.test.access-log", ACCESS_LOG.toString());
    System.setProperty("logback.access", "logback-access-test.xml");
  }

  private final HttpClient http = HttpClient.newHttpClient();

  @LocalServerPort private int port;

  @AfterAll
  static void cleanUp() throws IOException {
    System.clearProperty("konfo.test.access-log");
    System.clearProperty("logback.access");
    Files.deleteIfExists(ACCESS_LOG);
  }

  @RestController
  static class SchemeController {
    @GetMapping("/test/scheme")
    String scheme(HttpServletRequest request) {
      return request.getScheme() + " " + request.isSecure();
    }
  }

  private HttpResponse<String> get(String path) throws IOException, InterruptedException {
    HttpRequest request =
        HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
    return http.send(request, HttpResponse.BodyHandlers.ofString());
  }

  @Test
  void requestsArriveAsHttps() throws Exception {
    HttpResponse<String> response = get("/konfo/test/scheme");

    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).isEqualTo("https true");
  }

  @Test
  void requestsAreWrittenToAccessLog() throws Exception {
    HttpResponse<String> response = get("/konfo/rest/config/configuration?accesslog-test");
    assertThat(response.statusCode()).isEqualTo(200);

    // Valve kirjoittaa lokirivin vasta vastauksen jälkeen, joten odotetaan hetki
    String expectedLine = "\"GET /konfo/rest/config/configuration?accesslog-test HTTP/1.1\" 200";
    Instant deadline = Instant.now().plus(Duration.ofSeconds(5));
    String log = Files.readString(ACCESS_LOG);
    while (!log.contains(expectedLine) && Instant.now().isBefore(deadline)) {
      Thread.sleep(100);
      log = Files.readString(ACCESS_LOG);
    }
    assertThat(log).contains(expectedLine);
  }
}
