import { View, Text, FlatList, StyleSheet, Platform, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { getRiwayatPeminjaman } from "../../src/services/peminjamanService";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  white: "#ffffff",
  danger: "#ef4444",
  warning: "#f59e0b",
};

export default function RiwayatScreen() {
  const [data, setData] = useState<any[]>([]);

  const loadData = () => {
    setData(getRiwayatPeminjaman());
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderStatusBadge = (status: string) => {
    const isDone = status === "dikembalikan";
    return (
      <View style={[styles.statusBadge, { backgroundColor: isDone ? COLORS.softMint : "#FEF3C7" }]}>
        <Text style={[styles.statusText, { color: isDone ? COLORS.darkGreen : "#92400E" }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    );
  };

  const EmptyRiwayat = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="receipt-outline" size={80} color="#cbd5e1" />
      </View>
      <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
      <Text style={styles.emptySubtitle}>Aktivitas olahraga Anda akan tercatat secara otomatis di sini.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Riwayat</Text>
          <Text style={styles.subtitle}>Log aktivitas alat olahraga</Text>
        </View>
        <View style={styles.headerIconBox}>
          <Ionicons name="stats-chart" size={24} color={COLORS.darkGreen} />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyRiwayat}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Bagian Atas: Nama Alat & Badge Status */}
            <View style={styles.rowBetween}>
              <View style={styles.alatBox}>
                <View style={styles.miniIconBox}>
                  <Ionicons name="barbell" size={16} color={COLORS.darkGreen} />
                </View>
                <Text style={styles.namaAlat}>{item.nama_alat}</Text>
              </View>
              {renderStatusBadge(item.status)}
            </View>

            {/* Bagian Tengah: Detail Waktu & Jumlah */}
            <View style={styles.detailContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>
                  {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="layers-outline" size={14} color="#64748b" />
                <Text style={styles.detailText}>{item.jumlah} Unit</Text>
              </View>
            </View>

            {/* Bagian Bawah: Info Denda / Kondisi */}
            {item.status === "dikembalikan" && (
              <View style={[styles.dendaBox, { backgroundColor: item.denda > 0 ? "#FEF2F2" : "#F0FDFA" }]}>
                <Ionicons 
                  name={item.denda > 0 ? "alert-circle" : "checkmark-circle"} 
                  size={16} 
                  color={item.denda > 0 ? COLORS.danger : COLORS.emerald} 
                />
                <Text style={[styles.dendaText, { color: item.denda > 0 ? "#B91C1C" : COLORS.darkGreen }]}>
                  {item.denda > 0 ? `Denda: Rp ${item.denda.toLocaleString()}` : "Dikembalikan Tepat Waktu"}
                </Text>
              </View>
            )}
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
  headerIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: COLORS.softMint,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  miniIconBox: {
    padding: 6,
    backgroundColor: COLORS.softMint,
    borderRadius: 8,
  },
  namaAlat: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  detailContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 14,
    paddingLeft: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  dendaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  dendaText: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.darkGreen,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: 'center',
    paddingHorizontal: 50,
    marginTop: 8,
    lineHeight: 20,
  },
});