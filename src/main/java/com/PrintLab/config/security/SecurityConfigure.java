package com.PrintLab.config.security;

import com.PrintLab.service.impl.MyUserDetailServiceImplementation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfigure extends WebSecurityConfigurerAdapter {

    @Autowired
    private MyUserDetailServiceImplementation myUserDetailsService;
    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/api/login").permitAll()
                .antMatchers("/api/productField").permitAll()
                .antMatchers("/api/productDefinition").permitAll()
                .antMatchers("/api/productDefinition/{id}/productField").permitAll()
                .antMatchers("/api/productDefinition/{id}").permitAll()
                .antMatchers("/api/productField/{id}/{id}").permitAll()
                .antMatchers("/api/productField/{id}/productFieldValues").permitAll()
                .antMatchers("/api/pfv").permitAll()
                .antMatchers(HttpMethod.POST,"/api/paperMarketRates").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paperMarketRates").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paperMarketRates/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/paperMarketRates/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/paperMarketRates/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/paper-size").permitAll()
                .antMatchers(HttpMethod.POST,"/api/paper-size/{paper-size-id}/uping-paper-size").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-size").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/paper-size/{id}/{upsId}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/press-machine").permitAll()
                .antMatchers(HttpMethod.POST,"/api/press-machine/{press-machine-id}/press-machine-size").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/press-machine/{id}/{pmId}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/uping").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.GET, "/test").permitAll()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
