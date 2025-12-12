package com.example.backend.cache;

import com.example.backend.entity.Flight;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class FlightCacheManager {

    private final Cache<Integer, Flight> flightByIdCache;
    private final Cache<String, List<Flight>> flightsPagesCache;

    public FlightCacheManager() {
        flightByIdCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(10000)
                .build();

        flightsPagesCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(1000)
                .build();
    }

    // =======================
    // Flight by ID cache
    // =======================
    public Flight getFlightById(Integer id) {
        return flightByIdCache.getIfPresent(id);
    }

    public void putFlightById(Integer id, Flight flight) {
        flightByIdCache.put(id, flight);
    }

    public void evictFlightById(Integer id) {
        flightByIdCache.invalidate(id);
    }

    // =======================
    // Paginated flights cache
    // =======================
    public List<Flight> getFlightsPage(String key) {
        return flightsPagesCache.getIfPresent(key);
    }

    public void putFlightsPage(String key, List<Flight> flights) {
        flightsPagesCache.put(key, flights);
        // also update individual flightById cache
        for (Flight f : flights) {
            putFlightById(f.getFlightID(), f);
        }
    }

    public void evictFlightsPage(String key) {
        flightsPagesCache.invalidate(key);
    }

    // =======================
    // Evict flight and remove from pages
    // =======================
    public void evictFlightCompletely(Integer flightId) {
        // remove from flightById cache
        evictFlightById(flightId);

        // remove from any pages containing this flight
        flightsPagesCache.asMap().forEach((key, page) -> {
            page.removeIf(f -> f.getFlightID().equals(flightId));
        });
    }

    // =======================
    // Clear all caches
    // =======================
    public void evictAll() {
        flightByIdCache.invalidateAll();
        flightsPagesCache.invalidateAll();
    }
}