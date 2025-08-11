# Cahier de Recettes – Application Node/Express + Angular + MongoDB

## 1. Contexte & périmètre général
- **Technologies** : Backend Node/Express, Frontend Angular, Base MongoDB
- **Modules couverts** : Authentification, Gestion des plongées, Gestion du matériel, Gestion des utilisateurs, Disponibilités, Spots, etc.
- **Type de tests** : Fonctionnels, Structurels, Sécurité
- **Source de scénarios** : dérivés des tests automatisés Jest (backend) + Karma/Jasmine (frontend)

--


## 2. Recettes Backend

### 2.1 Authentification
**Modules concernés** : AuthController, AuthService  
**Fonctionnalités couvertes** : Connexion, Déconnexion, Vérification de token JWT  
**Environnement** : Backend Node/Express démarré, MongoDB opérationnel  
**Données de test** :
- Utilisateur existant : `test@example.com` / `password123`
- Utilisateur inexistant : `unknown@example.com`

---

#### AUTH-LOGIN-001 – Connexion réussie
**Pré-requis** : Backend démarré, utilisateur existant  
**Étapes** :  
1. Envoyer `POST /login` avec email et mot de passe valides  
2. Observer la réponse et les cookies  

**Résultat attendu** :  
- HTTP 200  
- Cookies `token`, `userId`, `role` créés  
- JSON contenant `message`, `token`, `userId` et `role`  

**Statut** : OK / KO  
**Tests liés** : AuthController (login success), AuthService (login success)  

---

#### AUTH-LOGIN-002 – Connexion avec email inconnu
**Pré-requis** : Aucun utilisateur `unknown@example.com` en base  
**Étapes** :  
1. Envoyer `POST /login` avec email inconnu  
2. Observer la réponse  

**Résultat attendu** :  
- HTTP 400  
- JSON : `{ "message": "Invalid email or password" }`  
- Aucun cookie créé  

**Statut** : OK / KO  
**Tests liés** : AuthController (login error), AuthService (user not found)  

---

#### AUTH-LOGIN-003 – Connexion avec mot de passe invalide
**Pré-requis** : Utilisateur `test@example.com` existant  
**Étapes** :  
1. Envoyer `POST /login` avec mauvais mot de passe  
2. Observer la réponse  

**Résultat attendu** :  
- HTTP 400  
- JSON : `{ "message": "Invalid email or password" }`  
- Aucun cookie créé  

**Statut** : OK / KO  
**Tests liés** : AuthService (invalid password)  

---

#### AUTH-VERIFY-001 – Vérification de token valide
**Pré-requis** : Token JWT valide généré par l'application  
**Étapes** :  
1. Appeler `AuthService.verifyToken(token)`  

**Résultat attendu** :  
- Retour payload du token avec `id` et `role`  

**Statut** : OK / KO  
**Tests liés** : AuthService (verify token)  

---

#### AUTH-LOGOUT-001 – Déconnexion
**Pré-requis** : Session active avec cookies `token`, `userId`, `role`  
**Étapes** :  
1. Envoyer `POST /logout`  

**Résultat attendu** :  
- HTTP 200  
- Cookies `token`, `userId`, `role` supprimés  
- JSON : `{ "message": "Logged out successfully" }`  

**Statut** : OK / KO  
**Tests liés** : AuthController (logout success)  

### 2.2 Availability
**Modules concernés** : AvailabilityController, AvailabilityService  
**Fonctionnalités couvertes** : Récupération des bateaux, palanquées, plongeurs, équipements et utilisateurs disponibles en fonction d’une date et d’une durée.  
**Environnement** : Backend Node/Express démarré, MongoDB opérationnel  

---

#### AVAIL-001 – Paramètres manquants (tous endpoints)
**Pré-requis** : Aucun  
**Étapes** :  
1. Appeler un des endpoints `/availableBoats`, `/availableDivingGroups`, `/availableEquipment`, `/availableDivers`, `/availableUsers` avec uniquement `date` dans la query (sans `duration`)  

**Résultat attendu** :  
- HTTP 400  
- JSON : `{ "message": "Date and duration are required" }`  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – should return 400 if date or duration missing  

---

#### AVAIL-002 – Récupération des bateaux disponibles
**Pré-requis** : Données en base avec au moins un bateau occupé et un libre à la date donnée  
**Étapes** :  
1. GET `/availableBoats?date=2025-08-06&duration=60`  

**Résultat attendu** :  
- HTTP 200  
- Liste des bateaux dont l’`_id` n’est pas dans les plongées en cours à la date donnée  
- Format : tableau d’objets `{ _id, ... }`  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – available data from service, AvailabilityService – getAvailableBoats  

---

#### AVAIL-003 – Récupération des palanquées disponibles
**Pré-requis** : Données en base avec au moins une palanquée libre  
**Étapes** :  
1. GET `/availableDivingGroups?date=2025-08-06&duration=60`  

**Résultat attendu** :  
- HTTP 200  
- Liste des palanquées libres à la date donnée  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – available data from service, AvailabilityService – getAvailableDivingGroups  

---

#### AVAIL-004 – Récupération des plongeurs disponibles
**Pré-requis** : Données en base avec plongeurs occupés et libres  
**Étapes** :  
1. GET `/availableDivers?date=2025-08-06&duration=60`  

**Résultat attendu** :  
- HTTP 200  
- Liste des plongeurs libres à la date donnée  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – available data from service, AvailabilityService – getAvailableDivers  

---

#### AVAIL-005 – Récupération du matériel disponible
**Pré-requis** : Données en base avec équipements occupés et libres  
**Étapes** :  
1. GET `/availableEquipment?date=2025-08-06&duration=60`  

**Résultat attendu** :  
- HTTP 200  
- Liste des équipements libres à la date donnée  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – available data from service, AvailabilityService – getAvailableEquipment  

---

#### AVAIL-006 – Récupération des utilisateurs disponibles
**Pré-requis** : Données en base avec utilisateurs occupés et libres  
**Étapes** :  
1. GET `/availableUsers?date=2025-08-06&duration=60`  

**Résultat attendu** :  
- HTTP 200  
- Liste des utilisateurs libres à la date donnée  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – available data from service, AvailabilityService – getAvailableUsers  

---

#### AVAIL-007 – Erreur service (tous endpoints)
**Pré-requis** : Forcer une erreur dans le service (ex. indisponibilité DB)  
**Étapes** :  
1. Appeler un des endpoints `/available...` avec paramètres corrects  

**Résultat attendu** :  
- HTTP 500  
- JSON : `{ "message": "<erreur renvoyée par le service>" }`  

**Statut** : OK / KO  
**Tests liés** : AvailabilityController – should return 500 on service error  

### 2.3 Boat
**Modules concernés** : BoatController, BoatService  
**Fonctionnalités couvertes** : CRUD complet sur les bateaux (création, lecture, mise à jour, suppression)  
**Environnement** : Backend Node/Express démarré, MongoDB opérationnel  

---

#### BOAT-001 – Création d’un bateau – Succès
**Pré-requis** : Backend démarré  
**Étapes** :  
1. Envoyer `POST /boats` avec un body valide, ex. `{ "name": "Test Boat" }`  

