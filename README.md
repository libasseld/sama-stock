# Gestion de Stock - Documentation API

## Configuration de l'API

L'API backend est accessible à l'adresse `http://localhost:8000/api`.

## Points d'accès (Endpoints)

### Authentification

- **POST** `/api/auth/signup` - Inscription d'un nouvel utilisateur 
    - Payloads : 
      ```json
      {
        "name": "Nom Utilisateur",
        "email": "utilisateur@exemple.com",
        "password": "motdepasse"
      }
      ```
    - Réponse :
      ```json
      {
        "message": "Inscription réussie",
        "user": {
          "id": 1,
          "name": "Nom Utilisateur",
          "email": "utilisateur@exemple.com",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      }
      ```
- **POST** `/api/auth/login` - Connexion d'un utilisateur
    - Payloads : 
      ```json
      {
        "email": "utilisateur@exemple.com",
        "password": "motdepasse"
      }
      ```
    - Réponse : 
      ```json
      {
        "message": "Connexion réussie",
        "user": {
          "id": 1,
          "name": "Nom Utilisateur",
          "email": "utilisateur@exemple.com",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        "token": "1|abcdefghijklmnopqrstuvwxyz123456789"
      }
      ```

### Produits

- **GET** `/api/products` - Récupération de tous les produits (authentification requise)
    - Paramètres de requête :
      ```
      search: Terme de recherche (optionnel)
      ```
    - Réponse :
      ```json
      [
        {
          "id": 1,
          "name": "Produit A",
          "price": 1500,
          "current_stock": 100,
          "image": "storage/products/1234567890.jpg",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      ]
      ```
- **GET** `/api/products/{id}` - Récupération d'un produit spécifique (authentification requise)
    - Réponse :
      ```json
      {
        "id": 1,
        "name": "Produit A",
        "price": 1500,
        "current_stock": 100,
        "image": "storage/products/1234567890.jpg",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **POST** `/api/products` - Création d'un nouveau produit (authentification requise)
    - Payload :
      ```json
      {
        "name": "Produit A",
        "price": 1500,
        "current_stock": 100,
        "image": [fichier image] (optionnel, max: 2048 KB)
      }
      ```
    - Réponse (201) :
      ```json
      {
        "id": 1,
        "name": "Produit A",
        "price": 1500,
        "current_stock": 100,
        "image": "storage/products/1234567890.jpg",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **PUT** `/api/products/{id}` - Mise à jour d'un produit (authentification requise)
    - Payload :
      ```json
      {
        "name": "Produit A modifié",
        "price": 2000,
        "current_stock": 150,
        "image": [fichier image] (optionnel)
      }
      ```
    - Réponse (200) :
      ```json
      {
        "message": "Produit mis à jour avec succès",
        "product": {
          "id": 1,
          "name": "Produit A modifié",
          "price": 2000,
          "current_stock": 150,
          "image": "storage/products/1234567890.jpg",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      }
      ```
- **DELETE** `/api/products/{id}` - Suppression d'un produit (authentification requise)
    - Réponse (200) :
      ```json
      {
        "message": "Produit supprimé avec succès"
      }
      ```

### Approvisionnements

- **GET** `/api/supplies` - Récupération de tous les approvisionnements (authentification requise)
    - Réponse :
      ```json
      [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 50,
          "date": "2023-01-01",
          "supplier": "Fournisseur A",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      ]
      ```
- **GET** `/api/supplies/{id}` - Récupération d'un approvisionnement spécifique (authentification requise)
    - Réponse :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 50,
        "date": "2023-01-01",
        "supplier": "Fournisseur A",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **POST** `/api/supplies` - Création d'un nouvel approvisionnement (authentification requise)
    - Payload :
      ```json
      {
        "product_id": 1,
        "quantity": 50,
        "date": "2023-01-01",
        "supplier": "Fournisseur A"
      }
      ```
    - Réponse (201) :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 50,
        "date": "2023-01-01",
        "supplier": "Fournisseur A",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **PUT** `/api/supplies/{id}` - Mise à jour d'un approvisionnement (authentification requise)
    - Payload :
      ```json
      {
        "product_id": 1,
        "quantity": 75,
        "date": "2023-01-02",
        "supplier": "Fournisseur B"
      }
      ```
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 75,
        "date": "2023-01-02",
        "supplier": "Fournisseur B",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **DELETE** `/api/supplies/{id}` - Suppression d'un approvisionnement (authentification requise)
    - Réponse (200) :
      ```json
      {
        "message": "Approvisionnement supprimé avec succès"
      }
      ```

### Sorties de Stock

- **GET** `/api/stock-outs` - Récupération de toutes les sorties de stock (authentification requise)
    - Réponse :
      ```json
      [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 20,
          "date": "2023-01-05",
          "reason": "Vente",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      ]
      ```
- **GET** `/api/stock-outs/{id}` - Récupération d'une sortie de stock spécifique (authentification requise)
    - Réponse :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 20,
        "date": "2023-01-05",
        "reason": "Vente",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **POST** `/api/stock-outs` - Création d'une nouvelle sortie de stock (authentification requise)
    - Payload :
      ```json
      {
        "product_id": 1,
        "quantity": 20,
        "date": "2023-01-05",
        "reason": "Vente"
      }
      ```
    - Réponse (201) :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 20,
        "date": "2023-01-05",
        "reason": "Vente",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **PUT** `/api/stock-outs/{id}` - Mise à jour d'une sortie de stock (authentification requise)
    - Payload :
      ```json
      {
        "product_id": 1,
        "quantity": 25,
        "date": "2023-01-06",
        "reason": "Perte"
      }
      ```
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "product_id": 1,
        "quantity": 25,
        "date": "2023-01-06",
        "reason": "Perte",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **DELETE** `/api/stock-outs/{id}` - Suppression d'une sortie de stock (authentification requise)
    - Réponse (200) :
      ```json
      {
        "message": "Sortie de stock supprimée avec succès"
      }
      ```

### Statistiques

- **GET** `/api/stats` - Récupération des statistiques du tableau de bord (authentification requise)
    - Réponse (200) :
      ```json
      {
        "total_products": 10,
        "total_supplies": 25,
        "total_stock_outs": 15,
        "recent_activities": {
          "supplies": [
            {
              "id": 1,
              "product_name": "Produit A",
              "quantity": 50,
              "created_at": "2023-01-01T00:00:00.000000Z"
            }
          ],
          "stock_outs": [
            {
              "id": 1,
              "product_name": "Produit B",
              "quantity": 20,
              "created_at": "2023-01-05T00:00:00.000000Z"
            }
          ]
        },
        "stock_evolution": [],
        "product_distribution": [
          {
            "name": "Produit A",
            "stock": 100
          },
          {
            "name": "Produit B",
            "stock": 75
          }
        ]
      }
      ```

## Authentification

L'API utilise Sanctum pour l'authentification par token. Pour les routes protégées, incluez le token d'authentification dans l'en-tête de la requête :
