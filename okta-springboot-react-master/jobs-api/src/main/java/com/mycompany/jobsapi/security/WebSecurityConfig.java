package com.mycompany.jobsapi.security;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.management.HttpSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@Configuration
public class WebSecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
	
	 @Autowired
	    public void configureGlobal(AuthenticationManagerBuilder auth) {
	        KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
	        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
	        auth.authenticationProvider(keycloakAuthenticationProvider);
	    }

	    @Bean
	    public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
	        return new KeycloakSpringBootConfigResolver();
	    }

	    @Bean
	    @Override
	    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
	        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
	    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers(HttpMethod.POST, "/authenticate").permitAll()
                .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/jobs/newest").permitAll()
                .antMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/**").hasAnyRole(JOBS_CUSTOMER, JOBS_STAFF)
                .antMatchers(HttpMethod.PUT, "/api/jobs/search").hasAnyRole(JOBS_CUSTOMER, JOBS_STAFF)
                .antMatchers("/api/jobs", "/api/jobs/**").hasRole(JOBS_STAFF)
                .antMatchers("/", "/error", "/csrf", "/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated();
        		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        		http.cors().and().csrf().disable();
    	}
    
    @Bean
    @Override
    @ConditionalOnMissingBean(HttpSessionManager.class)
    protected HttpSessionManager httpSessionManager() {
        return new HttpSessionManager();
    }

    public static final String JOBS_STAFF = "JOBS_STAFF";
    public static final String JOBS_CUSTOMER = "JOBS_CUSTOMER";

}
