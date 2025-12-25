import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { getAllAlat } from "../../src/services/alatService";
import { pinjamAlat } from "../../src/services/peminjamanService";
import AlatPicker from "../../components/AlatPicker";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  white: "#ffffff",
};

export default function PinjamScreen() {
  const [alat, setAlat] = useState<any[]>([]);
  const [selectedAlat, setSelectedAlat] = useState<any | null>(null);
  const [jumlah, setJumlah] = useState("");

  useFocusEffect(
    useCallback(() => {
      setAlat(getAllAlat());
    }, [])
  );

  const jumlahInt = parseInt(jumlah || "0");
  const totalHarga =
    selectedAlat && jumlahInt > 0
      ? selectedAlat.harga * jumlahInt
      : 0;

  const handlePinjam = () => {
    if (!selectedAlat || !jumlah) {
      Alert.alert(
        "Input Tidak Lengkap",
        "Silakan pilih alat dan tentukan jumlah peminjaman."
      );
      return;
    }

    if (isNaN(jumlahInt) || jumlahInt <= 0) {
      Alert.alert("Error", "Jumlah pinjam harus berupa angka positif.");
      return;
    }

const result = pinjamAlat(
  selectedAlat.id,
  jumlahInt,
  totalHarga
);

    if (result.success) {
      Alert.alert(
        "Berhasil",
        `Peminjaman berhasil\nTotal Biaya: Rp ${totalHarga.toLocaleString(
          "id-ID"
        )}`
      );
      setJumlah("");
      setSelectedAlat(null);
      setAlat(getAllAlat());
    } else {
      Alert.alert("Gagal", result.message);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGreen} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Form Pinjam</Text>
          <Text style={styles.subtitle}>
            Pilih alat, jumlah, dan lihat total biaya
          </Text>
        </View>
      </View>

      {/* ICON */}
      <View style={styles.iconSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="barbell" size={45} color={COLORS.darkGreen} />
        </View>
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Pilih Alat Olahraga</Text>
          <AlatPicker data={alat} onSelect={setSelectedAlat} />
        </View>

        {selectedAlat && (
          <>
            <View style={styles.infoBox}>
              <Ionicons name="stats-chart" size={18} color={COLORS.darkGreen} />
              <Text style={styles.infoText}>
                Stok:{" "}
                <Text style={styles.infoBold}>
                  {selectedAlat.stok} unit
                </Text>
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="cash" size={18} color={COLORS.emerald} />
              <Text style={styles.infoText}>
                Harga / unit:{" "}
                <Text style={styles.infoBold}>
                  Rp {selectedAlat.harga.toLocaleString("id-ID")}
                </Text>
              </Text>
            </View>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Jumlah Pinjam</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="barbell-outline" size={20} color="#94a3b8" />
            <TextInput
              placeholder="Contoh: 2"
              keyboardType="numeric"
              value={jumlah}
              onChangeText={setJumlah}
              style={styles.input}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {totalHarga > 0 && (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Biaya</Text>
            <Text style={styles.totalValue}>
              Rp {totalHarga.toLocaleString("id-ID")}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handlePinjam}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.emerald, COLORS.darkGreen]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Konfirmasi Pinjam</Text>
            <Ionicons
              name="checkmark-done-circle"
              size={22}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: {
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 40,
  },
  header: { flexDirection: "row", gap: 15, marginBottom: 20 },
  backBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.darkGreen,
  },
  subtitle: { fontSize: 13, color: "#64748b" },
  iconSection: { alignItems: "center", marginBottom: 25 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.softMint,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 24,
    elevation: 5,
  },
  formGroup: { marginBottom: 20 },
  label: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.softMint,
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    gap: 10,
  },
  infoText: { fontSize: 14 },
  infoBold: { fontWeight: "800" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  input: { flex: 1, height: 55, fontSize: 16 },
  totalBox: {
    backgroundColor: COLORS.softMint,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 15,
  },
  totalLabel: { fontSize: 14 },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.darkGreen,
  },
  buttonContainer: { marginTop: 10 },
  button: {
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});
