# Pretatous Back-End v2

Reboot du backend à partir de [Express REST API Generator](https://express-rest-api-generato.readthedocs.io/en/latest/), afin de produire plus vite les APIs nécessaires au front-end.

## Restauration de MongoDB en local
Pour restaurer/importer la base de données MongoDB du projet (dev)
$ cd ~/repertoire/du/projet/back-end
$ mongorestore -d pretatousbeTest ./mongo-backup/

Pour exporter/sauvegarder la base de données MongoDB du projet (dev)
$ cd ~/repertoire/du/projet/back-end
$ mongodump -d pretatousbeDev -o ./mongo-backup/

## Quelques rappels sur Mongo
$ mongo
>show dbs
>use pretatousbeDev
>db.useraccounts.find({})
>



Pour lancer le back-end (dev)
$ npm start ou node app.js

Les services sont accessibles sur le port 3000
localhost:3000/useraccounts
localhost:3000/products
localhost:3000/bookingrequests
localhost:3000/bookings
localhost:3000/loans
localhost:3000/returns
localhost:3000/messages
localhost:3000/accounts (inutiles)

On peut y faire des 
- liste : GET useraccounts
- un élément: GET useraccounts/HASH_ID
- ajouter: POST useraccounts
- supprimer: DELETE useraccounts/HASH_ID
- MAJ : PATCH useraccounts/HASH_ID

## Remarques

**Atttention !** 

- Pour que le serveur back-end accepte des POST (ajout d'un objet), il est nécesaire d'ajouter une entête HTTP 

    x-tag:HASH_DE_SESSION

Pour avoir ce HASH_DE_SESSION, ouvrir dans le navigateur web: 
    localhost:3000/initialize
    
Récupérer le hash de session. La session dure plusieurs jours

- l'entête HTTP PUT ne sert ici que les updates en masse.
- idem DELETE lorsqu'il n'y a pas de HASH_ID dans l'URL
