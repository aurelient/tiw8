## TIW8 - TP2 Application de Présentation multi-surface en React

#### Encadrants

- Aurélien Tabard (responsable)
- Louis Le Brun

#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant de créer et contrôler des présentations. Elle sera développée principalement côté client avec React, avec un serveur Node/Express léger. Le serveur sera codé en JavaScript, le client en TypeScript.

Les points suivants seront abordés

- Composants React
- Gestion des états et flux de données
- Gestion de routes React
- Redux pour la gestion avancée des états
- Middleware pour gérer des effets de bord
- Websockets et communication temps réelle entre dispositifs
- Design responsif et adaptatif
- Reconnaissance de gestes

Ce TP s'étalera sur 4 séances et fera l'objet d'un rendu en binome et d'une note. Voir les critères d'évaluation en bas de la page.

Pensez à remplir le formulaire de rendu sur Tomuss (n'importe quand avant la date de rendu).

#### Quelques pointeurs vers la doc React

- [Introduction à la structuration d'application React](https://reactjs.org/docs/thinking-in-react.html)
- [Components and Props](https://reactjs.org/docs/components-and-props.html)
- [Hooks at a Glance](https://reactjs.org/docs/hooks-overview.html)
- [En quoi les fonctions composants sont-elles différentes des classes ?](https://overreacted.io/fr/how-are-function-components-different-from-classes/)

## TP2.1 Introduction à React

Nous allons repartir du TP1 pour ce projet, et le pousser dans un nouveau repo dédié au TP2 (pour les 4 séances du TP).

Si vous utilisez Prettier vous pouvez suivre [ce tutoriel pour que les règles de eslint et de prettier soient alignées.](https://javascript.plainenglish.io/setting-eslint-and-prettier-on-a-react-typescript-project-2021-22993565edf9)

### Structurer une application React en composants

Lire l'[introduction à la structuration d'application React](https://reactjs.org/docs/thinking-in-react.html).

Nous allons commencer par créer un squelette d'application statique, nous rajouterons les parties dynamiques par la suite.

L'application est composée de transparents, d'outils d'édition, d'outils de navigation, et d'outils de présentations (notes, timer, ...)

<iframe style="border: none;" width="600" height="337" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FUzpqcHwddgDnfriafh7gIs%2FUntitled%3Fnode-id%3D0%253A1" allowfullscreen></iframe>

Les transparents auront (à minima) deux modèles:

- titre (le transparent ne contient qu'un grand titre centré), et
- contenu qui peut avoir les éléments suivants :
  - Titre,
  - Image (url vers imgur ou autre fournisseur d'image),
  - Texte (texte libre ou liste).
  - Notes pour l'orateur
  - Visibilité (afficher/cacher le transparent)
- On peut penser à d'autre modèles: image seule, iframe intégrant une page html, slide avec flux de la webcam intégré...

Imaginez que le serveur envoie ce type de données (qui peuvent être améliorées/modifiées selon vos besoins) :

```typescript
[
  { type: "title", title: "TIW 8", visible: true, notes: "" },
  {
    type: "content",
    title: "TP 1",
    text: "Le TP porte sur des rappels de developpement Web",
    visible: false,
    notes: "ce transparent est caché",
  },
  {
    type: "content",
    title: "TP 2",
    text: "Le TP porte sur la creation d'un outil de presentation HTML",
    visible: true,
    notes: "",
  },
  { type: "content", title: "TP 3", text: "Le TP 3", visible: true, notes: "" },
  { type: "content", title: "TP 4", text: "Le TP 4", visible: true, notes: "" },
  { type: "title", title: "Question ?", visible: true, notes: "" },
];
```

<iframe style="border: none;" width="600" height="337" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FUzpqcHwddgDnfriafh7gIs%2Ftiw8-tp2-appstructure%3Fnode-id%3D16%253A3" allowfullscreen></iframe>

<iframe style="border: none;" width="600" height="337" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FUzpqcHwddgDnfriafh7gIs%2Ftiw8-tp2-appstructure%3Fnode-id%3D16%253A15" allowfullscreen></iframe>

Créez la structure des composants correspondant à cette application, en suivant le guide et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy).

Voici une structure pour démarrer, pensez à utiliser les composants Windmill React UI plutôt que du html pur:

```typescript

```

Ce code est donné à titre indicatif. Commencez progressivement et testez régulièrement.

### Créer des composants passifs

Créer des composants fonctionnels passifs (on rajoutera de l'interaction par la suite. Vous pouvez vous inspirer de la syntaxe et de la structure de cette <a href="https://www.digitalocean.com/community/tutorials/how-to-build-a-react-to-do-app-with-react-hooks">mini todo app</a>

Vous allez vous rendre compte rapidement que votre linter râle. En effet, il veut pouvoir vérifier les types qui sont passés en props entre composants. Installez le module `prop-types` et lisez <a href="https://fr.reactjs.org/docs/typechecking-with-proptypes.html">la page suivante pour comprendre comment specifier les types de vos props</a>.

### Gérer la logique de l'application

La toolbar doit contenir deux boutons avant/arrière pour naviguer entre les transparents. Faites en sorte que l'état du slideshow change lorsque vous pressez un bouton, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le bouton parle à des composants parents). Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".

Pour comprendre comment cela fonctionne avec des functionals components et non des class components [référez vous à l'exemple de todo app mentionné plus haut](https://www.digitalocean.com/community/tutorials/how-to-build-a-react-to-do-app-with-react-hooks#step-5-%E2%80%94-updating-to-do-items)

Pour démarrer vous pouvez utiliser l'extension react dev tools, et modifier l'état à la main pour vérifier que la vue change bien.

### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir un lien dédié pour chaque transparent.
En plus d'avoir un état interne à l'application pour savoir quel transparent afficher, nous allons utiliser une route qui pointe vers le transparent en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reacttraining.com/react-router/). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à lire [cette page](https://reacttraining.com/react-router/web/guides/philosophy).

[React router](https://reacttraining.com/react-router/web/guides/primary-components) requiert d'envelopper votre application dans un composant `Router`.

En l'occurrence `HashRouter` (et non `BrowserRouter` qui demande une configuration côté serveur). L'idée est que charger un url de type [http://monsite.net/#/3](http://monsite.net/#/3) charge le 3e transparent. Importez bien `react-router-dom` non.

- Si vous utilisez des `class components`, vous pouvez récupérer la valeur de la route en utilisant un props dédié passé par le routeur. [Suivez cet exemple](https://reacttraining.com/react-router/core/api/withRouter)
- Si vous utilisez des `functional components`, avec le hook `useParams();` vous pouvez récupérer la valeur de la route. [Suivez cet exemple](https://reacttraining.com/react-router/web/example/url-params).

Une fois la valeur de la route récupérée, modifier l'état de l'application, pour qu'il corresponde au transparent à afficher.

## TP2.2 Redux

Nous allons maintenant gérer l’état de l’application sur plusieurs dispositifs en utilisant Redux et des Websockets. L’objectif est que vous puissiez changer l’état de votre application de présentation sur un dispositif (ex: mobile), et que l’état de l’application soit mis à jour partout (ex: vidéo-projection, personne qui regarde votre mur à distance sur sa machine…)

Pensez à relire le cours et les ressources associées pour être au clair sur ce que vous êtes en train de faire.

Afin de vous faciliter le debug du TP, vous pouvez activer la création d’un Source Map dans votre webpack.config.js : `devtool: 'eval-source-map'.`

### Redux

Installez Redux et les dépendances associées pour React (redux, react-redux). Par défaut Redux n’est pas lié à React et peut être utilisé avec d’autres frameworks.

Créez dans src des dossiers pour organiser votre store, vos reducers, actions, et containers.

#### Création d’un store

#### Création d’un reducer

#### Tester Redux et le store

#### Creation des actions

#### Tester les actions

#### Lien Redux / React

#### Lien Redux / React Router

Normalement l’intégration avec React Router se passe bien (pas de changements nécessaire). Si jamais ce n’était pas le cas, suivez l’utilisation de Redux avec React Router telle que présentée dans la documentation de React Router ou celle de Redux pour configurer votre projet.

## TP2.3 Distribution d’interface multi-dispositif

Nous allons maintenant travailler à la distribution de l'application sur plusieurs dispositifs et à leur synchronisation.

### Définition de nouvelles routes et des vues associées

Nous allons définir une route par situations d'usage :

- `controler` : route pour dispositif mobile qui va controler la présentation et afficher les notes de présentation.
- `present` : route pour le mode présentation plein écran, seule une diapositive plein écran sera affichée (pas de toolbar).
- `edit`: mode actuel permettant l'édition des transparents

Il n'existe pas de bibliothèque à l'heure actuelle pour gérer de manière simple de la distribution d'interface, nous allons donc devoir le faire "à la main".

Rajouter des `Redirect` [(doc)](https://reacttraining.com/react-router/web/api/Redirect) à la racine de votre application pour faire une redirection vers une route en fonction du dispositif utilisé et de son état.

Vous pouvez utiliser `react-device-detect` [(doc)](https://www.npmjs.com/package/react-device-detect) pour détecter le dispositif (mobile ou non). Et la `fullscreen API` [(doc)](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) pour controler le plein écran.

Déployez et tester.

### Créez une vue controler

Cette vue pour mobile affiche les notes de présentation associées à un transparet ainsi que les boutons suivant précédent.

Nous allons travailler sur la synchronisation entre les dispositifs ci-dessous. Pour l'instant la vue doit simplement afficher les notes correspondant au transparent courant.

### Gestion "à la main" des routes des transparents.

Nous allons maintenant préparer la synchronisation des dispositifs. Pour cela nous allons devoir gérer le transparent courant dans notre état (`currentSlide` dans le store).
`ReactRouter` n'est pas conçu pour bien gérer le lien entre route et état. Et les routeur alternatifs (type `connected-react-router`) ont aussi des limites. Nous allons donc gérer cette partie de la route à la main.

#### Changer l'état à partir de la route

En écoutant l'évènement `popstate` nous pouvons êtres informé d'un changement dans l'url du navigateur. Si ce changement correspond à un changement dans le numéro de transparent à afficher, nous allons déclencher l'action `setSlide`, avec le numéro de transparent approprié.

Si vous n'avez pas encore définit l'action `setSlide`, créez le action creator correspondant, et le traitement associé dans le reducer.

#### Changer la route à partir de l'état

En écoutant les changements dans le store nous allons pouvoir être notifiés de changement de l'état et les répercuter dans la barre d'url (utile pour la suite, quand nous allons synchroniser des dispositifs):

```javascript
// The other part of the two-way binding is updating the displayed
// URL in the browser if we change it inside our app state in Redux.
// We can simply subscribe to Redux and update it if it's different.
store.subscribe(() => {
  const hash = "#/" + store.getState().currentSlide;
  if (location.hash !== hash) {
    window.location.hash = hash;
    // Force scroll to top this is what browsers normally do when
    // navigating by clicking a link.
    // Without this, scroll stays wherever it was which can be quite odd.
    document.body.scrollTop = 0;
  }
});
```

### Refactorisation

Avant de passer à la suite, nous allons simplifier les ACTIONS de Redux. Supprimez les actions `NEXT_SLIDE` et `PREVIOUS_SLIDE` de votre liste d'actions et de votre Reducer. Aux endroits où ces actions étaient utilisées, remplacer par l'action `SET_SLIDE` avec une incrémentation ou une décrémentation de l'index courant.

### Middleware et websockets

Pour comprendre la logique du Middleware [suivez la documentation Redux](https://redux.js.org/advanced/middleware). Faites un essai qui reprend l'idée et logue dans la console toutes les actions déclenchées (voir [ici](https://redux.js.org/advanced/middleware#the-final-approach) _sans le crashReporter_).

Nous allons maintenant faire communiquer plusieurs navigateurs entre eux gràce à [socket.io](https://socket.io/). Pour cela nous allons rajouter un middleware dédié. Sur un navigateur, quand la slide courante sera changée, un message sera envoyé aux autres navigateurs afin qu'ils changent eux aussi leur slide courante.

Côté serveur, importez `socket.io` ([tuto officiel](https://socket.io/get-started/chat/)) et mettez en place le callback permettant de recevoir les messages `set_slide` provenant d'un client et de les propager à tous les autres clients. Ce [guide permet de créer et tester une micro-application express utilisant socket.io](https://devcenter.heroku.com/articles/node-websockets#option-2-socket-io) en local et sur Heroku.

Côté client créez un [Middleware](https://redux.js.org/advanced/middleware#the-final-approach) dans lequel vous importerez `socket.io-client`. Le middleware devra, dès qu'il intercepte une action de type `SET_SLIDE`, propager un message adéquat via le socket, avant de faire appel à `next(action)`

Toujours dans le middleware, configurez la socket pour qu'à la réception des messages `set_slide`, les actions soient dispatchées au store.

```js
const propagateSocket = (store) => (next) => (action) => {
  if (action.meta.propagate) {
    if (action.type === SET_SLIDE) {
      socket.emit("action", { type: "set_slide", value: action.hash });
    }
  }
  next(action);
};
```

```js
socket.on("action", (msg) => {
  console.log("action", msg);
  switch (msg.type) {
    case "set_slide":
      store.dispatch(setSlide(msg.value, false));
      break;
  }
});
```

Vous remarquerez sans doute qu'au point où nous en sommes nous allons provoquer une boucle infinie d'émissions de messages. Pour éviter cela, les actions `SET_SLIDE` peuvent embarquer un information supplémentaire grâce [la propriété `meta`](https://github.com/redux-utilities/flux-standard-action#meta). Faites en sorte que seuls les dispatchs provenant d'un clic sur un bouton ou d'une modification de l'URL provoquent la propagation d'un message via Websocket.

N'oubliez pas d'utiliser `applyMiddleware` lors de la création du votre store. Si vous avez précédement installé le devtool Redux, référez-vous [à cette page](http://extension.remotedev.io/#12-advanced-store-setup) pour modifier de nouveau votre code.

```js
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(propagateSocket))
);
```

## TP2.4 Modalité d’entrées (gestes, stylet)

### Gestion de modalités d'entrée

Nous allons maintenant ajouter des fonctions de dessin à nos slides. En utilisant un stylet, un utilisateur pourra mettre en avant des elements sur la slide courante, et ce de manière synchronisée avec les autres appareils.

**Pour simplier on ne dessine que sur la slide courante, et on efface/oublie le dessin quand on change de slide.**

#### Création d'un canvas sur lequel dessiner

Pour cette partie, nous prendrons exemple sur ce tutoriel [W. Malone](http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#demo-simple).

Dans un premier temps, dans le composant `Slide` ajoutez un élément `canvas` avec avec les handlers d'événements onPointerDown, onPointerMove et onPointerUp ainsi qu'en déclarant une [Référence React](https://reactjs.org/docs/hooks-reference.html#useref). Utilisez `useRef`si vous êtes dans un 'function component', ou `createRef` si vous êtes dans un 'class-based component' ([voir ici](https://stackoverflow.com/a/54620836)):

```jsx
<canvas
  className="stroke"
  ref={refCanvas}
  onPointerDown={pointerDownHandler}
  onPointerMove={pointerMoveHandler}
  onPointerUp={pointerUpEvent}
></canvas>
```

Ces handlers nous permettront de d'écouter les événements provenant de `pointer`.

Afin de vous faciliter la tâche, voici le code _presque_ complet pour faire marcher le dessin sur le canvas.

Assurez-vous de bien faire les imports nécessaires au bon fonctionnement du code ci-dessous. Faites en sortes que l'on ne dessine que si c'est un [stylet qui est utilisé](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType).

```js

```

### Lien du canvas au store

Dans votre état initial, rajoutez l'attribut suivant :

```js
drawing: {
        clickX: [],
        clickY: [],
        clickDrag: []
    }
```

Et créez les actions `ADD_DRAW_POINTS` et `RESET_DRAW_POINTS`.

`ADD_DRAW_POINTS` devra accepter au moins 3 paramètres de type Array `(clickX, clickY, clickDrag)` qui seront concaténés à l'état du store.

`RESET_DRAW_POINTS` réinitialiseras les tableaux du store à vide.

Dans votre composant Slide, réalisez la connexion avec le store :

```js
const mapStateToProps = (state) => {
  return {
    drawing: state.drawing,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    addPoints: (x, y, drag) => dispatch(addDrawPoints(x, y, drag, true)),
  };
};
```

Une fois ceci fait, faites en sorte qu'à chaque fois qu'une ligne est finie de dessiner (`pointerUpEvent`), que vous copiez les points de la nouvelle ligne dans le store. Bien sûr, maintenant il faut aussi dessiner les lignes stockées dans le store (`props.drawing.`).

Ajoutez un bouton "Effacer" à votre toolbar, ce bouton déclenchera l'action `RESET_DRAW_POINTS`

### Syncronisation du canvas entre les appareils

Vous pouvez maintenant ajouter à votre Middleware de nouveaux cas permettant de propager les nouvelles lignes dessinées aux autres appareils.

```js
// ...
 else if (action.type === ADD_DRAW_POINTS) {
  socket.emit('action', {type: 'add_draw_points', value: {
      x: action.x,
      y: action.y,
      drag: action.drag
    }
  })
} else if (action.type === RESET_DRAW_POINTS) {
  socket.emit('action', {type: 'reset_draw_points'})
}
//...
```

Vous remarquerez qu'à l'ouverture sur un autre appareil, votre dessin n'apparait que si vous dessinez aussi sur cet appareil. Pour remédier à ce problème, utilisez [useEffect](https://reactjs.org/docs/hooks-effect.html) afin d'exécuter `redraw()` au moment opportun.

### Reconnaissance de gestes

Pour terminer, nous allons effectuer de la reconnaissance de geste lors d'évènements touch.

Pour ce faire nous allons utiliser le [$1 recognizer](http://depts.washington.edu/acelab/proj/dollar/index.html) vu en cours. Nous allons utiliser une version modifiée de [OneDollar.js](https://github.com/nok/onedollar-unistroke-coffee) pour fonctionner avec React. Il n'y a pas de module JS récent pour cette bibliothèque. Nous devrions donc le créer, mais pour plus de simplicité nous allons placer directement [la bibliothèque](../code/onedollar.js) dans le dossier `src/` pour qu'elle soit facilement bundlée par Webpack.

#### Gérer le recognizer

Au niveau de votre `Slide`, importer et initialiser votre le One Dollar Recognizer.

```js
// Voir ici pour le détails de options https://github.com/nok/onedollar-unistroke-coffee#options
const options = {
  score: 80, // The similarity threshold to apply the callback(s)
  parts: 64, // The number of resampling points
  step: 2, // The degree of one single rotation step
  angle: 45, // The last degree of rotation
  size: 250, // The width and height of the scaling bounding box
};
const recognizer = new OneDollar(options);

// Let's "teach" two gestures to the recognizer:
recognizer.add("triangle", [
  [627, 213],
  [626, 217],
  [617, 234],
  [611, 248],
  [603, 264],
  [590, 287],
  [552, 329],
  [524, 358],
  [489, 383],
  [461, 410],
  [426, 444],
  [416, 454],
  [407, 466],
  [405, 469],
  [411, 469],
  [428, 469],
  [453, 470],
  [513, 478],
  [555, 483],
  [606, 493],
  [658, 499],
  [727, 505],
  [762, 507],
  [785, 508],
  [795, 508],
  [796, 505],
  [796, 503],
  [796, 502],
  [796, 495],
  [790, 473],
  [785, 462],
  [776, 447],
  [767, 430],
  [742, 390],
  [724, 362],
  [708, 340],
  [695, 321],
  [673, 289],
  [664, 272],
  [660, 263],
  [659, 261],
  [658, 256],
  [658, 255],
  [658, 255],
]);
recognizer.add("circle", [
  [621, 225],
  [616, 225],
  [608, 225],
  [601, 225],
  [594, 227],
  [572, 235],
  [562, 241],
  [548, 251],
  [532, 270],
  [504, 314],
  [495, 340],
  [492, 363],
  [492, 385],
  [494, 422],
  [505, 447],
  [524, 470],
  [550, 492],
  [607, 523],
  [649, 531],
  [689, 531],
  [751, 523],
  [782, 510],
  [807, 495],
  [826, 470],
  [851, 420],
  [859, 393],
  [860, 366],
  [858, 339],
  [852, 311],
  [833, 272],
  [815, 248],
  [793, 229],
  [768, 214],
  [729, 198],
  [704, 191],
  [678, 189],
  [655, 188],
  [623, 188],
  [614, 188],
  [611, 188],
  [611, 188],
]);
```

#### Traitement différencié selon le type du pointerEvent.

Etendre les fonctions `pointerDownHandler`, `pointerMoveHandler`, `pointerUpHandler` pour qu'elles traite différemment les sources `touch`, `pen` et `mouse`.

Nous allons associer les gestes au `touch`. Toutefois pour débugger plus facilement, vous pouvez commencer traiter les gestes sur le pointerEvent `mouse`, et basculer sur le touch une fois que cela marche bien.

Stocker les points composants le geste dans un Array `gesturePoints`.

#### Dessiner le geste

Dans la fonction de dessin `redraw` vous pouvez ajouter un cas à la fin qui dessine en cas de geste (les points composant le geste sont stockés dans `gesturePoints`).
Vous devrez être **vigilant à convertir vos points pour être dans le référentiel du canvas**, comme dans le code fournit ci-dessus.

```js
  function redraw(){

    ...

    if (gesture) {
      context.strokeStyle = "#666";
      context.lineJoin = "round";
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(gesturePoints[0][0]*width, gesturePoints[0][1]*height);
      for(var i=1; i < gesturePoints.length; i++) {
        context.lineTo(gesturePoints[i][0]*width-1, gesturePoints[i][1]*height);
      }

      context.stroke();
    }
  }
```

#### Reconnaitre un geste prédéfinit

Quand le geste se termine (`pointerUpHandler`), vous pouvez lancer la reconnaissance du geste.

```js
let gesture = recognizer.check(gesturePoints);
```

Inspectez l'objet gesture dans la console, et vérifiez que vous arrivez bien à reconnaiter un cercle et un triangle.

Pensez à réinitialiser `gesturePoints` une fois le geste terminé.

#### Apprendre de nouveaux gestes

Toujours dans `pointerUpHandler`, vous pouvez imprimer les trajectoires correspondants à des gestes.

```js
console.log("[[" + gesturePoints.join("],[") + "]]");
```

Utiliser cette sortie pour ajouter deux nouveaux gestes: '>' et '<' (partant du haut vers le bas) à votre recognizer.

#### Associer le geste à une action

Une fois le geste exécute, s'il correspond à un de ces deux nouveaux gestes (`recognized == true`), dispatcher les actions suivant ou précédent.

Pour faire cela, nous allons nous appuyer sur un `mapDispatchToProps` qu'il faudra connecter à votre composant.

```js
const matchDispatchProps = dispatch => {
  return {
    nextSlide: () => {
      dispatch(setSlide(store.getState().currentSlide+1, true))
      dispatch(resetDrawPoints(true))
    },
    previousSlide: () => {
      dispatch(setSlide(store.getState().currentSlide-1, true))
      dispatch(resetDrawPoints(true))
    },
    resetDrawPoints: () => dispatch(resetDrawPoints(true))
  }
```

`resetDrawPoints` est l'action associée à l'effaçage des dessins effectué sur le transparent.

Vérifier que l'action est bien distribuée sur tous les dispositifs connectés.

#### FIN

Vous pouvez maintenant tester, nettoyer le code, et rendre.

## Rendu

À rendre pour le dimanche 17 à 23h59.

1. Déployez votre code sur Heroku
2. Pousser votre code sur la forge
3. Déposer les liens sur Tomuss "UE-INF2427M Technologies Web Synchrones Et Multi-Dispositifs"

- Le lien vers Heroku pointe vers le 1e transparents
- Le lien vers la forge permet de faire un clone (format suivant: https://forge.univ-lyon1.fr/xxx/tiw8-tp2.git)

### Critères d'évaluation

- Fichier `README.md` décrivant le process de build en dev, en prod, et de déploiement.
- Fichier `package.json` nettoyé ne contenant que les dépendances nécessaires.
- Déploiement sur Heroku
- Composants React pour le `Slideshow`, les `Slides`, la `Toolbar`.
- Store qui contient l'état de l'application
- Le flux de données suit le flow React, des actions sont déclarées, et les changements d'états passent par des actions unitaires qui modifient le store.
- Les changement sont des fonctions qui renvoient un nouvel état (immutabilité) dans le reducer.
- Redux pour la gestion avancée des états
- Gestions des routes pour les transparents
- Suivant/precedent change l'URI. Changer la route dans la barre d'URL du navigateur change l'etat de l'application.
- Implémentation des Websockets côté client et serveur
- Synchronisation du transparent affiché entre les dispositifs s'appuyant sur un middleware
- Adaptation du contenu au dispositif (routage selon le dispositif) et affichage des bons composants.
- Gestion du plein écran.
- Gestion différenciée des pointer-events.
- Synchronisation des dessins s'appuyant sur un middleware.
- Gestion des gestes pour des commandes suivant, précédent.
- Les commandes associées aux gestes sont bien propagées et permettent de controler un dispositif à distance.
- Qualité globale du rendu (= application qui ressemble à quelque chose, un minimum de mise en page, orthographe propre, composants s'appuyant sur des librairies CSS ou stylés à la main).
