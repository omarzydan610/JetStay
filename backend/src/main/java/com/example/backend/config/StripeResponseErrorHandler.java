package com.example.backend.config;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;
import java.net.URI;
import org.springframework.http.HttpMethod;

public class StripeResponseErrorHandler implements ResponseErrorHandler {

    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        HttpStatusCode statusCode = response.getStatusCode();
        // Consider any status >= 400 as error
        return statusCode.value() >= 400;
    }

    @Override
    public void handleError(URI url, HttpMethod method, ClientHttpResponse response) throws IOException {
        // Example: log or throw exception
        System.out.println("Stripe error: " + response.getStatusCode() + " " + response.getStatusText());
    }
}