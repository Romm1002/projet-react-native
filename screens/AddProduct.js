import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

/**
 * Page pour ajouter un produit.
 *
 * La page affiche un formulaire avec les champs suivants :
 * - Nom
 * - Description
 * - Quantité
 * - Prix
 *
 * Lorsque le formulaire est soumis, la fonctionnalité ajoute le produit
 * correspondant à la base de données.
 *
 * Si le formulaire est vide, une alerte est affichée pour demander
 * à l'utilisateur de remplir tous les champs.
 *
 * @param {object} navigation - L'objet de navigation fourni par React Navigation.
 * @returns {React.Component} - La page d'ajout de produit.
 */
export default function AddProduct({ navigation }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");

  const addProduct = async () => {
    if (name.trim() && description.trim() && price.trim()) {
      const newProduct = {
        name,
        description,
        quantity,
        price,
      };

      try {
        await axios.post(API_URL + "/items", newProduct);

        setName("");
        setDescription("");
        setQuantity(0);
        setPrice("");

        navigation.goBack();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du produit", error);
      }
    } else {
      Alert.alert(
        "Champs manquants",
        "Veuillez remplir tous les champs avant d'ajouter le produit.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ajouter un nouveau produit</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={price}
        onChangeText={setPrice}
      />

      <Button title="Ajouter" onPress={addProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
});