**Résultat attendu** :  
- HTTP 201  
- JSON contenant les infos du bateau créé  

**Statut** : OK / KO  
**Tests liés** : BoatController – createBoat (success), BoatService – createBoat  

---

#### BOAT-002 – Création d’un bateau – Erreur service
**Pré-requis** : Service indisponible ou erreur simulée  
**Étapes** :  
1. Envoyer `POST /boats` avec un body valide  

**Résultat attendu** :  
- HTTP 500  
- JSON : `{ "message": "DB error" }`  

**Statut** : OK / KO  
**Tests liés** : BoatController – createBoat (error)  

---

#### BOAT-003 – Récupération de tous les bateaux
**Pré-requis** : Base contenant au moins un bateau  
**Étapes** :  
1. Envoyer `GET /boats`  

**Résultat attendu** :  
- HTTP 200  
- JSON : tableau de bateaux  

**Statut** : OK / KO  
**Tests liés** : BoatController – getAllBoats, BoatService – getAllBoats  

---

#### BOAT-004 – Récupération d’un bateau par ID – Succès
**Pré-requis** : Bateau existant avec ID connu  
**Étapes** :  
1. Envoyer `GET /boats/{id}`  

**Résultat attendu** :  
- HTTP 200  
- JSON contenant les infos du bateau correspondant  

**Statut** : OK / KO  
**Tests liés** : BoatController – getBoatById (found), BoatService – getBoatById  

---

#### BOAT-005 – Récupération d’un bateau par ID – Non trouvé
**Pré-requis** : Aucun bateau avec l’ID demandé  
**Étapes** :  
1. Envoyer `GET /boats/{id}`  

**Résultat attendu** :  
- HTTP 404  
- JSON : `{ "message": "Boat not found" }`  

**Statut** : OK / KO  
**Tests liés** : BoatController – getBoatById (not found)  

---

#### BOAT-006 – Mise à jour d’un bateau – Succès
**Pré-requis** : Bateau existant avec ID connu  
**Étapes** :  
1. Envoyer `PUT /boats/{id}` avec un body valide, ex. `{ "name": "Updated Boat" }`  

**Résultat attendu** :  
- HTTP 200  
- JSON contenant les nouvelles infos du bateau  

**Statut** : OK / KO  
**Tests liés** : BoatController – updateBoat (success), BoatService – updateBoat  

---

#### BOAT-007 – Mise à jour d’un bateau – Non trouvé
**Pré-requis** : Aucun bateau avec l’ID demandé  
**Étapes** :  
1. Envoyer `PUT /boats/{id}` avec un body valide  

**Résultat attendu** :  
- HTTP 404  
- JSON : `{ "message": "Boat not found" }`  

**Statut** : OK / KO  
**Tests liés** : BoatController – updateBoat (not found)  

---

#### BOAT-008 – Suppression d’un bateau – Succès
**Pré-requis** : Bateau existant avec ID connu  
**Étapes** :  
1. Envoyer `DELETE /boats/{id}`  

**Résultat attendu** :  
- HTTP 200  
- JSON : `{ "message": "Boat deleted successfully" }`  

**Statut** : OK / KO  
**Tests liés** : BoatController – deleteBoat (success), BoatService – deleteBoat  

---

#### BOAT-009 – Suppression d’un bateau – Non trouvé
**Pré-requis** : Aucun bateau avec l’ID demandé  
**Étapes** :  
1. Envoyer `DELETE /boats/{id}`  

**Résultat attendu** :  
- HTTP 404  
- JSON : `{ "message": "Boat not found" }`  

**Statut** : OK / KO  
**Tests liés** : BoatController – deleteBoat (not found)  

---

### 2.4 Dashboard
**Modules concernés** : DashboardController, DashboardService  
**Fonctionnalités couvertes** : Récap “Aujourd’hui” et “Semaine” (plongées, matériel à réviser, bateaux à réviser)  
**Environnement** : Backend Node/Express démarré, MongoDB opérationnel  

---

#### DASH-001 – Récupérer le tableau de bord du jour – Succès
**Pré-requis** : Backend démarré  
**Étapes** :  
1. GET `/dashboard/today`  

**Résultat attendu** :  
- HTTP 200  
- JSON contenant :  
  - `dives` : liste d’objets plongée  
  - `equipmentToReview` : liste d’équipements à réviser  
  - `boatsToReview` : liste de bateaux à réviser  

**Statut** : OK / KO  
**Tests liés** : DashboardController – getTodayDashboard (success), DashboardService – getTodayDashboardData (assemble data)  

---

#### DASH-002 – Récupérer le tableau de bord du jour – Erreur service
**Pré-requis** : Simuler une erreur côté service  
**Étapes** :  
1. GET `/dashboard/today`  

**Résultat attendu** :  
- HTTP 500  
- JSON : `{ "message": "Erreur serveur" }`  

**Statut** : OK / KO  
**Tests liés** : DashboardController – getTodayDashboard (service error)  

---

#### DASH-003 – Récupérer le tableau de bord de la semaine – Succès
**Pré-requis** : Backend démarré  
**Étapes** :  
1. GET `/dashboard/weekly`  

**Résultat attendu** :  
- HTTP 200  
- JSON contenant :  
  - `dives` : liste d’objets plongée  
  - `equipmentToReview` : liste d’équipements à réviser  
  - `boatsToReview` : liste de bateaux à réviser  

**Statut** : OK / KO  
**Tests liés** : DashboardController – getWeeklyDashboard (success), DashboardService – getWeeklyDashboardData (assemble data)  

---

#### DASH-004 – Récupérer le tableau de bord de la semaine – Erreur service
**Pré-requis** : Simuler une erreur côté service  
**Étapes** :  
1. GET `/dashboard/weekly`  

**Résultat attendu** :  
- HTTP 500  
- JSON : `{ "message": "Erreur serveur" }`  

**Statut** : OK / KO  
**Tests liés** : DashboardController – getWeeklyDashboard (service error)  

---

#### DASH-SVC-001 – Agrégation des données “Aujourd’hui” (service)
**Pré-requis** : Mocks des modèles Dive, Equipment, Boat configurés  
**Étapes** :  
1. Appeler `getTodayDashboardData()` du service  

**Résultat attendu** :  
- Retour d’un objet `{ dives: [...], equipmentToReview: [...], boatsToReview: [...] }`  

**Statut** : OK / KO  
**Tests liés** : DashboardService – should fetch today dashboard data  

---

#### DASH-SVC-002 – Agrégation des données “Semaine” (service)
**Pré-requis** : Mocks des modèles Dive, Equipment, Boat configurés  
**Étapes** :  
1. Appeler `getWeeklyDashboardData()` du service  

**Résultat attendu** :  
- Retour d’un objet `{ dives: [...], equipmentToReview: [...], boatsToReview: [...] }`  

**Statut** : OK / KO  
**Tests liés** : DashboardService – should fetch weekly dashboard data  


### 2.5 Dive

**Modules concernés :** `DiveController`, `DiveService`  
**Fonctionnalités couvertes :** Validations de création de plongée, disponibilité, niveaux, capacité bateau, CRUD complet (création, liste, détail, mise à jour, suppression)  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel

