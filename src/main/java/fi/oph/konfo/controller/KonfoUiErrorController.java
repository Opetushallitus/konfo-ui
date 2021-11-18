package fi.oph.konfo.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class KonfoUiErrorController implements ErrorController {

  private static final String PATH = "/error";

  @GetMapping(value = PATH)
  public String notFound() {
    return "/index.html";
  }

  @Override
  public String getErrorPath() {
    return PATH;
  }
}
