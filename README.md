# Tables de Multiplications

Petit projet perso pour donner à mes enfants un outils d'apprentissage et révision des tables de multiplications.

## Utilisation

- cloner ce repository
- `npm install`
- `npm wc:serve`
- ouvrir http://127.0.0.1:8080

Pour aller plus loin, il y a aussi ces scripts NPM:

- `npm run test` ou `npm t` : lance les tests unitaires Jest
- `npm run e2e` : lance les tests End-to-End Cypress
- `npm run lint`: KO !
- `npm run start`: démarre l'application Angular (et non le index static qui inclut un web-component, petite subtilité).
- `npm run build`: construit l'app Angular (il y a un `wc:build` dédié pour construire l'application en mode web-component).

## Suggestions d'amélioration

- Faire des questions sur toutes les tables
- synthèse vocale qui énonce la multiplication ("4 x 5") et le résultat (bravo/dommage + "4 x 5 = 20")

## Intégration en tant que MicroFrontEnd

Avec [Angular Elements](https://angular.io/guide/elements).

Voir l'article : https://medium.com/@kitson.mac/wrapping-an-angular-app-in-a-custom-element-web-component-angular-element-in-4-simple-steps-ded3554e9006
