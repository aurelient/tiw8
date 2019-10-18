## TIW8 - TP2 Application de Présentation multi-surface en React

#### Encadrants
- Aurélien Tabard (responsable)
- Lionel Médini
- Alix Ducros



#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant de créer et controler des présentations. Elle sera développée principalement côté client avec React, avec un serveur Node/Express léger. Client et serveur seront codés en JavaScript. 

Les points suivants seront abordés

- Composants React 
- Gestion des états et flux de données
- Gestion de routes React
- Redux pour la gestion avancée des états 
- Middleware pour gérer des effets de bord
- Design responsive et adaptatif
- Reconnaissance de gestes 


Ce TP s'étalera sur 4 séances et fera l'objet d'un rendu en binome et d'une note. Voir les critères d'évaluation en bas de la page.

Vous ferez le rendu sur la forge, créez un projet git dès maintenant, puis un projet (npm init).

Pensez à remplir le <a href="">formulaire de rendu</a>.


## TP2.1 Introduction à React

Nous allons repartir du TP1 pour ce projet, vous pouvez donc le cloner, puis le pousser dans un nouveau repo dédié au TP2 (pour les 4 séances du TP).

Si vous n'avez pas utilisé [react-bootstrap](https://react-bootstrap.github.io/) dans le TP précédent. Installez le.

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
- on peut penser à d'autre modèles: image seule, iframe intégrant une page html...

Imaginez que le serveur envoie ce type de données (qui peuvent être améliorées/modifiées selon vos besoins) : 

```javascript
[
  {type: 'title', title: 'TIW 8', visible: true, notes: ""},
  {type: 'content', title: 'TP 1', text: "Le TP porte sur des rappels de developpement Web", visible: false, notes: "ce transparent est caché"},
  {type: 'content', title: 'TP 2', text: "Le TP porte sur la creation d'un outil de presentation HTML", visible: true, notes: ""},
  {type: 'content', title: 'TP 3', text: "Le TP 3", visible: true, notes: ""},
  {type: 'content', title: 'TP 4', text: "Le TP 4", visible: true, notes: ""},
  {type: 'title', title: 'Question ?', visible: true, notes: ""},
];
```

<iframe style="border: none;" width="600" height="337" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FUzpqcHwddgDnfriafh7gIs%2Ftiw8-tp2-appstructure%3Fnode-id%3D16%253A3" allowfullscreen></iframe>
 
 <iframe style="border: none;" width="600" height="337" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FUzpqcHwddgDnfriafh7gIs%2Ftiw8-tp2-appstructure%3Fnode-id%3D16%253A15" allowfullscreen></iframe>


Créez la structure des composants correspondant à cette application, en suivant le guide et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-1-break-the-ui-into-a-component-hierarchy).

Voici une structure pour démarrer, pensez à utiliser les composants bootstrap plutôt que du html pur: 

```JSX

class Slide extends React.Component {
  render() {
    const slide = this.props.slide;
    const type = slide.type ? "title" : ...

    return (
        <h1> {slide.title} </h1>
        ...
    );
  }
}

class Slides extends React.Component {
  render() {
    
    this.props.slides.forEach((slide) => {
        ...
    });

    return (
      <div>
      ...
      </div>
    );
  }
}

class Toolbar extends React.Component {
  render() {
    return (
      <div>
      ... d'autres composants ...
      </div>
    );
  }
}

class SlideShow extends React.Component {
  render() {
    return (
      <div>
        <Slides slides={this.props.slides}/>
        <Toolbar slides={this.props.slides} />
      </div>
    );
  }
}


const SLIDES = [
  {type: 'title', title: 'TIW 8', visible: true, notes: ""},
  {type: 'content', title: 'TP 1', text: "Le TP porte sur des rappels de developpement Web", visible: false, notes: "ce transparent est caché"},
  {type: 'content', title: 'TP 2', text: "Le TP porte sur la creation d'un outil de presentation HTML", visible: true, notes: ""},
  {type: 'content', title: 'TP 3', text: "Le TP 3", visible: true, notes: ""},
  {type: 'content', title: 'TP 4', text: "Le TP 4", visible: true, notes: ""},
  {type: 'title', title: 'Question ?', visible: true, notes: ""},
];

ReactDOM.render(
  <FilterableProductTable slides={SLIDES} />,
  document.getElementById('container')
);
```