---

#### DIVE-CRT-001 – Refus si `endDate < date`
- **Pré-requis :** Aucun
- **Étapes :** Créer une plongée avec `endDate` antérieure à `date`
- **Attendu :** `HTTP 400` + message `"endDate must be after date"`
- **Tests liés :** `DiveController` – should return 400 if endDate is before date

#### DIVE-CRT-002 – Refus si bateau introuvable
- **Pré-requis :** Aucun bateau avec l’ID fourni
- **Étapes :** Créer une plongée avec `boat` inexistant
- **Attendu :** `HTTP 404` + message `"Boat not found"`
- **Tests liés :** `DiveController` – 404 if boat is not found

#### DIVE-CRT-003 – Refus si pilote (driver) introuvable
- **Pré-requis :** Aucun utilisateur avec l’ID driver
- **Étapes :** Créer une plongée avec `driver` inexistant
- **Attendu :** `HTTP 404` + message `"Driver not found"`
- **Tests liés :** `DiveController` – 404 if driver is not found

#### DIVE-CRT-004 – Refus si palanquées manquantes
- **Pré-requis :** Aucun `DivingGroup` correspondant aux IDs fournis
- **Étapes :** Créer une plongée avec des IDs inexistants
- **Attendu :** `HTTP 404` + message `"One or more diving groups not found"`
- **Tests liés :** `DiveController` – 404 if diving groups are missing

#### DIVE-CRT-005 – Refus si le driver est dans une palanquée
- **Pré-requis :** Une palanquée contenant le driver dans ses `divers`
- **Étapes :** Créer une plongée avec ce driver
- **Attendu :** `HTTP 400` + message `"Driver cannot be part of a diving group"`
- **Tests liés :** `DiveController` – 400 if driver is part of a diving group

#### DIVE-CRT-006 – Refus si capacité bateau dépassée
- **Pré-requis :** Bateau avec `numberMaxPlaces` faible et groupes dépassant cette capacité (guide + divers + driver comptés)
- **Étapes :** Créer une plongée dépassant la capacité
- **Attendu :** `HTTP 400` + message `"The number of people exceeds the maximum capacity of the boat"`
- **Tests liés :** `DiveController` – 400 if too many people for the boat

#### DIVE-CRT-007 – Refus si niveau plongeur insuffisant
- **Pré-requis :** Diver avec `divingLvl` trop bas pour `maxDepth` (ex. Jean)
- **Étapes :** Créer une plongée avec ce plongeur
- **Attendu :** `HTTP 400` + message `"Diver Jean does not have the required diving level for this depth"`
- **Tests liés :** `DiveController` – 400 if a diver has insufficient level

#### DIVE-CRT-008 – Refus si chevauchement horaire
- **Pré-requis :** Une autre plongée existante sur le créneau (même bateau/driver/groupe indisponibles)
- **Étapes :** Créer une plongée sur le même intervalle
- **Attendu :** `HTTP 400` + message `"Boat, driver, or diving groups are not available during this period"`
- **Tests liés :** `DiveController` – 400 if overlapping dive exists

#### DIVE-CRT-009 – Création de plongée réussie
- **Pré-requis :** Bateau existant et assez de places, driver existant et non présent dans une palanquée, palanquées existantes, aucun chevauchement, niveaux conformes
- **Étapes :** Créer une plongée valide (`name`, `location`, `date`, `endDate`, `maxDepth`, `divingGroups`, `boat`, `driver`)
- **Attendu :** `HTTP 201` + JSON de la plongée créée (`id`/`newDive`)
- **Tests liés :** `DiveController` – create dive if all checks pass ; `DiveService` – createDive

---

#### DIVE-SVC-001 – Service : création et sauvegarde d’une plongée
- **Pré-requis :** Aucun
- **Étapes :** Appeler `DiveService.createDive(payload minimal valide)`
- **Attendu :** Renvoie l’objet créé avec `_id` ; `save()` appelé
- **Tests liés :** `DiveService` – create and save a new dive

#### DIVE-SVC-002 – Service : liste de toutes les plongées (populate)
- **Pré-requis :** Données en base- **Étapes :** Appeler `DiveService.getAllDives()`
- **Attendu :** Appel `Dive.find().populate('divingGroups boat driver')` ; renvoie la liste
- **Tests liés :** `DiveService` – return all dives with population

#### DIVE-SVC-003 – Service : détail d’une plongée (populate)
- **Pré-requis :** ID existant
- **Étapes :** Appeler `DiveService.getDiveById(id)`
- **Attendu :** Appel `findById(id).populate('divingGroups boat driver')` ; renvoie la plongée
- **Tests liés :** `DiveService` – return dive by ID with population

#### DIVE-SVC-004 – Service : mise à jour d’une plongée (populate, new:true)
- **Pré-requis :** ID existant
- **Étapes :** Appeler `DiveService.updateDive(id, payload)`
- **Attendu :** Appel `findByIdAndUpdate(id, payload, { new: true }).populate('divingGroups boat driver')` ; renvoie la version mise à jour
- **Tests liés :** `DiveService` – update dive and return new one with population

#### DIVE-SVC-005 – Service : suppression d’une plongée
- **Pré-requis :** ID existant
- **Étapes :** Appeler `DiveService.deleteDive(id)`
- **Attendu :** Appel `findByIdAndDelete(id)` ; renvoie l’objet supprimé
- **Tests liés :** `DiveService` – delete dive by ID


## 2.6 Cahier de Recettes – Diver

**Modules concernés :** `DiverController`, `DiverService`  
**Fonctionnalités couvertes :** CRUD plongeurs + création multiple  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel  

---

#### DIVER-CRT-001 – Créer un plongeur (succès)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/divers` avec un body valide (ex. `{ "firstName": "Jean", "lastName": "Dupont" }`)  
- **Attendu :** `HTTP 201` ; JSON = plongeur créé  
- **Tests liés :** `DiverController` – createDiver (success) ; `DiverService` – createDiver (save called)

#### DIVER-CRT-002 – Créer plusieurs plongeurs (succès)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/divers/bulk` avec `{ divers: [{...}, {...}] }`  
- **Attendu :** `HTTP 201` ; JSON = liste des plongeurs insérés  
- **Tests liés :** `DiverController` – createMultipleDivers ; `DiverService` – createMultipleDivers (insertMany)

#### DIVER-CRT-003 – Lister tous les plongeurs
- **Pré-requis :** Base avec au moins un enregistrement  
- **Étapes :** GET `/divers`  
- **Attendu :** `HTTP 200` ; JSON = tableau des plongeurs  
- **Tests liés :** `DiverController` – getAllDivers ; `DiverService` – getAllDivers

#### DIVER-CRT-004 – Obtenir un plongeur par ID (succès)
- **Pré-requis :** ID existant (ex. `123`)  
- **Étapes :** GET `/divers/123`  
- **Attendu :** `HTTP 200` ; JSON = plongeur correspondant  
- **Tests liés :** `DiverController` – getDiverById (found) ; `DiverService` – getDiverById

