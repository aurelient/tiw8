## TIW8 - TP4 Web of Things

#### Encadrants
- Aurélien Tabard (responsable)
- Lionel Médini
- Alix Ducros

## Présentation du TP

L'objectif du TP est de vous faire développer une application Web of Things (WoT), qui utilise un arduino Uno, avec capteurs et actionneurs.

### Description de l'application

Le use case choisi est un système de limitation d'accès à un environnement physique (en clair : une porte), contrôlé par un système d'ouverture et de fermeture par vibrations sonores (quand on frappe) ou à distance (authentification).

La porte est matérialisée par un servo-moteur, et la détection de vibrations sonores est obtenus par un capteur piézo-électrique.

### Outils

Pour cela, vous utiliserez :
- la bibliothèque [Johnny-Five](http://johnny-five.io/) pour communiquer avec l'arduino, 
- un serveur [Socket.io](https://socket.io/) capable de gérer les informations des capteurs et des actionneurs.

## Mise en place de la plateforme matérielle

### Première connexion de l'arduino board

La première étape est d'installer les drivers arduino, qui sont inclus dans le [Arduino Create Plugin](https://create.arduino.cc/getting-started/plugin/welcome). Branchez ensuite l'arduino Uno en USB, et voyez s'il est reconnu par votre PC.

Alternativement, vous pouvez installer un [IDE](https://www.arduino.cc/en/Main/Software) qui inclut les drivers et vous permet de tester facilement que votre board est connectée et reconnue (menu Fichiers -> Exemples -> Basics -> Blink, puis "téléverser", et la LED doit clignoter).

### Mise en place de Johnny-five

Johnny-five est en fait un client JS qui implémente le protocole [Firmata](https://github.com/firmata/protocol). Pour pouvoir contrôler une board arduino avec cette bibliothèque, il faut donc déployer ("téléverser") le firmware `StandardFirmataPlus` sur la board.

Pour cela, ouvrir l'IDE arduino et :
  - vérifiier que la bibliothèque Firmata est bien installée : Croquis -> Inclure une bibliothèque -> Gérer les bibliothèques, puis filtrer par le nom "Firmata".
  - téléverser le code du sketch StandardFirmataPlus, en allant le chercher dans Fichiers -> Exemples -> Firmata -> StandardFirmataPlus

*La méthode qui a marché pour moi sous Windows :* selon la procédure indiquée [ici](https://github.com/rwaldron/johnny-five/wiki/Getting-Started), dans un powershell en mode administrateur, taper : `npm --add-python-to-path install --global --production windows-build-tools`

Puis, cloner le repo dans TP4 et lancer : `node index.js`

Vous devriez voir la LED clignoter.

### Mise en place du circuit

Le montage est schématisé ainsi :

[![arduino Knock Lock](https://img.youtube.com/vi/VgFw7bc3fa8/0.jpg)](https://www.youtube.com/watch?v=VgFw7bc3fa8)

Dans ce TP, il vous est demandé de réaliser une application Web et non le _sketch_ arduino de référence.

L'étape suivante est de réaliser le circuit ci-dessous, comme indiqué [ici](https://programminginarduino.wordpress.com/2016/03/06/project-13/). [Apparemment](https://forum.arduino.cc/index.php?topic=175831.msg1383787#msg1383787), le code est un peu buggé, mais c'est juste pour tester votre montage.

<img alt="Knock Lock circuit" src="https://programminginarduino.files.wordpress.com/2016/03/knock-lock-disec3b1o-de-protoboard.jpg" style="max-width: 600px">

Pour mieux comprendre le fonctionnement du circuit et de l'arduino, vous pouvez vous aider du livre "Arduino Project Book" fourni avec le starter kit, ou des ressources sur le site [arduino.cc](https://www.arduino.cc/).

## Contrôle de l'arduino

&Agrave; l'aide de [Johnny-Five](http://johnny-five.io/), vous allez mettre en place dans votre projet un module en JS qui expose les capacités (foncions JS) suivantes :
- ouvrir et fermer la porte (en allumant les leds correspondantes : vert = ouvert, rouge = fermé)
- générer un événement à partir du capteur piezoélectrique pour savoir quand quelqu'un frappe à la porte (en allumant la led jaune pendant 300ms)

Remarque : le module "piezo" de Johnny-Five est un actionneur, destiné à produire des sons (au demeurant très désagréables). Il n'existe pas de module utilisant le piezo en tant que capteur. C'est pourquoi vous utiliserez le [module générique `Sensor`](http://johnny-five.io/api/sensor/) en vous inspirant du sketch arduino pour les paramètres d'initialisation.

## Mise en place du serveur

Installez et mettez en place dans votre projet un serveur [Socket.IO](https://socket.io/) qui expose des fonctionnalités applicatives :
- une API RESTful pour le moteur `/door` avec un paramètre `position` (GET et PUT)
- un modèle de communications "REST + Notify" pour le capteur piezo `/knock`, en permettant de s'abonner (POST) / se désabonner (DELETE) et de récupérer les événements (WebSocket)
- une ressource supplémentaire `/unlock` répondant uniquement aux requêtes POST et prenant un paramètre `code` qui s'il est valide déclenchera alternativement l'ouverture ou la fermeture de la porte

Votre serveur sera basé sur un pattern MV* "classique", avec cette spécificité que le modèle sera le module d'interface avec l'arduino : il permet de récupérer les données des capteurs et de transmettre les ordres aux actionneurs.

Le Content-Type des requêtes et des réponses sera `application/json`.

## Mise en place du client

Utilisez le framework JS de votre choix pour :
- visualiser sur le client les événements générés par le piezo
- permettre la saisie et l'envoi d'un code d'ouverture / fermeture de la porte
- visualiser sur le client l'état de la porte

Faites en sorte que votre serveur serve aussi les fichiers statiques du client pour éviter les problèmes de CORS.

**To be continued...**

### Rendu et évaluation

Le TP est individuel. Il est évalué sur une base binaire PASS/FAIL et compte pour 10% de la note de TP totale.

Les critères d'évaluation sont les suivants pour avoir un PASS:

- Le rendu est effectué avant le jeudi 16/01/200 23h59. Pensez à remplir le <a href="https://airtable.com/shr65AEGKsjsQ9r94">formulaire</a>.
- Les responsables de l'UE sont ajoutés au projet forge (le projet est clonable)
- Le projet ne contient que des éléments nécessaire (.gitignore est bien défini)
- Les dépendances de *développement* et de *déploiement* dans package.json sont bien définies
- `npm run build` construit le projet
- `npm run start` lance le serveur et permet de tester le projet.
