import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
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
  const [restockModalVisible, setRestockModalVisible] = useState(false);
  const [productToRestock, setProductToRestock] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");

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
      console.log(
        "Une erreur est survenue lors de la récupération des produits",
        error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );
  
  /**
   * Restock un produit de la liste.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const restockProduct = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/items/${productToRestock.id}`,
        {
          ...productToRestock,
          quantity: (
            parseInt(productToRestock.quantity) + parseInt(restockAmount)
          ).toString(),
        }
      );
      setProducts(
        products.map((product) => {
          if (product.id === productToRestock) {
            return response.data;
          }
          return product;
        })
      );
      setRestockModalVisible(false);
      setRestockAmount("");
      setProductToRestock(null);
    } catch (error) {
      console.log(
        "Une erreur est survenue lors du réaprovisionnement du produit",
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
        <View style={styles.productDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{item.price} €</Text>
          {item.quantity <= 10 && (
            <Text style={styles.danger}>Quantité basse</Text>
          )}
          <View style={styles.buttons}>
            <Button
              title="Réaprovisionner"
              onPress={() => {
                setRestockModalVisible(true);
                setProductToRestock(item);
              }}
            />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={restockModalVisible}
        onRequestClose={() => {
          setRestockModalVisible(!restockModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Quantité à réaprovisionner</Text>
            <TextInput
              style={styles.searchBar}
              placeholder="Quantité"
              value={restockAmount.toString()}
              onChangeText={setRestockAmount}
            />
            <View style={styles.buttons}>
              <Button
                style={styles.button}
                onPress={restockProduct}
                title="Confirmer"
              />
              <Button
                style={styles.button}
                onPress={() => {
                  setRestockModalVisible(!restockModalVisible);
                  setRestockAmount("");
                  setProductToRestock(null);
                }}
                title="Annuler"
              />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={filterProducts()}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={products}
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
  danger: {
    fontSize: 14,
    color: "#c91414",
    marginBottom: 8,
  },
  buttons: {
    width: "100%",
    flexDirection: "row-reverse",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 25,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default HomeScreen;
