package fi.oph.konfo.filter;

import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfiguration {

  //  @Bean
  //  public FilterRegistrationBean<OphPrerenderFilter> ophPrerenderFilter(
  //      @Value("${prerender.enable}") boolean enablePrerender,
  //      @Value("${prerender.timeout}") int socketTimeoutMillis,
  //      @Value("${prerender.token}") String token) {
  //    FilterRegistrationBean<OphPrerenderFilter> registrationBean = new
  // FilterRegistrationBean<>();
  //
  //    registrationBean.setFilter(new OphPrerenderFilter(enablePrerender, socketTimeoutMillis,
  // token));
  //    registrationBean.addUrlPatterns("/*");
  //
  //    return registrationBean;
  //  }
}
