# SpeedArti — Démo Espace Fournisseur

Démonstration publique, **100 % fictive**, sans authentification réelle, API, données clients, synchronisation SpeedArti ni secrets. Ouvrir `index.html` localement ou utiliser GitHub Pages après activation dans GitHub (Settings → Pages → main / root).

Le code métier et les propositions d'intégration confidentielles ne sont jamais publiés ici.

Dépôt privé de développement distinct : `speedarti-fournisseurs-internal`.

## Démonstration V3 — 3 novembre 2026

- Page **Stocks par agence** : choix dépôt principal / Dax / Montauban, quantités fictives par agence et statut inconnu lorsqu'aucune information n'est disponible.
- Page **Synchronisations** : préparation d'un premier transfert fictif, puis comptage des modifications seulement et historique local ; aucun réseau ni synchronisation SpeedArti.
- PWA de démonstration installable, avec cache limité aux ressources statiques.
- Les essais automatiques Playwright vérifient l'isolation de dépôt et le passage de synchronisation complète à différentielle.
- **NON BRANCHÉ :** aucune API, aucune authentification ni écriture réelle. Cette démo HTML/JS est indépendante du vrai code React privé.

Voir le code et les contrats réels à préparer dans le dépôt privé : [Sprint V3](https://github.com/AGENCE-GSTAI-EN-COURS/speedarti-fournisseurs-internal/blob/main/docs/SPRINT_V3_ETAT_2026-11-03.md).
