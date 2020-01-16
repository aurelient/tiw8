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
- une ressource supplémentaire `/unlock` répondant uniquement aux requêtes POST et prenant un paramètre `code` qui s'il est valide déclenchera l'ouverture de la porte puis sa fermeture au bout de 5 secondes<br>
  <span style="color: red">Attention : **MODIFICATION**</span> par rapport à la version précédente, qui consistait à déclencher alternativement l'ouverture ou la fermeture de la porte

Votre serveur sera basé sur un pattern MV* "classique", avec cette spécificité que le modèle sera le module d'interface avec l'arduino : il permet de récupérer les données des capteurs et de transmettre les ordres aux actionneurs.

Le Content-Type des requêtes et des réponses sera `application/json`.

## Mise en place du client

Utilisez le framework JS de votre choix pour :
- visualiser sur le client les événements générés par le piezo
- permettre la saisie et l'envoi d'un code d'ouverture / fermeture de la porte
- visualiser sur le client l'état de la porte

Faites en sorte que votre serveur serve aussi les fichiers statiques du client pour éviter les problèmes de CORS.

## Description sémantique de l'objet

Vous allez maintenant faire en sorte que votre objet puisse être utilisé par d'autres clients que le vôtre, en fournissant une description standardisée de son API, conformément à la spec [WoT Thing Description](https://www.w3.org/TR/wot-thing-description/) (TD) du W3C.

Créez un fichier de description de votre arduino en tant que `Thing`, qui exposera les capacités simples de l'objet indiquées ci-dessus et exposées par votre serveur à l'aide d'`InteractionAffordance` :
- [`ActionAffordance`](https://www.w3.org/TR/wot-thing-description/#actionaffordance) : permet de modifier l'état de la porte,
- [`PropertyAffordance`](https://www.w3.org/TR/wot-thing-description/#propertyaffordance) : expose l'état courant de la porte,
- [`EventAffordance`](https://www.w3.org/TR/wot-thing-description/#eventaffordance) : permet de s'abonner, de se désabonner aux événements "knock" et définit le format des données dans cet événement

Ne tenez pas compte pour l'instant de la fonctionnalité `unlock`.

Pour réaliser votre fichier, vous pouvez vous inspirer des [exemples](https://www.w3.org/TR/wot-thing-description/#introduction) de l'introduction de la spec WoT TD.

Pour valider votre fichier, vous pouvez utiliser le validateur du [Playground d'Eclipse ThingWeb](http://plugfest.thingweb.io/playground/).

## Publication d'une TD

Si votre fichier est valide, vous devez pouvoir le publier sur l'annuaire de TD fourni par le W3C : [ThingWeb Directory](https://github.com/thingweb/thingweb-directory/), dont nous avons déployé une instance sur la VM 192.168.75.90 de l'infra OpenStack. Pour accéder à cette machine de l'extérieur, vous pouvez passer par notre proxy : https://proxy-tps-m1if13-2019.univ-lyon1.fr/90

## Découverte d'une TD

Modifiez votre client pour qu'il requête cet annuaire, découvre votre arduino, requête sa TD et utilise cette TD pour :
- déterminer les URLs à requêter pour avoir accès à l'objet
- "comprenne" comment l'utiliser (bonus) ; pour cela, vous pouvez vous aider de la [WoT Scripting API](https://www.w3.org/TR/wot-scripting-api/)

**To be continued...**

### Rendu et évaluation

Le TP est réalisé par groupe de 4. Il est évalué sur une base binaire PASS/FAIL + sur une soutenance qui aura lieu le mardi 4 février 2020 après-midi. IL compte pour 10% de la note de TP totale.

Les critères d'évaluation sont les suivants pour avoir un PASS:

- Le rendu est effectué avant le jeudi 16/01/200 23h59. Pensez à remplir le <a href="https://airtable.com/shr65AEGKsjsQ9r94">formulaire</a>.
- Les responsables de l'UE sont ajoutés au projet forge (le projet est clonable)
- Le projet ne contient que des éléments nécessaire (.gitignore est bien défini)
- Les dépendances de *développement* et de *déploiement* dans package.json sont bien définies
- `npm run build` construit le projet
- `npm run start` lance le serveur et permet de tester le projet.
