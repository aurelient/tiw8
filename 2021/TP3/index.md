## TIW8 - TP3 Collaboration temps-réel

#### Encadrants
- Aurélien Tabard (responsable)
- Louis Le Brun


#### Présentation du TP

L'objectif du TP est de créer un clone de [gather.town](https://gather.town) : une plateforme d'échange collaborative basée sur du RPG, qui lance une visio si deux personnes sont à côté.

Ce TP s'étalera sur 2 séances et fera l'objet d'un rendu en binome et d'une note. Vous ferez le rendu sur la forge.



## TP3.1 WebRTC et partage de données en local

### Boilerplate

Vous pouvez partir du code [fournit ici](https://forge.univ-lyon1.fr/tiw8-internal/tiw8-tp3-2021-base/) (voir le README pour les instructions de build).

Vérifiez que votre déploiement sur Heroku fonctionne.

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

Côté client, nous allons gérer ce qui a trait à `simple-peer` dans un middleware. En effet peerjs est une abstraction d'interfaces de communication réseau qu'on veut tout garder active. *Alternativement,* il est possible de déclarer les objets `simple-peer` comme mutable et persistant tout au long du cycle de vie [grâce au hook useref](https://reactjs.org/docs/hooks-reference.html#useref), et de les gérer par exemple dans le composant Board.

Les étapes sont les suivantes : 
- côté client on ouvre une connexion (socket) vers le serveur

- côté serveur, `socket.io` gère déjà la liste de tous les clients qui lui sont connectés (`io.sockets`). En cas de `connection` on va diffuser à tous les clients connectés la présence d'un nouveau pair en émettant un message ayant pour `eventName` `peer`, et pour argument un objet décrivant le pair. À la différence d'un appel ou l'un des utilisateurs enclenche la connection vers un autre, dans notre situation, c'est le serveur qui va décider arbitrairement quel pair est le `initiator`.  

  ```json
  {
    peerId: socket.id,
    initiator: true, // ou false selon la situation
  }
  ```

- côté client on écoute l'annonce de la connexion de nouveaux pairs aux serveurs `socket.on('peer', (data) => {})`. C'est à cette annonce qu'on crée un nouveau `peer`

  ```json
  const peer: SimplePeer.Instance = new SimplePeer({
          initiator: data.initiator,
          trickle: useTrickle,
          config: {
              iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
              ],
          },
  })
  
  ... ajouter tous les listeners au peer, ajouter ce peer à une liste de tous les pairs auxquels vous êtes connecté
  ```

  

En vous référent à la [documentation de simple-peer](https://github.com/feross/simple-peer) mettez en relation les deux clients. Commencez par gérer seulement deux pairs pour simplifier. La gestion de 3 ou à 5 pairs sera en bonus. 

### Augmentation du composant Board

Pour vous aider à débugger (ce n'est pas obligatoire) il peut être utile de cabler des boutons sur les différentes Nous allons créer un composant React qui va assembler les composants suivants :
- Le `Board` qui contient la carte
- Un div par personne connectée 
  - Au début un seul div, celui de l'utilisateur du navigateur
  - Plus tard un div par participant connecté
  - Ensuite pour chaque div la liste des déplacements du participant
  - Encore plus tard une vidéo du participant (prochain TP)
- Un bouton pour démarrer la mise entre relation entre les deux clients
- Un bouton mettant fin à la connexion

Voilà un exemple de composant dont vous pouvez vous inspirer.

```js
function DataChat()  {

    const [startAvailable, setStart] = useState(true)
    const [sendAvailable, setSend] = useState(false)
    const [hangupAvailable, setHangup] = useState(false)

    return (
        // TODO rajouter les champs textes correspondants
        // Vous pouvez utiliser des TextField de material-UI
        // Et une Grid plutôt que des div pour la mise en page
        <div>
          <Button onClick={start} disabled={!startAvailable}>
            Start
          </Button>
          <Button onClick={send} disabled={!callAvailable}>
            Send
          </Button>
          <Button onClick={hangUp} disabled={!hangupAvailable}>
            Hang Up
          </Button>
        </div>
    )
}
export default DataChat
```

Vous devriez à ce stade avoir un cadre d'application non fonctionelle.

- Lors du clic sur Start créez une connexion entre les deux clients (il faudra que les deux clients cliquent sur Start pour que la connexion soit établie). La création sera constituée des étapes suivantes
  - création/initialisation de l'objet Peer avec l'identifiant de votre client local.
  - ajout d'un listener d'ouverture de connexion (on open)
  - ajout d'un listener en cas de réception d'une demande de connexion (on connection)
  - connexion au client distant
- Lors d'un déplacement du personnage, envoi du message.
  - Vous pouvez vous brancher directement sur les événements pour commencer. 
  - Puis basculer sur un middleware comme au TP précédent pour être intégré au lifecycle de React.
- (Rajouter) un listener à la connexion sur l'arrivée d'un message (on data) pour l'ajouter à la liste des messages reçus.
- Lors du clic sur HangUp, femer la connexion




## TP3.2 WebRTC et vidéo

Nous allons maintenant créer un nouveau composant dédié à la vidéo.

Comme pour le TP précédent, nous allons démarrer par établir une connexion WebRTC entre 2 peers en local.


### Création du composant VideoChat

Nous allons maintenant transmettre des flux vidéos en plus des data.

Voici un composant vidéo pouvant servir d'inspiration. 

Vous pouvez commencer par avoir des boutons pour déclencher l'appel. Puis l'appel se déclenchera et se coupera si les deux personnages sont à moins de 2 ou 3 cases l'un de l'autre. Vous pouvez établir d'autre modes de connexion, par exemple en "entrant" dans une salle. Le composant Board vient avec une grille de `div` au-dessus de la carte, vous pouvez utiliser ces divs pour faire des effets d'activation (par exemple mettre en rouge une salle active si des personnes sont dedans, ou indiquer la zone dans laquelle l'appel va rester actif). 

```js
function VideoChat()  {

    const [startAvailable, setStart] = useState(true)
    const [callAvailable, setCall] = useState(false)
    const [hangupAvailable, setHangup] = useState(false)

    return (
        <div>
          <video
            ref={localVideoRef} autoPlay muted
            style={{ width: '240px', height: '180px' }}
          >
            <track kind="captions" srcLang="en" label="english_captions"/>
          </video>
          <video
            ref={remoteVideoRef} autoPlay
            style={{ width: '240px', height: '180px' }}
          >
            <track kind="captions" srcLang="en" label="english_captions"/>
          </video>

          <div>
            <Button onClick={start} disabled={!startAvailable}>
              Start
            </Button>
            <Button onClick={call} disabled={!callAvailable}>
              Call
            </Button>
            <Button onClick={hangUp} disabled={!hangupAvailable}>
              Hang Up
            </Button>
          </div>
        </div>
    )
}
export default VideoChat
```


### Récupération du flux vidéo

Avant de transmettre notre flux local à notre correspondant, nous allons tout d'abord faire en sorte de récupérer le flux vidéo du navigateur, lorsqu'on clique sur `Start`

Utilisez l'API mediaDevices pour récupérer le `stream` vidéo et le visualiser dans votre composant.

```js
    const start = () => {
        // TODO initialisation de peerjs

        setStart(false)
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(gotStream)
            .catch(e => {console.log(e); alert("getUserMedia() error:" + e.name)})
    }

    const gotStream = stream => {
        localVideoRef.current.srcObject = stream
        setCall(true) // On fait en sorte d'activer le bouton permettant de commencer un appel
        localStreamRef.current = stream
    }
```

Plutôt que des déclarer des variables hors du scope du composant, comme précédemment, nous allons faire les choses plus proprement en déclarant certaines objets comme mutable et persistant tout au long du cycle de vie [grâce au hook useref](https://reactjs.org/docs/hooks-reference.html#useref).

Vous aurez globalement besoin de gérer trois objets (déclarer au début du composant après vos variables d'état) :

```js
  const localStreamRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
```

#### Mise en relation des clients

Le click sur le bouton `Call` initiera la connexion entre les deux pairs.

Référez vous à la [documentation de peerjs](https://peerjs.com/) pour l'émission et la réception du flux vidéo.

Vous pourrez appelez `gotRemoteStream(stream_de_peerjs);` dans votre événement `on call` pour cabler le flux à l'interface.

```js
    const call = () => {
        // TODO voir la doc de peerjs

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
Il suffit d'appeler les méthodes `disconnect` sur chacune des connexion (avec les listeners appropriés), potentiellement `destroy` pour forcer la fin de la connexion.


## Déployer sur Heroku

Pour terminer nous allons déployer le code sur Heroku. Il faudra donc mettre à jour votre application en conséquence.

Vous pouvez faire du code code conditionnel et tester `location` côté client pour savoir si vous êtes en localhost ou déployé sur heroku, et parler à un serveur peer ou un autre en conséquence.

**Dans votre README préciser bien quelle type de configuration fonctionne.**

## Rendu

À rendre pour le dimanche 13 à 23h59.

  - Déployez votre code sur Heroku
  - Pousser votre code sur la forge
  - Déposer les liens sur Tomuss “UE-INF2427M Technologies Web Synchrones Et Multi-Dispositifs”

  - Le lien vers Heroku pointe vers une page permettant d'aller sur le composant de chaque TP (ou sur une version intégrant les deux).
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
- Déploiement sur Heroku qui fonctionne (2pt) 

Bonus: 

- Gestion de plus de deux pairs. 
- Gestion de salon

