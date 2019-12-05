## TIW8 - TP3 Collaboration temps-réel 

#### Encadrants
- Aurélien Tabard (responsable)
- Lionel Médini
- Alix Ducros



#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant de mettre en place .

Les points suivants seront abordés

Ce TP s'étalera sur 2 séances et fera l'objet d'un rendu en binome et d'une note. Voir les critères d'évaluation en bas de la page.

Vous ferez le rendu sur la forge, créez un projet git dès maintenant, puis un projet (npm init).

Pensez à remplir le <a href="">formulaire de rendu</a>.


## TP3.1 WebRTC et vidéo

### Boilerplate

Repartez de votre projet du TP1. Ou utilisez react-create-app pour générer un nouveau projet.

Vérifiez que vous arrivez à lancer une page hello world avec un serveur node basique comme dans le TP1.

Vérifiez que votre déploiement sur Heroku fonctionne.

### Démarrage du TP
Nous allons créer une application qui permette de faire une visio entre deux navigateurs.

Elle ressemblera à cela : 

// TODO dessin / lien ?

Nous allons nous appuyer sur WebRTC pour réaliser cela. WebRTC est une technologie p2p.

Nous aurons avoir : 
- un serveur 
  - pour fournir le site de base
  - pour permettre la découverte des clients du réseau p2p
- des clients qui se parleront entre eux.

### 


### Création d'un composant dédié 

