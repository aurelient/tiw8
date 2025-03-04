## TIW8 - TP1 Mise en place Stack

#### Encadrants

- Aurélien Tabard (responsable)
- Louis Le Brun

### Présentation du TP

L'objectif du TP est de mettre en place "l'enveloppe" d'une application Web avec un serveur Node/Express léger, et un framework JS côté client. Pour l'UE le client sera développé avec React, mais la "stack" que nous allons voir dans ce TP serait peu ou prou la même pour Angular ou Vue.

Nous allons voir :

- La mise en place d'un serveur Node/Express basique
- L'automatisation d'un build
- Comment configurer la transpilation du code Typescript et des composants TSX en code interprétable par n'importe quel navigateur.
- Créer un projet React
- Créer deux composants React basiques
- Gérer le bundling avec Webpack
- Utiliser un linter pour vérifier votre code
- Assembler et servir le contenu
- Déployer sur Heroku

Ce TP fera l'objet d'un premier rendu **individuel** et d'une note binaire (PASS/FAIL). Voir les critères d'évaluation en bas de la page.

Vous ferez le rendu sur la forge.

### Initialisation du projet

Créez un projet git sur la forge dès maintenant. Remplissez le champ Tomuss associé.

Installer [Node](https://nodejs.org/) et [Express](https://expressjs.com/) si ce n'est pas déjà fait. Si c'est le cas, pensez à les mettre à jour.

Selon votre OS, la version de node et d'Express que vous allez installer, il sera peut être nécessaire d'installer `express-generator` qui gère le "cli" d'Express (la possibilité de l'invoquer depuis la ligne de commande). Installez le globalement avec npm ou yarn.

**Pensez régulièrement à ajouter les fichiers qui n'ont pas à être versionnés à votre .gitignore** (_a minima_ : node_modules & dist)

Créez un projet node (`yarn init`), en le liant à votre dépôt Git sur la forge. Structurer votre projet en :

- un dossier `server` qui contiendra le code Nodejs + Express côté serveur
- un dossier `client` ou `src` qui contiendra le code React côté navigateur

Poussez ce projet sur la forge.

### Mise en place du serveur

Voici le coeur d'un serveur Express.

```javascript
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mockResponse = {
  foo: "bar",
  bar: "foo",
};
app.get("/api", (req, res) => {
  res.send(mockResponse);
});
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});
app.listen(port, function () {
  console.log("App listening on port: " + port);
});
```

Installer express `yarn add express`, puis ajouter un script au package.json qui permette de lancer votre serveur avec la commande
`yarn run start`

```json
"scripts": {
  "start": "node server/index.js",
  "test": "echo \"Error: pas de tests pour le moment\" && exit 1"
}
```

Vérifier que le serveur fonctionne et versionner.

### Projet React

Nous verrons plus en détail le fonctionnement de React lors de la prochaine séance.
Pour le moment nous allons créer un projet simple. Nous utiliserons Typescript plutôt que du JavaScript au passage.

```
yarn add --dev typescript
```

Installons react et react-dom, ainsi que les déclarations de type pour Typescript.

```
yarn add --dev react-dom react @types/react-dom @types/react
```

Dans votre dossier client (`client`), créer un `index.html`.
Ce sera le seul fichier HTML du projet, il sera "peuplé" dynamiquement par React.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>React TP1</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Dans le même dossier nous allons créer un premier composant React, on l'appellera `index.tsx`:

```javascript
import * as React from "react";
import * as ReactDOM from "react-dom";

const Index = () => {
  return <div>TIW 8 TP1!</div>;
};
ReactDOM.render(<Index />, document.getElementById("root"));
```

### Générer un bundle avec Webpack

#### Mise en place de Webpack

