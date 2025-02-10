## TIW8 - Technologies Web synchrones et multi-dispositifs

Le temps où l’ordinateur personnel était le dispositif principal d’accès à l’informatique est révolu. Les dispositifs numériques prennent aujourd’hui des formes variées, de la montre connectée aux murs d’écrans interactifs. Ces dispositifs communiquent entre eux et sont de plus en plus utilisés pour fournir des services complexes. Ils demandent de nouvelles façons de penser la conception, l’interaction, les architectures logicielles et leur implantation. Le caractère universel des technologies Web en fait un candidat de choix pour aborder ces problématiques de manière concrète. L’objectif de cette UE est d’aborder les problématiques de conception, de distribution, d’optimisation et de synchronisationdans des applications Web multi-dispositifs.

## Contenu abordé

Cette UE porte sur la conception et la réalisation d’applications Web multi-dispositifs. Elle abordera la question de l’adaptation des applications à leur dispositifs cibles, en termes de surface d’affichage, de modalités d’interaction ou de type de données échangées. Cette problématique sera vue à la fois d’un point de vue architectural (design adaptatif), mais aussi du point de vue des usages et de l’interaction.

Seront ensuite abordés les principes et algorithmes de communication synchrone dédiés au Web (WebSocket, WebRTC, Operational Transform, CRDT). Les préoccupations transverses des applications Web embarquées et synchrones telles que découvrabilité de dispositifs, la qualité de service liée aux données de capteurs, la gestion des ressources énergétiques pour les objets autonomes et la performance applicative globale seront également prises en compte.

D’un point de vue technique, nous mettrons en place une “stack” JavaScript côté serveur et côté client (Node+React/Redux), et apprendrons les principes de la programmation réactive.

**Mots-clés** : Programmation réactive, programmation Web synchrone, adaptation, interaction multi-dispositif, Internet des objets, Web des objets, découvrabilité, qualité de service, performance.

**Compétences visées** :

- Mettre en place une architecture Web JavaScript côté serveur et côté client, en s’appuyant sur un framework dédié à la programmation réactive
- Appliquer une méthode de conception fondée sur le design adaptatif, et permettre le déploiement d’une application sur les dispositifs présents dans l’environnement
- Mettre en oeuvre des architectures web peer-to-peer, pour le partage de données et de contenus multi-média temps réel (chat et visio p2p)
- Comprendre comment gérer la communication entre dispositifs de manière synchrone pour des usages temps réel de type collaboratif (type Google doc)
- Prendre en compte les problématiques de gestion des ressources pour l’accès aux capteurs et aux actionneurs sur les objets contraints, et mesurer et optimiser la qualité de service (QoS) et la performance de ces applications

#### Encadrants

- Aurélien Tabard (aurelien.tabard@univ-lyon1.fr)

## Plan du cours

|          | Date  | Cours                          | Supports                                                             | Intervenant |
| -------- | ----- | ------------------------------ | -------------------------------------------------------------------- | ----------- |
| CM 0     | 06/01 | Présentation de l'UE           | [pdf](cours/cm0-intro.pdf)                                           | A. Tabard   |
| CM 1     | 06/01 | Stack                          | [pdf](cours/cm1-stack.pdf)                                           | A. Tabard   |
| CM 2     | 08/01 | Informatique Ubiquitaire       | [pdf](cours/cm1-introUbicomp.pdf)                                    | A. Tabard   |
| CM 3     | 13/01 | Programmation Réactive         | [pdf](cours/cm2-reactivity.pdf)                                      | A. Tabard   |
|          | 15/01 | _pas de CM que du TP_          |                                                                      |             |
| CM 4     | 03/02 | Design adaptatif & Gestes      | [pdf](cours/cm3-designAdaptatifetGestes.pdf)                         | A. Tabard   |
|          | 05/02 | _pas de CM que du TP_          |                                                                      |             |
| CM 5     | 10/02 | WebRTC - Temps réel            | [pdf](cours/cm4-collaboration.pdf)                                   | A. Tabard   |
|          | 12/02 | _pas de CM que du TP_          |                                                                      |             |
| CM 6     | 03/03 | Algorithmes de synchronisation | [pdf](cours/cm5-sharedediting.pdf)                                   | A. Tabard   |
|          | 05/03 | _pas de CM que du TP_          |                                                                      |             |
| CM 7     | 10/03 | ? Performance ?                |                                                                      | A. Tabard   |
|          | 12/03 | Examen                         |                                                                      |             |



