import React, { useState, useEffect } from "react";
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

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.1.19:5000/items');
        setProducts(response.data);
      } catch (error) {
        console.log("Une erreur est survenue lors de la récupération des produits", error);
      }
    };

    fetchProducts();
  }, []);

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

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.1.19:5000/items/${productId}`);
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.log("Une erreur est survenue lors de la suppression du produit", error);
    }
  };

  const filterProducts = () => {
    if (searchQuery === '') {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetailsProduct', { productId: item.id })}
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
