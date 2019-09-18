## TIW8 - TP1 Mise en place Stack

#### Encadrants
- Aurélien Tabard (responsable)
- Lionel Médini
- Alix Ducros



### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA), développée principalement côté client avec React, avec un serveur Node/Express léger. Client et serveur seront codés en JavaScript. Nous allons voir

- La mise en place d'un serveur Express très basique
- L'automatisation et le bundling avec Webpack
- Comment configurer Babel pour la rétrocompatibilité du code
- Créer un projet React 
- Créer deux composants React basiques
- Générer un bundle
- Assembler et servir le contenu


Ce TP fera l'objet d'un premier rendu et d'une note. Voir les critères d'évaluation à la fin du TP.

Vous ferez le rendu sur la forge, créez un projet git dès maintenant.

### Mise en place du serveur

Structurez votre projet pour avoir un dossier serveur et un dossier client clairement nommés.

Installez [Node](https://nodejs.org/) et [Express](https://expressjs.com/) si ce n'est pas déjà fait.


__Penser à bien ajouter les fichiers qui n'ont pas à être versionnés à .gitignore (node_modules)__

Voici le coeur d'un serveur Express.

```js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mockResponse = {
  foo: 'bar',
  bar: 'foo'
};
app.get('/api', (req, res) => {
  res.send(mockResponse);
});
app.get('/', (req, res) => {
 res.status(200).send('Hello World!');
});
app.listen(port, function () {
 console.log('App listening on port: ' + port);
});
```

Ajoutez un script à package.json qui permette de lancer votre serveur.avec la commande 
`npm run start`

```json
"scripts": {
  "start": "node serveur/index.js",
  "test": "echo \"Error: pas de tests pour le moment\" && exit 1"
}
```


Vérifier que le serveur fonctionne et versionnez.


### Mise en place de Webpack





### Mise en place du client React
