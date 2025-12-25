import { Slot, router, usePathname } from "expo-router";
import { useEffect } from "react";
import { initDB } from "@/src/database/db";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { View, ActivityIndicator } from "react-native";

function AuthGate() {
  const { user, ready } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;

    const publicRoutes = ["/login", "/register"];

    // ❌ belum login → hanya boleh ke login & register
    if (!user && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }

    // ❌ sudah login → tidak boleh ke login & register
    if (user && publicRoutes.includes(pathname)) {
      router.replace("/(tabs)");
    }
  }, [user, ready, pathname]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
