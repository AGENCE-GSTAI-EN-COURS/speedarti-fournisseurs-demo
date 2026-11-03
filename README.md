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

## Correctif import et stocks planifiés — 3 novembre 2026

- L'interface **Mes produits** propose « Importer Excel / CSV » et « Nouveau produit » sur deux boutons séparés, avec gestion responsive.
- Le bouton de référence automatique est facultatif ; la référence fournisseur reste libre.
- Lecture de `.xlsx` via `read-excel-file` CDN version fixe et de `.csv`/`.tsv` directement dans le navigateur. **Aucun upload de fichier vers un serveur.**
- Après prévisualisation, l'utilisateur confirme explicitement les créations et mises à jour ; la démonstration ne sauvegarde rien sur un serveur.
- L'onglet **Stocks par agence** accepte des fichiers de stock par référence et préserve les prix.
- L'onglet propose les fréquences manuel, heure, 12 h, jour, semaine et mois, mais aucune exécution programmée n'est active.
- La PWA privée React contient le parcours complet configurable par colonnes et les contrats de futur planificateur.
