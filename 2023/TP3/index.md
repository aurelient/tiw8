## TIW8 - TP3 Collaboration temps-réel

#### Encadrants

- Aurélien Tabard (responsable)

#### Présentation du TP

L'objectif du TP est de créer un clone de [gather.town](https://gather.town) : une plateforme d'échange collaborative basée sur du RPG, qui lance une visio si deux personnes sont à côté.

Ce TP s'étalera sur 2 séances et fera l'objet d'un rendu en binome et d'une note. Vous ferez le rendu sur la forge.

## TP3.1 WebRTC et partage de données en local

### Boilerplate

Vous pouvez partir du code [fournit ici](https://forge.univ-lyon1.fr/tiw8-internal/tiw8-tp3-2023-base/) (voir le README pour les instructions de build).

On continuera d'utiliser le linter et prettier.

### Démarrage du TP

Nous allons créer une application qui permet de partager des données entre deux navigateurs. À la différence d'une application Web "normale", ici les messages vont s'échanger entre les navigateurs sans passer par un serveur. Nous allons nous appuyer sur WebRTC pour réaliser cela. WebRTC est une technologie p2p.

Nous aurons :

- un serveur
  - pour fournir le site de base
  - pour permettre la découverte des clients du réseau p2p
- des clients qui se parleront entre eux.

Nous allons nous appuyer sur la [simple-peer](https://github.com/feross/simple-peer) pour réaliser ce TP. Cette bibliothèque abstrait une bonne partie de la complexité de WebRTC. Vous pouvez aller voir le [TP de 2019](../../2019/TP3) pour avoir une idée de comment faire les choses "à la main".

On aura besoin des dépendances suivantes :

- Tailwind
- [simple-peer](https://github.com/feross/simple-peer/)
- @types/simple-peer
- socket.io

### Mise en place du signaling

Le signaling consiste en la mise en relation des différents clients entre eux. Pour cette phase nous allons utiliser un serveur qui servira d'entremetteur. Les clients vont se déclarer au serveur, puis ouvrir un canal de communication direct entre eux.

Comme dans les TP précédents nous allons utliser express. Pour le mécanisme de la découverte des pairs nous allons utiliser des websockets (avec socket.io côté client et côté serveur). Nous utilisons webpack et servons le contenu du dossier `dist` (comme dans les TP précédents). Vous pouvez reprendre le code serveur du TP précédent.

On part du principe que tous les clients qui se connectent au serveur veulent se connecter les un aux autres, d'abord en data, puis en audio/vidéo. En bonus vous pouvez mettre en place un principe de salon: chaque salon a sa propre carte seuls les utilisateurs sur un salon donné sont connectés les uns aux autres.

Côté client, nous allons gérer ce qui a trait à `simple-peer` dans un middleware. En effet simple-peer est une abstraction d'interfaces de communication réseau qu'on veut tout garder active. _Alternativement,_ il est possible de déclarer les objets `simple-peer` comme mutable et persistant tout au long du cycle de vie [grâce au hook useref](https://reactjs.org/docs/hooks-reference.html#useref), et de les gérer par exemple dans le composant Board.

Les étapes sont les suivantes :

- côté client on ouvre une connexion (socket) vers le serveur

- côté serveur, `socket.io` gère déjà la liste de tous les clients qui lui sont connectés (`io.sockets`). En cas de `connection` on va diffuser à tous les clients connectés la présence d'un nouveau pair en émettant un message ayant pour `eventName`: `peer`, et pour argument un objet décrivant le pair. À la différence d'un appel ou l'un des utilisateurs enclenche la connection vers un autre, dans notre situation, c'est le serveur qui va décider arbitrairement quel pair est le `initiator`.

```json
  {
    peerId: socket.id,
    initiator: true, // ou false selon la situation
  }
```

- côté client on écoute l'annonce de la connexion de nouveaux pairs aux serveurs `socket.on('peer', (data) => {})`. C'est à cette annonce qu'on crée un nouveau `peer`

```jsx
const peer: SimplePeer.Instance = new SimplePeer({
  initiator: data.initiator,
  trickle: useTrickle, // useTrickle doit être a true pour que le peer persiste
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:global.stun.twilio.com:3478" },
    ],
  },
});

// TODO ajouter tous les listeners au peer,

socket.on("signal", function (data) {
  console.log("received signal on socket");
  // TODO propagate signal from socket to peer
});

peer.on("signal", function (data) {
  console.log("Advertising signaling data" + data + "to Peer ID:" + peerId);
  // TODO propagate signal from peer to socket
});
peer.on("error", function (e) {
  console.log("Error sending connection to peer :" + peerId + e);
});
peer.on("connect", function () {
  console.log("Peer connection established");
  // vous pouvez essayer d'envoyer des donnees au pair avec send("hello") pour voir si ça marche
});
peer.on("data", function (data) {
  console.log("Received data from peer:" + data);
  // les donnees arrivent sous forme de string,
  // si le string est un objet JSON serialise avec JSON.stringify(objet)
  // JSON.parse(string) permet de reconstruire l'objet
  const restructuredData = JSON.parse(data);
  // TODO take action after receiving data from peer
});
peer.on("stream", (stream): void => {
  //   TP suivant 3.3
  console.log("got stream " + stream);
});

// TODO ajouter ce peer à une liste de tous les pairs auxquels vous êtes connecté
```

En vous référent à la [documentation de simple-peer](https://github.com/feross/simple-peer) mettez en relation les deux clients. Commencez par gérer seulement deux pairs pour simplifier. La gestion de 3 ou à 5 pairs est en bonus si jamais vous vous ennuyez fin décembre.

Voici un diagramme de séquence de la mise en relation.

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F30I32CQBdqwdMxK6mUCPRw%2Ftiw8-tp3%3Fnode-id%3D0%253A1" allowfullscreen></iframe>

### Partage de la position du même joueur

A ce stade vous devrions être capable de partager des données entre deux pairs qui se sont auto-découverts.

Maitenant nous allons reprendre le principe du TP précédent: lorsqu'on bouge le personnage, le déplacement va être capturé par le middleware (c'est là qu'est localisé tout le code ci-dessus) et propagé.

A la place de propager par un socket, on va partager avec un `peer.send()` et recevoir de l'autre côté avec un `peer.on('data', data => {})`

En suivant le même principe que le TP 2 vous devriez pouvoir déplacer le personnage entre deux navigateurs.

### Rajouter un deuxieme personnage dans l'état

Maintenant nous allons rajouter un deuxième personnage. Pour simplifier vous pouvez "hardcoder" l'avatar du personnage en fonction de la valeur peer.initiator.

Au lieu de partager les déplacements du même personnage faites en sorte que chaque pair controle son propre personnage : en plus du deplacement partagez l'identifiant du personnage.

### En cas de déploiement

**J'évaluerai le TP3 en local** (= chez moi sur mon réseau interne), le déploiement fonctionnel c'est super, mais ne perdez pas trop de temps dessus si ça vous bloque.

Depuis l'université notamment, il est possible que des ports de mise en relation soient bloqués, et que les deux pairs ne puissent pas bien se parler. Dans ce cas, il faut passer par un serveur turn qui relaiera le traffic (de la data, mais au prochain TP de la vidéo). Vu que c'est du volume, cela devient couteux, il n'existe donc pas de serveurs TURN public.

Toutefois vous pouvez vous créer un compte sur [Twilio.com](https://www.twilio.com/), et [voir ici comment récupérer un accès à leurs serveurs Stun/Turn](https://www.twilio.com/docs/stun-turn). Vous aurez 15$ de crédits en ouvrant le compte. Ce qui devrait largement aller pour le TP.


## TP3.2 WebRTC et vidéo

Nous allons maintenant créer un nouveau composant dédié à la vidéo. La vidéo va se déclencher quand les deux personnages sont à moins de deux cases de distance, et se couper quand ils sont à plus de 5 cases de distance.

On va donc transmettre des flux vidéos en plus des data. La documentation de simple-peer traite de ce cas de figure : [dynamic video voice](https://nicedoc.io/feross/simple-peer#user-content-dynamic-videovoice). NB: on s'intéresse à la vidéo pour commender ne perdez pas de temps sur l'audio au début.

Vous pouvez commencer par avoir des boutons pour déclencher l'appel, cela permet de tester les différentes étapes de l'établissement d'un appel. Une fois que cela marche avec des boutons, vous pourrez faire en sorte que l'appel se déclenche et se coupe si les deux personnages sont à moins de 2 ou 3 cases l'un de l'autre.

Vous pourrez établir d'autre modes de connexion, par exemple en "entrant" dans une salle. Le composant Board vient avec une grille de `div` au-dessus de la carte, vous pouvez utiliser ces divs pour faire des effets d'activation (par exemple mettre en rouge une salle active si des personnes sont dedans, ou indiquer la zone dans laquelle l'appel va rester actif).

### Création du composant VideoChat

Voici un composant vidéo pouvant servir d'inspiration.

```js
function VideoChat() {
  const [startAvailable, setStart] = useState(true);
  const [callAvailable, setCall] = useState(false);
  const [hangupAvailable, setHangup] = useState(false);

  return (
    <div>
      <div>
        <video
          ref={localVideoRef}
          autoPlay
          muted
          style={{ width: "240px", height: "180px" }}
        >
          <track kind="captions" srcLang="en" label="english_captions" />
        </video>
        <video
          ref={remoteVideoRef}
          autoPlay
          style={{ width: "240px", height: "180px" }}
        >
          <track kind="captions" srcLang="en" label="english_captions" />
        </video>
      </div>
      <div>
        <button onClick={start} disabled={!startAvailable}>
          Start
        </button>
        <button onClick={call} disabled={!callAvailable}>
          Call
        </button>
        <button onClick={hangup} disabled={!hangupAvailable}>
          HangUp
        </button>
      </div>
    </div>
  );
}
export default VideoChat;
```

### Récupération du flux vidéo

Avant de transmettre notre flux à notre correspondant, nous allons tout d'abord faire en sorte de récupérer le flux vidéo du navigateur.

Utilisez l'API mediaDevices pour récupérer le `stream` vidéo et le visualiser dans votre composant.

```js
const start = () => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then(gotStream)
    .catch((e) => {
      console.log(e);
      alert("getUserMedia() error:" + e.name);
    });
};

const gotStream = (stream) => {
  localVideoRef.current.srcObject = stream; // on injecte le flux vidéo local dans l'element video qui a pour ref 'localVideoRef'
  dispatch(setLocalStream(stream, false)); // sera utile plus tard pour avoir accès au flux dans le middleware
};
```

Nous allons déclarer certains objets comme mutable et persistant tout au long du cycle de vie [grâce au hook useref](https://reactjs.org/docs/hooks-reference.html#useref).

Vous aurez globalement besoin de gérer deux objets (déclarer au début du composant après vos variables d'état) :

```js
const localVideoRef = useRef < HTMLVideoElement > null;
const remoteVideoRef = useRef < HTMLVideoElement > null;
```

#### Partage des flux entre clients

Lorsque qu'on clique sur appel (ou lorsque deux personnages sont proches) nous allons déclencher la connexion vidéo entre les deux pairs.

Référez vous à la documentation de simple-peer pour l'émission et la réception du flux vidéo.

Vous pourrez appelez `gotRemoteStream(stream_de_simple-peer);` dans votre événement `on call` pour cabler le flux à l'interface.

```js
const call = () => {
  // TODO voir la doc de simple-peer
  // vous pouvez passer par un dispatch pour gérer ça dans le middleware

  setCall(false);
  setHangup(true);
};
```

```js
const gotRemoteStream = (remoteStream) => {
  const remoteVideo = remoteVideoRef.current;

  if (remoteVideo.srcObject !== remoteStream) {
    remoteVideo.srcObject = remoteStream;
  }
};
```

### Raccrocher

Pour raccrocher plusieurs s'option sont possibles : `peer.removestream(stream)` va couper le flux vidéo. peer.destroy() va directement détruire et couper la connexion. Si vous faites cela, il faut prévenir le serveur via un message passé par socket qu'il puisse mettre éventuellement mettre à jour l'état des pairs (par exemple si un pair est déjà dans un appel ou non).
`peer.on('close', () => {})` permettra de capturer la fin d'une connexion entre pairs.

## En cas de déploiement 

Si vous déployez le code sur un serveur. Il faudra donc mettre à jour votre application en conséquence.

Vous pouvez faire du code conditionnel et tester `location` côté client pour savoir si vous êtes en localhost ou déployé, et parler à un serveur peer ou un autre en conséquence.

**Dans votre README préciser bien quelle type de configuration fonctionne.**

## Rendu

À rendre pour le dimanche 10/03 à 23h59.

- Pousser votre code sur la forge
- Déposer les liens sur Tomuss “UE-INF2427M Technologies Web Synchrones Et Multi-Dispositifs”
- Le lien vers la forge permet de faire un clone (format suivant: https://forge.univ-lyon1.fr/xxx/yyy.git)

## Références en plus :

Voir aussi [ce cours de NYU](https://github.com/lisajamhoury/The-Body-Everywhere-And-Here/blob/master/syllabus.md) et [la discussion sur le signaling avec simple-peer](https://javascript.plainenglish.io/building-a-signaling-server-for-simple-peer-f92d754edc85) si vous souhaitez aller plus loin.

## Evaluation

Malus (points négatifs)

- linter original qui ne passe pas (ou trop d'exceptions dans le code) -2pt
- la séquence `yarn install`, `yarn build` et `yarn start`qui ne passe pas -2pt
- README pas clair sur les spécificité du projet (build, déploiement, ce qui marche et ce qui ne marche pas, sur comment tester...) -2pt

Points

- Un style Tailwind (ou autre) est utilisé de manière judicieuse (aka l'application ressemble à quelque chose) (2pt)
- Les states et props de React sont bien utilisées (1pt).
- Utilisation des hooks appropriés (2pt).
- Mise en relation des pairs
  - signalement au serveur (2pt)
  - établissement de la connexion entre les deux pairs (2pt)
- Data (5pt)
  - les pairs peuvent s'envoyer des messages (2pt)
  - l'envoi de message est géré dans un middleware (2pt)
  - plusieurs participants bougent de manière cohérente (1pt)
- VidéoChat (5pt)
  - le flux local s'affiche
  - le flux distant est bien récupéré
  - le flux distant s'affiche
  - le tout fonctionne sur localhost
  - la fermeture de l'appel se passe correctement

Bonus:

- Déploiement
- Gestion de plus de deux pairs.
- Gestion de salon
- Gestion de l'audio et de la vidéo séparé : quand on s'éloigne, la vidéo se coupe, mais l'audio diminue progressivement avec la distance avant de se couper.
