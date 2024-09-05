import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from "axios";

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

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.1.102:5000/items/${productId}`);
      navigation.navigate("Home");
    } catch (error) {
      console.log("Une erreur est survenue lors de la suppression du produit", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://192.168.1.102:5000/items/${productId}`);
        
        if (response) {
          setProduct(response.data)
          setProductInput(response.data);
        } else {
          navigation.goBack();
        }
      } catch (error) {
        console.log("Une erreur est survenue lors de la récupération des produits", error);
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
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProduct', { productId })}>
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => deleteProduct(productId)}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  year: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '75%',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});


export default DetailsProduct;
