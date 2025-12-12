package com.example.backend.cache;

import com.example.backend.entity.RoomType;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class RoomCacheManager {

    private final Cache<Integer, RoomType> roomByIdCache;
    private final Cache<String, List<RoomType>> roomsPagesCache;

    public RoomCacheManager() {
        roomByIdCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(10000)
                .build();

        roomsPagesCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(1000)
                .build();
    }

    // =======================
    // Room by ID cache
    // =======================
    public RoomType getRoomById(Integer id) {
        return roomByIdCache.getIfPresent(id);
    }

    public void putRoomById(Integer id, RoomType room) {
        roomByIdCache.put(id, room);
    }

    public void evictRoomById(Integer id) {
        roomByIdCache.invalidate(id);
    }

    // =======================
    // Paginated rooms cache
    // =======================
    public List<RoomType> getRoomsPage(String key) {
        return roomsPagesCache.getIfPresent(key);
    }

    public void putRoomsPage(String key, List<RoomType> rooms) {
        roomsPagesCache.put(key, rooms);
        // also update individual roomById cache
        for (RoomType r : rooms) {
            putRoomById(r.getRoomTypeID(), r);
        }
    }

    public void evictRoomsPage(String key) {
        roomsPagesCache.invalidate(key);
    }

    // =======================
    // Evict room and remove from pages
    // =======================
    public void evictRoomCompletely(Integer roomId) {
        evictRoomById(roomId);

        roomsPagesCache.asMap().forEach((key, page) -> {
            page.removeIf(r -> r.getRoomTypeID().equals(roomId));
        });
    }

    // =======================
    // Clear all caches
    // =======================
    public void evictAll() {
        roomByIdCache.invalidateAll();
        roomsPagesCache.invalidateAll();
    }
}