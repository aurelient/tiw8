## TIW8 - Technologies Web synchrones et multi-dispositifs

Le temps où l’ordinateur personnel était le dispositif principal d’accès à l’informatique est révolu. Les dispositifs numériques prennent aujourd’hui des formes variées, de la montre connectée aux objets connectés, en passant par les murs d’écrans interactifs ou les wearables. Ces dispositifs communiquent entre eux et sont de plus en plus utilisés pour fournir des services complexes. Ils demandent de nouvelles façons de penser la conception, l’interaction, les architectures logicielles et leur implantation. Le caractère universel des technologies Web en fait un candidat de choix pour aborder ces problématiques de manière concrète. L’objectif de cette UE est d’aborder les problématiques de conception, de distribution, d’optimisation et de synchronisationdans des applications Web multi-dispositifs.

## Contenu abordé

Cette UE porte sur la conception et la réalisation d’applications Web multi-dispositifs. Elle abordera la question de l’adaptation des applications à leur dispositifs cibles, en termes de surface d’affichage, de modalités d’interaction ou de type de données échangées. Cette problématique sera vue à la fois d’un point de vue architectural (design adaptatif), mais aussi du point de vue des usages et de l’interaction.

Seront ensuite abordés les principes et algorithmes de communication synchrone dédiés au Web (WebSocket, WebRTC, Operational Transform, CRDT). Les préoccupations transverses des applications Web embarquées et synchrones telles que découvrabilité de dispositifs, la qualité de service liée aux données de capteurs, la gestion des ressources énergétiques pour les objets autonomes et la performance applicative globale seront également prises en compte.

D’un point de vue technique, nous mettrons en place une “stack” JavaScript côté serveur et côté client (Node+React/Redux), et apprendrons les principes de la programmation réactive.

**Mots-clés** : Programmation réactive, programmation Web synchrone, adaptation, interaction multi-dispositif, Internet des objets, Web des objets, découvrabilité, qualité de service, performance.

**Compétences visées** :

- Mettre en place une architecture Web JavaScript côté serveur et côté client, en s’appuyant sur un framework dédié à la programmation réactive
- Appliquer une méthode de conception fondée sur le design adaptatif, et permettre le déploiement d’une application sur les dispositifs présents dans l’environnement
- Comprendre les enjeux et les spécificités de l’Internet des objets (IoT) et du Web des objets (WoT), et concevoir des applications multi-dispositifs prenant en compte les modalités d’interaction particulières de ces dispositifs
- Comprendre les différents types de contraintes temporelles dans les technologies Web et gérer la communication entre dispositifs de manière synchrone, pour les usages temps réel de type collaboratif
- Prendre en compte les problématiques de gestion des ressources pour l’accès aux capteurs et aux actionneurs sur les objets contraints, et mesurer et optimiser la qualité de service (QoS) et la performance de ces applications

#### Encadrants

- Aurélien Tabard (responsable)
- Lionel Médini

## Plan du cours

|          | Date  | Cours                          | Supports                                                             | Intervenant |
| -------- | ----- | ------------------------------ | -------------------------------------------------------------------- | ----------- |
| CM 0     | 17/09 | Présentation de l'UE           | [pdf](cours/cm0-intro.pdf)                                           | A. Tabard   |
| CM 1     | 17/09 | Informatique Ubiquitaire       | [pdf](cours/cm1-introUbicomp.pdf)                                    | A. Tabard   |
| CM 1 bis | 17/09 | Stack                          | [pdf](cours/cm1-stack.pdf)                                           | A. Tabard   |
| CM 2     | 08/10 | Programmation Réactive         | [pdf](cours/cm2-reactivity.pdf)                                      | A. Tabard   |
|          | 15/10 | _séance de TP supplémentaire_  |                                                                      |             |
| CM 3     | 05/11 | Design adaptatif & Gestes      | [pdf](cours/cm3-designAdaptatifetGestes.pdf)                         | A. Tabard   |
|          | 12/11 | _séance de TP supplémentaire_  |                                                                      |             |
| CM 4     | 03/12 | Temps réel & Collaboration     | [pdf](cours/cm4-collaboration.pdf)                                   | A. Tabard   |
| CM 5     | 10/12 | Algorithmes de synchronisation | [pdf](cours/cm5-sharedediting.pdf)                                   | A. Tabard   |
| CM 6     | 07/01 | Web of Things                  | [site](https://perso.liris.cnrs.fr/lionel.medini/enseignement/TIW8/) | L. Medini   |
|          | 14/01 | —                              |                                                                      |             |
| CM 7     | 04/02 | _séance de TP supplémentaire_  |                                                                      |             |

## TP

| Sujet                                                                    | Date  | Thème                                     | Rendu   |
| ------------------------------------------------------------------------ | ----- | ----------------------------------------- | ------- |
| [TP 1](TP1)                                                              | 17/09 | Mise en place d'une Stack JavaScript      | rendu 0 |
| [TP 2.1](TP2/)                                                           | 08/10 | Introduction à React                      |         |
| [TP 2.2](TP2/#tp22-redux-middleware-websockets-pour-le-multi-dispositif) | 15/10 | Redux + websockets / multi-dispositif     |         |
| [TP 2.3](TP2/#tp23-distribution-dinterface-multi-dispositif)             | 05/11 | Distribution d'interface multi-dispositif |         |
| [TP 2.4](TP2/#4-suite)                                                   | 12/11 | Modalité d'entrée (gestes, stylet)        | rendu 1 |
| [TP 3.1](TP3)                                                            | 03/12 | WebRTC: p2p data                          |         |
| [TP 3.2](TP3/#tp32-webrtc-et-vidéo)                                      | 10/12 | WebRTC: audio et video                    | rendu 2 |
| [TP 4](https://perso.liris.cnrs.fr/lionel.medini/enseignement/TIW8/)     | 07/01 | WoT et capteurs Arduino                   |         |
| TP 4                                                                     | 14/01 | WoT et CrowdSensing                       |         |
| TP 4                                                                     | 04/02 | WoT et Performance                        | rendu 3 |

## Evaluation

- 4 TPs notés (66%)
  - TP1 : 10% (PASS/FAIL)
  - TP2 : 40%
  - TP3 : 20%
  - TP4 : 30%
- 1 contrôle écrit (33%)
  - 90 minutes
  - 3 feuilles A4 de supports autorisées.
  - [sujet de l'année 2019](cours/TIW8-exam2019-session1.pdf)

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

Le planning est disponible sur cet [agenda partagé Google](https://calendar.google.com/calendar/embed?src=jtfqc9236icr8imhegough22i4%40group.calendar.google.com&ctz=Europe%2FBerlin).

<!-- Vérifiez l'agenda régulièrement, les salles et les horaires de TP risquent d'être modifiés en fonction de la disponibilité des salles du batiment Nautibus. -->

<!-- iframe src="https://calendar.google.com/calendar/embed?title=TIW8&amp;showPrint=0&amp;showCalendars=0&amp;showTz=0&amp;height=500&amp;wkst=2&amp;bgcolor=%23FFFFFF&amp;src=rtlfsq23dgbtshi8lghu5qi7o6oihk0j%40import.calendar.google.com&amp;color=%238C500B&amp;ctz=Europe%2FBerlin" style="border-width:0" width="600" height="500" frameborder="0" scrolling="no"></iframe-->