#### DIVER-CRT-005 – Obtenir un plongeur par ID (non trouvé)
- **Pré-requis :** ID inexistant (ex. `404`)  
- **Étapes :** GET `/divers/404`  
- **Attendu :** `HTTP 404` ; JSON `{ "message": "Diver not found" }`  
- **Tests liés :** `DiverController` – getDiverById (not found)

#### DIVER-CRT-006 – Mettre à jour un plongeur (succès)
- **Pré-requis :** ID existant (ex. `123`)  
- **Étapes :** PUT `/divers/123` avec body valide (ex. `{ "firstName": "Updated" }`)  
- **Attendu :** `HTTP 200` ; JSON = document mis à jour  
- **Tests liés :** `DiverController` – updateDiver (success) ; `DiverService` – updateDiver (findByIdAndUpdate new:true)

#### DIVER-CRT-007 – Mettre à jour un plongeur (non trouvé)
- **Pré-requis :** ID inexistant (ex. `404`)  
- **Étapes :** PUT `/divers/404` avec body quelconque  
- **Attendu :** `HTTP 404` ; JSON `{ "message": "Diver not found" }`  
- **Tests liés :** `DiverController` – updateDiver (not found)

#### DIVER-CRT-008 – Supprimer un plongeur (succès)
- **Pré-requis :** ID existant (ex. `123`)  
- **Étapes :** DELETE `/divers/123`  
- **Attendu :** `HTTP 200` ; JSON `{ "message": "Diver deleted successfully" }`  
- **Tests liés :** `DiverController` – deleteDiver (success) ; `DiverService` – deleteDiver

#### DIVER-CRT-009 – Supprimer un plongeur (non trouvé)
- **Pré-requis :** ID inexistant (ex. `404`)  
- **Étapes :** DELETE `/divers/404`  
- **Attendu :** `HTTP 404` ; JSON `{ "message": "Diver not found" }`  
- **Tests liés :** `DiverController` – deleteDiver (not found)

---

## 2.7 Cahier de Recettes – DivingGroup

**Modules concernés :** `DivingGroupController`, `DivingGroupService`  
**Fonctionnalités couvertes :** CRUD palanquées (création, liste, détail, mise à jour, suppression)  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel  

---

#### DIVGRP-CRT-001 – Créer une palanquée (succès)
- **Pré-requis :** Aucun (IDs guide/divers valides)  
- **Étapes :** POST `/diving-groups` avec body minimal valide (ex. `guide: "g1"`, `divers: ["d1"]`, `equipmentAssignments: []`)  
- **Attendu :** `HTTP 201` ; JSON = palanquée créée  
- **Tests liés :** `DivingGroupController` – createDivingGroup (success) ; `DivingGroupService` – createDivingGroup (save)

#### DIVGRP-CRT-002 – Lister toutes les palanquées
- **Pré-requis :** Base avec au moins une palanquée  
- **Étapes :** GET `/diving-groups`  
- **Attendu :** `HTTP 200` ; JSON = tableau de palanquées  
- **Tests liés :** `DivingGroupController` – getAllDivingGroups ; `DivingGroupService` – getAllDivingGroups (populate "guide divers")

#### DIVGRP-CRT-003 – Obtenir une palanquée par ID (succès)
- **Pré-requis :** ID existant (ex. `1`)  
- **Étapes :** GET `/diving-groups/1`  
- **Attendu :** `HTTP 200` ; JSON = palanquée correspondante  
- **Tests liés :** `DivingGroupController` – getDivingGroupById (found) ; `DivingGroupService` – getDivingGroupById (populate "guide divers")

#### DIVGRP-CRT-004 – Obtenir une palanquée par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** GET `/diving-groups/{id-inexistant}`  
- **Attendu :** `HTTP 404` ; JSON `{ "message": "Diving group not found" }`  
- **Tests liés :** `DivingGroupController` – getDivingGroupById (not found)

#### DIVGRP-CRT-005 – Mettre à jour une palanquée (succès)
- **Pré-requis :** ID existant  
- **Étapes :** PUT `/diving-groups/1` avec body valide (ex. changement de guide ou des divers)  
- **Attendu :** `HTTP 200` ; JSON = palanquée mise à jour  
- **Tests liés :** `DivingGroupController` – updateDivingGroup (success) ; `DivingGroupService` – updateDivingGroup (populate "guide divers")

#### DIVGRP-CRT-006 – Supprimer une palanquée (succès)
- **Pré-requis :** ID existant  
- **Étapes :** DELETE `/diving-groups/1`  
- **Attendu :** `HTTP 200` ; JSON `{ "message": "Diving group deleted successfully" }`  
- **Tests liés :** `DivingGroupController` – deleteDivingGroup (success) ; `DivingGroupService` – deleteDivingGroup

---

#### DIVGRP-SVC-001 – Service : création (save)
- **Pré-requis :** Aucun  
- **Étapes :** Appeler `createDivingGroup(payload)`  
- **Attendu :** `save()` appelé ; retour de l’objet créé  
- **Tests liés :** `DivingGroupService` – createDivingGroup

#### DIVGRP-SVC-002 – Service : liste (populate)
- **Pré-requis :** Aucun  
- **Étapes :** Appeler `getAllDivingGroups()`  
- **Attendu :** `DivingGroup.find().populate("guide divers")` ; renvoie la liste  
- **Tests liés :** `DivingGroupService` – getAllDivingGroups

#### DIVGRP-SVC-003 – Service : détail (populate)
- **Pré-requis :** ID existant  
- **Étapes :** Appeler `getDivingGroupById(id)`  
- **Attendu :** `findById(id).populate("guide divers")` ; renvoie la palanquée  
- **Tests liés :** `DivingGroupService` – getDivingGroupById

#### DIVGRP-SVC-004 – Service : mise à jour (populate, new:true)
- **Pré-requis :** ID existant  
- **Étapes :** Appeler `updateDivingGroup(id, payload)`  
- **Attendu :** `findByIdAndUpdate(..., { new: true }).populate("guide divers")` ; renvoie la version mise à jour  
- **Tests liés :** `DivingGroupService` – updateDivingGroup

#### DIVGRP-SVC-005 – Service : suppression
- **Pré-requis :** ID existant  
- **Étapes :** Appeler `deleteDivingGroup(id)`  
- **Attendu :** `findByIdAndDelete(id)` ; renvoie l’objet supprimé  
- **Tests liés :** `DivingGroupService` – deleteDivingGroup



## 2.8 Cahier de Recettes – Equipment

**Modules concernés :** `EquipmentController`, `EquipmentService`  
**Fonctionnalités couvertes :** CRUD matériel (création, création multiple, liste, détail, mise à jour, suppression)  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel  

---

#### EQUIP-CRT-001 – Créer un équipement (succès)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/equipment` avec body valide (`reference`, `nature`, `nextMaintenanceDate`)  
- **Attendu :** `HTTP 201` + JSON équipement créé  
- **Tests liés :** Controller : createEquipment (success) ; Service : createEquipment (save)

