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
                .antMatchers(HttpMethod.POST,"/api/product-field").permitAll()
                .antMatchers(HttpMethod.POST,"/api/customer").permitAll()
                .antMatchers(HttpMethod.GET,"/api/customer").permitAll()
                .antMatchers(HttpMethod.GET,"/api/customer/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-field").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-field/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-field/name/{name}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-field/{id}/product-field-value").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/product-field/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-field/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/customer/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-field/{id}/{pfvId}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/paper-market-rates").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-market-rates").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-market-rates/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-market-rates/paper-stock/{stock}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/paper-market-rates/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/paper-market-rates/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/paper-size").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-size").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/paper-size/label/{label}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/paper-size/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/press-machine").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine/name/{name}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/press-machine/{id}/paper-size").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/press-machine/{id}/{pmId}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/press-machine/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/customer/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/uping").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping/product-size/{size}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/uping/{id}/paper-size").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/uping/{id}/{uping-paper-size-id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/uping/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/vendor").permitAll()
                .antMatchers(HttpMethod.GET,"/api/vendor").permitAll()
                .antMatchers(HttpMethod.GET,"/api/vendor/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/vendor/name/{name}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/vendor/{id}/product-process").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/vendor/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/vendor/{id}/{vendor-process-id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/vendor/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/product-process").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-process").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-process/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-process/name/{name}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-process/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/product-process/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/product-definition").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition/title/{title}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition/{id}/product-field").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition/{id}/product-process").permitAll()
                .antMatchers(HttpMethod.GET,"/api/product-definition/{id}/vendor").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/product-definition/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-definition/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-definition/{id}/{pdfId}/product-definition-field").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/product-definition/{id}/{pdpId}/product-definition-process").permitAll()
                .antMatchers(HttpMethod.POST,"/api/setting").permitAll()
                .antMatchers(HttpMethod.GET,"/api/setting").permitAll()
                .antMatchers(HttpMethod.GET,"/api/setting/{id}").permitAll()
                .antMatchers(HttpMethod.GET,"/api/setting/key/{key}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/setting/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/setting/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/printlab-calculator").permitAll()
                .antMatchers(HttpMethod.POST,"/api/order").permitAll()
                .antMatchers(HttpMethod.GET,"/api/order").permitAll()
                .antMatchers(HttpMethod.GET,"/api/order/{id}").permitAll()
                .antMatchers(HttpMethod.DELETE,"/api/order/{id}").permitAll()
                .antMatchers(HttpMethod.PUT,"/api/order/{id}").permitAll()
                .antMatchers(HttpMethod.POST,"/api/image").permitAll()
                .antMatchers(HttpMethod.GET,"/api/image/{fileName}").permitAll()
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