## TP

| Sujet                                                                    | Date  | Durée | Thème                                     | Rendu   |
| ------------------------------------------------------------------------ | ----- | ----- | ----------------------------------------- | ------- |
| [TP 1](TP1)                                                              | 06/01 | 1h30  | Mise en place d'une Stack JavaScript      |         |
| [TP 1](TP1)                                                              | 08/01 | 1h30  | Mise en place d'une Stack JavaScript      | rendu 0 |
| [TP 2.1](TP2/)                                                           | 13/01 | 1h30  | Introduction à React                      |         |
| [TP 2.2](TP2/#tp22-redux-middleware-websockets-pour-le-multi-dispositif) | 15/01 | 3h    | State management + websockets             |         |
| [TP 2.3](TP2/#tp23-distribution-dinterface-multi-dispositif)             | 03/02 | 1h30  | Distribution d'interface multi-dispositif |         |
| [TP 2.4](TP2/#4-suite)                                                   | 05/02 | 3h    | Modalité d'entrée (gestes, stylet)        | rendu 1 |
| [TP 3.1](TP3)                                                            | 10/02 | 1h30  | WebRTC: p2p data                          |         |
| [TP 3.2](TP3/#tp32-webrtc-et-vidéo)                                      | 12/02 | 3h    |                                           |         |
| TP 3 finalisation                                                        | 03/03 | 1h30  | WebRTC: audio et video                    |         |
| TP 3 finalisation                                                        | 05/03 | 3h    |                                           | rendu 2 |
| TP 4                                                                     | 10/03 | 1h30  |                                           |         |
| Examen                                                                   | 12/03 | 1h30  |                                           |         |


## Evaluation

- 4 TPs notés (66%)
  - TP1 : 10% (PASS/FAIL)
  - TP2 : 50%
  - TP3 : 40%
- 1 contrôle écrit (33%)
  - 90 minutes
  - 3 feuilles A4 de supports autorisées.
  - [sujet de l'année 2019](../2023/cours/TIW8-exam2019-session1.pdf)

# Références

- [Ressources du cours (contribuez)](hack)
- [Javascript Cheat Sheet](https://mbeaudru.github.io/modern-js-cheatsheet/)
- [Mozilla Developer Network (Documentation)](https://developer.mozilla.org/)

### Un peu de lecture

- [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [Your Mouse is a Database](https://queue.acm.org/detail.cfm?id=2169076)
- [A Survey on Reactive Programming](http://soft.vub.ac.be/Publications/2012/vub-soft-tr-12-13.pdf)
- [Dynamics of Change: Why Reactivity Matters](https://queue.acm.org/detail.cfm?id=2971330)
- [Immutability is not enough](https://codewords.recurse.com/issues/six/immutability-is-not-enough)
- [What is FRP?](https://stackoverflow.com/questions/1028250/what-is-functional-reactive-programming)

## Calendrier

<!-- Vérifiez l'agenda régulièrement, les salles et les horaires de TP risquent d'être modifiés en fonction de la disponibilité des salles du batiment Nautibus. -->

<!-- iframe src="https://calendar.google.com/calendar/embed?title=TIW8&amp;showPrint=0&amp;showCalendars=0&amp;showTz=0&amp;height=500&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=rtlfsq23dgbtshi8lghu5qi7o6oihk0j%40import.calendar.google.com&amp;color=%238C500B&amp;ctz=Europe%2FBerlin" style="border-width:0" width="600" height="500" frameborder="0" scrolling="no"></iframe-->
