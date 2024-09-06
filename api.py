from flask import Flask, jsonify, request 

 

app = Flask(__name__) 

# Exemple de base de données en mémoire 

items = [ 

    { 

        'id': 1, 

        'name': 'iphone 15 pro max', 

        'description': 'L\'iPhone 15 Pro est le premier iPhone avec un design en titane de qualité aérospatiale', 

        'quantity': '1943', 

        'price': '10', 

    }, 
    { 

        'id': 2, 

        'name': 'Riz basmati', 

        'description': 'La texture moelleuse des grains de riz fins et longs du basmati offre à votre palais une expérience totalement différente en termes de saveurs et de sensations', 

        'quantity': '4', 

        'price': '120', 

    }, 
    { 

        'id': 3, 

        'name': 'Ben & Jerry\'s Cookie Dough', 

        'description': 'Crème Glacée Vanille avec des Morceaux de Pâte à Cookie aux Pépites de Chocolat et des inclusions cacaotées', 

        'quantity': '150', 

        'price': '1499', 

    }, 

] 

 

# Récupérer tous les produits 

@app.route('/items', methods=['GET']) 

def get_items(): 

    return jsonify(items) 

 

# Récupérer un produit par ID 

@app.route('/items/<int:item_id>', methods=['GET']) 

def get_item(item_id): 

    item = next((item for item in items if item['id'] == item_id), None) 

    if item is None: 

        return jsonify({'message': 'produit non trouvé'}), 404 

    return jsonify(item) 

 

# Créer un nouveau produit 

@app.route('/items', methods=['POST']) 

def add_item(): 

    new_item = request.json 

    new_item['id'] = len(items) + 1 

    items.append(new_item) 

    return jsonify(new_item), 201 

 

# Mettre à jour un produit 

@app.route('/items/<int:item_id>', methods=['PUT']) 

def update_item(item_id): 

    item = next((item for item in items if item['id'] == item_id), None) 

    if item is None: 

        return jsonify({'message': 'produit non trouvé'}), 404 

 

    updated_data = request.json 

    item.update(updated_data) 

    return jsonify(item) 

 

# Supprimer un produit 

@app.route('/items/<int:item_id>', methods=['DELETE']) 

def delete_item(item_id): 

    item = next((item for item in items if item['id'] == item_id), None) 

    if item is None: 

        return jsonify({'message': 'produit non trouvé'}), 404 

 

    items.remove(item) 

    return jsonify({'message': 'produit supprimé'}) 

 

if __name__ == '__main__': 

    app.run(host='0.0.0.0', port=5000) 