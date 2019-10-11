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

```javascript

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

La toolbar doit contenir deux boutons avant/arrière pour naviguer entre les transparents. Faites en sorte que l'état du slideshow change lorsque vous pressez un bouton, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le bouton parle à des composants parents). Suivez les instructions et l'exemple de [Thinking in React][https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow] sur les "Inverse Data Flow".


### React Router

Pour terminer ce TP nous allons rajouter la gestion de routes, pour qu'il soit possible d'avoir un lien dédié pour chaque transparent.
En plus d'avoir un état interne à l'application pour savoir quel transparent afficher, nous allons utiliser une route qui pointe vers le transparent en question. En chargeant cette route, l'état sera modifié.

Nous allons utiliser [react-router](https://reacttraining.com/react-router/). Pour en comprendre la logique (et les différences avec d'autres outils de routing), je vous invite à lire [cette page](https://reacttraining.com/react-router/web/guides/philosophy).

[React router](https://reacttraining.com/react-router/web/guides/primary-components) requiert d'envelopper votre application dans un composant `Router`.

En l'occurrence `HashRouter` (et non `BrowserRouter` qui demande une configuration côté serveur). L'idée est que charger un url de type [http://monsite.net/3](http://monsite.net/3) charge le 3e transparent.

En utilisant le hook `useParams();` vous pouvez récupérer la valeur de la route. [Suivez cet exemple](https://reacttraining.com/react-router/web/example/url-params).

Une fois la valeur de la route récupérée, modifier l'état de l'application, pour qu'il corresponde au transparent à afficher.



## TP2.2 Redux + websockets / multi-dispositif

### Redux


### Middleware



## TP2.3 Distribution d’interface multi-dispositif



## TP2.4 Modalité d’entrée (gestes, stylet)


