//package com.PrintLab.service;
//
//import com.PrintLab.model.UserSession;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//import java.util.concurrent.ConcurrentHashMap;
//
//@Service
//public class UserSessionService {
//    private final Map<String, UserSession> activeSessions = new ConcurrentHashMap<>();
//
//    public void addUserSession(String userId, UserSession userSession) {
//        activeSessions.put(userId, userSession);
//    }
//
//    public void removeUserSession(String userId) {
//        activeSessions.remove(userId);
//    }
//
//    public List<UserSession> getAllActiveSessions() {
//        return new ArrayList<>(activeSessions.values());
//    }
//}
