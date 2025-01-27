# Documentation de l’API : Extraction de Données des Reçus

## Présentation

L’API est conçue pour traiter des reçus ou des billets (PDF ou images) afin d’extraire des informations structurées telles que les lieux de départ et d’arrivée, les dates de voyage, et d’autres détails pertinents. L’objectif principal de l’API est de fournir une réponse formatée selon les spécifications requises par l’outil de calcul de l’empreinte carbone Carbon Clap, facilitant ainsi l’intégration des données extraites dans le processus de calcul des émissions de CO₂.

## URL de Base

``` https://example-api.com/api/v1```

## Authentification

Aucune authentification n’est requise, car l’API ne traite pas de données sensibles.

## Catégories Prises en Charge

L’API prend actuellement en charge les catégories suivantes :

•	trains : Extraction des gares de départ et d’arrivée.

•	avions : Extraction des aéroports de départ et d’arrivée.

•	peage : Extraction des points d’entrée et de sortie des péages.

•	essence : Extraction des montants d’essence.

## Points de Terminaison

1. Extraire des Données de Reçu

**POST /extract**

## Description

Traite un fichier de reçu ou de billet et extrait des informations structurées.

## Paramètres de la Requête

|Paramètre|	Type|	Obligatoire|	Description|
|---|---|---|---|
|file	|Fichier|	Oui,	Le fichier de reçu ou de billet à traiter.| Formats pris en charge : PDF, JPG, PNG.
|category|	String|	Oui,	La catégorie du reçu (trains, avions, peage).|
|countries|	Liste|	Optionnel|	Liste de codes pays pour filtrer les gares/aéroports (par exemple, ["FR"]).

## Exemple de Requête

```bash
curl -X POST https://votre-domaine-api.com/api/v1/extract \
  -F "file=@chemin/vers/recu.pdf" \
  -F "category=trains" \
  -F "countries[]=FR"
```

## Réponse

|Champ|	Type|	Description|
|---|---|---|
|category|	String|	La catégorie du reçu (trains, avions, peage, essence
).|
|name_of_trip|	String|	Une chaîne formatée indiquant le trajet (par exemple, Paris à Lyon).|
|type_of_transport|	String|	Le type de transport (si applicable).|
|are_kilometers_known|	Booléen	Indique si les kilomètres pour le trajet sont connus.|
|number_of_kilometers| Float|	Le nombre de kilomètres pour le trajet.|
|departure|	String|	Gare, aéroport ou point d’entrée de départ.|
|arrival|	String|	Gare, aéroport ou point de sortie d’arrivée.|
|number_of_trips|	Entier|	Nombre de trajets identifiés.|

## Exemple de Réponse

Pour la catégorie trains :

```json
{
  "category": "trains",
  "name_of_trip": "Paris à Lyon",
  "type_of_transport": null,
  "are_kilometers_known": false,
  "departure": "Paris",
  "arrival": "Lyon",
  "number_of_trips": 1
}
```

Pour la catégorie peage :

```json
{
  "category": "peage",
  "name_of_trip": "Sortie: 25008000 à Entrée: Lyon",
  "type_of_transport": null,
  "are_kilometers_known": false,
  "departure": "25008000",
  "arrival": "Lyon",
  "number_of_trips": 1
}
```

## Exemple d’Erreur :

```json
{
  "detail": "Erreur lors du traitement du fichier : Aucun point d'entrée ou de sortie valide trouvé dans le fichier."
}
```

## Gestion des Erreurs

L’API utilise des codes HTTP standard pour les réponses d’erreur :

|Code| HTTP|	Description|
|---|---|---|
|200 |OK	|La requête a réussi.|
|400| Bad Request|	Entrée invalide ou paramètres obligatoires manquants.|
|422| Unprocessable Entity|	Le traitement du fichier a échoué ou aucune donnée trouvée.|

## Bonnes Pratiques

1.	Validez le format du fichier :
Assurez-vous que le fichier téléchargé est au format PDF ou image (JPG, PNG). La conversion de fichier peut causer des erreurs.

2.	Lors de l’extraction des gares ou des aéroports, utilisez le paramètre countries pour limiter les correspondances.


## FAQ

**Quels formats de fichier sont pris en charge ?**

•	PDF, JPG, et PNG.

**L’API nécessite-t-elle une authentification ?**

Non, l’API est ouverte et ne nécessite pas d’authentification.

**Comment spécifier plusieurs pays pour le filtrage ?**

Passez une liste de codes pays dans le paramètre countries, par exemple ["FR", "DE"].



