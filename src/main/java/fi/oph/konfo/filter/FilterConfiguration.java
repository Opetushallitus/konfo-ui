package fi.oph.konfo.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfiguration {

    @Bean
    public FilterRegistrationBean<OphPrerenderFilter> ophPrerenderFilter(@Value("${prerender.enable}") boolean enablePrerender,
                                                                         @Value("${prerender.timeout}") int socketTimeoutMillis){
        FilterRegistrationBean<OphPrerenderFilter> registrationBean
                = new FilterRegistrationBean<>();

        registrationBean.setFilter(new OphPrerenderFilter(enablePrerender, socketTimeoutMillis));
        registrationBean.addUrlPatterns("/*");

        return registrationBean;
    }
}
