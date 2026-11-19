package fi.oph.konfo;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

/**
 * Käynnistää sovelluksen oikealla Tomcatilla ja testaa HTTP:n yli, että Java-kääre palvelee
 * konfiguraatiorajapinnat ja frontendin oikein.
 */
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class KonfoUiApplicationTest {

  private static final String INDEX_MARKER = "konfo-ui-test-index";

  private final HttpClient http = HttpClient.newHttpClient();

  @LocalServerPort private int port;

  private HttpResponse<String> get(String path) throws IOException, InterruptedException {
    HttpRequest request =
        HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).build();
    return http.send(request, HttpResponse.BodyHandlers.ofString());
  }

  @Test
  void configurationReturnsPublicConfigurationAsJson() throws Exception {
    HttpResponse<String> response = get("/konfo/rest/config/configuration");

    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.headers().firstValue("Content-Type"))
        .hasValueSatisfying(contentType -> assertThat(contentType).startsWith("application/json"));
    assertThat(response.body()).isEqualTo("{\"naytaFiltterienHakutulosLuvut\":false}");
  }

  @Test
  void frontPropertiesReturnsUrlsResolvedFromConfiguration() throws Exception {
    HttpResponse<String> response = get("/konfo/rest/config/frontProperties");

    assertThat(response.statusCode()).isEqualTo(200);
    Map<String, String> properties =
        JsonMapper.builder().build().readValue(response.body(), new TypeReference<>() {});
    assertThat(properties)
        .containsEntry(
            "konfo-backend.suosikit", "https://oppija.example.test/konfo-backend/suosikit")
        .containsEntry("konfo-backend.content", "https://content.example.test/$1")
        .containsEntry("kartta.base-url", "https://kartta.example.test")
        .containsEntry(
            "eperusteet-service.eperuste.kuvaus",
            "https://eperusteet.example.test/#/$1/ammatillinen/$2/tutkinnonosat/$3");
    assertThat(properties.values()).noneMatch(value -> value.contains("${"));
  }

  @ParameterizedTest
  @ValueSource(
      strings = {
        "/konfo/",
        "/konfo/fi/",
        "/konfo/sv/haku",
        "/konfo/en/haku/tampere",
        "/konfo/fi/koulutus/1.2.246.562.13.00000000000000000001",
        "/konfo/fi/toteutus/1.2.246.562.17.00000000000000000001",
        "/konfo/fi/oppilaitos/1.2.246.562.10.00000000001",
        "/konfo/fi/hakukohde/1.2.246.562.20.00000000000000000001/valintaperuste",
        "/konfo/fi/sivu/tietoa-palvelusta",
        "/konfo/fi/omapolku/suosikit",
      })
  void frontendRoutesServeIndexHtml(String path) throws Exception {
    HttpResponse<String> response = get(path);

    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).contains(INDEX_MARKER);
  }

  @Test
  void staticAssetsAreServed() throws Exception {
    HttpResponse<String> response = get("/konfo/test-asset.js");

    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.body()).contains("konfo-ui-test-asset");
  }

  @Test
  void unknownPathFallsBackToIndexHtmlThroughErrorController() throws Exception {
    HttpResponse<String> response = get("/konfo/fi/olematon/polku");

    assertThat(response.statusCode()).isEqualTo(404);
    assertThat(response.body()).contains(INDEX_MARKER);
  }
}
