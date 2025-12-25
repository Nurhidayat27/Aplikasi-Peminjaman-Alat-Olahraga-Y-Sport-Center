import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Image,
  ScrollView 
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { db } from "@/src/database/db";
import { Ionicons } from "@expo/vector-icons";

// Konsistensi Warna Tema
const COLORS = {
  darkGreen: "#064e3b",      
  cardBg: "#065f46",         
  emerald: "#10b981",        
  textLight: "#ecfdf5",      
  placeholder: "#6ee7b7",    
  inputBg: "#042f2e"         
};

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi tidak sama");
      return;
    }

    const existing = db.getFirstSync(
      `SELECT id FROM users WHERE username='${username}'`
    );

    if (existing) {
      Alert.alert("Error", "Username sudah digunakan");
      return;
    }

    db.execSync(`
      INSERT INTO users (username, password, role)
      VALUES ('${username}', '${password}', 'user')
    `);

    Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan login.");
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* --- LOGO BRAND --- */}
          <View style={styles.logoContainer}>
            <Image 
              source={require("@/assets/images/logo-sport.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.subtitle}>Daftar akun baru untuk mulai berolahraga</Text>

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

          {/* Input Konfirmasi Password */}
          <View style={styles.inputWrapper}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.emerald} style={styles.icon} />
            <TextInput
              placeholder="Konfirmasi Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholderTextColor={COLORS.placeholder}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Daftar Sekarang</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/login")}>
            <Text style={styles.loginText}>
              Sudah punya akun? <Text style={styles.loginHighlight}>Masuk di sini</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGreen,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.cardBg,
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
    width: 100,
    height: 100,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 25,
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
    color: COLORS.darkGreen,
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  loginLink: {
    marginTop: 25,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  loginHighlight: {
    color: COLORS.emerald,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});