import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  white: "#ffffff",
  danger: "#ef4444",
  adminNavy: "#0f172a",
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  
  // Deteksi Role
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    Alert.alert("Konfirmasi Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

return (
    <View style={styles.container}>
      {/* Ubah barStyle ke light-content agar teks jam/baterai berwarna putih di atas hijau */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* HEADER SECTION */}
        <LinearGradient 
          colors={isAdmin ? [COLORS.adminNavy, "#1e293b"] : [COLORS.emerald, COLORS.darkGreen]} 
          style={styles.upperHeader}
        >
          {/* View ini bertindak sebagai spacer agar tidak menabrak status bar */}
          <View style={styles.safeAreaSpacer} />
          
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {isAdmin ? (
                  <Ionicons name="shield-checkmark" size={40} color={COLORS.emerald} />
                ) : (
                  <Text style={styles.avatarText}>{initial}</Text>
                )}
              </View>
              <View style={[styles.onlineBadge, { backgroundColor: isAdmin ? "#38bdf8" : "#22c55e" }]} />
            </View>
            
            <View style={styles.userTextInfo}>
              <Text style={styles.displayName}>{user?.username || "Pengguna"}</Text>
              <View style={[styles.roleBadge, { backgroundColor: isAdmin ? COLORS.emerald : "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.roleBadgeText}>{isAdmin ? "SISTEM ADMIN" : "MEMBER PRO"}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* STATS CARD - Berubah Data berdasarkan Role */}
        <View style={styles.statsCard}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{isAdmin ? "142" : "12"}</Text>
            <Text style={styles.statsLabel}>{isAdmin ? "Total Alat" : "Total Pinjam"}</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{isAdmin ? "28" : "3"}</Text>
            <Text style={styles.statsLabel}>{isAdmin ? "Dipinjam" : "Aktif"}</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{isAdmin ? "5" : "0"}</Text>
            <Text style={styles.statsLabel}>{isAdmin ? "Overdue" : "Denda"}</Text>
          </View>
        </View>

        {/* MENU SECTION - Berubah Menu berdasarkan Role */}
        <View style={styles.menuWrapper}>
          <Text style={styles.menuSectionTitle}>
            {isAdmin ? "MANAJEMEN SISTEM" : "PENGATURAN ATLET"}
          </Text>
          
          {isAdmin ? (
            <>
              <MenuLink icon="add-circle-outline" label="Tambah Inventaris Baru" color="#0ea5e9" />
              <MenuLink icon="people-outline" label="Kelola Data Member" color="#8b5cf6" />
              <MenuLink icon="document-text-outline" label="Laporan Aktivitas" color="#f59e0b" />
            </>
          ) : (
            <>
              <MenuLink icon="person-outline" label="Edit Profil" color={COLORS.darkGreen} />
              <MenuLink icon="barbell-outline" label="Target Latihan" color={COLORS.darkGreen} />
              <MenuLink icon="shield-checkmark-outline" label="Keamanan Akun" color={COLORS.darkGreen} />
            </>
          )}

          <Text style={[styles.menuSectionTitle, { marginTop: 25 }]}>LAINNYA</Text>
          <MenuLink icon="help-buoy-outline" label="Pusat Bantuan" color="#64748b" />
          
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <View style={styles.logoutIconBox}>
              <Ionicons name="power" size={20} color={COLORS.danger} />
            </View>
            <Text style={styles.logoutLabel}>
              {isAdmin ? "Log Out" : "Log Out"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>
          Y-Sport Mobile v1.0.24 {isAdmin ? "(Admin Mode)" : "(Athlete Mode)"}
        </Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// Sub-komponen Menu
function MenuLink({ icon, label, color }: any) {
  return (
    <TouchableOpacity style={styles.menuRow}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  // PERBAIKAN DI SINI:
  upperHeader: { 
    // Tambahkan paddingBottom yang lebih besar agar lengkungan di bawah tidak memotong teks
    paddingBottom: 80, 
    paddingHorizontal: 25, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35,
  },
  // Spacer otomatis berdasarkan tinggi StatusBar perangkat
  safeAreaSpacer: {
    height: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    // Margin top dihilangkan karena sudah ada safeAreaSpacer
    marginTop: 10 
  },
  avatarContainer: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 25, backgroundColor: COLORS.white, justifyContent: "center", alignItems: "center", elevation: 5 },
  avatarText: { fontSize: 35, fontWeight: "bold", color: COLORS.darkGreen },
  onlineBadge: { position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: COLORS.white },
  userTextInfo: { marginLeft: 20 },
  displayName: { fontSize: 22, fontWeight: "900", color: COLORS.white, textTransform: 'uppercase' },
  roleBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  roleBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: "bold", letterSpacing: 1 },
  statsCard: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 25, marginTop: -35, borderRadius: 22, paddingVertical: 20, elevation: 12, shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10 },statsItem: { flex: 1, alignItems: 'center' },
  statsValue: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  statsLabel: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  statsDivider: { width: 1, height: '100%', backgroundColor: '#f1f5f9' },
  menuWrapper: { marginTop: 30, paddingHorizontal: 25 },
  menuSectionTitle: { fontSize: 11, fontWeight: "800", color: "#94a3b8", marginBottom: 15, letterSpacing: 1.5 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  iconCircle: { width: 42, height: 42, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 15 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: "#334155" },
  logoutRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15, paddingVertical: 10 },
  logoutIconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#fee2e2', justifyContent: "center", alignItems: "center", marginRight: 15 },
  logoutLabel: { fontSize: 15, fontWeight: "bold", color: COLORS.danger },
  versionText: { textAlign: "center", marginTop: 40, color: "#cbd5e1", fontSize: 11, fontWeight: "700" },
});