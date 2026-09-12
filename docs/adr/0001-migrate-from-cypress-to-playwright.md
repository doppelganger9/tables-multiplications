# ADR 0001: Migrer les tests E2E de Cypress vers Playwright

- Statut : Propose
- Date : 2026-09-12
- Decideurs : Equipe projet

## Contexte

L'application Angular utilise actuellement Cypress pour ses tests E2E. La couverture est limitee a cinq tests repartis dans deux specs : navigation initiale, changement de mode, changement de table, reponse a une question et verification du focus lors du passage a la question suivante.

La migration vers Angular 22 et TypeScript 6 a deja expose une friction dans la chaine Cypress : la compilation des specs depend du preprocesseur Webpack de Cypress et necessite une configuration `rootDir` specifique dans `cypress/tsconfig.json`.

La configuration contient egalement des cibles Angular Cypress et une configuration de tests de composants, alors qu'aucun test de composant n'est utilise dans la couverture actuelle.

Les workflows GitHub Actions `.github/workflows/main.yml` et `.github/workflows/static.yml` executent actuellement `npm run test:e2e` avec `CI=true`, apres `npm ci`. Ils ne preparent pas de navigateur E2E et ne publient pas de rapport ou de trace en cas d'echec. La migration doit donc couvrir le poste local et ces deux workflows.

Un baseline avant migration est conserve dans `docs/e2e-performance-baseline.md`. Il mesure notamment le temps de `npm ci`, l'empreinte de `node_modules`, le cache Cypress et la duree complete de `npm run e2e`. Les mesures locales seront completees par des mesures sur `ubuntu-latest`, car les caches et les caracteristiques des runners influencent fortement les resultats.

## Decision

Nous migrerons les tests E2E de Cypress vers Playwright et ne maintiendrons pas les deux frameworks en parallele.

Playwright sera configure avec un serveur de developpement Angular demarre automatiquement via `webServer`, une base URL locale, et un projet navigateur Chromium en CI. Les specs seront reecrites avec les locators Playwright et ses attentes auto-synchronisees.

Le script E2E Playwright sera la commande appelee par les deux workflows GitHub Actions. La configuration Playwright demarrera et arretera le serveur Angular elle-meme afin d'eviter de maintenir une orchestration parallele avec `start-server-and-test`. La CI installera le navigateur Chromium et ses dependances systeme avec `npx playwright install --with-deps chromium`. Les rapports HTML, traces et captures seront conserves comme artefacts lorsqu'un test echoue.

Les tests unitaires Vitest restent inchanges. Les scripts npm E2E seront renommes ou remplaces pour appeler Playwright, et les dependances, fichiers de configuration et cibles Angular specifiques a Cypress seront retires lorsqu'ils ne seront plus references.

## Raisons

- La suite E2E est petite, donc le cout de reecriture est borne.
- Playwright fournit une API d'attente et de localisation adaptee aux interactions deja testees.
- Playwright permet d'etendre la verification a Chromium, Firefox et WebKit sans changer de framework.
- Les traces et artefacts d'echec facilitent le diagnostic en CI.
- La migration reduit la dependance au preprocesseur Cypress et a `@cypress/schematic` dans ce projet Angular recent.
- Les deux workflows GitHub Actions utiliseront la meme commande E2E et la meme preparation de navigateur.
- Le gain sera evalue sur des mesures reproductibles, et pas uniquement sur le temps apparent des tests.

## Alternatives considerees

### Conserver Cypress

Cette option minimise le risque et le travail immediat. Elle reste raisonnable pour une suite de cinq tests, mais conserve la chaine Cypress et ses adaptations de configuration deja necessaires avec Angular 22 et TypeScript 6.

### Maintenir Cypress et Playwright

Cette option permettrait une migration progressive, mais doublerait les dependances, les scripts et les couts de maintenance sans apporter de couverture supplementaire au projet actuel.

### Utiliser uniquement des tests unitaires ou d'integration

Cette option ne couvre pas correctement le demarrage de l'application, le rendu des templates et les interactions navigateur. Elle ne remplace donc pas les tests E2E existants.

## Consequences

### Positives

- Tests E2E plus facilement extensibles a plusieurs moteurs navigateur.
- Moins de configuration specifique Cypress a maintenir.
- Meilleure collecte des traces et captures lors des echecs.

### Negatives

- Reecriture des tests et adaptation des habitudes de diagnostic.
- Installation des navigateurs Playwright en environnement local et CI.
- Modification des commandes documentees et des pipelines qui appelleraient Cypress.
- Temps CI et espace de stockage supplementaires pour installer Chromium et conserver les artefacts d'echec.
- Le projet devra expliciter les selecteurs stables utilises par les tests.
- Les mesures devront distinguer le temps d'installation, le temps de build Angular, le temps de demarrage du serveur et le temps d'execution des tests.

## Plan de migration

1. Ajouter `@playwright/test` et la configuration Playwright.
2. Configurer le serveur Angular avec `webServer`.
3. Reecrire les deux specs existantes en Playwright.
4. Remplacer les scripts npm et mettre a jour la documentation utile.
5. Adapter `.github/workflows/main.yml` et `.github/workflows/static.yml` pour installer Chromium avec `--with-deps`, lancer la commande Playwright et publier le rapport en cas d'echec.
6. Supprimer les dependances, fichiers et cibles Angular Cypress non references.
7. Executer lint, tests unitaires et tests E2E Playwright localement.
8. Verifier les deux workflows GitHub Actions, y compris les artefacts produits en cas d'echec.
9. Comparer les resultats au baseline en gardant le meme navigateur, le meme nombre de tests, le meme mode headless et un etat de cache documente.

## Verification

La migration sera consideree comme terminee lorsque les cinq scenarios existants passeront avec Playwright localement et dans les deux workflows GitHub Actions, que les tests unitaires Vitest et le lint resteront verts, qu'un echec CI publiera un rapport exploitable, qu'une comparaison du temps et des poids sera disponible face au baseline, et qu'aucune commande ou configuration active ne dependra encore de Cypress.