#### EQUIP-CRT-002 – Créer plusieurs équipements (succès)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/equipment/multiple` avec `{ equipment: [...] }`  
- **Attendu :** `HTTP 201` + JSON tableau équipements créés  
- **Tests liés :** Controller : createMultipleEquipment (success) ; Service : createMultipleEquipment (insertMany)

#### EQUIP-CRT-003 – Lister tous les équipements
- **Pré-requis :** Base avec au moins un équipement  
- **Étapes :** GET `/equipment`  
- **Attendu :** `HTTP 200` + JSON tableau des équipements  
- **Tests liés :** Controller : getAllEquipment (success) ; Service : getAllEquipment (find)

#### EQUIP-CRT-004 – Obtenir un équipement par ID (succès)
- **Pré-requis :** ID existant  
- **Étapes :** GET `/equipment/{id}`  
- **Attendu :** `HTTP 200` + JSON équipement correspondant  
- **Tests liés :** Controller : getEquipmentById (found) ; Service : getEquipmentById (findById)

#### EQUIP-CRT-005 – Obtenir un équipement par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** GET `/equipment/{id-inexistant}`  
- **Attendu :** `HTTP 404` + `{ "message": "Equipment not found" }`  
- **Tests liés :** Controller : getEquipmentById (not found)

#### EQUIP-CRT-006 – Mettre à jour un équipement (succès)
- **Pré-requis :** ID existant  
- **Étapes :** PUT `/equipment/{id}` avec `{ reference: "Updated" }`  
- **Attendu :** `HTTP 200` + JSON équipement mis à jour  
- **Tests liés :** Controller : updateEquipment (success) ; Service : updateEquipment (findByIdAndUpdate)

#### EQUIP-CRT-007 – Mettre à jour un équipement (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** PUT `/equipment/{id-inexistant}`  
- **Attendu :** `HTTP 404` + `{ "message": "Equipment not found" }`  
- **Tests liés :** Controller : updateEquipment (not found)

#### EQUIP-CRT-008 – Supprimer un équipement (succès)
- **Pré-requis :** ID existant  
- **Étapes :** DELETE `/equipment/{id}`  
- **Attendu :** `HTTP 200` + `{ "message": "Equipment deleted successfully" }`  
- **Tests liés :** Controller : deleteEquipment (success) ; Service : deleteEquipment (findByIdAndDelete)

#### EQUIP-CRT-009 – Supprimer un équipement (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** DELETE `/equipment/{id-inexistant}`  
- **Attendu :** `HTTP 404` + `{ "message": "Equipment not found" }`  
- **Tests liés :** Controller : deleteEquipment (not found)


## 2.9 Cahier de Recettes – Spot

**Modules concernés :** `SpotController`, `SpotService`  
**Fonctionnalités couvertes :** CRUD spots de plongée (création, liste, détail, mise à jour, suppression)  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel  

---

#### SPOT-CRT-001 – Créer un spot (succès)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/spots` avec body valide (`name`, `coordinates.lat`, `coordinates.lng`)  
- **Attendu :** `HTTP 201` + JSON du spot créé  
- **Tests liés :** Controller : createSpot (success) ; Service : createSpot (save)

#### SPOT-CRT-002 – Créer un spot (erreur)
- **Pré-requis :** Aucun  
- **Étapes :** POST `/spots` avec body invalide  
- **Attendu :** `HTTP 500` + `{ "message": "Erreur création Spot" }`  
- **Tests liés :** Controller : createSpot (error)

#### SPOT-CRT-003 – Lister tous les spots (succès)
- **Pré-requis :** Au moins un spot en base  
- **Étapes :** GET `/spots`  
- **Attendu :** `HTTP 200` + tableau JSON des spots  
- **Tests liés :** Controller : getAllSpots (success) ; Service : getAllSpots (find)

#### SPOT-CRT-004 – Lister tous les spots (erreur)
- **Pré-requis :** Aucun  
- **Étapes :** GET `/spots` (provoquer une erreur)  
- **Attendu :** `HTTP 500` + `{ "message": "Erreur récupération Spots" }`  
- **Tests liés :** Controller : getAllSpots (error)

#### SPOT-CRT-005 – Obtenir un spot par ID (succès)
- **Pré-requis :** ID existant  
- **Étapes :** GET `/spots/{id}`  
- **Attendu :** `HTTP 200` + JSON spot correspondant  
- **Tests liés :** Controller : getSpotById (found) ; Service : getSpotById (findById)

#### SPOT-CRT-006 – Obtenir un spot par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** GET `/spots/{id-inexistant}`  
- **Attendu :** `HTTP 404` + `{ "message": "Spot non trouvée" }`  
- **Tests liés :** Controller : getSpotById (not found)

#### SPOT-CRT-007 – Obtenir un spot par ID (erreur)
- **Pré-requis :** Aucun  
- **Étapes :** GET `/spots/{id}` (provoquer une erreur)  
- **Attendu :** `HTTP 500` + `{ "message": "Erreur récupération Spot" }`  
- **Tests liés :** Controller : getSpotById (error)

#### SPOT-CRT-008 – Mettre à jour un spot (succès)
- **Pré-requis :** ID existant  
- **Étapes :** PUT `/spots/{id}` avec `{ name: "Updated" }`  
- **Attendu :** `HTTP 200` + JSON du spot mis à jour  
- **Tests liés :** Controller : updateSpot (success) ; Service : updateSpot (findByIdAndUpdate)

#### SPOT-CRT-009 – Mettre à jour un spot (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** PUT `/spots/{id-inexistant}`  
- **Attendu :** `HTTP 404` + `{ "message": "Spot non trouvée" }`  
- **Tests liés :** Controller : updateSpot (not found)

#### SPOT-CRT-010 – Mettre à jour un spot (erreur)
- **Pré-requis :** Aucun  
- **Étapes :** PUT `/spots/{id}` (provoquer une erreur)  
- **Attendu :** `HTTP 500` + `{ "message": "Erreur mise à jour Spot" }`  
- **Tests liés :** Controller : updateSpot (error)

#### SPOT-CRT-011 – Supprimer un spot (succès)
- **Pré-requis :** ID existant  
- **Étapes :** DELETE `/spots/{id}`  
- **Attendu :** `HTTP 204` sans corps de réponse  
- **Tests liés :** Controller : deleteSpot (success) ; Service : deleteSpot (findByIdAndDelete)

#### SPOT-CRT-012 – Supprimer un spot (erreur)
- **Pré-requis :** Aucun  
- **Étapes :** DELETE `/spots/{id}` (provoquer une erreur)  
- **Attendu :** `HTTP 500` + `{ "message": "Erreur suppression Spot" }`  
- **Tests liés :** Controller : deleteSpot (error)


## 2.10 — Cahier de Recettes : Task
**Modules concernés :** `TaskController`, `TaskService`  
**Fonctionnalités couvertes :** CRUD tâches (liste, création, mise à jour, suppression)  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel

---

#### 2.10.1 — TASK-CRT-001 · Lister toutes les tâches (succès)
- **Pré-requis :** au moins une tâche en base (facultatif)
- **Étapes :** `GET /tasks`
- **Résultats attendus :** HTTP `200` ; JSON = tableau des tâches
- **Tests liés :** TaskController – getAllTasks (success) ; TaskService – getAllTasks (find)