Ce code est donné à titre indicatif. Commencez progressivement et testez régulièrement.


### Gérer la logique de l'application

La toolbar doit contenir deux boutons avant/arrière pour naviguer entre les transparents. Faites en sorte que l'état du slideshow change lorsque vous pressez un bouton, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le bouton parle à des composants parents). Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".


### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir un lien dédié pour chaque transparent.
En plus d'avoir un état interne à l'application pour savoir quel transparent afficher, nous allons utiliser une route qui pointe vers le transparent en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reacttraining.com/react-router/). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à lire [cette page](https://reacttraining.com/react-router/web/guides/philosophy).

[React router](https://reacttraining.com/react-router/web/guides/primary-components) requiert d'envelopper votre application dans un composant `Router`.

En l'occurrence `HashRouter` (et non `BrowserRouter` qui demande une configuration côté serveur). L'idée est que charger un url de type [http://monsite.net/#/3](http://monsite.net/#/3) charge le 3e transparent. Importez bien `react-router-dom` non.

- Si vous utilisez des `class components`, vous pouvez récupérer la valeur de la route en utilisant un props dédié passé par le routeur. [Suivez cet exemple](https://reacttraining.com/react-router/core/api/withRouter)
- Si vous utilisez des `functional components`, avec le hook `useParams();` vous pouvez récupérer la valeur de la route. [Suivez cet exemple](https://reacttraining.com/react-router/web/example/url-params).

Une fois la valeur de la route récupérée, modifier l'état de l'application, pour qu'il corresponde au transparent à afficher.

```

```

## TP2.2 Redux, Middleware, websockets pour le multi-dispositif

Nous allons maintenant gérer l'état de l'application sur plusieurs dispositifs en utilisant Redux et des Websockets. L'objectif est que vous puissiez changer l'état de votre application de présentation sur un dispositif (ex: mobile), et que l'état de l'application soit mis à jour partout (ex: vidéo-projection, personne qui regarde votre présentation à distance sur sa machine...)

Nous allons gérer l'état qui comprend la liste des transparents et le transparent en cours.

**Pensez à relire le cours et les ressources associées pour être au clair sur ce que vous êtes en train de faire.**

Afin de vous faciliter le debug du TP, vous pouvez activer la création d'un Source Map dans votre `webpack.config.js` : `devtool: 'eval-source-map'`.

### Redux

[Installez Redux et les dépendances associées pour React](https://redux-docs.netlify.com/introduction/installation) (`react-redux`). Par défaut Redux n'est pas lié à React et peut être utilisé avec d'autres Framework.

Créez dans `src` des dossiers pour organiser votre `store`, vos `reducers`, `actions`, et `containers`.


#### Création d'un store

Nous allons commencer par créer le store qui va gérer les états.

```js
    // src/store/index.js
    import { createStore } from "redux";
    import rootReducer from "../reducers/index";
    const store = createStore(rootReducer);
    export default store;
```

On importe `createStore` depuis redux et aussi `rootReducer`, on verra plus bas la définition des reducers. 

`createStore` peut aussi prendre un état initial en entrée, mais c'est en React c'est les reducers qui produisent l'état de l'application (y compris l'état initial).


#### Création d'un reducer

On crée un premier reducer qui va initialiser l'application. Le `rootReducer` a un état initial constant (_immutable_) à compléter.

```js
    const initialState = {
      index: 1, // initialise votre presentation au transparent 1
      slides: [] // vous pouvez réutiliser votre état de slides initial.
    };
    function rootReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_SLIDE:
            return ...
        case REMOVE_SLIDE: 
            return ...
        case NEXT_SLIDE: 
            return ...
        case PREVIOUS_SLIDE: 
            return ...
        default: 
            return state
    }
    return state;
    };
    export default rootReducer;
```

#### Tester Redux et le store

Dans votre `index.js` principal exposez le store pour pouvoir l'afficher via la console du navigateur.
Cela permettra d'effectuer les premiers tests de Redux, sans l'avoir branché à votre application React.

```js
    import store from "store/index"; // verifiez que le chemin est correct
    window.store = store;
```
Un devtool pour Redux est disponible pour [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) et [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/), il necessite quelques légères [modification de votre code](http://extension.remotedev.io/#11-basic-store).


#### Creation des actions

Suivre le [guide de Redux sur la création d'action](https://redux.js.org/basics/actions) en transposant la gestion de todos à la gestion de slides.

Vous aurez à définir les actions suivantes dans `actions/index.js`

```js
export const ADD_SLIDE = "ADD_SLIDE";
export const REMOVE_SLIDE = "REMOVE_SLIDE";
export const NEXT_SLIDE = 'NEXT_SLIDE'
export const PREVIOUS_SLIDE = 'PREVIOUS_SLIDE'
```

Ces actions sont utilisées comme signaux par Redux, ce ne que des objects JavaScript Simle. C'est le Reducer qui va faire le travail.

Les actions forcent principalement à définir des traitement unitaire.

Une bonne pratique Redux consiste à envelopper les actions dans une fonction pour s'assurer que la création de l'objet est bien faite. Ces fonction s'appellent `action creator`.

```js
export function addSlide(payload) {
  return { type: ADD_SLIDE, payload };
}
```

**Ne le faites pas maintenant**. Toutefois, quand votre application deviendra plus complexe, vous pourrez utiliser la convention [Redux duck](https://github.com/erikras/ducks-modular-redux) pour organiser votre code. 


#### Tester les actions

Toujours dans votre `index.js` principal, exposez les actions pour vérifier qu'elles changent bien le contenu du store. 
Redux n'est toujours pas branché à React, il est donc normal que l'interface ne change pas pour le moment. Mais vous pouvez observer l'état via l'extension Redux ou un simple `console.log()` dans votre Reducer.

```js
    import { nextSlide } from "actions/index"; // verifiez que le chemin est correct
    window.nextSlide = nextSlide;
```

#### Lien Redux / React

Nous allons lier votre composant principal à Redux.

Pour commencer `Redux` fournit un composant `<Provider>` à placer à la racine de votre application.

Voir l'[exemple de la documentation](https://react-redux.js.org/introduction/quick-start#provider).

Ce `provider` va rendre le store Redux disponible dans l'application.

Il faut ensuite ce connecter à ce store. Pour cela on utilise la fonction `connect()`, et en définissant une fonction `mapStateToProps()` qui va faire le lien entre le state Redux et les props de votre composant.

```js
const mapStateToProps = (state) => {
  return {
    slides: state.slides,
    index: state.index
  }
}

... VOTRE_COMPOSANT ...

export default connect(mapStateToProps)(VOTRE_COMPOSANT)
```


Maintenant nous allons modifier l'état de `index` en cliquant sur les boutons précédent/suivant de votre `Toolbar`. Pour cela nous allons utiliser `mapDispatchToProps()` [qui va connecter notre application React aux actions Redux](https://react-redux.js.org/using-react-redux/connect-mapdispatch).

1. Importer connect de `react-redux`, et les actions depuis votre fichier de définition d'action.
```js
import { connect } from "react-redux";
import { action1, action2 } from "..../actions/index";
```

2. Créer un `mapDispatchToProps` et le connecter avec votre composant.

```js
const mapDispatchToProps = { precendent, suivant } // corriger selon le nom de vos actions

// ... VOTRE_COMPOSANT

export default withRouter(connect(null, mapDispatchToProps)(VOTRE_COMPOSANT));
```

3. Enfin en cas de clic sur vos boutons avant/apres appelez vos actions  `onClick={() => {suivant(true)}`


#### Lien Redux / React Router  

Normalement l'intégration avec React Router se passe bien (pas de changements nécessaire). Si jamais ce n'était pas le cas, suivez l'utilisation de Redux avec React Router telle que présentée dans la documentation de [React Router](https://reacttraining.com/react-router/web/guides/redux-integration) ou celle de [Redux](https://redux.js.org/advanced/usage-with-react-router) pour configurer votre projet.  





### Déployer sur Heroku 
Afin de rendre notre application disponible sur les internets, nous allons la déployer sur [Heroku](https://heroku.com). 
Suivre le guide de Heroku pour déployer une application via git :
[https://devcenter.heroku.com/articles/git#creating-a-heroku-remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)

N'oubliez pas de désactiver l'option `watch` de webpack si vous lancez Webpack en `--mode production` [voir ici](https://webpack.js.org/configuration/mode/).



## TP2.3 Distribution d’interface multi-dispositif



### Middleware et websockets

Pour comprendre la logique du Middleware [suivez la documentation Redux](https://redux.js.org/advanced/middleware). Faites un essai qui reprend l'idée et logue dans la console toutes les actions déclenchées (voir [ici](https://redux.js.org/advanced/middleware#the-final-approach) _sans le crashReporter_).


Nous allons maintenant faire communiquer plusieurs navigateurs entre eux gràce à [socket.io](https://socket.io/). Pour cela nous allons rajouter un middleware dédié. Sur un navigateur, quand la slide courante sera changée, un message sera envoyé aux autres navigateurs afin qu'ils changent eux aussi leur slide courante.

Côté serveur, importez `socket.io` ([tuto officiel](https://socket.io/get-started/chat/)) et mettez en place le callback permettant de recevoir les messages `previous_slide` et `next_slide` provenant d'un client et de les propager à tous les autres clients. Ce [guide permet de créer et tester une micro-application express utilisant socket.io](https://devcenter.heroku.com/articles/node-websockets#option-2-socket-io) en local et sur Heroku.


Côté client créez un [Middleware](https://redux.js.org/advanced/middleware#the-final-approach) dans lequel vous importerez `socket.io-client`. Le middleware devra, dès qu'il intercepte une action de type `NEXT_SLIDE` ou `PREVIOUS_SLIDE`, propager un message adéquat via le socket, avant de faire appel à `next(action)`

Toujours dans le middleware, configurez la socket pour qu'à la réception des messages `previous_slide` et `next_slide`, les actions soient dispatchées au store.

```js
const propagateSocket = store => next => action => {
  if (action.meta.propagate) {
    if (action.type === NEXT_SLIDE) {
      socket.emit('action', 'next_slide')
    } else if (action.type === PREVIOUS_SLIDE) {
      socket.emit('action', 'previous_slide')
    }
  }
  next(action)
}
```

Vous remarquerez sans doute qu'au point où nous en sommes nous allons provoquer une boucle infinie d'émissions de messages. Pour éviter cela, les actions `NEXT_SLIDE` et `PREVIOUS_SLIDE` peuvent embarquer un information supplémentaire grâce [la propriété `meta`](https://github.com/redux-utilities/flux-standard-action#meta). Faites en sorte que seuls les dispatchs provenant d'un clic sur un bouton provoquent la propagation d'un message via Websocket.

N'oubliez pas d'utiliser `applyMiddleware` lors de la création du votre store. Si vous avez précédement installé le devtool Redux, référez-vous [à cette page](http://extension.remotedev.io/#12-advanced-store-setup) pour modifier de nouveau votre code.

```js
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(propagateSocket)));
```





## TP2.4 Modalité d’entrées (gestes, stylet)





