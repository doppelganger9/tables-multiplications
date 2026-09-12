# Baseline de performance E2E

Date de mesure : 2026-09-12
Branche : `migration-playwright`
Solution mesuree : Cypress 15.19.0

## Environnement local

- OS : macOS
- Node.js : v26.8.2
- npm : 11.19.1
- Navigateurs : Electron 138, headless
- Suite : 2 specs, 5 tests

Ces mesures locales servent de reference relative. Elles ne remplacent pas une mesure sur le runner `ubuntu-latest` de GitHub Actions.

## Mesures actuelles

| Metrique | Valeur | Perimetre |
| --- | ---: | --- |
| `npm ci` | 11,84 s | Installation propre, scripts npm actifs, cache npm local |
| `npm ci --ignore-scripts` | 10,44 s | Installation propre sans scripts d'installation |
| Paquets installes | 1 049 | Arbre npm resolu apres `npm ci` |
| `node_modules` | 437 Mo | Empreinte disque locale apres installation |
| Paquet `cypress` | 7,3 Mo | Repertoire `node_modules/cypress` |
| Paquets `@cypress` | 4,1 Mo | Repertoire `node_modules/@cypress` |
| `start-server-and-test` | 232 Ko | Repertoire installe |
| Cache Cypress 15.19.0 | 631 Mo | Binaire et donnees de cette version |
| Cache Cypress global | 8,1 Go | Toutes les versions presentes dans le cache local |
| `npm run e2e` | 11,82 s | Build Angular, serveur, lancement Cypress et 5 tests |
| `dist` | 83 Mo | Artefacts de build presents localement |
| `static` | 4,5 Mo | Artefacts statiques presents localement |

La mesure `npm run e2e` a produit 5 tests passes. Les durees affichees par Cypress etaient d'environ 1 seconde pour `fix-409.cy.ts` et 3 secondes pour `spec.cy.ts`; le reste correspond principalement au build Angular et au demarrage du serveur.

## Limites

- Les durees locales varient selon la charge de la machine et les caches npm/Cypress.
- Le cache Cypress est un cout disque local, pas la taille telechargee par `npm ci` dans GitHub Actions.
- La taille de `node_modules` inclut toutes les dependances du projet, pas seulement E2E.
- Le workflow GitHub Actions utilise `ubuntu-latest`; ses temps d'installation, son cache npm et son espace disque doivent etre mesures dans les logs CI apres ajout d'une instrumentation comparable.

## Protocole de comparaison Playwright

Apres migration, reprendre les memes mesures et conserver le meme perimetre :

1. Executer `npm ci` sur un environnement propre et relever la duree.
2. Relever le nombre de paquets et la taille de `node_modules`.
3. Relever la taille du paquet `@playwright/test`, des dependances Playwright et du cache navigateur installe.
4. Executer la commande E2E officielle du projet trois fois et comparer la mediane, en separant le temps de build Angular du temps des tests si possible.
5. Executer le workflow sur le meme type de runner GitHub Actions et relever la duree des etapes `npm ci`, installation navigateur et E2E.
6. Comparer les artefacts de diagnostic produits en cas d'echec : taille du rapport, traces, captures et videos.

La comparaison doit utiliser le meme nombre de tests, le meme mode headless, le meme navigateur et un cache CI explicitement indique.
