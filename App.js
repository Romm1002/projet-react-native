import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddProduct from "./screens/AddProduct";
import EditProduct from "./screens/EditProduct";
import DetailsProduct from "./screens/DetailsProduct";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AddProduct"
        screenOptions={{ headerShown: true }}
      >

        <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{ title: "Ajouter un produit" }}
        />

        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{ title: "Editer un produit" }}
        />

        <Stack.Screen
          name="DetailsProduct"
          component={DetailsProduct}
          options={{ title: "Détails d'un produit" }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Écran d'Accueil" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
