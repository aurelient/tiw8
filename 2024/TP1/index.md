## TIW8 - TP1 Mise en place Stack

#### Encadrants

- Aurélien Tabard (responsable)

### Présentation du TP

L'objectif du TP est de mettre en place "l'enveloppe" d'une application Web avec un serveur Node/Express léger, et un framework JS côté client. Pour l'UE le client sera développé avec React, mais la "stack" que nous allons voir dans ce TP serait peu ou presque la même pour Angular ou Vue.

Nous allons voir :

- La mise en place d'un serveur Node/Express basique
- L'automatisation d'un build
- Comment configurer la transpilation du code Typescript et des composants TSX en code interprétable par n'importe quel navigateur
- Créer un projet React
- Créer deux composants React basiques
- Gérer le bundling avec Vite
- Utiliser un linter pour vérifier votre code
- Assembler et servir le contenu avec un serveur node/express simple.

Ce TP fera l'objet d'un premier rendu **individuel** et d'une note binaire (PASS/FAIL). Voir les critères d'évaluation en bas de la page.

Vous ferez le rendu sur la forge (ce mercredi 8/01).


🔓 Si vous êtes déjà familier de la stack ci-dessus, vous pouvez utiliser Typescript et des composants TSX, et utiliser Webpack à la place de Vite (voir le [TP de l'année dernière](https://aurelient.github.io/tiw8/2023/TP1/))

### Initialisation du projet

Nous vous recommandons chaudement de vous servir d'un `version manager` pour NodeJS comme `Node Version Manager` [NVM](https://github.com/nvm-sh/nvm) afin de pouvoir changer de version de Node facilement ou installer la dernière version `long term support (LTS)` avec `nvm install --lts`. Ce conseil s'applique à toutes les autres technologies peu importe le langage (venv pour python, sdkman! pour le sdk android, ...) 

Créez un projet git sur la forge dès maintenant. Remplissez le champ Tomuss associé.

Installer [Node](https://nodejs.org/) dans sa dernière version `lts` et [Express](https://expressjs.com/) si ce n'est pas déjà fait. Si c'est le cas, pensez à les mettre à jour.

(Optionel) Selon votre OS, la version de node et d'Express que vous allez installer, il sera peut être nécessaire d'installer `express-generator` qui gère le "cli" d'Express (la possibilité de l'invoquer depuis la ligne de commande). Installez le globalement avec npm ou yarn.

À la racine de votre projet, créez deux dossiers:
- un dossier `server` avec un dossier `src` qui contiendra le code Nodejs + Express côté serveur
- un dossier `client` avec un dossier `src` qui contiendra le code React côté navigateur

Ce sont deux projets distincts.

**Pensez régulièrement à ajouter les fichiers qui n'ont pas à être versionnés à votre .gitignore** (_a minima_ : node_modules & dist), vous pouvez vous servir de [gitignore.io](https://www.toptal.com/developers/gitignore/) pour en générer un via des tags (Visual Studio Code, nodejs, ...)

Poussez le projet sur la forge.

On va en premier configurer le serveur.

### Partie serveur

Allez dans le dossier `server`.

Créez un projet node (`yarn init`), en le liant à votre dépôt Git sur la forge via le champs `repository` du `package.json`. 

Pour pouvoir travailler avec Typescript, installez quelques dépendances supplémentaires:

```bash
# Ajoute typescript à votre projet
yarn add typescript ts-node express --dev

# Ajoute les types d'un module à typescript
yarn add @types/node @types/express

# Installe le compilateur Typescript de façon globale
npm i -g tsc

# Créé un fichier de configuration pour Typescript
tsc --init
```

Trouvez le fichier automatiquement généré `tsconfig.json`:
- Cherchez la ligne `outDir` et décommentez là pour mettre comme valeur `./dist`.
- Cherchez la ligne `rootDir` et décommentez là pour mettre comme valeur `./src`.
- Dans le fichier `package.json`, dans la partie `scripts`, mettre:

```json
"scripts": {
  "start": "tsc && node dist/index.js"
}
```

### Mise en place du serveur

Voici l'architecture du projet express que nous allons créer:

```
| - dist
| - src
| | - index.ts
| | - routes
|   | - hello.router.ts 
| - package.json
| - yarn.lock
| - tsconfig.json
| - .gitignore
```

Dans notre `index.ts`, nous allons créer le serveur:

```js
import express from 'express';
import { HelloRouteur } from './routes/hello.router';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  process.stdout.write(`Server started on port: ${port}\n`);
});

app.use('/hello', HelloRouteur);
```

Dans `hello.router.ts`, nous allons créer un des routeurs de notre API:

```javascript
import express from 'express';

const helloRouteur = express.Router();

// With middlewares you can ensure the user is authenticated
// before requesting secured API routes
helloRouteur.use((request, response, next) => {
  process.stdout.write('HelloRouter Middleware\n');
  if (request.ip.endsWith('127.0.0.1')) {
    process.stdout.write('Request from local IP\n');
    next();
  } else {
    next();
  }
});

helloRouteur.get('/', (request, response) => {
  response.send('Hello TIW8 !');
});

export {
  helloRouteur as HelloRouteur
};
```

Testez votre serveur avec la commande `yarn start`

Si vous avez des problèmes remontés par Typescript, cherchez à les résoudre. **En comprenant ce que vous faites**, en cas de doutes, on en parle en classe.

Vérifier que le serveur fonctionne et versionnez le sur la forge.


### Projet React

Allez maintenant dans le dossier `client`.

Nous verrons plus en détail le fonctionnement de React lors de la prochaine séance.
Pour le moment nous allons créer un projet simple.

Comme pour le projet serveur, il faut installer quelques dépendances avant tout:

```bash
yarn add react-dom react 
```

Dans le dossier `src`, créez un `index.html`.
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
    <!-- L'id de ce div est important -->
    <div id="root"></div>
  </body>
</html>
```

Dans le même dossier nous allons créer un premier composant React, on l'appellera `index.tsx` (l'extension de fichier est très importante):

```javascript
import * as React from "react";
import { createRoot } from 'react-dom/client'

const Index = () => (
    <div className="container">
        <h1>Hello World</h1>
    </div>
)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<Index />)
```



#### Bundling

Il faut maintenant assembler le code .


Cette commande doit vous générer un fichier HTML et un fichier JS dans `dist`.

### Servir le contenu

Il faut maintenant dire à Express où aller chercher le contenu.
Pour cela il faut lui dire que sa route `/` est maintenant `../../client/dist/index.html`

Rajouter les constantes suivantes (selon vos noms de fichiers et de dossiers) :

```js
const path = require("path");

const DIST_DIR = path.join(__dirname, "../../client/dist");
const HTML_FILE = path.join(DIST_DIR, "index.html");

// TODO Modifier la route '/' pour qu'elle pointe sur HTML_FILE
```

#### Gérer les fichiers statiques

Pour que Express trouve plus tard son chemin "de base" et les fichiers statiques générés par Webpack (images, css...) rajouter la ligne suivante:

```js
app.use(express.static(DIST_DIR));
```

Installez le module `file-loader` (toujours en dev).

Et rajoutez la règle suivante dans la partie `rules` du fichier `webpack.config.js:` pour que webpack place les images dans un dossier `/static/`.

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

Je conseille d'utiliser une surcouche à [Tailwind CSS](https://tailwindcss.com/). 
Par exemple [shadcn/ui](https://ui.shadcn.com/docs). 


### Linting

Pour vérifier que votre code se conforme aux bonnes pratiques, nous allons utiliser eslint, et son [plugin react](https://github.com/yannickcr/eslint-plugin-react).

Pour créer votre fichier de configuration `eslint` taper `yarn run eslint --init`
Vous pouvez tester eslint à la "main" avec

```
yarn run eslint src/*.tsx
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

Si vous utilisez Prettier dans votre editeur de code vous risquez de rencontrer des conflits avec ESlint . J'ai suivi [la documentation de Prettier](https://prettier.io/docs/en/comparison.html), et ces deux posts [1](https://javascript.plainenglish.io/setting-eslint-and-prettier-on-a-react-typescript-project-2021-22993565edf9), [2](https://khalilstemmler.com/blogs/tooling/prettier/) pour corriger ça.


### Déployer sur GitLab Pages

Afin de rendre notre application disponible sur le Web, nous allons la déployer sur le GitLab Pages de votre projet.

Depuis la page de votre projet GitLab, allez dans `settings > pages` et suivez les indications pour héberger le site.

N'oubliez pas de désactiver l'option `watch` de webpack si vous lancez Webpack en `--mode production` [voir ici](https://webpack.js.org/configuration/mode/).

### Des composants Reacts

Créer deux composants basiques sans aucune logique. Le premier affichera un titre. Le deuxième affichera des images prises dans un dossier statique.
On placera ces composants dans un dossier `components`.

```js
import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header.tsx";
import Content from "./components/Content.tsx";
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

Le TP est individuel. **Il est évalué sur une base binaire REUSSI/RATE** et compte pour 10% de la note de Controle Continu (CC) totale. Il est à rendre pour vendredi 12 23h59.

Les critères d'évaluation sont les suivants pour avoir un REUSSI (=20), si un des critères n'est pas rempli c'est un RATE (=0):

- Le rendu est effectué avant la deadline. Pensez à remplir les deux champs Tomuss associés au TP1 (lien forge pour clone, et lien gitlab pages).
- Les responsables de l'UE sont ajoutés au projet forge (ils/elles peuvent cloner le projet)
- Le lien vers la forge fournit sur Tomuss permet un `git clone` sans aucune modification de l'url
- Le projet ne contient que des éléments nécessaire (.gitignore est bien défini)
- `yarn run build` construit le projet
- `yarn run start` lance le serveur.
- `eslint` ne retourne pas d'erreur
- l'application Web est bien déployée sur gitlab pages au lien fournit dans le rendu