import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, router } from "expo-router";

import {
  getPeminjamanAktif,
  kembalikanAlat,
} from "../../src/services/peminjamanService";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  white: "#ffffff",
  danger: "#ef4444",
};

export default function PengembalianScreen() {
  const [data, setData] = useState<any[]>([]);

  const loadData = () => {
    const peminjaman = getPeminjamanAktif();
    setData(peminjaman);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleKembali = (id: number, namaAlat: string) => {
    Alert.alert(
      "Konfirmasi Kembali",
      `Apakah alat "${namaAlat}" sudah dicek kondisinya dan siap dikembalikan?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Kembalikan",
          onPress: () => {
            const result = kembalikanAlat(id);
            if (result.success) {
              Alert.alert("Berhasil", "Stok alat telah diperbarui otomatis.");
              loadData();
            } else {
              Alert.alert("Gagal", result.message);
            }
          },
        },
      ]
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="barbell-outline" size={80} color="#cbd5e1" />
      </View>
      <Text style={styles.emptyTitle}>Semua Beres!</Text>
      <Text style={styles.emptySubtitle}>Tidak ada alat yang sedang dipinjam saat ini.</Text>
      <TouchableOpacity 
        style={styles.backHomeBtn} 
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.backHomeText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pengembalian</Text>
          <Text style={styles.subtitle}>Kembalikan alat yang dipinjam</Text>
        </View>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeText}>{data.length} Aktif</Text>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                {/* IKON BARBEL UNTUK ALAT YANG DIPINJAM */}
                <Ionicons name="barbell" size={24} color={COLORS.darkGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.namaAlat}>{item.nama_alat}</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="layers-outline" size={14} color="#64748b" />
                  <Text style={styles.infoPinjam}>Jumlah: {item.jumlah} Unit</Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity 
              onPress={() => handleKembali(item.id, item.nama_alat)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.emerald, COLORS.darkGreen]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.returnButton}
              >
                <Ionicons name="refresh-circle" size={22} color="white" />
                <Text style={styles.returnButtonText}>Kembalikan Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.darkGreen,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  badgeCount: {
    backgroundColor: COLORS.softMint,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 15,
  },
  badgeText: {
    color: COLORS.darkGreen,
    fontWeight: "800",
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.softMint,
    justifyContent: "center",
    alignItems: "center",
  },
  namaAlat: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  infoPinjam: {
    fontSize: 13,
    color: "#64748b",
  },
  statusBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    color: "#d97706",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 18,
  },
  returnButton: {
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  returnButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.softMint,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.darkGreen,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  backHomeBtn: {
    marginTop: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.emerald,
  },
  backHomeText: {
    color: COLORS.emerald,
    fontWeight: "700",
  }
});