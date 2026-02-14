import { defineConfig } from 'vitest/config';

/**
 * Afin de pouvoir faire du snapshot testing avec Vitest et Angular, 
 * il est nécessaire d'ajouter les serializers de jest-preset-angular.
 * 
 * Ces serializers permettent de nettoyer le rendu HTML des composants Angular 
 * avant de le comparer au snapshot, en supprimant les attributs spécifiques 
 * à Angular et les commentaires, par exemple _ngcontent-c0_ ou _nghost-c0_, 
 * qui sont générés par Angular pour la gestion du DOM.
 * 
 * Sans ces serializers, les snapshots seraient très verbeux et difficiles 
 * à maintenir, car ils contiendraient beaucoup de détails techniques liés à
 * Angular plutôt qu'à la structure et au contenu du composant lui-même.
 * 
 * En utilisant ces serializers, les snapshots deviennent plus lisibles et se 
 * concentrent sur l'essentiel, ce qui facilite leur maintenance et leur 
 * compréhension.
 * 
 * On gagne en stabilité et lisibilité des snapshots, et aussi en reproductibilité
 * des tests, car les snapshots ne seront pas affectés par des changements 
 * mineurs dans la structure du DOM générée par Angular.
 * 
 * Voir aussi https://angular.dev/guide/testing#advanced-vitest-configuration
 */
export default defineConfig({
  test: {
    snapshotSerializers: [
      'jest-preset-angular/build/serializers/html-comment',
      'jest-preset-angular/build/serializers/ng-snapshot',
      'jest-preset-angular/build/serializers/no-ng-attributes',
    ],
  },
});