import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
// Ganti IconSymbol dengan Ionicons untuk kepastian muncul
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  textTitle: "#064e3b",
  textSubtitle: "#059669",
  white: "#ffffff",
  lightGray: "#f3f4f6"
};

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: COLORS.darkGreen, dark: "#022c22" }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(6, 78, 59, 0.9)']}
            style={styles.gradientOverlay}
          />
          <View style={styles.headerTextContainer}>
            <ThemedText style={styles.headerTopText}>Selamat Datang di</ThemedText>
            <ThemedText style={styles.headerBrandText}>Y-Sport Center</ThemedText>
          </View>
        </View>
      }
    >
      <ThemedView style={styles.container}>
        
        {/* --- SECTION 1: STATS QUICK VIEW --- */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>335</ThemedText>
            <ThemedText style={styles.statLabel}>Total Alat</ThemedText>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e5e7eb' }]}>
            <ThemedText style={styles.statNumber}>1</ThemedText>
            <ThemedText style={styles.statLabel}>Dipinjam</ThemedText>
          </View>
          <View style={styles.statBox}>
            <ThemedText style={styles.statNumber}>Active</ThemedText>
            <ThemedText style={styles.statLabel}>Status GOR</ThemedText>
          </View>
        </View>

        {/* --- SECTION 2: MENU UTAMA --- */}
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Layanan Utama</ThemedText>
        </View>

        {/* BARIS PERTAMA */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/pinjam")}>
            <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="arrow-up-circle" size={28} color={COLORS.emerald} />
            </View>
            <ThemedText style={styles.menuLabel}>Pinjam Alat</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/pengembalian")}>
            <View style={[styles.iconBox, { backgroundColor: '#f0fdfa' }]}>
              <Ionicons name="arrow-down-circle" size={28} color="#0d9488" />
            </View>
            <ThemedText style={styles.menuLabel}>Kembalikan</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/riwayat")}>
            <View style={[styles.iconBox, { backgroundColor: '#fefce8' }]}>
              <Ionicons name="time" size={28} color="#ca8a04" />
            </View>
            <ThemedText style={styles.menuLabel}>Riwayat</ThemedText>
          </TouchableOpacity>
        </View>

        {/* BARIS KEDUA */}
        <View style={[styles.menuGrid, { marginTop: 20 }]}>
         <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/profile")}>
            <View style={[styles.iconBox, { backgroundColor: '#f5f3ff' }]}>
              <Ionicons name="person" size={28} color="#8b5cf6" />
            </View>
            <ThemedText style={styles.menuLabel}>Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* --- SECTION 3: TENTANG APLIKASI --- */}
        <View style={styles.aboutCard}>
          <LinearGradient
            colors={[COLORS.darkGreen, '#065f46']}
            style={styles.aboutGradient}
          >
            <ThemedText style={styles.aboutTitle}>Tentang Y-Sport</ThemedText>
            <ThemedText style={styles.aboutDesc}>
              Sistem manajemen digital untuk memudahkan civitas dalam memantau, meminjam, 
              dan mengelola fasilitas serta alat olahraga secara real-time dan transparan.
            </ThemedText>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>v1.0.4 Premium</ThemedText>
            </View>
          </LinearGradient>
        </View>

        {/* --- SECTION 4: INFO JADWAL --- */}
        <View style={styles.sectionHeader}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Informasi Operasional</ThemedText>
        </View>
        
        <View style={styles.infoCard}>
           <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color={COLORS.darkGreen} />
              <ThemedText style={styles.infoText}>Senin - Minggu (08.00 - 21.00 WIB)</ThemedText>
           </View>
           <View style={[styles.infoRow, { marginTop: 10 }]}>
              <Ionicons name="location" size={20} color={COLORS.darkGreen} />
              <ThemedText style={styles.infoText}>Gedung Olahraga Utama, Desa Mekarsari</ThemedText>
           </View>
        </View>

        <View style={{ height: 40 }} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { height: '100%', width: '100%' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%' },
  headerTextContainer: { position: 'absolute', bottom: 30, left: 30 },
  headerTopText: { color: COLORS.white, fontSize: 16, opacity: 0.9 },
  headerBrandText: { color: COLORS.white, fontSize: 32, fontWeight: '900' },
  
  container: {
    padding: 30,
    marginTop: -25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: COLORS.white,
  },
  
  // Stats Section
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '800', color: COLORS.darkGreen },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  // Menu Section
  sectionHeader: { marginBottom: 15, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, color: COLORS.darkGreen },
  menuGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  menuItem: { width: '30%', alignItems: 'center' },
  iconBox: { 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  menuLabel: { fontSize: 12, fontWeight: '600', color: '#374151', textAlign: 'center' },

  // About Card
  aboutCard: { borderRadius: 25, overflow: 'hidden', marginBottom: 25 },
  aboutGradient: { padding: 25 },
  aboutTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  aboutDesc: { color: COLORS.white, fontSize: 13, lineHeight: 20, opacity: 0.8 },
  badge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 10, 
    marginTop: 15 
  },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },

  // Info Card
  infoCard: { 
    backgroundColor: COLORS.lightGray, 
    padding: 20, 
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.emerald
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoText: { fontSize: 13, color: '#4b5563', fontWeight: '500' }
});