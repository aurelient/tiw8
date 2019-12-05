## TIW8 - TP3 Collaboration temps-réel 

#### Encadrants
- Aurélien Tabard (responsable)
- Lionel Médini
- Alix Ducros



#### Présentation du TP

L'objectif du TP est de mettre en place une Single Page Application (SPA) permettant à deux navigateurs de commencer une conversation via chat vidéo.

Ce TP s'étalera sur 2 séances et fera l'objet d'un rendu en binome et d'une note. 

Vous ferez le rendu sur la forge.


### T3.2 Mise en place d'un serveur

Pour la semaine prochaine

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




<!-- ## TP3.2 WebRTC et edition de texte synchrone -->


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
