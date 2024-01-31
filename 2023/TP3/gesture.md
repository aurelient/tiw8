## TP 3.? Modalité d’entrées (gestes, stylet)

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

<!-- ### Synchronisation du canvas entre les appareils

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
``` -->

Faites en sorte que tous les post-its affichent leurs dessins associés au chargement du board.

<!-- Vous remarquerez qu'à l'ouverture sur un autre appareil, votre dessin n'apparait que si vous dessinez aussi sur cet appareil. Pour remédier à ce problème, utilisez [useEffect](https://reactjs.org/docs/hooks-effect.html) afin d'exécuter `redraw()` au moment opportun. -->

### Reconnaissance de gestes 

Pour terminer, nous allons effectuer de la reconnaissance de geste lors d'évènements touch.

Pour ce faire nous allons utiliser le [\$1 recognizer](http://depts.washington.edu/acelab/proj/dollar/index.html) vu en cours. Nous allons utiliser une version modifiée de [OneDollar.js](https://github.com/nok/onedollar-unistroke-coffee) pour fonctionner avec React. Il n'y a pas de module Typescript pour cette bibliothèque. Si vous êtes motivés, contribuez en un.

#### Gérer le recognizer

<!-- Au niveau de votre `Postit`, importer et initialiser votre le One Dollar Recognizer. -->
Dans votre composant contenant le `canvas`, importer et initialiser votre le One Dollar Recognizer.
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
