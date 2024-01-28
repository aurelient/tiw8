## TIW8 - TP2 Application de Présentation multi-surface en React

#### Encadrants

- Aurélien Tabard (responsable)

#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant de gérer des murs de post-its virtuels. Elle sera développée principalement côté client avec React, avec un serveur Node/Express léger. Client et serveur seront codés en JavaScript.

Les points suivants seront abordés

- Composants React
- Gestion des états et flux de données
- Gestion de routes React
- Easy Peasy pour la gestion avancée des états
- Middleware pour gérer des effets de bord
- Websockets et communication temps réelle entre dispositifs
- Design responsif et adaptatif
- Reconnaissance de gestes

Ce TP s'étalera sur 4 séances et fera l'objet d'un rendu en binôme et d'une note. Voir les critères d'évaluation en bas de la page.

Vous ferez le rendu sur la forge, créez un projet git dès maintenant.

Pensez à remplir les champs de rendu sur Tomuss.

#### Quelques pointeurs vers la doc React

- [Introduction à la structuration d'application React](https://reactjs.org/docs/thinking-in-react.html)
- [Components](https://react.dev/learn/your-first-component)
- [Passer des props à un composant](https://react.dev/learn/passing-props-to-a-component)

## TP2.1 Introduction à React

Nous allons repartir du TP1 pour ce projet, vous pouvez donc le cloner, puis le pousser dans un nouveau repo dédié au TP2 (pour les 4 séances du TP).

Vous pourrez utiliser Tailwind, [chakra-ui](https://chakra-ui.com/) ou [material-ui](https://material-ui.com/). 

### Structurer une application React en composants

Lire l'[introduction à la structuration d'application React](https://react.dev/learn/thinking-in-react).

Nous allons commencer par créer un squelette d'application statique, nous rajouterons les parties dynamiques par la suite.

L'application est composée de plusieurs murs. À chaque mur on peut ajouter des posts-its.
Les post-its ont un certain nombre de propriétés : couleur, contenu (texte, image, dessin à la main), position, taille, auteur, ... Vous pourrez par exemple vous inspirer de padlet ou de nombreux services équivalents.

<img style="border: none;" alt="padlet postit board" width="600" src="padlet.png"/>

Imaginez que le serveur envoie ce type de données (qui peuvent être améliorées/modifiées selon vos besoins) :

```javascript
[
  {
    type: "board",
    id: "1",
    title: "TIW 8",
    notes: "",
    postits:[
      {
        type: "postit",
        board: "1",
        title: "TP 1",
        text: "Le TP porte sur des rappels de developpement Web",
        visible: false,
        color: "#CCC",
      },
      {
        type: "postit",
        board: "1",
        title: "TP 2",
        text: "Le TP porte sur la creation d'un outil de presentation HTML",
        visible: true,
        color: "#00E",
      },
      {
        type: "postit",
        board: "1",
        title: "TP 3",
        text: "Le TP 3",
        visible: true,
        color: "#00E",
      },
      {
        type: "postit",
        board: "1",
        title: "TP 4",
        text: "Le TP 4",
        visible: true,
        color: "#0E0",
      },
    ]},
  {
    type: "board",
    id: "2",
    title: "Courses",
    notes: "",
    postits: [],
  },
]
```

Créez la structure des composants correspondant à cette application, en suivant le guide et l'exemple de [Thinking in React](https://react.dev/learn/thinking-in-react#step-1-break-the-ui-into-a-component-hierarchy).

Voici une structure pour démarrer, basée sur des composants material-ui.
<img style="border: none;" alt="padlet postit board" width="600" src="composants.png"/>

Pour démarrer voilà un `index.tsx` le reste des composants que vous allez créer est rangé dans un sous-dossier `components`.

```tsx
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import Board from './components/Board'
import AppToolbar from './components/AppToolbar'

const App = () => (
    <div>
        <AppToolbar />
        <Board />
    </div>
)

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)
```

Ce code est donné à titre indicatif. Commencez progressivement et testez régulièrement.

### Créer des composants passifs

Créer des composants fonctionnels passifs (on rajoutera de l'interaction par la suite. Vous pouvez vous inspirer de la syntaxe et de la structure de cette <a href=https://github.com/laststance/react-typescript-todomvc-2022">mini todo app</a>

Il est <a href="https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/">conseillé de ne pas typer vos composants fonctionnels.</a> Si vous souhaitez le faire, vous pouvez soit créer un type dédié, soit utiliser `React.FC`.


### Gérer la logique de l'application

La toolbar doit afficher le titre du mur et un menu permettant de naviguer entre tous les murs. Rajouter à l'état de l'App, une balise indiquant le mur courant. Faites en sorte que l'état de App change lorsque vous sélectionnez un mur, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le menu parle à des composants parents).
Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".

Pour démarrer vous pouvez utiliser l'extension react dev tools, et modifier l'état à la main pour vérifier que la vue change bien.

### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir un chemin dédié à chaque mur.
En plus d'avoir un état interne à l'application pour savoir quel post-it afficher, nous allons utiliser une route qui pointe vers le mur en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reactrouter.com/en/main). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à lire [cette page](https://reactrouter.com/en/main/start/concepts) (pas super à jour).

[React router](https://reacttraining.com/react-router/web/guides/primary-components) requiert d'envelopper votre application dans un composant `Router`.

On va utiliser `BrowserRouter` qui demande une configuration côté serveur (toutes les requêtes doivent être redirigées sur l'index). L'idée est que charger un url de type [http://monsite.net/3](http://monsite.net/3) charge le 3e mur. Importez bien `react-router-dom`.

<!-- Si vous utilisez des `class components`, vous pouvez récupérer la valeur de la route en utilisant un props dédié passé par le routeur. [Suivez cet exemple](https://reacttraining.com/react-router/core/api/withRouter) -->

Si vous utilisez des `functional components`, vous pouvez utiliser le hook `useParams();` pour récupérer des informations sur la route. [Suivez cet exemple](https://reacttraining.com/react-router/web/example/url-params). Vous pouvez aussi passer cette information with `routeProps`, du côté du composant parent [voir la documentation ici](https://reactrouter.com/web/api/Route/render-func).

```jsx
<Switch>
  <Route
    path="/:id"
    render={(routeProps) => <Board boards={boards} match={routeProps.match} />}
  />
</Switch>
```

Une fois la valeur de la route récupérée pour qu'il corresponde au mur à afficher. Vous remarquerez que la gestion de l'état courant est maintenant distribuée entre l'url et le state de React.

<!-- Puis implémenter une route et une n'affichant qu'un post-it. -->

<!-- Déployez et testez sur mobile (faites les adaptations nécessaires). -->

## TP2.2 Easy peasy

Nous allons maintenant gérer l'état de l'application sur plusieurs dispositifs en utilisant Easy peasy et des Websockets. L'objectif est que vous puissiez changer l'état de votre application de présentation sur un dispositif (ex: mobile), et que l'état de l'application soit mis à jour partout (ex: vidéo-projection, personne qui regarde votre mur à distance sur sa machine...)

<!-- Nous allons gérer l'état qui comprend la liste des murs et le mur en cours.-->

**Pensez à relire le cours et les ressources associées pour être au clair sur ce que vous êtes en train de faire.**

Afin de vous faciliter le debug du TP, vous pouvez activer la création d'un Source Map dans votre `webpack.config.js` : `devtool: 'eval-source-map'`.


#### Création d'un store

Nous allons commencer par créer le store qui va gérer les états.

```js
TODO
```

#### Utiliser le store

Dans votre index.tsx principal exposez le store pour pouvoir l’afficher via la console du navigateur. Cela permettra d’effectuer les premiers tests de easy-peasy, sans l’avoir branché à votre application React.

#### Lien React - EasyPeasy



1. Importer connect de `react-redux`, et les actions depuis votre fichier de définition d'action.

```js
import { connect } from "react-redux";
import { action1, action2 } from "..../actions/index";
```

2. Créer un `mapDispatchToProps` et le connecter avec votre composant.

```js
const mapDispatchToProps = (dispatch) => {
  return {
    nextBoard: () => dispatch(nextBoard(true)),
    previousBoard: () => dispatch(previousBoard(true)),
  };
};
// ... VOTRE_COMPOSANT

export default withRouter(connect(null, mapDispatchToProps)(VOTRE_COMPOSANT));
```

3. Enfin en cas de clic sur vos boutons avant/apres appelez vos actions `onClick={() => {this.props.previousBoard}`

#### Lien Redux / React Router


## TP2.3 Distribution d’interface multi-dispositif Middleware et websockets

Nous allons maintenant travailler à la distribution de l'application sur plusieurs dispositifs et à leur synchronisation.

Nous allons définir une route pour chaque postit. Vous pouvez rajouter `postit` au chemin route pour basculer en mode édition de post-it.

Sur mobile l'interface ressemblera à ça :

<img style="border: none;" alt="padlet postit board" width="350" src="mobile.png"/>

Les boutons `<` et `>` permettent de naviguer entre les post-its. Le menu du haut pour naviguer entre les boards. Eventuellement un menu du bas pour naviguer entre post-its (optionnel).

### Définition de nouvelles routes et des vues associées

Il n'existe pas de bibliothèque à l'heure actuelle pour gérer de manière simple de la distribution d'interface, nous allons donc devoir le faire "à la main".

Rajouter des `Redirect` [(doc)](https://reactrouter.com/en/main/fetch/redirect) à la racine de votre application pour faire une redirection vers une route en fonction du dispositif utilisé et de son état.

Vous pouvez utiliser `react-device-detect` [(doc)](https://www.npmjs.com/package/react-device-detect) [TODO à vérifier] pour détecter le dispositif (mobile ou non). Et la `fullscreen API` [(doc)](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) pour contrôler le plein écran.

Déployez et tester.

### Gestion "à la main" des routes des Boards

Nous allons maintenant préparer la synchronisation des dispositifs. Pour cela nous allons devoir gérer le board courant dans notre état (`currentBoard` dans le store).
`ReactRouter` n'est pas conçu pour bien gérer le lien entre route et état. Et les routeur alternatifs (type `connected-react-router`) ont aussi des limites. Nous allons donc gérer cette partie de la route à la main.

#### Changer l'état à partir de la route

En écoutant l'évènement `popstate` nous pouvons êtres informé d'un changement dans l'url du navigateur. Si ce changement correspond à un changement dans l'index du board à afficher, nous allons déclencher l'action `setBoard`, avec l'index du board approprié.

```javascript
TODO
```

Si vous n'avez pas encore définit l'action `setBoard`, créez le action creator correspondant, et le traitement associé dans le reducer.

#### Changer la route à partir de l'état

En écoutant les changements dans le store nous allons pouvoir être notifiés de changement de l'état et les répercuter dans la barre d'url (utile pour la suite, quand nous allons synchroniser des dispositifs):

```javascript
TODO
```

### Refactorisation

Avant de passer à la suite, c'est un bon moment pour nettoyer votre projet.
<!-- nous allons simplifier les ACTIONS de Redux. Supprimez les actions `NEXT_BOARD` et `PREVIOUS_BOARD` de votre liste d'actions et de votre Reducer. Aux endroits où ces actions étaient utilisées, remplacer par l'action `SET_BOARD` avec un changement de l'index courant. -->

### Un premier Middleware de logging

En ce qui concerne les `Middleware`, `easy-peasy` manipule directement les types de `Redux`, car `easy-peasy` est construit par dessus `Redux`.

Pour comprendre la logique du Middleware [suivez la documentation Redux](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware). Faites un essai qui reprend en suivante [cette courte vidéo](https://www.youtube.com/watch?v=6AGdeO28UKY)) (pensez juste à installer `@types/redux-logger` en plus).

Nous allons maintenant créer un logger similaire "à la main" (vous pouvez faire ça dans le fichier de base de votre store). Un middleware a une signature un peu particulière. [Il s'agit en fait de 3 fonctions imbriquées](https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware):

Dans le fichier où vous avez créé votre store, ajoutez:

```js
const myLoggerMiddleware: Middleware<Dispatch, myStoreModel> = (api) => (next) => { // myStoreModel doit être changé pour votre store
    return (action: AnyAction) => {
        console.log("State Before:", api.getState());
        return next(action);
    };
};
```

Et ajoutez le dans le tableau des middlewares qui était vide jusqu'à présent.

- La fonction externe est le middleware lui-même, elle reçoit un objet de type `MiddlewareAPI` qui contient les fonctions {dispatch, getState} du store.
- La fonction centrale reçoit une fonction `next` comme argument, qui appellera le prochain middleware du pipeline. S'il c'est le dernier (ou l'unique), alors la fonction `store.dispatch`
- La fonction interne reçoit l'action courante en argument et sera appelée à chaque fois qu'une action est dispatchée.

Vous pouvez importer tous les types nécessaire depuis `@reduxjs/toolkit`

### Notre Middleware de diffusion des actions avec des websockets

Nous allons maintenant faire communiquer plusieurs navigateurs entre eux grâce à [socket.io](https://socket.io/). Pour cela nous allons rajouter un middleware dédié. Sur un navigateur, quand on change de board, un message sera envoyé aux autres navigateurs afin qu'ils changent eux aussi leur board courant.

## TP2.4 Modalité d’entrées (gestes, stylet)

### Gestion de modalités d'entrée

Nous allons maintenant ajouter des fonctions de dessin à nos post-its. En utilisant un stylet, un utilisateur pourra dessiner sur le post-it courant, et ce de manière synchronisée avec les autres appareils.

#### Création d'un canvas sur lequel dessiner

Pour cette partie, nous prendrons exemple sur ce tutoriel [W. Malone](http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#demo-simple).

Dans un premier temps, dans le composant `Postit` ajoutez un élément `canvas` avec avec les handlers d'événements onPointerDown, onPointerMove et onPointerUp ainsi qu'en déclarant une [Référence React](https://reactjs.org/docs/hooks-reference.html#useref). Utilisez `useRef` si vous êtes dans un 'function component':

```jsx
TODO
```

Ces handlers nous permettront d'écouter les événements provenant de `pointer`.

Voici du vieux code JS qui permet de gérer le canvas. [TODO mettre à jour]
Assurez-vous de bien faire les imports nécessaires au bon fonctionnement du code ci-dessous. Faites en sortes que l'on ne dessine que si c'est [un doigt ou un stylet qui est utilisé](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType).

```js
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;

// Cette ligne permet d'avoir accès à notre canvas après que le composant aie été rendu. Le canvas est alors disponible via refCanvas.current
// Si vous utilisez des Class Components plutôt que des function Components, voir ici https://stackoverflow.com/a/54620836
let refCanvas = useRef(null);

function addClick(x, y, dragging) {
  clickX.push(x), clickY.push(y), clickDrag.push(dragging);
}

function redraw() {
  let context = refCanvas.current.getContext("2d");

  let width = refCanvas.current.getBoundingClientRect().width;
  let height = refCanvas.current.getBoundingClientRect().height;

  //Ceci permet d'adapter la taille du contexte de votre canvas à sa taille sur la page
  refCanvas.current.setAttribute("width", width);
  refCanvas.current.setAttribute("height", height);
  context.clearRect(0, 0, context.width, context.height); // Clears the canvas

  context.strokeStyle = "#df4b26";
  context.lineJoin = "round";
  context.lineWidth = 2;

  for (var i = 0; i < clickX.length; i++) {
    context.beginPath();
    if (clickDrag[i] && i) {
      context.moveTo(clickX[i - 1] * width, clickY[i - 1] * height);
    } else {
      context.moveTo(clickX[i] * width - 1, clickY[i] * height);
    }
    context.lineTo(clickX[i] * width, clickY[i] * height);
    context.closePath();
    context.stroke();
  }
}

function pointerDownHandler(ev) {
  console.error("ICI ON PEUT DIFFERENCIER QUEL TYPE DE POINTEUR EST UTILISE !");

  let width = refCanvas.current.getBoundingClientRect().width;
  let height = refCanvas.current.getBoundingClientRect().height;
  var mouseX = (ev.pageX - refCanvas.current.offsetLeft) / width;
  var mouseY = (ev.pageY - refCanvas.current.offsetTop) / height;

  paint = true;
  addClick(mouseX, mouseY, false);
  redraw();
}

function pointerMoveHandler(ev) {
  if (paint) {
    let width = refCanvas.current.getBoundingClientRect().width;
    let height = refCanvas.current.getBoundingClientRect().height;
    addClick(
      (ev.pageX - refCanvas.current.offsetLeft) / width,
      (ev.pageY - refCanvas.current.offsetTop) / height,
      true
    );
    redraw();
  }
}

function pointerUpEvent(ev) {
  paint = false;
}
```

### Lien du canvas au store

Dans votre rajoutez l'attribut `drawing` à chaque post-it :

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

Dans votre composant `Postit`, réalisez la connexion avec le store :

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

Sur mobile, ajoutez un bouton "Effacer" à votre toolbar, ce bouton déclenchera l'action `RESET_DRAW_POINTS`

### Synchronisation du canvas entre les appareils

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

Faites en sorte que tous les post-its affichent leurs dessins associés au chargement du board.

<!-- Vous remarquerez qu'à l'ouverture sur un autre appareil, votre dessin n'apparait que si vous dessinez aussi sur cet appareil. Pour remédier à ce problème, utilisez [useEffect](https://reactjs.org/docs/hooks-effect.html) afin d'exécuter `redraw()` au moment opportun. -->

### Reconnaissance de gestes

Pour terminer, nous allons effectuer de la reconnaissance de geste lors d'évènements touch.

Pour ce faire nous allons utiliser le [\$1 recognizer](http://depts.washington.edu/acelab/proj/dollar/index.html) vu en cours. Nous allons utiliser une version modifiée de [OneDollar.js](https://github.com/nok/onedollar-unistroke-coffee) pour fonctionner avec React. Il n'y a pas de module Typescript pour cette bibliothèque. Si vous êtes motivés, contribuez en un.

#### Gérer le recognizer

Au niveau de votre `Postit`, importer et initialiser votre le One Dollar Recognizer.

[TODO à faire...]

#### Traitement différencié selon le type du pointerEvent.

Etendre les fonctions `pointerDownHandler`, `pointerMoveHandler`, `pointerUpHandler` pour qu'elles traite différemment les sources `touch`, `pen` et `mouse`.

Nous allons associer les gestes au `touch`. Toutefois pour débugger plus facilement, vous pouvez commencer traiter les gestes sur le pointerEvent `mouse`, et basculer sur le touch une fois que cela marche bien.

Similairement si vous n'avez pas de stylet à disposition, au lieu d'écouter `pen`, vous pouvez écouter des évènements `mouse` avec un modifieur (par exemple la touche `P` enfoncée). Mettez toutefois la condition dans le code avec un commentaire du type
`/* nous n'avions pas de stylet pour tester */`

Stocker les points composants le geste dans un Array `gesturePoints`.

#### Dessiner le geste

Dans la fonction de dessin `redraw` vous pouvez ajouter un cas à la fin qui dessine en cas de geste (les points composant le geste sont stockés dans `gesturePoints`).
Vous devrez être **vigilant à convertir vos points pour être dans le référentiel du canvas**.

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

Inspectez l'objet gesture dans la console, et vérifiez que vous arrivez bien à reconnaitre un cercle et un triangle.

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

Par exemple passer au board ou au post-it suivant, selon vos préférences.

```js
const matchDispatchProps = dispatch => {
  return {
    nextBoard: () => {
      dispatch(setBoard(store.getState().currentBoard+1, true))
      dispatch(resetDrawPoints(true))
    },
    previousBoard: () => {
      dispatch(setBoard(store.getState().currentBoard-1, true))
      dispatch(resetDrawPoints(true))
    },
    resetDrawPoints: () => dispatch(resetDrawPoints(true))
  }
```

`resetDrawPoints` est l'action associée à l'effaçage des dessins effectué sur le postit.

Vérifier que l'action est bien distribuée sur tous les dispositifs connectés.

#### FIN

Vous pouvez maintenant tester, nettoyer le code, et rendre.

## Rendu

À rendre pour le dimanche 11/02 à 23h59.

1. Déployez votre code sur une VM ou votre plateforme préférée (type Heroku)
2. Pousser votre code sur la forge
3. Déposer les liens sur Tomuss :

- Le lien vers la forge permet de faire un clone (format suivant: https://forge.univ-lyon1.fr/xxx/yyy.git)

### Critères d'évaluation

- Fichier `README.md` décrivant le process de build en dev, en prod, et de déploiement.
- Fichier `package.json` nettoyé ne contenant que les dépendances nécessaires.
- Linting bien configuré et respecté
- Déploiement sur Heroku
- Composants React pour le `Board`, les `Postits`, la `Toolbar`.
- Utilisation de composants fonctionnels.
- Store qui contient l'état de l'application
- Le flux de données suit le flow React, des actions sont déclarées, et les changements d'états passent par des actions unitaires qui modifient le store.
- Les changements sont des fonctions qui renvoient un nouvel état (immutabilité) dans le reducer.
- Redux pour la gestion avancée des états
- Gestions des routes pour les boards et post-its
- Suivant/precedent change l'URI. Changer la route dans la barre d'URL du navigateur change l'état de l'application.
- Implémentation des Websockets côté client et serveur
- Synchronisation du board affiché entre les dispositifs s'appuyant sur un middleware
- Adaptation du contenu au dispositif (routage selon le dispositif) et affichage des bons composants.
- Gestion du plein écran.
- Gestion différenciée des pointer-events.
- Synchronisation des dessins s'appuyant sur un middleware.
- Gestion des gestes pour des commandes suivant, précédent.
- Les commandes associées aux gestes sont bien propagées et permettent de contrôler un dispositif à distance.
- Qualité globale du rendu (= application qui ressemble à quelque chose, un minimum de mise en page, orthographe propre, composants s'appuyant sur des librairies CSS ou stylés à la main).
