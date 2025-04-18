import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  NativeSyntheticEvent,
} from "react-native";
import RequestService from "../services";
import { STORAGE_KEYS, URLS } from "../constants";
import FailedConnectionModal from "./FailedConnectionModal";

interface CreatePlayerProps {
  displayModal: boolean;
  onClose: (event?: NativeSyntheticEvent<any>) => void;
}
const CreatePlayerModal = ({ displayModal, onClose }: CreatePlayerProps) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getName = async () => {
      const storedPlayer = await AsyncStorage.getItem(STORAGE_KEYS.player);
      storedPlayer && setName(JSON.parse(storedPlayer).name);
    };
    getName();
  }, [displayModal]);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    const { response, error } = await RequestService.sendRequest(
      URLS.CREATE_PLAYER_URL,
      name,
    );
    if (response?.ok && !error) {
      const player = (await response.json()).player;
      setName(player.name);
      AsyncStorage.setItem(STORAGE_KEYS.player, JSON.stringify(player));
    }
    onClose();
    // Time for Profile modal to close before Failed-Connection modal opens
    setTimeout(() => setError(error), 50);
    setLoading(false);
  };

  return (
    <>
      <Modal transparent={true} visible={displayModal} onRequestClose={onClose}>
        <Pressable style={styles.modalContainer} onPress={onClose}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Player Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Player name"
              value={name}
              onChangeText={setName}
            />
            <TouchableOpacity
              style={[styles.submitButton, { opacity: name === "" ? 0.5 : 1 }]}
              disabled={name === ""}
              onPress={handleSubmit}
            >
              {loading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.buttonText}>Enter</Text>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <FailedConnectionModal
        displayModal={!!error}
        message={error}
        onClose={() => setError(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CreatePlayerModal;
