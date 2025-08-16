Mateleau — Manuel d’utilisation
Version : 1.0 — Dernière mise à jour : 11/08/2025
Périmètre : Front Angular 19, API Node/Express, Nginx, MongoDB + PostgreSQL
Public cible : administrateurs de clubs, moniteurs, staff accueil

1. Connexion et rôles
1.1 Création de compte

L’administrateur du club crée un compte initial .


1.2 Rôles et permissions
Admin : accès complet (planning, utilisateurs, bateaux, spots, paiements si activés, configuration).

Moniteur : accès aux plongées où il est affecté, consultation du planning, gestion des groupes, check-list matériel.

Accueil / Staff : création/modification de réservations, gestion des plongeurs, encaissements .

Astuce : limitez le rôle Admin à 1–2 personnes par structure.


/*********************//////////////

2. Découverte de l’interface
2.1 Tableau de bord
Vue synthétique du jour : plongées prévues, moniteurs affectés, nombre de plongeurs, alertes matériel à réviser.

Cartes récapitulatives : « Plongées du jour », « Équipement à vérifier », « Places restantes ».

2.2 Planning
Vue Calendrier (FullCalendar) : navigation jour/mois.

Vue Kanban du jour : colonnes par état (A faire  ▶ en cours ▶  terminé).

Astuce : utilisez la vue Kanban pour gérer le temps réel le jour J.

3. Créer et gérer une plongée
3.1 Création rapide
Ouvrir Calendrier > Cliquer sur un créneau (date).

Renseigner : Spot, Bateau, Heure de départ, Durée, Niveau requis.

Le système vérifie automatiquement :

disponibilité bateau (capacité + pas de chevauchement),

disponibilité moniteurs,

conflits avec autres plongées,

le niveau des plongeurs par rapport a la profondeur,

Valider. La plongée apparaît dans le calendrier.

3.2 Affectation des moniteurs et groupes
Depuis la fiche plongée, ajouter un moniteur .

Créer des groupes de plongée (ex. 1 guide pour 4 plongeurs) ; un compteur groupSize s’actualise automatiquement.

Les règles empêchent :

dépassement de capacité bateau,

doublons de matériel loué pour un même plongeur,

filtre automatiquement les plongeurs qui on le niveau pour la plongée.


3.3 Supression
Depuis le calendrier  clicker sur la plongée puis sur supprimer la plongée.

libérer automatiquement matériel et ressources.

4. Gestion des utilisateurs
4.1 Plongeurs
Créer (nom, prénom, niveau, email).


4.3 Droits d’accès
Changer rôle, modifier les information du User .

5. Ressources : Bateaux, Matériel, Spots
5.1 Bateaux
CRUD complet (nom, capacité, entretien).

Capacité utilisée en vérification lors de la création/édition de plongées.

5.2 Matériel
Enregistrer nature (ex. combinaison, détendeur), tailles, dates d’entretien.

Alerte « à réviser » lorsqu’une date d’entretien est dépassée/approche.

5.3 Spots & Localisations
Carte (Leaflet) : clic pour ajouter un marker (coordonnées + nom).

CRUD des spots (cohordonées gps, nom).

6 Système de mailling avec mailjet
Envoyer des rappel par mail de la plonége prévus 
sois via le détail de la plongée
sois via le dashboard
