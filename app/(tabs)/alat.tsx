import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "@/src/context/AuthContext";
import { initDB } from "@/src/database/db";
import {
  getAllAlat,
  addAlat,
  updateAlat,
  deleteAlat,
} from "@/src/services/alatService";

const COLORS = {
  darkGreen: "#064e3b",
  emerald: "#10b981",
  softMint: "#d1fae5",
  inputBg: "#f1f5f9",
  white: "#ffffff",
  danger: "#ef4444",
};

export default function AlatScreen() {
  const { user } = useAuth();

  const [alat, setAlat] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [user]);

  useEffect(() => {
    initDB();
    loadData();
  }, []);

  const loadData = () => {
    setAlat(getAllAlat());
  };

  if (user?.role !== "admin") return null;

  const handleSubmit = () => {
    if (!nama || !stok || !harga) {
      Alert.alert("Error", "Nama, stok, dan harga wajib diisi");
      return;
    }

    const stokInt = parseInt(stok);
    const hargaInt = parseInt(harga);

    if (stokInt <= 0 || hargaInt <= 0) {
      Alert.alert("Error", "Stok dan harga harus lebih dari 0");
      return;
    }

    if (editId) {
      updateAlat(editId, nama, stokInt, hargaInt);
      Alert.alert("Berhasil", "Data alat diperbarui");
    } else {
      addAlat(nama, stokInt, hargaInt);
      Alert.alert("Berhasil", "Alat baru ditambahkan");
    }

    setNama("");
    setStok("");
    setHarga("");
    setEditId(null);
    loadData();
  };

  const handleDelete = (id: number) => {
    Alert.alert("Hapus Alat", "Yakin ingin menghapus alat ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          deleteAlat(id);
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGreen} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Inventaris Alat</Text>
          <Text style={styles.subtitle}>Manajemen alat olahraga</Text>
        </View>
      </View>

      {/* FORM */}
      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="fitness-outline" size={20} color={COLORS.emerald} />
          <TextInput
            placeholder="Nama alat"
            value={nama}
            onChangeText={setNama}
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="layers-outline" size={20} color={COLORS.emerald} />
          <TextInput
            placeholder="Stok"
            value={stok}
            onChangeText={setStok}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="cash-outline" size={20} color={COLORS.emerald} />
          <TextInput
            placeholder="Harga pinjam (Rp)"
            value={harga}
            onChangeText={setHarga}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9}>
          <LinearGradient
            colors={
              editId
                ? ["#059669", "#064e3b"]
                : [COLORS.emerald, COLORS.darkGreen]
            }
            style={styles.button}
          >
            <Ionicons
              name={editId ? "checkmark-circle" : "add-circle"}
              size={22}
              color="white"
            />
            <Text style={styles.buttonText}>
              {editId ? "Simpan Perubahan" : "Tambah Alat"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {editId && (
          <TouchableOpacity
            onPress={() => {
              setEditId(null);
              setNama("");
              setStok("");
              setHarga("");
            }}
          >
            <Text style={styles.cancelText}>Batalkan Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LIST */}
      <FlatList
        data={alat}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.detail}>Stok: {item.stok} unit</Text>
              <Text style={styles.harga}>
                Rp {item.harga.toLocaleString("id-ID")}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: COLORS.softMint }]}
                onPress={() => {
                  setEditId(item.id);
                  setNama(item.nama);
                  setStok(item.stok.toString());
                  setHarga(item.harga.toString());
                }}
              >
                <Ionicons name="pencil" size={16} color={COLORS.darkGreen} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#fee2e2" }]}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 24,
  },
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
  subtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 25,
    marginBottom: 24,
    elevation: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
  },
  button: {
    height: 55,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    textAlign: "center",
    color: COLORS.danger,
    marginTop: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  nama: {
    fontSize: 16,
    fontWeight: "700",
  },
  detail: {
    fontSize: 13,
    color: "#64748b",
  },
  harga: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.emerald,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
