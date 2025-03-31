import React, { useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { View, TextInput, StyleSheet, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FailedConnectionModal from "./FailedConnectionModal";
import RequestService from "../services";
import { Header } from "./settingsUtils";
import { URLS } from "../constants";

const MAIN_FONT_FAMILY = "Verdana";

interface FeedbackProp {
  globalBackgroundColor: string;
}

const Feedback = ({ globalBackgroundColor }: FeedbackProp) => {
  const [focusedStyles, setFocusedStyles] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | boolean>(false);
  const textInputRef = useRef<TextInput | null>(null);

  const handleSubmit = async () => {
    if (!!message) {
      setLoading(true);
      const { response, error } = await RequestService.sendRequest(
        URLS.FEEDBACK_URL,
        message,
      );
      if (response?.ok && !error) {
        setSubmitted(true);
        textInputRef.current?.clear();
        textInputRef.current?.blur();
        Keyboard.dismiss();
      }
      setLoading(false);
      setError(error);
    }
  };

  return (
    <View style={[styles.container, focusedStyles]}>
      <Header text="Feedback" />
      <TextInput
        ref={textInputRef}
        style={styles.input}
        placeholder="Write your feedback here..."
        multiline
        numberOfLines={6}
        value={message}
        onChangeText={setMessage}
        onFocus={() => {
          setSubmitted(false);
          setFocusedStyles({
            position: "absolute",
            bottom: "41%",
            backgroundColor: globalBackgroundColor,
          });
        }}
        onBlur={() => setFocusedStyles({})}
        submitBehavior="blurAndSubmit"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={1}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : submitted ? (
          <Ionicons name="checkmark-circle-outline" size={25} color="green" />
        ) : (
          <Text style={[styles.buttonText, { opacity: !!message ? 1 : 0.2 }]}>
            Send
          </Text>
        )}
      </TouchableOpacity>
      <FailedConnectionModal
        displayModal={!!error}
        message={error}
        onClose={() => setError(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: "15%",
    paddingRight: "15%",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 120,
    width: 300,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    borderColor: "#ccc",
  },
  buttonText: {
    fontFamily: MAIN_FONT_FAMILY,
    fontSize: 18,
  },
});

export default Feedback;
