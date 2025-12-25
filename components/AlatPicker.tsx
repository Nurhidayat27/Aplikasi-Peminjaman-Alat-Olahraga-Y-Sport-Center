import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  data: any[];
  onSelect: (alat: any) => void;
};

export default function AlatPicker({ data, onSelect }: Props) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleSelect = (item: any) => {
    setSelected(item);
    onSelect(item);        // 🔥 KIRIM KE PINJAM.TSX
    setVisible(false);     // 🔥 TUTUP MODAL
  };

  return (
    <>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: selected ? "#000" : "#94a3b8" }}>
          {selected ? selected.nama : "Pilih alat olahraga"}
        </Text>
        <Ionicons name="chevron-down" size={20} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.nama}>{item.nama}</Text>
                  <Text style={styles.stok}>Stok: {item.stok}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.batal}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 55,
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  nama: {
    fontSize: 16,
    fontWeight: "700",
  },
  stok: {
    fontSize: 13,
    color: "#64748b",
  },
  batal: {
    textAlign: "center",
    color: "red",
    marginTop: 15,
    fontSize: 16,
  },
});
