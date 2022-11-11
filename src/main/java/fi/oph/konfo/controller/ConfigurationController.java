package fi.oph.konfo.controller;

import fi.oph.konfo.config.KonfoUiConfiguration;
import fi.oph.konfo.config.PublicConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/rest/config")
public class ConfigurationController {

  @Autowired private KonfoUiConfiguration configuration;

  @GetMapping(value = "/frontProperties", produces = "application/json")
  public String frontProperties() {
    return configuration.frontPropertiesToJson();
  }

  @GetMapping(value = "/configuration", produces = "application/json")
  public PublicConfiguration configuration() {
    return configuration.getPublicConfiguration();
  }
}
