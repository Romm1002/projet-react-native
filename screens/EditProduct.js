import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";

const EditProduct = ({ navigation }) => {
  const route = useRoute();
  const [product, setProduct] = useState(null);
  const [productInput, setProductInput] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    price: "",
  });
  const { productId } = route.params;

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const response = await axios.get(`${API_URL}/items/${productId}`);
        setProduct(response.data);
        setProductInput(response.data);
      } catch (error) {
        console.log(
          "Une erreur est survenue lors de la récupération du produit",
          error
        );
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (key, value) => {
    setProductInput({ ...productInput, [key]: value });
  };

  const updateProduct = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/items/${productId}`,
        productInput
      );
      setProduct(response.data);
      navigation.goBack();
    } catch (error) {
      console.log(
        "Une erreur est survenue lors de la mise a jour du produit",
        error
      );
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mettre à jour le produit</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={productInput.name}
        onChangeText={(value) => handleChange("name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={productInput.description}
        onChangeText={(value) => handleChange("description", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={productInput.quantity}
        onChangeText={(value) => handleChange("quantity", value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Prix"
        value={productInput.price}
        onChangeText={(value) => handleChange("price", value)}
      />

      <Button title="Mise à jour" onPress={updateProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  templateAuthor: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bookItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
  },
  cover: {
    width: 60,
    height: 90,
    marginRight: 16,
  },
  bookDetails: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
});

export default EditProduct;
