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

Vous ferez le rendu sur la forge, créez un projet git dès maintenant, puis un projet npm.

### Mise en place du serveur

Structurer votre projet pour avoir un dossier serveur et un dossier client clairement nommés.

Installer [Node](https://nodejs.org/) et [Express](https://expressjs.com/) si ce n'est pas déjà fait. Si c'est le cas, pensez à les mettre à jour.


__Pensez à bien ajouter les fichiers qui n'ont pas à être versionnés à .gitignore__ (ex: node_modules, dist, ...)

Voici le coeur d'un serveur Express.

```javascript
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

Ajouter un script à package.json qui permette de lancer votre serveur.avec la commande 
`npm run start`

```json
"scripts": {
  "start": "node serveur/index.js",
  "test": "echo \"Error: pas de tests pour le moment\" && exit 1"
}
```


Vérifier que le serveur fonctionne et versionnez.


### Mise en place de Webpack

Installer [Webpack](https://webpack.js.org/) en dev (pas la peine d'avoir les dépendances pour le déploiement)  :

- `webpack` (Le bundler)
- `webpack-cli` (Command Line Interface pour lancer les commandes webpack)

Dans `package.json` ajouter une commande `build` (dans `scripts`)

```json
"scripts": {
  "build": "webpack --mode production"
}
```

Tentez un build, regarder les fichiers/dossiers générés. 

### Configuration de Babel 

React s'appuie sur [JSX](https://reactjs.org/docs/introducing-jsx.html) pour 
lier la logique de rendu, la gestion d'évènement et les changements d'états 
pour un élément donné. Ces éléments seraient normalement séparés entre langages 
et technos différentes. Babel permet de traduire ce code (et au passage de transformer du ES6 en ES6).

Installer les dépendances (de développement) suivantes:

- `@babel/core` (ES6+ vers ES5)
- `@babel/preset-env` (Preset pour les polyfills)
- `@babel/preset-react` (Preset pour React et JSX)
- `babel-loader` (pour l'intégration avec Webpack)

Configurer Babel à l'aide d'un fichier `.babelrc` à la racine de votre projet, 
en indiquant les pré-configurations utilisées pour le reste du projet.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Il faut spécifier à Webpack la transpilation Babel des fichiers .js et .jsx du projet lors du build. 
Cela se fait le fichier `webpack.config.js` :

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```


### Projet React


### Générer un bundle


### Assembler et servir le contenu


### Rendu et évaluation