#### 2.10.2 — TASK-CRT-002 · Lister toutes les tâches (erreur service)
- **Pré-requis :** simuler une erreur service
- **Étapes :** `GET /tasks`
- **Résultats attendus :** HTTP `500` ; JSON `{ "message": "Erreur lors de la récupération des tâches" }`
- **Tests liés :** TaskController – getAllTasks (error)

#### 2.10.3 — TASK-CRT-003 · Créer une tâche (succès)
- **Pré-requis :** aucun
- **Étapes :** `POST /tasks` avec body valide `{ "title": "New Task" }`
- **Résultats attendus :** HTTP `201` ; JSON = tâche créée
- **Tests liés :** TaskController – createTask (success) ; TaskService – createTask (save)

#### 2.10.4 — TASK-CRT-004 · Créer une tâche (erreur service)
- **Pré-requis :** simuler une erreur service
- **Étapes :** `POST /tasks` (ex. `{ "title": "fail" }` dans le test)
- **Résultats attendus :** HTTP `500` ; JSON `{ "message": "Erreur lors de la création de la tâche" }`
- **Tests liés :** TaskController – createTask (error)

#### 2.10.5 — TASK-CRT-005 · Mettre à jour une tâche (succès)
- **Pré-requis :** ID existant (ex. `1`)
- **Étapes :** `PUT /tasks/1` avec `{ "title": "Updated Task" }`
- **Résultats attendus :** HTTP `200` ; JSON = tâche mise à jour
- **Tests liés :** TaskController – updateTask (success) ; TaskService – updateTask (findByIdAndUpdate new:true)

#### 2.10.6 — TASK-CRT-006 · Mettre à jour une tâche (erreur service)
- **Pré-requis :** simuler une erreur service
- **Étapes :** `PUT /tasks/1`
- **Résultats attendus :** HTTP `500` ; JSON `{ "message": "Erreur lors de la mise à jour de la tâche" }`
- **Tests liés :** TaskController – updateTask (error)

#### 2.10.7 — TASK-CRT-007 · Supprimer une tâche (succès)
- **Pré-requis :** ID existant (ex. `1`)
- **Étapes :** `DELETE /tasks/1`
- **Résultats attendus :** HTTP `204` ; réponse vide (`end()`)
- **Tests liés :** TaskController – deleteTask (204 success) ; TaskService – deleteTask (findByIdAndDelete)

#### 2.10.8 — TASK-CRT-008 · Supprimer une tâche (erreur service)
- **Pré-requis :** simuler une erreur service
- **Étapes :** `DELETE /tasks/1`
- **Résultats attendus :** HTTP `500` ; JSON `{ "message": "Erreur lors de la suppression de la tâche" }`
- **Tests liés :** TaskController – deleteTask (error)

---

#### 2.10.9 — TASK-SVC-001 · Service : lister toutes les tâches
- **Étapes :** appeler `TaskService.getAllTasks()`
- **Résultats attendus :** `Task.find()` appelé ; renvoie le tableau de tâches
- **Tests liés :** TaskService – getAllTasks

#### 2.10.10 — TASK-SVC-002 · Service : créer une tâche
- **Étapes :** appeler `TaskService.createTask({ title: "Test" })`
- **Résultats attendus :** `new Task(...).save()` appelé ; renvoie `{ id, title }`
- **Tests liés :** TaskService – createTask

#### 2.10.11 — TASK-SVC-003 · Service : mettre à jour une tâche
- **Étapes :** appeler `TaskService.updateTask('1', { title: 'Updated' })`
- **Résultats attendus :** `findByIdAndUpdate('1', { title: 'Updated' }, { new: true })` ; renvoie la tâche mise à jour
- **Tests liés :** TaskService – updateTask

#### 2.10.12 — TASK-SVC-004 · Service : supprimer une tâche
- **Étapes :** appeler `TaskService.deleteTask('1')`
- **Résultats attendus :** `findByIdAndDelete('1')` ; renvoie l’objet supprimé
- **Tests liés :** TaskService – deleteTask



## 2.11 — Cahier de Recettes : User
**Modules concernés :** `UserController`, `UserService`  
**Fonctionnalités couvertes :** CRUD utilisateurs + gestion utilisateur courant via cookie  
**Environnement :** Backend Node/Express démarré, MongoDB opérationnel

---

#### 2.11.1 — USER-CRT-001 · Créer un utilisateur (succès)
- **Pré-requis :** aucun  
- **Étapes :** `POST /users` avec body `{ "name": "Test" }`  
- **Résultats attendus :** HTTP `201` ; JSON `{ "id": "1" }`  
- **Tests liés :** UserController – createUser (success) ; UserService – createUser (save)

#### 2.11.2 — USER-CRT-002 · Récupérer tous les utilisateurs (succès)
- **Pré-requis :** au moins un utilisateur en base  
- **Étapes :** `GET /users`  
- **Résultats attendus :** HTTP `200` ; JSON tableau des utilisateurs  
- **Tests liés :** UserController – getAllUsers (success) ; UserService – getAllUsers (find)

#### 2.11.3 — USER-CRT-003 · Récupérer un utilisateur par ID (succès)
- **Pré-requis :** utilisateur existant (id = "1")  
- **Étapes :** `GET /users/1`  
- **Résultats attendus :** HTTP `200` ; JSON `{ "id": "1" }`  
- **Tests liés :** UserController – getOneUser (success) ; UserService – getUserById (findById)

#### 2.11.4 — USER-CRT-004 · Récupérer un utilisateur par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** `GET /users/unknown`  
- **Résultats attendus :** HTTP `404` ; JSON `{ "message": "User not found" }`  
- **Tests liés :** UserController – getOneUser (404)

#### 2.11.5 — USER-CRT-005 · Récupérer l’utilisateur courant via cookie (succès)
- **Pré-requis :** cookie `userId` valide  
- **Étapes :** `GET /users/me`  
- **Résultats attendus :** HTTP `200` ; JSON `{ "id": "<cookie-id>" }`  
- **Tests liés :** UserController – getCurrentUser (success)

#### 2.11.6 — USER-CRT-006 · Récupérer l’utilisateur courant via cookie (non trouvé)
- **Pré-requis :** cookie `userId` invalide  
- **Étapes :** `GET /users/me`  
- **Résultats attendus :** HTTP `404` ; JSON `{ "message": "User not found" }`  
- **Tests liés :** UserController – getCurrentUser (404)

#### 2.11.7 — USER-CRT-007 · Mettre à jour l’utilisateur courant (succès)
- **Pré-requis :** cookie `userId` valide  
- **Étapes :** `PUT /users/me` avec body `{ "name": "New" }`  
- **Résultats attendus :** HTTP `200` ; JSON `{ "id": "updated" }`  
- **Tests liés :** UserController – updateCurrentUser (success) ; UserService – updateUser

#### 2.11.8 — USER-CRT-008 · Mettre à jour l’utilisateur courant (non trouvé)
- **Pré-requis :** cookie `userId` invalide  
- **Étapes :** `PUT /users/me`  
- **Résultats attendus :** HTTP `404` ; JSON `{ "message": "User not found" }`  
- **Tests liés :** UserController – updateCurrentUser (404)