Installer [Webpack](https://webpack.js.org/) en dev (pas la peine d'avoir les dépendances pour le déploiement) :

- `webpack` (Le bundler)
- `webpack-cli` (Command Line Interface pour lancer les commandes webpack)

Installez également le module [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) pour faciliter la création de fichier HTML avec Webpack.

```
yarn add --dev ts-loader css-loader html-webpack-plugin mini-css-extract-plugin source-map-loader webpack webpack-cli
```

#### Configuration de webpack

Même si les dernières versions de webpack peuvent fonctionner sans fichier de configuration (avec des défauts), vous aurez de toutes façons à spécifier une config dans ce TP. Mettez donc en place un fichier `webpack.config.js` avec une configuration minimale (entry, output), que vous allez modifier par la suite.

Dans ce fichier de configuration, pointez vers le point d'entée React (le fichier index.jsx) et indiquez ou l'appliquer (`template: "./client/index.html"`). Ci-dessous une partie de ce fichier, qui sera complétée par la suite :

```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./client/index.html",
  filename: "./index.html"
});
module.exports = (env, argv) => {
  console.log(argv.mode);
  return {
    entry: "./client/index.tsx",
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "bundle.js"
    },
    plugins: [htmlPlugin],
    module: {
      rules: [
        {
          ...
        }
      ]
    }
  };
};
```

#### Transpilation et configuration de Babel

React s'appuie "normalement" sur [JSX](https://reactjs.org/docs/introducing-jsx.html) pour
lier la logique de rendu, la gestion d'évènement et les changements d'états
pour un élément donné. Ces éléments seraient normalement séparés entre langages
et technos différentes. Babel permet de traduire ce code (et au passage de transformer du ES6 en ES5).

Nous allons reprendre la même logique mais avec du Typescript (un fichier typescript simple se termine en .ts, nous allons créer des .tsx).
JSX, Typescript ou TSX ne sont pas interprétés par les navigateurs, nous devons donc le "traduire" ou transpiler en HTML+JS pour que le code devienne compréhensible.

Nous avons normalement déjà installé les dépendances typescript, reste à installer un dépendance (de développement) pour l'intégration à Webpack: `ts-loader`

Configurez le transpileur Typescript à l'aide d'un fichier `tsconfig.json` à la racine de votre projet, en indiquant les pré-configurations utilisées pour le reste du projet.

```json
{
  "compilerOptions": {
    "jsx": "react",
    "module": "commonjs",
    "noImplicitAny": true,
    "outDir": "./dist/",
    "preserveConstEnums": true,
    "removeComments": true,
    "sourceMap": true,
    "target": "es5"
  },
  "include": ["client"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
```

Il faut spécifier à Webpack la transpilation des fichiers .ts et .tsx du projet lors du build.
Cela se fait dans le fichier `webpack.config.js` :

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
};
```

Il faut aussi spécifier à votre bundler (Webpack) comment résoudre les liens vers les modules, il faut lui dire de quelles extensions de fichier rajouter et dans quel ordre les traiter.
Pour cela on utilise la directive [resolve](https://webpack.js.org/configuration/resolve/) de webpack.

```javascript
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
```

#### Bundling

Il faut maintenant assembler le code React.

Dans `package.json` ajouter une commande `build` (dans `scripts`)

```json
"scripts": {
  "build": "webpack --mode production"
}
```

Cette commande doit vous générer un fichier HTML et un fichier JS dans `dist`.

### Servir le contenu

Il faut maintenant dire à Express où aller chercher le contenu.
Pour cela il faut lui dire que sa route '/' est maintenant `dist/index.html`

Rajouter les constantes suivantes (selon vos noms de fichiers et de dossiers) :

```js
const path = require("path");

