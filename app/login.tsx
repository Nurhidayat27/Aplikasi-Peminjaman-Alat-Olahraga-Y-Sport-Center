import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Image 
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

// Definisi Warna Tema agar konsisten
const COLORS = {
  darkGreen: "#064e3b",      // Background utama
  cardBg: "#065f46",         // Hijau sedikit lebih terang untuk kartu
  emerald: "#10b981",        // Warna aksen (tombol/link)
  textLight: "#ecfdf5",      // Putih kehijauan sangat terang
  placeholder: "#6ee7b7",    // Warna placeholder
  inputBg: "#042f2e"         // Background input yang kontras
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(username, password);
    if (!success) {
      alert("Login gagal. Silakan cek kembali data Anda.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.card}>
        {/* --- BAGIAN LOGO --- */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("@/assets/images/logo-sport.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.subtitle}>Silakan masuk ke akun Anda</Text>

        {/* Input Username */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color={COLORS.emerald} style={styles.icon} />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

        {/* Input Password */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.emerald} style={styles.icon} />
          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor={COLORS.placeholder}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk Sekarang</Text>
        </TouchableOpacity>

        <Link href="/register" asChild>
          <TouchableOpacity style={styles.registerLink}>
            <Text style={styles.registerText}>
              Belum punya akun? <Text style={styles.registerHighlight}>Daftar di sini</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGreen, // Background Hijau Gelap
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg, // Kartu sedikit lebih terang dari background
    padding: 30,
    borderRadius: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    // Tint color jika logo Anda satu warna dan ingin disesuaikan (opsional)
    // tintColor: COLORS.textLight, 
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 30,
    opacity: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#064e3b",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: COLORS.emerald,
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.darkGreen, // Teks tombol gelap di atas background terang
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  registerLink: {
    marginTop: 25,
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  registerHighlight: {
    color: COLORS.emerald,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});