#### 2.11.9 — USER-CRT-009 · Mettre à jour un utilisateur par ID (succès)
- **Pré-requis :** ID existant (`1`)  
- **Étapes :** `PUT /users/1` avec body `{ "name": "Updated" }`  
- **Résultats attendus :** HTTP `200` ; JSON `{ "id": "updated" }`  
- **Tests liés :** UserController – updateUser (success) ; UserService – updateUser

#### 2.11.10 — USER-CRT-010 · Mettre à jour un utilisateur par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** `PUT /users/1`  
- **Résultats attendus :** HTTP `404` ; JSON `{ "message": "User not found" }`  
- **Tests liés :** UserController – updateUser (404)

#### 2.11.11 — USER-CRT-011 · Supprimer un utilisateur par ID (succès)
- **Pré-requis :** ID existant (`1`)  
- **Étapes :** `DELETE /users/1`  
- **Résultats attendus :** HTTP `200` ; JSON `{ "message": "User deleted successfully" }`  
- **Tests liés :** UserController – deleteUser (success) ; UserService – deleteUser

#### 2.11.12 — USER-CRT-012 · Supprimer un utilisateur par ID (non trouvé)
- **Pré-requis :** ID inexistant  
- **Étapes :** `DELETE /users/1`  
- **Résultats attendus :** HTTP `404` ; JSON `{ "message": "User not found" }`  
- **Tests liés :** UserController – deleteUser (404)

---

#### 2.11.13 — USER-SVC-001 · Service : création utilisateur
- **Étapes :** `UserService.createUser({ name: "Lucas" })`  
- **Résultats attendus :** `new User(...).save()` ; renvoie `{ id, name }`  

#### 2.11.14 — USER-SVC-002 · Service : récupération de tous les utilisateurs
- **Étapes :** `UserService.getAllUsers()`  
- **Résultats attendus :** `User.find()` appelé ; renvoie tableau des utilisateurs  

#### 2.11.15 — USER-SVC-003 · Service : récupération utilisateur par ID
- **Étapes :** `UserService.getUserById('1')`  
- **Résultats attendus :** `User.findById('1')` ; renvoie utilisateur  

#### 2.11.16 — USER-SVC-004 · Service : mise à jour utilisateur
- **Étapes :** `UserService.updateUser('1', { name: 'Updated' })`  
- **Résultats attendus :** `User.findByIdAndUpdate('1', { name: 'Updated' }, { new: true })` ; renvoie utilisateur MAJ  

#### 2.11.17 — USER-SVC-005 · Service : suppression utilisateur
- **Étapes :** `UserService.deleteUser('1')`  
- **Résultats attendus :** `User.findByIdAndDelete('1')` ; renvoie utilisateur supprimé  

---

## 2.12 — Cahier de Recettes : Middleware d’authentification
**Modules concernés :** `authenticateToken`, `checkAdminRole` (`authMiddleware`)  
**Dépendances :** `AuthService.verifyToken`, `User` (Mongo)  
**Environnement :** Backend Node/Express démarré, cookies actifs

---

#### 2.12.1 — AUTHMW-001 · Requête sans token → 401
- **Pré-requis :** aucun  
- **Étapes :** requête avec cookies vides vers une route protégée  
- **Résultats attendus :** HTTP `401` ; `next()` non appelé  
- **Tests liés :** authenticateToken should return 401 if no token

#### 2.12.2 — AUTHMW-002 · Token valide mais utilisateur inexistant → 401
- **Pré-requis :** `verifyToken` → `{ id: 'user-id' }`, `User.findById` → `null`  
- **Étapes :** requête avec cookie token présent  
- **Résultats attendus :** HTTP `401` ; `next()` non appelé  
- **Tests liés :** authenticateToken should return 401 if user not found

#### 2.12.3 — AUTHMW-003 · Échec vérification du token → 403
- **Pré-requis :** `verifyToken` lève une erreur (“Invalid token”)  
- **Étapes :** requête avec cookie token invalide  
- **Résultats attendus :** HTTP `403` ; `next()` non appelé  
- **Tests liés :** authenticateToken should return 403 on token verification failure

#### 2.12.4 — AUTHMW-004 · Token valide + utilisateur trouvé → next()
- **Pré-requis :** `verifyToken` → `{ id: 'user-id' }`, `User.findById` → objet user  
- **Étapes :** requête avec cookie token valide  
- **Résultats attendus :** utilisateur attaché à `req.body.user` ; `next()` appelé  
- **Tests liés :** authenticateToken should attach user and call next if valid

#### 2.12.5 — AUTHMW-005 · Vérification rôle admin : cookies absents → 401
- **Pré-requis :** aucun  
- **Étapes :** requête sans `userId`/`role` dans cookies  
- **Résultats attendus :** HTTP `401` ; `next()` non appelé  
- **Tests liés :** checkAdminRole should return 401 if no userId or role

#### 2.12.6 — AUTHMW-006 · Vérification rôle admin : utilisateur non admin → 403
- **Pré-requis :** cookies `{ userId: 'user-id', role: 'user' }`  
- **Étapes :** passer dans `checkAdminRole`  
- **Résultats attendus :** HTTP `403` ; `next()` non appelé  
- **Tests liés :** checkAdminRole should return 403 if user is not admin

#### 2.12.7 — AUTHMW-007 · Vérification rôle admin : utilisateur admin → next()
- **Pré-requis :** cookies `{ userId: 'admin-id', role: 'admin' }`  
- **Étapes :** passer dans `checkAdminRole`  
- **Résultats attendus :** `next()` appelé (pas d’erreur HTTP)  
- **Tests liés :** checkAdminRole should call next if user is admin

#### 2.12.8 — AUTHMW-008 · Vérification rôle admin : erreur base de données → 403
- **Pré-requis :** cookies `{ userId: 'admin-id', role: 'admin' }`, `User.findById` rejette (“DB error”)  
- **Étapes :** passer dans `checkAdminRole`  
- **Résultats attendus :** HTTP `403` ; `next()` non appelé  
- **Tests liés :** checkAdminRole should return 403 on database error



## 2.13 — Cahier de Recettes : Modèle DivingGroup
**Modules concernés :** Modèle Mongoose `DivingGroup` (hooks/validations)  
**Dépendances :** Modèle `Equipment` (référence par IDs)  
**Environnement :** MongoDB local (db de test), Mongoose connecté (tests E2E modèle)

#### 2.13.1 — DG-MDL-001 · Calcul automatique de la taille du groupe (`groupSize`)
- **Pré-requis :** guide défini, deux divers dans la liste  
- **Étapes :** créer un document `DivingGroup` avec 1 guide et 2 divers puis `save()`  
- **Résultats attendus :** `groupSize = 3` (guide + 2 divers)  
- **Tests liés :** should calculate groupSize and save a valid group

