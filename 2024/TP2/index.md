## TIW8 - TP2 Application de Présentation multi-surface en React

#### Encadrants

- Aurélien Tabard (responsable)

#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant de gérer des sessions de questions/réponses, sondages en temps réel. Elle sera développée principalement côté client avec React, avec un serveur Node/Express léger. Client et serveur seront codés en Typescript.

Les points suivants seront abordés

- Composants React
- Gestion des états et flux de données
- Gestion de routes React
- Redux et Redux Toolkit pour la gestion avancée des états
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

L'application est composée de plusieurs événements, chacun composé de plusieurs questions/quizz. À évenement on peut ajouter des questions et réagir dessus.
Les questions ont un certain nombre de propriétés : couleur, contenu (texte, image, dessin à la main), position, taille, auteur, ... Vous pourrez par exemple vous inspirer de [slido](https://www.slido.com/) ou de nombreux services équivalents.

<img style="border: none;" alt="questions panel" width="400" src="slido-une.jpg"/>

Imaginez que le serveur envoie [ce type de données](qa-data-structure.json) (qui peuvent être améliorées/modifiées selon vos besoins), voici une [version étendue](qa-expanded-data_2.json).

### Créer des composants passifs

Créez la structure des composants correspondant à cette application, en suivant le guide et l'exemple de [Thinking in React](https://react.dev/learn/thinking-in-react#step-1-break-the-ui-into-a-component-hierarchy).

Pour démarrer voilà un `index.tsx` le reste des composants que vous allez créer est rangé dans un sous-dossier `components`.

```tsx
import { createRoot } from 'react-dom/client'
import * as React from 'react'
import AppToolbar from './components/AppToolbar'
import EventPanel from './components/EventPanel'

const App = () => (
    <div>
        <AppToolbar />
        <EventPanel />
    </div>
)

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)
```

Ce code est donné à titre indicatif vous pouvez reprendre ce que vous avez déjà créé dans le TP1, en faisant attention au typage des fonctions composant, de leurs paramètres (props). Commencez progressivement et testez régulièrement.

Créer des composants fonctionnels (on rajoutera de l'interaction par la suite). Vous pouvez vous inspirer de la syntaxe et de la structure de cette <a href="https://github.com/laststance/react-typescript-todomvc-2022">mini todo app</a>

### Gérer la logique de l'application

La toolbar doit afficher le titre de l'événement et un menu permettant de naviguer entre tous les événements. Rajouter à l'état de l'App, une balise indiquant le événement courant. Faites en sorte que l'état de App change lorsque vous sélectionnez un événement, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le menu parle à des composants parents).
Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".

Pour démarrer vous pouvez utiliser l'extension react dev tools, et modifier l'état à la main pour vérifier que la vue change bien.

Voici à quoi ressemblerait la structure de `AppToolbar` :
`PublicEvent` est définit comme une interface dans un fichier `models.d.ts` contenant les types / interfaces utilisées dans l'application que j'importe ici.

```tsx
TODO imports
import { PublicEvent } from "../models";

interface Props {
  events: Array<PublicEvent>;
}

const AppToolbar: React.FC<Props> = (props): React.ReactElement => {
    return (
      <div>ma toolbar pour l'événement #{props.id}</div>
    )
}

export default AppToolbar
```

### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir deux chemins dédié à chaque Événement, l'un en mode admin, l'autre en mode participant.

En complément d'avoir un état interne à l'application qui définit quel événement afficher, nous allons utiliser une route qui pointe vers l'événement en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reactrouter.com/en/main). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à parcourir les tutoriels [sur cette page](https://reactrouter.com/en/main/start/tutorial).

On va utiliser `BrowserRouter` qui demande une configuration côté serveur (toutes les requêtes doivent être redirigées sur l'index, [https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3](voir un exemple ici, à adapter à vos besoins) ). L'idée est que charger un url de type [http://monsite.net/admin/event/eventID](http://monsite.net/admin/event/eventID) charge l'evenement donné.

Importez bien `react-router-dom`.

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

Une fois la valeur de la route récupérée pour qu'elle corresponde à l'événement à afficher. Vous remarquerez que la gestion de l'état courant est maintenant distribuée entre l'url et le state de React.

### Nettoyage

Déployez et testez sur mobile (faites les adaptations nécessaires).

En anticipation du TP 2.3, vous pouvez déjà préparer la gestion d'une route de type `monappli.net/event/1/question/2` qui n'affiche que la question à l'id `2` de l'evenement `1`. Sur cette vue, vous pouvez rajouter des flèches `<` `>` à la toolbar (ou ailleurs) qui permettent de naviguer entre les questions d'un même événement.

## TP2.2 Redux Toolkit

Nous allons maintenant gérer l'état de l'application sur plusieurs dispositifs en utilisant Redux Toolkit et des Websockets. L'objectif est que vous puissiez changer l'état de votre application sur un dispositif (ex: mobile), et que l'état de l'application soit mis à jour partout (ex: vidéo-projection, personne qui regarde votre mur à distance sur sa machine...)

<!-- Nous allons gérer l'état qui comprend la liste des murs et le mur en cours.-->

**Pensez à relire le cours et les ressources associées pour être au clair sur ce que vous êtes en train de faire.**

### Création d'un store

Nous allons commencer par créer le store qui va gérer les états.

```ts
TODO
```

#### Utiliser le store

Dans votre `index.tsx` principal exposez le store pour pouvoir l'afficher via la console du navigateur.
Cela permettra d'effectuer les premiers tests de Redux, sans l'avoir branché à votre application React.

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
TODO
```

#### Lien React - Redux Toolkit
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

Maintenant on va tester que le flux d'information ce passe bien. On va rajouter un bouton `up` aux questions. Quand on cliquera dessus, il ira modifier la propriété `upvotes` de la question.

Pour faire cela nous allons devoir modifier le composant question et le store

```js
TODO
```

Lorsque l'on clique sur le bouton on va appeler une action du store :

```js
  // on récupère l'action désirée dans le store
  const triggerUpvote = useStoreActions((actions) => actions.triggerUpvote);
  ...
  // et on s'en sert lors du clic sur le bouton
  <button onClick={triggerUpvote}></button>
```

## TP2.3 Distribution d’interface multi-dispositif Middleware et websockets

Nous allons maintenant travailler à la distribution de l'application sur plusieurs dispositifs et à leur synchronisation.

Nous allons définir une route pour chaque question. Les questions seront éditable.

Les routes et vues dédiées à la réponse aux questions, peuvent être optimisées pour mobile.

Les boutons `<` et `>` permettent de naviguer entre les questions. Le menu du haut pour naviguer entre les événements. Eventuellement un menu du bas pour naviguer entre les questions (optionnel).

### Définition de nouvelles routes et des vues associées

Il n'existe pas de bibliothèque à l'heure actuelle pour gérer de manière simple de la distribution d'interface, nous allons donc devoir le faire "à la main".

À la création du `BrowserRouter` faites une redirection vers une route en fonction du dispositif utilisé et de son état.

Vous pouvez utiliser `react-device-detect` [(doc)](https://www.npmjs.com/package/react-device-detect) pour détecter le dispositif (mobile ou non). Et la `fullscreen API` [(doc)](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide) pour contrôler le plein écran.

Au besoin vous pouvez aussi vous appuyer sur des appels à `redirect` [(doc)](https://reactrouter.com/en/main/fetch/redirect) à la racine de votre application pour

### Gestion "à la main" des routes des Evenements

Nous allons maintenant préparer la synchronisation des dispositifs. Pour cela nous allons devoir gérer le event courant dans notre état (`currentEvent` dans le store).
`ReactRouter` n'est pas conçu pour bien gérer le lien entre route et état (même si cela s'est bien amélioré avec la v6).
Et les routeur alternatifs (type `connected-react-router`) ont aussi des limites. Nous allons donc gérer cette partie de la route à la main.

#### Changer la route en cas de changement de event

Lors d'un changement d'event, plutôt que d'utiliser `<Link to={`/event/${i}`}>` créer un listener.

Ce listener sera en charge de déclenche une action modifiant le store (la valeur du event courant), puis déclenchera une navigation vers l'event sélectionné grace au hook [useNavigate()](https://reactrouter.com/en/main/hooks/use-navigate)

A ce stade maintenant vous ne devriez plus passer de props depuis vos parents mais utiliser le store de votre application pour remplir vos composants

### Un premier Middleware de logging

Pour comprendre la logique du Middleware [suivez la documentation Redux](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware). `Faites un essai qui reprend en suivante [cette courte vidéo](https://www.youtube.com/watch?v=6AGdeO28UKY)) (pensez juste à installer`@types/redux-logger`en plus).`

Nous allons maintenant créer un logger similaire "à la main" (vous pouvez faire ça dans le fichier de base de votre store). Un middleware a une signature un peu particulière. [Il s'agit en fait de 3 fonctions imbriquées](https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware):

Dans le fichier où vous avez créé votre store, ajoutez:

```jsx
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

export default loggerMiddleware;
```

Et ajoutez le dans le tableau des middlewares qui était vide jusqu'à présent.

- La fonction externe est le middleware lui-même, elle reçoit un objet de type `MiddlewareAPI` qui contient les fonctions {dispatch, getState} du store.
- La fonction centrale reçoit une fonction `next` comme argument, qui appellera le prochain middleware du pipeline. S'il c'est le dernier (ou l'unique), alors la fonction `store.dispatch`
- La fonction interne reçoit l'action courante en argument et sera appelée à chaque fois qu'une action est dispatchée.

### Notre Middleware de diffusion des actions avec des websockets

Nous allons maintenant faire communiquer plusieurs navigateurs entre eux grâce à [socket.io](https://socket.io/). Pour cela nous allons rajouter un middleware dédié. Sur un navigateur, quand on change de question, un message sera envoyé aux autres navigateurs afin qu'ils changent eux aussi leur question courante.

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

#### Synchronisation des changements de navigation entre les appareils

Passons à la création de notre propre Middleware dans lequel on importera `socket.io-client` (installez le avec yarn). Le middleware devra, dès qu'il intercepte une action (`setQuestion` ou autre) la propager au serveur via un websocket par un message adéquat, avant de faire appel à `next(action)`.

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

Toujours dans le middleware, configurez la socket pour qu'à la réception des messages les actions soient dispatchées au store, ou pour que vous naviguiez à la bonne route.

```js
socket.on("action", (msg) => {
  console.log("action", msg);
  switch (
    msg.type // ajuster le msg.type pour qu'il corresponde bien à celui dédinit pour l'action de votre reducer
  ) {
    case "set_question": // <- probablement autre chose cela dépend du 'type_de_message' définit dans votre emit ci-dessus
          // action à dispatcher
      break
  }
});
```

Pour changer la question courante, le mieux est de ne pas modifier l'état, mais de naviguer sur la route attendue, ce qui aura pour effet de change l'état.
Vous remarquerez sans doute qu'au point où nous en sommes nous allons provoquer une boucle infinie d'émissions de messages. 

Pour éviter cela, les actions Redux peuvent embarquer un information supplémentaire grâce [la propriété `meta`](https://github.com/redux-utilities/flux-standard-action#meta). 


#### Synchronisation des actions entre les appareils

Pour synchroniser votre store plus généralement (exemple: édition du titre d'un événement ou d'une question, ajout d'une question, etc.) nous allons diffuser les actions via le même middleware. Les actions vont ensuite être récupérées et dispatchées au store.

Pour pouvoir être dispatchées nous allons devoir utiliser redux. Pour ce faire il va falloir faire un double wrapping de **votre composant racine** avec le même objet store fournit au Provider de redux

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
    case "set_postit_title": // <- probablement autre chose
      store.dispatch(
                // action à dispatcher
            )
      break;
  }
})
```

<!-- Comme nous utilisons ReduxToolkit et TypeScript, il faut utiliser un `prepare` callback [comme décrit ici](https://redux-toolkit.js.org/usage/usage-with-typescript#defining-action-contents-with-prepare-callbacks) -->

#### Finalisation

Vous avez maintenant le poc de votre application.

Rajoutez des actions pour ajouter/supprimer des evenements, et des questions, et éditer leur titre.

Vous pouvez maintenant tester, nettoyer le code, et rendre.

## Rendu

À rendre pour le dimanche 07/02 à 23h59.

1. Déployez votre code en local
2. Pousser votre code sur la forge
3. Déposer les liens sur Tomuss

- Le lien vers la forge permet de faire un clone (format suivant: <https://forge.univ-lyon1.fr/xxx/yyy.git>)

### Critères d'évaluation

- Fichier `README.md` décrivant le process de build en dev, en prod, et de déploiement (expliquez les cas et comment lancer).
- Fichier `package.json` nettoyé ne contenant que les dépendances nécessaires.
- Linting bien configuré et respecté
- Types Typescript correctement définis
- Déploiement sur une VM de l'université.
- Composants React pour le `Event`, les `Questions`, la `Toolbar`.
- Utilisation de composants fonctionnels
- Store qui contient l'état de l'application
- Le flux de données suit le flow React, des actions sont déclarées, et les changements d'états passent par des actions unitaires qui modifient le store.
- Les changements sont des fonctions qui renvoient un nouvel état (immutabilité) dans le reducer.
- Redux Toolkit pour la gestion avancée des états
- Gestions des routes pour les boards et post-its
- Suivant/precedent change l'URI. Changer la route dans la barre d'URL du navigateur change l'état de l'application.
- Implémentation des Websockets côté client et serveur
- Synchronisation des questions affichées entre les dispositifs s'appuyant sur un middleware
- Synchronisation des changements sur une question s'appuyant sur un middleware.
- Adaptation du contenu au dispositif (routage selon le dispositif) et affichage des bons composants.
- Gestion du plein écran.
<!-- - Gestion différenciée des pointer-events. -->
<!-- - Synchronisation des dessins s'appuyant sur un middleware. -->
<!-- - Gestion des gestes pour des commandes suivant, précédent. -->
<!-- - Les commandes associées aux gestes sont bien propagées et permettent de contrôler un dispositif à distance. -->
- Qualité globale du rendu (= application qui ressemble à quelque chose, un minimum de mise en page, orthographe propre, composants s'appuyant sur des librairies CSS ou stylés à la main).
