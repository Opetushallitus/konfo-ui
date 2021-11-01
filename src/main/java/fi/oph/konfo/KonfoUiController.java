package fi.oph.konfo;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class KonfoUiController implements ErrorController {
  private static final String PATH = "/error";

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

  @GetMapping(value = PATH)
  public String notFound() {
    return "/index.html";
  }

  @Override
  public String getErrorPath() {
    return PATH;
  }
}
