package fi.oph.konfo.filter;

import com.github.greengerong.PreRenderSEOFilter;
import com.github.greengerong.PrerenderSeoService;
import com.google.common.collect.Maps;
import java.io.IOException;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OphPrerenderFilter extends PreRenderSEOFilter {
  private static final Logger LOG = LoggerFactory.getLogger(OphPrerenderFilter.class);

  private PrerenderSeoService ophPrerenderSeoService;

  private final boolean enablePrerender;
  private final int socketTimeoutMillis;

  public OphPrerenderFilter(boolean enablePrerender, int socketTimeoutMillis) {
    this.enablePrerender = enablePrerender;
    this.socketTimeoutMillis = socketTimeoutMillis;
  }

  @Override
  public void init(FilterConfig filterConfig) {
    LOG.info(String.format("enablePrerender = %s", enablePrerender));
    LOG.info(String.format("socketTimeoutMillis = %d", socketTimeoutMillis));
    if (enablePrerender) {
      Map<String, String> configAsMap = toMap(filterConfig);
      LOG.info(
          String.format(
              "Initialising %s with config: %s",
              PrerenderSeoService.class.getSimpleName(), configAsMap));
      this.ophPrerenderSeoService = new PrerenderSeoService(configAsMap);
    } else {
      LOG.warn(
          String.format(
              "ophPrerenderWrapper.enablePrerender == %s , not initialising service.",
              enablePrerender));
    }
  }

  public void doFilter(
      ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
      throws IOException, ServletException {
    if (enablePrerender) {
      boolean isPrerendered =
          ophPrerenderSeoService.prerenderIfEligible(
              (HttpServletRequest) servletRequest, (HttpServletResponse) servletResponse);
      if (!isPrerendered) {
        filterChain.doFilter(servletRequest, servletResponse);
      }
    } else {
      filterChain.doFilter(servletRequest, servletResponse);
    }
  }

  @Override
  protected void setPrerenderSeoService(PrerenderSeoService prerenderSeoService) {
    this.ophPrerenderSeoService = prerenderSeoService;
  }

  @Override
  public void destroy() {
    ophPrerenderSeoService.destroy();
  }

  protected Map<String, String> toMap(FilterConfig filterConfig) {
    Map<String, String> config = Maps.newHashMap();
    for (String parameterName : PARAMETER_NAMES) {
      config.put(parameterName, filterConfig.getInitParameter(parameterName));
    }
    config.put(
        "socketTimeout",
        Integer.toString(socketTimeoutMillis)); // See PrerenderConfig.getSocketTimeout()
    return config;
  }
}
