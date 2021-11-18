package fi.oph.konfo.controller;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = {"/fi", "/sv", "/en", "/"})
public class KonfoUiController {

  @GetMapping(
      value = {
        "/haku",
        "/sivu/*",
        "/sisaltohaku/*",
        "/omapolku/*",
        "/haku/*",
        "/koulutus",
        "/koulutus/*",
        "/toteutus",
        "/toteutus/*",
        "/oppilaitos",
        "/oppilaitos/*",
        "/",
      })
  public String frontProperties() {
    return "/index.html";
  }
}
