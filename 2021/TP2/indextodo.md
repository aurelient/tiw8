TODO:

- utilisation de prettier
- webpack et treeshaking

Voici une structure pour démarrer, pensez à utiliser les composants Windmill React UI plutôt que du html pur:

```typescript

```

Ce code est donné à titre indicatif. Commencez progressivement et testez régulièrement.

Créer des composants fonctionnels passifs (on rajoutera de l'interaction par la suite. Vous pouvez vous inspirer de la syntaxe et de la structure de cette <a href="https://www.digitalocean.com/community/tutorials/how-to-build-a-react-to-do-app-with-react-hooks">mini todo app</a>

https://opensource.com/article/21/3/react-app-hooks

### Gérer la logique de l'application

La toolbar doit contenir deux boutons avant/arrière pour naviguer entre les transparents. Faites en sorte que l'état du slideshow change lorsque vous pressez un bouton, et que ce changement d'état soit reflété au niveau de l'application. Pour cela il va falloir ajouter un flux inverse (faire en sorte que le bouton parle à des composants parents). Suivez les instructions et l'exemple de [Thinking in React](https://reactjs.org/docs/thinking-in-react.html#step-5-add-inverse-data-flow) sur les "Inverse Data Flow".

Pour comprendre comment cela fonctionne avec des functionals components [référez vous à l'exemple de todo app mentionné plus haut](https://typeofnan.dev/your-first-react-typescript-project-todo-app/)

Pour démarrer vous pouvez utiliser l'extension react dev tools, et modifier l'état à la main pour vérifier que la vue change bien.
