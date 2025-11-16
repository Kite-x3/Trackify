import React from "react";
import { Modal, View, Image, StyleSheet, Pressable } from "react-native";

interface FullscreenImageProps {
  visible: boolean;
  onClose: () => void;
  source: any;
}

export function FullscreenImage({ visible, onClose, source }: FullscreenImageProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Image
          source={source}
          style={styles.image}
          resizeMode="contain"
        />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "90%",
  },
});
