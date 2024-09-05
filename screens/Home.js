import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import axios from "axios";
import { API_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";

/**
 * Page d'accueil de l'application, affichant la liste des produits et
 * permettant d'en ajouter de nouveaux, de les modifier ou de les supprimer.
 *
 * @param {object} navigation - Un objet de navigation fourni par React Navigation.
 * @returns {React.Component} - La page d'accueil de l'application.
 */
const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Récupère la liste des produits depuis l'API.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL + "/items");
      setProducts(response.data);
    } catch (error) {
      console.log("Une erreur est survenue lors de la récupération des produits", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  /**
   * Demande une confirmation avant de supprimer un produit.
   *
   * @param {number} productId - L'ID du produit à supprimer.
   * @returns {void}
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
  };

  /**
   * Supprime un produit de la liste.
   *
   * @async
   * @function
   * @param {number} productId - L'ID du produit à supprimer.
   * @returns {Promise<void>}
   */
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_URL}/items/${productId}`);
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.log(
        "Une erreur est survenue lors de la suppression du produit",
        error
      );
    }
  };

  /**
   * Filtre la liste des produits en fonction de la valeur de `searchQuery`.
   *
   * @returns {array} - La liste des produits filtrés.
   */
  const filterProducts = () => {
    if (searchQuery === "") {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  /**
   * Render un produit de la liste.
   *
   * @param {{ item: object }} props - Les propriétés du produit à rendre.
   * @returns {React.ReactElement} - Le JSX du produit.
   */
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetailsProduct", { productId: item.id })
      }
      style={styles.productItemButton}
    >
      <View style={styles.productItem}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.productDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{item.price} €</Text>
          <View style={styles.buttons}>
            <Button
              title="Modifier"
              onPress={() =>
                navigation.navigate("EditProduct", {
                  productId: item.id,
                })
              }
            />
            <Button title="Supprimer" onPress={() => confirmDelete(item.id)} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filterProducts()}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button
        title="Ajouter un produit"
        onPress={() => navigation.navigate("AddProduct")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: "#333",
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
});

export default HomeScreen;
