import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { HapticTab } from "@/components/haptic-tab";

// Warna kustom untuk tema Hijau Gelap
const DARK_GREEN = "#064e3b"; // Hijau hutan sangat gelap
const EMERALD_LIGHT = "#10b981"; // Hijau terang untuk ikon aktif
const GRAY_GREEN = "#6b7280"; // Abu-abu untuk ikon tidak aktif

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        // --- MODIFIKASI TEMA DISINI ---
        tabBarActiveTintColor: EMERALD_LIGHT,
        tabBarInactiveTintColor: GRAY_GREEN,
        tabBarStyle: {
          backgroundColor: DARK_GREEN, // Latar belakang tab
          borderTopWidth: 0,           // Menghilangkan garis pembatas atas agar lebih clean
          height: 60,                  // Sedikit lebih tinggi untuk estetika
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        // ------------------------------
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* 🔐 ALAT — ADMIN ONLY */}
      <Tabs.Screen
        name="alat"
        options={{
          title: "Alat",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* PINJAM */}
      <Tabs.Screen
        name="pinjam"
        options={{
          title: "Pinjam",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-up-circle" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* KEMBALI */}
      <Tabs.Screen
        name="pengembalian"
        options={{
          title: "Kembali",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="arrow-down-circle" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* RIWAYAT */}
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null,
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}