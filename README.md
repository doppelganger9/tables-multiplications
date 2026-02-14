# Tables de Multiplications

[![Deploy static content to Pages](https://github.com/doppelganger9/tables-multiplications/actions/workflows/static.yml/badge.svg)](https://github.com/doppelganger9/tables-multiplications/actions/workflows/static.yml) [![Coverage Status](https://coveralls.io/repos/github/doppelganger9/tables-multiplications/badge.svg?branch=main)](https://coveralls.io/github/doppelganger9/tables-multiplications?branch=main)

Petit projet perso pour donner à mes enfants un outils d'apprentissage et révision des tables de multiplications.

## Démo

Voir https://doppelganger9.github.io/tables-multiplications/

## Utilisation

- cloner ce repository
- `npm install`
- `npm wc:serve`
- ouvrir http://127.0.0.1:8080

Pour aller plus loin, il y a aussi ces scripts NPM:

- `npm run test` ou `npm t` : lance les tests unitaires Vitest
- `npm run e2e` : lance les tests End-to-End Cypress
- `npm run lint`: vérifie le format du code JS/TS/HTML et corrige si possible avec ESLint
- `npm run format`: formatte le code avec Prettier
- `npm run lint:css`: vérifie le code CSS
- `npm run start`: démarre l'application Angular (et non le index static qui inclut un web-component, petite subtilité).
- `npm run build`: construit l'app Angular (il y a un `wc:build` dédié pour construire l'application en mode web-component).

## Notes

Dans VSCode, si vous rencontrez un problème de conflit dans le typage des assertions des tests entre Chai et Vitest, c'est qu'il faut réinstaller `local-cypress`, pour qu'il patche un fichier qui force des variables globales.

Voir [cet article](https://glebbahmutov.com/blog/local-cypress/), et vérifiez que le fichier `node_modules/cypress/types/index.d.ts` a bien été patché sur la ligne avec `cypress-global-vars`.

## Suggestions d'amélioration

- Faire des questions sur toutes les tables
- synthèse vocale qui énonce la multiplication ("4 x 5") et le résultat (bravo/dommage + "4 x 5 = 20")
- Algorithme de répétition espacée et améliorer le mode aléatoire pour éviter de poser les mêmes questions
- améliorer sur mobile la saisie
- transformer en app mobile avec Capacitor
- stocker les statistiques dans storage

## Intégration en tant que MicroFrontEnd

Avec [Angular Elements](https://angular.io/guide/elements).

Voir l'article : https://medium.com/@kitson.mac/wrapping-an-angular-app-in-a-custom-element-web-component-angular-element-in-4-simple-steps-ded3554e9006
