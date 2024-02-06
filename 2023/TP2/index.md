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

Vous pourrez utiliser Tailwind, [chakra-ui](https://chakra-ui.com/), [material-ui](https://material-ui.com/) ou autre. 

Si vous avez des soucis avec Typescript et React, [regardez par ici](https://react-typescript-cheatsheet.netlify.app/)

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

### Créer des composants passifs

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

Créer des composants fonctionnels (on rajoutera de l'interaction par la suite). Vous pouvez vous inspirer de la syntaxe et de la structure de cette <a href="https://github.com/laststance/react-typescript-todomvc-2022">mini todo app</a>

### Gérer la logique de l'application

La toolbar doit afficher le titre du mur et un menu permettant de naviguer entre tous les murs. Rajouter à l'état de l'App, une balise indiquant le mur courant. Faites en sorte que l'état de App change lorsque vous sélectionnez un mur, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le menu parle à des composants parents).
Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".

Pour démarrer vous pouvez utiliser l'extension react dev tools, et modifier l'état à la main pour vérifier que la vue change bien.

Voici à quoi ressemblerait la structure de `AppToolbar` :
`Board` est définit comme une interface dans un fichier `models.d.ts` contenant les types / interfaces utilisées dans l'application que j'importe ici.

```tsx
TODO imports

interface Props {
    boards: Board[]
    index: number
}

const AppToolbar = (props: Props): JSX.Element => {
    return (
      <div>ma toolbar pour le board numéro {props.index}</div>
    )
}

export default AppToolbar
```

### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir un chemin dédié à chaque mur (board)).
En complément d'avoir un état interne à l'application qui définit quel board/post-its afficher, nous allons utiliser une route qui pointe vers le mur en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reactrouter.com/en/main). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à parcourir les tutoriels [sur cette page](https://reactrouter.com/en/main/start/tutorial).

On va utiliser `BrowserRouter` qui demande une configuration côté serveur (toutes les requêtes doivent être redirigées sur l'index, [https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3](voir un exemple ici, à adapter à vos besoins) ). L'idée est que charger un url de type [http://monsite.net/board/3](http://monsite.net/board/3) charge le 3e board. Importez bien `react-router-dom`.

Vous pouvez utiliser le hook `useParams` pour récupérer des informations sur la route. [Voir la doc ici](https://reactrouter.com/en/main/hooks/use-params). 

<!-- Vous pouvez aussi passer cette information with `routeProps`, du côté du composant parent [voir la documentation ici](https://reactrouter.com/web/api/Route/render-func).

```jsx
<Switch>
  <Route
    path="/:id"
    render={(routeProps) => <Board boards={boards} match={routeProps.match} />}
  />
</Switch>
```
-->

Une fois la valeur de la route récupérée pour qu'elle corresponde au mur à afficher. Vous remarquerez que la gestion de l'état courant est maintenant distribuée entre l'url et le state de React.

#### Nettoyage
Déployez et testez sur mobile (faites les adaptations nécessaires).

En anticipation du TP 2.3, vous pouvez déjà préparer la gestion d'une route de type `monappli.net/board/1/postit/2` qui n'affiche que le post-it à l'id `2` du board `1`. Sur cette vue, vous pouvez rajouter des flèches `<` `>` à la toolbar (ou ailleurs) qui permettent de naviguer entre les postits d'un même board. 

Si ce n'est pas fait, vous pouvez activer la création d'un Source Map dans votre `webpack.config.js` : `devtool: 'eval-source-map'`.


## TP2.2 Easy peasy

Nous allons maintenant gérer l'état de l'application sur plusieurs dispositifs en utilisant Easy peasy et des Websockets. L'objectif est que vous puissiez changer l'état de votre application de présentation sur un dispositif (ex: mobile), et que l'état de l'application soit mis à jour partout (ex: vidéo-projection, personne qui regarde votre mur à distance sur sa machine...)

<!-- Nous allons gérer l'état qui comprend la liste des murs et le mur en cours.-->

**Pensez à relire le cours et les ressources associées pour être au clair sur ce que vous êtes en train de faire.**



#### Création d'un store

Nous allons commencer par créer le store qui va gérer les états.

```ts
import { type Action, action, createStore } from 'easy-peasy'
import { type Board } from './models/models'
import { boards } from './data/data'

interface BoardStoreModel {
    name: string
    index: number
    boards: Board[]
    isVisible: boolean
    setBoard: Action<BoardStoreModel, SetBoardAction>
}

interface SetBoardAction {
    boardNumber: number
}


const storeModel: BoardStoreModel = {
    name: 'boardApp',
    index: 0,
    boards,
    setBoard: action((state, payload) => {
        // TODO
    }),
    addPostit: action((state, payload) => {
        // TODO
    }),
    changePostitVisibility: action((state, payload) => {
        // TODO
    })
}

const store = createStore<BoardStoreModel>(storeModel, {
    // middlewares: [], // pour plus tard
})

export default store

```

#### Utiliser le store

Dans votre `index.tsx` principal exposez le store pour pouvoir l'afficher via la console du navigateur.
Cela permettra d'effectuer les premiers tests de easy-peasy, sans l'avoir branché à votre application React.

```js
import { store } from './application/store' // verifiez que le chemin est correct

declare global {
    interface Window {
        mystore: unknown
    }
}
window.mystore = store
```

Et toujours dans le `index.tsx`, enveloppez votre application dans une balise :

```xml
<StoreProvider store={store}>`
  ...
</StoreProvider>`
```


#### Lien React - EasyPeasy
<!-- 


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
-->

Maintenant on va tester que le flux d'information ce passe bien. On va rajouter un bouton `hide` aux post-its. Quand on cliquera dessus, il ira modifier la propriété `visible` du post-it en question. Si le post-it est visible il deviendra invisible et inversement.

Pour vous faciliter la vie, on ne va pas le rendre vraiment invisible mais simplement changer son opacité de 100% à 10%.

Pour faire cela nous allons devoir modifier le composant post-it et le store

```js
import { useStoreActions } from 'easy-peasy';
```

Lorsque l'on clique sur le bouton on va appeler une action du store :

```js
  // on récupère l'action désirée dans le store
  const changePostitVisibility = useStoreActions((actions) => actions.changePostitVisibility);
  ...
  // et on s'en sert lors du clic sur le bouton
  <button onClick={changePostitVisibility}></button>
```

Dans le composant transparent (`AppPostit` chez moi), récupérez l'état de visibilité du board. S'il est visible l'opacité est normale sinon à 10%. Rajoutez un div enveloppant pour gérer ça. Ajouter aussi l'import permettant d'accéder à l'état à un instant T du store.

```js
  import { useStoreState } from 'easy-peasy';
  ...
  const isVisible = useStoreState((state) => state.isVisible);
  const opacity: string = isVisible ? 'opacity-100' : 'opacity-10';
  ...
  <div className={opacity}>
```

<!-- #### Lien Easy-Peasy / React Router -->


## TP2.3 Distribution d’interface multi-dispositif Middleware et websockets

Nous allons maintenant travailler à la distribution de l'application sur plusieurs dispositifs et à leur synchronisation.

Nous allons définir une route pour chaque postit. Vous pouvez rajouter `postit` au chemin route pour basculer en mode édition de post-it.

Sur mobile l'interface ressemblera à ça :

<img style="border: none;" alt="padlet postit board" width="350" src="mobile.png"/>

Les boutons `<` et `>` permettent de naviguer entre les post-its. Le menu du haut pour naviguer entre les boards. Eventuellement un menu du bas pour naviguer entre post-its (optionnel).

### Définition de nouvelles routes et des vues associées

Il n'existe pas de bibliothèque à l'heure actuelle pour gérer de manière simple de la distribution d'interface, nous allons donc devoir le faire "à la main".

À la création du `BrowserRouter` faites une redirection vers une route en fonction du dispositif utilisé et de son état.

Vous pouvez utiliser `react-device-detect` [(doc)](https://www.npmjs.com/package/react-device-detect) pour détecter le dispositif (mobile ou non). Et la `fullscreen API` [(doc)](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) pour contrôler le plein écran.

Au besoin vous pouvez aussi vous appuyer sur des appels à `redirect` [(doc)](https://reactrouter.com/en/main/fetch/redirect) à la racine de votre application pour

### Gestion "à la main" des routes des Boards

Nous allons maintenant préparer la synchronisation des dispositifs. Pour cela nous allons devoir gérer le board courant dans notre état (`currentBoard` dans le store).
`ReactRouter` n'est pas conçu pour bien gérer le lien entre route et état (même si cela s'est bien amélioré avec la v6).
Et les routeur alternatifs (type `connected-react-router`) ont aussi des limites. Nous allons donc gérer cette partie de la route à la main.

#### Changer la route en cas de changement de board

Lors d'un changement de board, plutôt que d'utiliser `<Link to={`/board/${i}`}>` créer un listener. 

Ce listener sera en charge de déclenche une action modifiant le store (la valeur du board courant), puis déclenchera une navigation vers le board sélectionné grace au hook [useNavigate()](https://reactrouter.com/en/main/hooks/use-navigate)

A ce stade maintenant vous ne devriez plus passer de props depuis vos parents mais utiliser le store de votre application pour remplir vos composants

### Un premier Middleware de logging

En ce qui concerne les `Middleware`, `easy-peasy` manipule directement les types de `Redux`, car `easy-peasy` est construit par dessus `Redux`.

<!-- Pour comprendre la logique du Middleware [suivez la documentation Redux](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware). `Faites un essai qui reprend en suivante [cette courte vidéo](https://www.youtube.com/watch?v=6AGdeO28UKY)) (pensez juste à installer `@types/redux-logger` en plus).` -->

Nous allons maintenant créer un logger similaire "à la main" (vous pouvez faire ça dans le fichier de base de votre store). Un middleware a une signature un peu particulière. [Il s'agit en fait de 3 fonctions imbriquées](https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware):

Dans le fichier où vous avez créé votre store, ajoutez:

```js
import {
    type Middleware,
    type MiddlewareAPI,
    type Dispatch,
    type AnyAction,
} from 'redux'

const loggerMiddleware: Middleware =
    (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
        console.log('Dispatching action:', action)

        // Call the next middleware in the chain
        const result = next(action)

        console.log('State after action:', api.getState())

        return result
    }

export default loggerMiddleware
};
```

Et ajoutez le dans le tableau des middlewares qui était vide jusqu'à présent.

- La fonction externe est le middleware lui-même, elle reçoit un objet de type `MiddlewareAPI` qui contient les fonctions {dispatch, getState} du store.
- La fonction centrale reçoit une fonction `next` comme argument, qui appellera le prochain middleware du pipeline. S'il c'est le dernier (ou l'unique), alors la fonction `store.dispatch`
- La fonction interne reçoit l'action courante en argument et sera appelée à chaque fois qu'une action est dispatchée.


### Notre Middleware de diffusion des actions avec des websockets

Nous allons maintenant faire communiquer plusieurs navigateurs entre eux grâce à [socket.io](https://socket.io/). Pour cela nous allons rajouter un middleware dédié. Sur un navigateur, quand on change de board, un message sera envoyé aux autres navigateurs afin qu'ils changent eux aussi leur board courant.

Pareil en mobile si on change de post-its.

#### Socket.io côté serveur
Côté serveur, importez `socket.io` ([tuto officiel](https://socket.io/get-started/chat/#integrating-socketio)) et mettez en place le callback permettant de recevoir les messages d'action provenant d'un client et de les propager à tous les autres clients. 

Le serveur ne va quasi rien faire, quand il reçoit un message d'action, il le broadcast à tous les clients connectés:

```js
socket.on("action", (msg) => {
  console.log("action received", msg);
  socket.broadcast.emit("action", msg);
});
```

#### Synchronisation des changements sur les postits entre les appareils

Passons à la création de notre propre Middleware dans lequel on importera `socket.io-client` (installez le avec yarn). Le middleware devra, dès qu'il intercepte une action (`setBoard` ou autre) la propager au serveur via un websocket par un message adéquat, avant de faire appel à `next(action)`.

```js
import io from "socket.io-client";
import { store } from "./index";
// TODO importer les actions nécessaires
import { Middleware, Dispatch, AnyAction } from "redux";

// on se connecte au serveur
const socket = io();

export const propagateSocketMiddleware: Middleware<Dispatch> =
  () => (next) => (action: AnyAction) => {
    // Explorez la structure de l'objet action :
    console.log("propagateSocketMiddleware", action);

    // TODO traiter et propager les actions au serveur.
    // Vous pourrez utiliser
    // socket.emit('type_du_message', 'contenu du message, peut être un objet TS');

    // Après diffusion au serveur on fait suivre l'action au prochain middleware
    next(action);
  };
```

Toujours dans le middleware, configurez la socket pour qu'à la réception des messages, les actions soient dispatchées au store.

Pour pouvoir être dispatchées nous allons devoir utiliser redux. Pour ce faire il va falloir faire un double wrapping de **votre composant racine** avec le même objet store fournit au Provider de easy-peasy et de redux

```jsx
        <Provider store={store}>
            <StoreProvider store={store}>
                <RouterProvider router={router} />
            </StoreProvider>
        </Provider>
```

Et de retour dans le middle-ware :

```js
socket.on("action", (msg) => {
  console.log("action", msg);
  switch (
    msg.type // ajuster le msg.type pour qu'il corresponde bien à celui dédinit pour l'action de votre reducer
  ) {
    case "set_board": // <- probablement autre chose selon la façon dont vous avez nommé vos actions
      store.dispatch(
                // action à dispatcher
            )
      break;
  }
});
```

<!-- Vous remarquerez sans doute qu'au point où nous en sommes nous allons provoquer une boucle infinie d'émissions de messages. 

Pour éviter cela, les actions Redux peuvent embarquer un information supplémentaire grâce [la propriété `meta`](https://github.com/redux-utilities/flux-standard-action#meta). 
Mais surprise le mainteneur de [Easy-peasy est pas motivé pour l'implémenter](https://github.com/ctrlplusb/easy-peasy/issues/241), nous allons donc surcharger notre payload avec cette information.  -->

Une fois la synchronisation des stores réalisée. Reste à s'assurer que les routes soient bien mises à jour.

Pour cela nous allons utiliser `navigate()` de nouveau depuis le middleware. Idéalement nous voudrions faire `dispatch(...).then(() => navigate())` mais avec l'intégration redux/easy-peasy cela devient compliqué. Nous allons donc simplement appeler navigate après dispatch sans attendre.

Dans le middle vous n'avez pas accès aux hooks react, il faut donc appeler `navigate()` "à la main" en exportant votre `router = createBrowserRouter()`. Le plus simple est de définir votre routeur dans un fichier `router.tsx` dédié, qui se terminera par `export default router`. Vous pourrez importer cet objet `router` et appeler `router.navigate('monchemin')` dans votre middleware.

<!-- Comme nous utilisons ReduxToolkit et TypeScript, il faut utiliser un `prepare` callback [comme décrit ici](https://redux-toolkit.js.org/usage/usage-with-typescript#defining-action-contents-with-prepare-callbacks) -->

#### Finalisation

Vous avez maintenant le poc de votre application.

Rajoutez des actions pour ajouter/supprimer des boards, et des post-its, et éditer leur titre.

Vous pouvez maintenant tester, nettoyer le code, et rendre.

## Rendu

À rendre pour le dimanche 03/03 à 23h59.

1. Déployez votre code sur une VM ou votre plateforme préférée (type Railapp)
2. Pousser votre code sur la forge
3. Déposer les liens sur Tomuss

- Le lien vers la forge permet de faire un clone (format suivant: https://forge.univ-lyon1.fr/xxx/yyy.git)

### Critères d'évaluation

- Fichier `README.md` décrivant le process de build en dev, en prod, et de déploiement (expliquez les cas et comment lancer).
- Fichier `package.json` nettoyé ne contenant que les dépendances nécessaires.
- Linting bien configuré et respecté
- Types Typescript correctement définis
- Déploiement sur une VM de l'université ou Railapp
- Composants React pour le `Board`, les `Postit`, la `Toolbar`.
- Utilisation de composants fonctionnels.
- Store qui contient l'état de l'application
- Le flux de données suit le flow React, des actions sont déclarées, et les changements d'états passent par des actions unitaires qui modifient le store.
- Les changements sont des fonctions qui renvoient un nouvel état (immutabilité) dans le reducer.
- Easy Peasy, Redux ou Redux Toolkit pour la gestion avancée des états
- Gestions des routes pour les boards et post-its
- Suivant/precedent change l'URI. Changer la route dans la barre d'URL du navigateur change l'état de l'application.
- Implémentation des Websockets côté client et serveur
- Synchronisation du board affiché entre les dispositifs s'appuyant sur un middleware
- Synchronisation des changements sur un post-its s'appuyant sur un middleware.
- Adaptation du contenu au dispositif (routage selon le dispositif) et affichage des bons composants.
- Gestion du plein écran.
<!-- - Gestion différenciée des pointer-events. -->
<!-- - Synchronisation des dessins s'appuyant sur un middleware. -->
<!-- - Gestion des gestes pour des commandes suivant, précédent. -->
<!-- - Les commandes associées aux gestes sont bien propagées et permettent de contrôler un dispositif à distance. -->
- Qualité globale du rendu (= application qui ressemble à quelque chose, un minimum de mise en page, orthographe propre, composants s'appuyant sur des librairies CSS ou stylés à la main).
