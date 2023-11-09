package com.PrintLab.utils;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailUtils {
    private final JavaMailSender javaMailSender;

    public EmailUtils(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendRegistrationEmail(String userEmail, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(userEmail);
        message.setSubject("Welcome to Your PrintLab!");
        message.setText("Thank you for registering with PrintLab!\n\n"
                + "Your login credentials:\n"
                + "Email: " + userEmail + "\n"
                + "Password: " + password + "\n\n"
                + "Please keep your credentials safe and do not share them with anyone.");

        javaMailSender.send(message);
    }
}
