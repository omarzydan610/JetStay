package com.example.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class CommentModerationService {

    @Value("${perspective.api.url}")
    private String API_URL;

    @Value("${perspective.api.key}")
    private String apiKey;

    public boolean isToxic(String comment) {
        RestClient restClient = RestClient.create();

        Map<String, Object> requestBody = Map.of(
                "comment", Map.of("text", comment),
                "languages", List.of("en"),
                "requestedAttributes", Map.of("TOXICITY", Map.of())
        );

        JsonNode response = restClient.post()
                .uri(API_URL + apiKey)
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        double score = response.get("attributeScores").get("TOXICITY")
                .get("summaryScore").get("value").asDouble();

        return score > 0.8;
    }
}