Avec les dernières versions de React, et notamment l'introduction des [hooks](https://reactjs.org/docs/hooks-intro.html) permettent de gérer des états dans créer de classes dédiées.
Au sein d'un composant React, on peut manipuler l'état avec `useRef` ou `useState`, [lire ici pour savoir lequel utiliser(https://www.codebeast.dev/usestate-vs-useref-re-render-or-not/)

   
    
```js
class WebRTCPeerConnection extends React.Component {

 
    render() {
        const { startDisabled, callDisabled, hangUpDisabled } = this.state;
 
        return (
            <div>
                <video
                    ref={localVideo}
                    autoPlay
                    muted
                    style={{ width: "240px", height: "180px" }}
                />
                <video
                    ref={remoteVideo}
                    autoPlay
                    style={{ width: "240px", height: "180px" }}
                />
 
                <ButtonToolbar>
                    <Button onClick={this.start} disabled={startDisabled}>
                        Start
                    </Button>
                    <Button onClick={this.call} disabled={callDisabled}>
                        Call
                    </Button>
                    <Button onClick={this.hangUp} disabled={hangUpDisabled}>
                        Hang Up
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}
```


### Récupération du flux vidéo

Nous allons faire en sorte de récupérer le flux vidéo du navigateur, lorsqu'on clique sur `Start`

```js
    start = () => {
        this.setState({
            startDisabled: true
        });
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then(this.gotStream)
            .catch(e => alert("getUserMedia() error:" + e.name));
    };
 
    gotStream = stream => {
        //TODO supprimer ces refs
        this.localVideoRef.current.srcObject = stream;
        this.setState({
            callDisabled: false,
            localStream: stream
        });
    };
```


### Établissement de la connexion
You can now press the Call button. That starts two peer connections, pc1 and pc2, and goes through the dance to get them talking to each other.

- call initiates the offer
- onCreateOfferSuccess updates both pcs and initiates the answer
- onCreateAnswerSuccess finishes the handshake
- gotRemoteStream wakes up and sets the second video

https://developer.mozilla.org/fr/docs/Web/API/RTCPeerConnection/RTCPeerConnection


```js
    call = () => {
        this.setState({
            callDisabled: true,
            hangUpDisabled: false
        });
        let { localStream } = this.state;
 
        let servers = null,
            pc1 = new RTCPeerConnection(servers),
            pc2 = new RTCPeerConnection(servers);
 
        pc1.onicecandidate = e => this.onIceCandidate(pc1, e);
        pc1.oniceconnectionstatechange = e => this.onIceStateChange(pc1, e);
 
        pc2.onicecandidate = e => this.onIceCandidate(pc2, e);
        pc2.oniceconnectionstatechange = e => this.onIceStateChange(pc2, e);
        pc2.ontrack = this.gotRemoteStream;
 
        localStream
            .getTracks()
            .forEach(track => pc1.addTrack(track, localStream));
 
        pc1
            .createOffer({
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            })
            .then(this.onCreateOfferSuccess, error =>
                console.error(
                    "Failed to create session description",
                    error.toString()
                )
            );
 
        this.setState({
            servers,
            pc1,
            pc2,
            localStream
        });
    };
```


### onCreateOfferSuccess
After pc1 successfully creates an offer to be received, we update local and remote descriptions in our clients. I’m not sure what these “descriptions” are, but it’s where the important stuff happens.

```js
onCreateOfferSuccess = desc => {
  let { pc1, pc2 } = this.state;

  pc1.setLocalDescription(desc).then( () =>
    console.log("pc1 setLocalDescription complete createOffer"),
    error =>
        console.error(
            "pc1 Failed to set session description in createOffer",
            error.toString()
        )
  );

  pc2.setRemoteDescription(desc).then( () => {
    console.log("pc2 setRemoteDescription complete createOffer");
    pc2.createAnswer()
        .then(this.onCreateAnswerSuccess, error =>
            console.error(
                "pc2 Failed to set session description in createAnswer",
                error.toString()
            )
        );
    },
    error =>
        console.error(
            "pc2 Failed to set session description in createOffer",
            error.toString()
        )
  );
};
```

pc1 updates its local description, and pc2 updates its remote description. pc2 also creates an answer, which I think is akin to saying “Okay, I accepted your offer, let’s do this”.



We enable and disable the appropriate buttons, get localStream from state, and instantiate servers, pc1, and pc2.

Both pc objects get a bunch of event listeners. onIceCandidate will connect them to each other, onIceStateChange just prints debugging info, and gotRemoteStream will add it to the right <video> element.

Then we take all tracks from localStream (audio and video) and add them to the first client. After that pc1 creates an offer to receive its video and audio.

When all that’s done, we update component state.

### onCreateAnswerSuccess
When pc2 successfully creates an answer, we do another round of description setting. This time in reverse order.


```js
    onCreateAnswerSuccess = desc => {
        let { pc1, pc2 } = this.state;
 
        pc1
            .setRemoteDescription(desc)
            .then(
                () =>
                    console.log(
                        "pc1 setRemoteDescription complete createAnswer"
                    ),
                error =>
                    console.error(
                        "pc1 Failed to set session description in onCreateAnswer",
                        error.toString()
                    )
            );
 
        pc2
            .setLocalDescription(desc)
            .then(
                () =>
                    console.log(
                        "pc2 setLocalDescription complete createAnswer"
                    ),
                error =>
                    console.error(
                        "pc2 Failed to set session description in onCreateAnswer",
                        error.toString()
                    )
            );
    };
```

pc1 sets its remote description and pc2 sets its local description. I think this acknowledges that, from pc1‘s perspective, it is local to itself and pc2 is remote, and vice-versa for pc2.


### onIceCandidate
At some point during all this, both pc*s say that they’ve got an ICE candidate. Don’t know when exactly that happens, but it gives us a chance to tell each client who they’re talking to.

```js
    onIceCandidate = (pc, event) => {
        let { pc1, pc2 } = this.state;
 
        let otherPc = pc === pc1 ? pc2 : pc1;
 
        otherPc
            .addIceCandidate(event.candidate)
            .then(
                () => console.log("addIceCandidate success"),
                error =>
                    console.error(
                        "failed to add ICE Candidate",
                        error.toString()
                    )
            );
    };
```

We guess the other client and add it as a candidate. If we had more than 2, this could get tricky.


### Raccrocher

```js
    hangUp = () => {
        let { pc1, pc2 } = this.state;
 
        pc1.close();
        pc2.close();
 
        this.setState({
            pc1: null,
            pc2: null,
            hangUpDisabled: true,
            callDisabled: false
        });
    };
```

### Mise en place d'un serveur


#### Signaling côté serveur

Nous allons utiliser une version légèrement modifiée du [code serveur](https://github.com/mdn/samples-server/blob/master/s/webrtc-from-chat/chatserver.js) de la [documentation MDN](http://bit.ly/webrtc-from-chat)

#### Signaling côté client

Voici une [classe qui permet de gérer le signaling côté client](../code/SignalingConnection.js).

Elle fait les choses suivantes : 

- crée un WebSocket avec `connectToSocket`,  
- configure des callbacks : `onOpen` quand la connexion démarre, `onMessage` quand on recoit des messages.
- `addMsgListener` permet d'ajouter des listeners de message au besoin.  
- `sendToServer` permet d'envoyer un objet json au serveur.

Nous allons utiliser cela pour configurer se connecter à l'autre client participant à l'appel. 


### Ajouter un nom d'utilisateur

Ces imports faits, nous allons maintenant rajouter un champ dans l'interface pour gérer les noms d'utilisateurs, au lieu de les avoir codé en dur. Gérer le comme un état.


Quand un nom est validé, nous allons l'envoyer au serveur.

```js
    const pushUsername = () => {
        this.signalingConnection.sendToServer({
            name: username,
            date: Date.now(),
            id: clientID,
            type: "username"
        });
    };
```

Vous remarquerez la présence d'un clientID. C'est un identifiant unique à chaque client. 
Utiliser l'algorithme de votre choix pour le générer. 
Nous avons utilisé `new Date().getTime() % 1000`.



#### Refactoring 
Une grosse partie du code n'a pas sa place dans un composant sensé géré la vue.

Nous allons réorganiser tout cela pour avoir une helper classe qui gère la logique de connexion, avant de passer à la suite.



### Etablissement de la connexion pair à pair

#### 



## TP3.2 WebRTC et edition de texte synchrone


#### FIN

Vous pouvez maintenant tester, nettoyer le code, et rendre.

## Rendu

À rendre pour le dimanche 15 décembre à 23h59.

1. Déployez votre code sur Heroku
2. Pousser votre code sur la forge
3. Déposer les liens sur Tomuss "UE-INF2427M Technologies Web Synchrones Et Multi-Dispositifs"

- Le lien vers Heroku pointe vers une page fonctionelle
- Le lien vers la forge permet de faire un clone (format suivant: https://forge.univ-lyon1.fr/xxx/tiw8-tp2.git)

### Critères d'évaluation

- Fichier `README.md` décrivant le process de build en dev, en prod, et de déploiement.
- Fichier `package.json` nettoyé ne contenant que les dépendances nécessaires.
- Déploiement sur Heroku
- 
- Qualité globale du rendu (= application qui ressemble à quelque chose, un minimum de mise en page, orthographe propre, composants s'appuyant sur des librairies CSS ou stylés à la main).