#### 2.13.2 — DG-MDL-002 · Taille maximale du groupe (refus > 5)
- **Pré-requis :** guide défini, 5 divers dans la liste (total 6)  
- **Étapes :** créer puis `save()`  
- **Résultats attendus :** échec `save()` avec erreur `Group size cannot exceed 5 members`  
- **Tests liés :** should throw if group size exceeds 5

#### 2.13.3 — DG-MDL-003 · Unicité des plongeurs (pas de doublons)
- **Pré-requis :** même `diverId` présent deux fois dans `divers`  
- **Étapes :** créer puis `save()`  
- **Résultats attendus :** échec `save()` avec erreur `Divers must be unique`  
- **Tests liés :** should throw if there are duplicate divers

#### 2.13.4 — DG-MDL-004 · Références d’équipement valides (existence en base)
- **Pré-requis :** aucun `Equipment` correspondant aux `equipmentIds` fournis (base vidée)  
- **Étapes :** ajouter `rentedEquipment` pour un diver avec un `equipmentId` inexistant, puis `save()`  
- **Résultats attendus :** échec `save()` avec erreur `Equipment with ID <id> not found`  
- **Tests liés :** should throw if equipment not found

#### 2.13.5 — DG-MDL-005 · Conflit de nature d’équipement entre deux plongeurs
- **Pré-requis :** deux équipements en base avec même nature (ex. `bottle`), assignés à deux divers différents  
- **Étapes :** créer un groupe avec `rentedEquipment` où chaque diver loue un équipement de nature identique, puis `save()`  
- **Résultats attendus :** échec `save()` avec erreur `Equipment of nature bottle is already rented by another diver`  
- **Tests liés :** should throw if two divers have same equipment nature




## Suite de non-régression – Backend (Node/Express + MongoDB)

### Environnement & données (commun)
- **Env** : Node 20, Express, MongoDB 7 (instance de test), Jest.
- **Seeds minimales** :
  - 1 utilisateur **admin**
  - 1 utilisateur **staff**
  - 1 bateau (capacité = 8)
  - Spots de base
  - Équipements : quelques références (dont 2 de même nature pour tests de conflit).
  - Plongeurs / Palanquées : quelques docs de base.
  - Tokens **valide** et **expiré**
- **Critère de passage** : 100% des cas NR **OK** (blocage déploiement si échec).



---

### Authentification
- AUTH-LOGIN-001 / 002 / 003
- AUTH-VERIFY-001
- AUTH-LOGOUT-001

---

### Availability (disponibilités)
- AVAIL-001 à AVAIL-007

---

### Boats (CRUD)
- BOAT-001 à BOAT-009

---

### Dashboard (today / weekly + service)
- DASH-001, DASH-002
- DASH-003, DASH-004
- DASH-SVC-001, DASH-SVC-002

---

### Dives (règles métier + service)
- DIVE-CRT-001 à DIVE-CRT-009
- DIVE-SVC-001 à DIVE-SVC-005

---

### Divers (CRUD + bulk)
- DIVER-CRT-001 à DIVER-CRT-009

---

### DivingGroups (CRUD + service)
- DIVGRP-CRT-001 à DIVGRP-006
- DIVGRP-SVC-001 à DIVGRP-SVC-005

---

### Equipment (CRUD + multiple)
- EQUIP-CRT-001 à EQUIP-CRT-009

---

### Spots (CRUD)
- SPOT-CRT-001 à SPOT-CRT-012

---

### Tasks (CRUD + service)
- TASK-CRT-001 à TASK-CRT-008
- TASK-SVC-001 à TASK-SVC-004

---

### Users (CRUD + current user)
- USER-CRT-001 à USER-CRT-012
- USER-SVC-001 à USER-SVC-005

---

### Middleware Auth (token/role)
- AUTHMW-001 à AUTHMW-008

---

### Middleware User (hash/email unique)
- USRMW-ENC-001 à USRMW-ENC-003
- USRMW-EMAIL-001 à USRMW-EMAIL-003

---

### Modèle DivingGroup (validations critiques)
- DG-MDL-001 à DG-MDL-005






### Matrice de traçabilité

| Feature / US                        | Scénario(x)                                               | Tests auto (fichier/spec)                                       | Type              | Priorité |
|--------------------------------------|----------------------------------------------------------|-----------------------------------------------------------------|-------------------|----------|
| Auth – Login / Logout / Verify       | AUTH-LOGIN-001/002/003, AUTH-VERIFY-001, AUTH-LOGOUT-001 | auth.controller.spec.ts, auth.service.spec.ts                   | Sécurité / Fonc   | P1       |
| Availability – Disponibilités        | AVAIL-001..007                                           | availability.controller.spec.ts, availability.service.spec.ts   | Fonctionnel       | P2       |
| Boats – CRUD                         | BOAT-001..009                                            | boat.controller.spec.ts, boat.service.spec.ts                   | Fonctionnel       | P1       |
| Dashboard – Today / Weekly + Service | DASH-001..004, DASH-SVC-001..002                         | dashboard.controller.spec.ts, dashboard.service.spec.ts         | Fonctionnel       | P2       |
| Dives – Règles métier + CRUD svc     | DIVE-CRT-001..009, DIVE-SVC-001..005                     | dive.controller.spec.ts, dive.service.spec.ts                   | Structurel / Fonc | P1       |
| Divers – CRUD + bulk                 | DIVER-CRT-001..009                                       | diver.controller.spec.ts, diver.service.spec.ts                 | Fonctionnel       | P2       |
| Diving Groups – CRUD + service       | DIVGRP-CRT-001..006, DIVGRP-SVC-001..005                 | divingGroup.controller.spec.ts, divingGroup.service.spec.ts     | Fonctionnel       | P2       |
| Equipment – CRUD (+ multiple)        | EQUIP-CRT-001..009                                       | equipment.controller.spec.ts, equipment.service.spec.ts         | Fonctionnel       | P2       |
| Spots – CRUD                         | SPOT-CRT-001..012                                        | spot.controller.spec.ts, spot.service.spec.ts                   | Fonctionnel       | P2       |
| Tasks – CRUD + service               | TASK-CRT-001..008, TASK-SVC-001..004                     | task.controller.spec.ts, task.service.spec.ts                   | Fonctionnel       | P2       |
| Users – CRUD + current user          | USER-CRT-001..012, USER-SVC-001..005                     | user.controller.spec.ts, user.service.spec.ts                   | Fonctionnel       | P2       |
| Middleware Auth (token / role)       | AUTHMW-001..008                                          | auth.middleware.spec.ts                                         | Sécurité          | P1       |
| Middleware User (hash / email unique)| USRMW-ENC-001..003, USRMW-EMAIL-001..003                 | user.middleware.spec.ts                                         | Sécurité          | P1       |
| Modèle DivingGroup – validations     | DG-MDL-001..005                                          | divingGroup.model.spec.ts                                       | Structurel        | P1       |



## 5. Annexes – Sécurité & Cas négatifs

- **Accès API sans token** → 401 non autorisé
- **Accès avec rôle insuffisant** → 403 interdit
- **Tentative de suppression sur ressource inexistante** → 404
- **Token expiré** → 401 + message clair
- **Conflit sur ressource unique** (email déjà pris, nature d’équipement déjà louée) → 409
