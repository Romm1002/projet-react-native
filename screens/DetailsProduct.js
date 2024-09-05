import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

/**
 * Affiche les détails d'un produit.
 * La page attend un paramètre "productId" qui correspond à l'identifiant du
 * produit à afficher.
 *
 * @param {object} navigation - L'objet de navigation du component.
 * @param {object} route - L'objet de route du component.
 * @param {string} route.params.productId - L'identifiant du produit à afficher.
 */
const DetailsProduct = ({ route, navigation }) => {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [productInput, setProductInput] = useState({
    id: "",
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

 /**
   * Supprime un produit de la base de données.
   *
   * @async
   * @function
   * @param {number} productId - L'ID du produit à supprimer.
   * @returns {Promise<void>}
   */
  const confirmDelete = (productId) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce produit?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", onPress: () => deleteProduct(productId) },
      ]
    );
 
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/items/${productId}`);
      navigation.navigate("Home");
    } catch (error) {
      console.log(
        "Une erreur est survenue lors de la suppression du produit",
        error
      );
    }
  };

  useEffect(() => {
  /**
   * Récupère le produit correspondant à l'identifiant productId
   * depuis l'API.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/items/${productId}`);

        if (response) {
          setProduct(response.data);
          setProductInput(response.data);
        } else {
          navigation.goBack();
        }
      } catch (error) {
        console.log(
          "Une erreur est survenue lors de la récupération des produits",
          error
        );
      }
    };

    fetchProduct();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productInput.name}</Text>
      <Text style={styles.description}>{productInput.description}</Text>
      <Text style={styles.author}>Quantité: {productInput.quantity}</Text>
      <Text style={styles.year}>Prix: {productInput.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("EditProduct", { productId })}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => confirmDelete(productId)}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
  year: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "75%",
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
  },
});

export default DetailsProduct;