const DIST_DIR = path.join(__dirname, "../dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

// TODO Modifier la route '/' pour qu'elle pointe sur HTML_FILE
```

Nous allons aussi rajouter la commande suivante dans `package.json` pour distinguer un build de dev et un de production.

```
  "dev": "webpack --mode development && node server/index.js",
```

#### Gérer les fichiers statiques

Pour que Express trouve plus tard son chemin "de base" et les fichiers statiques générés par Webpack (images, css...) rajouter la ligne suivante:

```js
app.use(express.static(DIST_DIR));
```

Installez le module `file-loader` (toujours en dev).

Et rajoutez la règle suivante dans `webpack.config.js:` pour que webpack place les images dans un dossier `/static/`.

```js
{
  test: /\.(png|svg|jpg|gif)$/,
  loader: "file-loader",
  options: { name: '/static/[name].[ext]' }
}
```

> Note: depuis Webpack 5, vous pouvez préférer [Asset Modules](https://webpack.js.org/guides/asset-modules/) qui évite d'utiliser un loader externe.

Il faudra les importer dans vos composants. Voici comment cela se fait au sein d'un composant React:

```js
// Import de l'image
import LOGO from "./logo.png";

// Utilisation
<img src={LOGO} alt="Logo" />;
```

Pour que l'import marche, il faut spécifier à Typescript et Webpack de traiter les images comme des modules:

- Créer un fichier `index.d.ts` qui contient la définition des modules/types associé aux extensions de fichiers :

```
declare module '*.png';
declare module '*.jpg';
```

- Dans `tsconfig.json`, modifier la ligne d'include en rajoutant le fichier créé : `["client", "index.d.ts"],`

### CSS

Nous allons utiliser une bibliothèque dérivée de [Tailwind CSS](https://tailwindcss.com/) qui fonctionne bien avec React: [Windmill React UI](https://windmillui.com/react-ui). Cette bibliothèque fournit des composants, mais permet aussi de s'appuyer sur Tailwind pour la création de nouveaux composants/widgets.

### Linting

Pour vérifier que votre code se conforme aux bonnes pratiques, nous allons utiliser eslint, et son [plugin react](https://github.com/yannickcr/eslint-plugin-react).

Pour créer votre fichier de configuration `eslint` taper `yarn run eslint --init` votre configuration devrait ressembler à cela

```
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · require
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JSON
```

Vous pouvez tester eslint à la "main" avec

```
yarn run eslint client/*.tsx
```

Ajouter ensuite eslint à Webpack. Installez le module `eslint-webpack-plugin` en dev. Importez le dans votre webpack config et rajouter les lignes suivantes au blog plugin. eslint se lancera maintenant lors du build (vous pouvez rajouter une erreur dans votre index.tsx et tester le build).

```
  plugins: [
    ...,
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
  ],
```

### Déployer sur Heroku

Afin de rendre notre application disponible sur le Web, nous allons la déployer sur [Heroku](https://heroku.com).
Suivre le guide de Heroku pour déployer une application via git :
[https://devcenter.heroku.com/articles/git#creating-a-heroku-remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)

Pensez à bien committer avant de pusher sur heroku.

N'oubliez pas de désactiver l'option `watch` de webpack si vous lancez Webpack en `--mode production` [voir ici](https://webpack.js.org/configuration/mode/).

### Des composants Reacts

Créer deux composants basiques sans aucune logique. Le premier affichera un titre. Le deuxième affichera des images prises dans un dossier statique.
On placera ces composants dans un dossier `components`.

```js
import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header/index.jsx";
import Content from "./components/Content/index.jsx";
const Index = () => {
  return (
    <div className="container">
      <Header />
      <Content />
    </div>
  );
};
ReactDOM.render(<Index />, document.getElementById("root"));
```

### React Developer Tools

Installez l'extension [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) dans votre navigateur préféré.
Inspectez l'application.

### Rendu et évaluation

Le TP est individuel. **Il est évalué sur une base binaire PASS/FAIL** et compte pour 10% de la note de Controle Continu (CC) totale. Il est à rendre pour dimanche 19 23h59.

Les critères d'évaluation sont les suivants pour avoir un PASS (=20), si un des critères n'est pas rempli c'est un FAIL (=0):

- Le rendu est effectué avant ce soir minuit. Pensez à remplir les deux champs Tomuss associés au TP1 (lien forge pour clone, et lien heroku).
- Les responsables de l'UE sont ajoutés au projet forge (le projet est clonable)
- Le lien vers la forge fournit sur Tomuss permet un `git clone` sans aucune modification
- Le projet ne contient que des éléments nécessaire (.gitignore est bien défini)
- `yarn run build` construit le projet
- `yarn run start` lance le serveur.
- `eslint` ne retourne pas d'erreur
- l'application Web est bien déployée sur Heroku au lien fournit dans le rendu

## Pour aller plus loin

Il est possible d'automatiser votre déploiement sur Héroku dès que vous mettez à jour votre code sur la forge.

Pour ce faire, on va configurer une CI/CD (Continuous Integration/Continuous Deployement) sur la forge.

### Heroku

Pour pouvoir mettre en place cette CI de façon propre, il vous faudra un compte Héroku et accéder directement au [Dashboard Heroku](https://dashboard.heroku.com/).

Depuis le dashboard, cliquez sur `New` > `Create new App` et saisissez un nom pour votre application, et conservez le pour la suite. Dans les bonnes pratiques, on créé un projet par environnement donc il n'est pas rare de voir un projet `dev`, `staging` et prod. 

Une fois que cette étape est réalisée, accédez à la page des settings et bas de celle-ci vous devriez trouver un champ `API Key`, copiez et conservez la valeur de ce champ, on va en avoir besoin juste après.

### .gitlab-ci.yml

À la racine de votre projet, créez un fichier `.gitlab-ci.yml`. Ce fichier sera repéré par Gitlab et sera interprété, vous pourrez vérifier que Gitlab l'a bien pris en compte en regardant les "Jobs" dans votre projet dans l'onglet "CI/CD".

Dans ce fichier vous allez ajouter ceci:

``` yaml
image: node:latest

before_script:
    - apt update -qy
    - apt install -y ruby-dev
    - gem install dpl

stages:
    - dev

dev:
    type: deploy
    stage: dev
    image: ruby:latest
    script:
        - dpl --provider=heroku --app=$HEROKU_APP_DEV --api-key=$HEROKU_API_KEY
    only:
        - develop
```

C'est la configuration de notre Runner Gitlab, la machine virtuelle qui va se charger de déployer notre code.

On précise son image, et avant son exécution, on lui demande d'installer dpl, un outil de déploiement issu de travis dont la description est dispo [ici](https://github.com/travis-ci/dpl) si vous êtes curieux.

Ensuite, pour le stage `dev`, on lui demande d'exécuter les commandes dans la partie `script` mais de déclencher cette étape UNIQUEMENT sur la branche `develop` de votre projet sur la forge.

Dans le script, on se sert de variables d'environnement: `HEROKU_APP_DEV` et `HEROKU_API_KEY`.

Ces variables, vous devez les préciser dans votre repo la forge: `Settings` > `CI/CD` > `Variables` > `Expand` > `Add variable`.

Ajoutez la variable `HEROKU_API_KEY` qui a pour valeur la `clé d'API` que vous avez conservé plus haut.

Ajoutez la variable `HEROKU_APP_DEV` qui est le nom de votre application de dev sur le dashboard Héroku.

Une fois que tout ça est mis en place, si vous mettez à jour le code sur votre branche `develop`, vous pourrez voir qu'un `Job` se lance, et quand celui-ci est terminé, votre code sera dispo sur Heroku ! Regardez les logs du runner pour avoir plus d'infos et notamment l'url de votre page.