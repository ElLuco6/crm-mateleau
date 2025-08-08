# Cahier de Recettes – Application Node/Express + Angular + MongoDB

## Contexte & périmètre général
- **Technologies** : Backend Node/Express, Frontend Angular, Base MongoDB
- **Modules couverts** : Authentification, Gestion des plongées, Gestion du matériel, Gestion des utilisateurs, Disponibilités, Spots, etc.
- **Type de tests** : Fonctionnels, Structurels, Sécurité
- **Source de scénarios** : dérivés des tests automatisés Jest (backend) + Karma/Jasmine (frontend)

---

Cahier de Recettes – Authentification
Modules concernés : AuthController, AuthService
Fonctionnalités couvertes : Connexion, Déconnexion, Vérification de token JWT
Environnement : Backend Node/Express démarré, MongoDB opérationnel
Données de test :

Utilisateur existant : test@example.com / password123

Utilisateur inexistant : unknown@example.com

AUTH-LOGIN-001 – Connexion réussie
Pré-requis : Backend démarré, utilisateur existant test@example.com / password123
Étapes :

Envoyer une requête POST /login avec email et mot de passe valides

Observer la réponse et les cookies
Résultat attendu :

HTTP 200

Cookies token, userId, role créés

JSON contenant message, token, userId et role
Statut : OK / KO
Tests liés : AuthController (login success), AuthService (login success)

AUTH-LOGIN-002 – Connexion avec email inconnu
Pré-requis : Aucun utilisateur unknown@example.com en base
Étapes :

Envoyer une requête POST /login avec email inconnu

Observer la réponse
Résultat attendu :

HTTP 400

JSON : { "message": "Invalid email or password" }

Aucun cookie créé
Statut : OK / KO
Tests liés : AuthController (login error), AuthService (user not found)

AUTH-LOGIN-003 – Connexion avec mot de passe invalide
Pré-requis : Utilisateur test@example.com existant
Étapes :

Envoyer une requête POST /login avec mauvais mot de passe

Observer la réponse
Résultat attendu :

HTTP 400

JSON : { "message": "Invalid email or password" }

Aucun cookie créé
Statut : OK / KO
Tests liés : AuthService (invalid password)

AUTH-VERIFY-001 – Vérification de token valide
Pré-requis : Token JWT valide généré par l'application
Étapes :

Appeler AuthService.verifyToken(token)
Résultat attendu :

Retour payload du token avec id et role
Statut : OK / KO
Tests liés : AuthService (verify token)

AUTH-LOGOUT-001 – Déconnexion
Pré-requis : Session active avec cookies token, userId, role
Étapes :

Envoyer une requête POST /logout
Résultat attendu :

HTTP 200

Cookies token, userId, role supprimés

JSON : { "message": "Logged out successfully" }
Statut : OK / KO
Tests liés : AuthController (logout success)

Cahier de Recettes – Availability
Modules concernés : AvailabilityController, AvailabilityService
Fonctionnalités couvertes : Récupération des bateaux, palanquées, plongeurs, équipements et utilisateurs disponibles en fonction d’une date et d’une durée.
Environnement : Backend Node/Express démarré, MongoDB opérationnel

AVAIL-001 – Paramètres manquants (tous endpoints)
Pré-requis : Aucun spécifique
Étapes :

Appeler un des endpoints /availableBoats, /availableDivingGroups, /availableEquipment, /availableDivers, /availableUsers avec uniquement date dans la query (sans duration)

Observer la réponse
Résultat attendu :

HTTP 400

JSON : { "message": "Date and duration are required" }
Statut : OK / KO
Tests liés : AvailabilityController – should return 400 if date or duration missing

AVAIL-002 – Récupération des bateaux disponibles
Pré-requis : Données en base avec au moins un bateau occupé et un libre à la date donnée
Étapes :

Appeler GET /availableBoats?date=2025-08-06&duration=60

Observer la réponse
Résultat attendu :

HTTP 200

Liste des bateaux dont l’_id n’est pas dans les plongées en cours à la date donnée

Format : tableau d’objets { _id, ... }
Statut : OK / KO
Tests liés : AvailabilityController – available data from service, AvailabilityService – getAvailableBoats

AVAIL-003 – Récupération des palanquées disponibles
Pré-requis : Données en base avec au moins une palanquée libre
Étapes :

Appeler GET /availableDivingGroups?date=2025-08-06&duration=60
Résultat attendu :

HTTP 200

Liste des palanquées libres à la date donnée
Statut : OK / KO
Tests liés : AvailabilityController – available data from service, AvailabilityService – getAvailableDivingGroups

AVAIL-004 – Récupération des plongeurs disponibles
Pré-requis : Données en base avec plongeurs occupés et libres
Étapes :

Appeler GET /availableDivers?date=2025-08-06&duration=60
Résultat attendu :

HTTP 200

Liste des plongeurs libres à la date donnée
Statut : OK / KO
Tests liés : AvailabilityController – available data from service, AvailabilityService – getAvailableDivers

AVAIL-005 – Récupération du matériel disponible
Pré-requis : Données en base avec équipements occupés et libres
Étapes :

Appeler GET /availableEquipment?date=2025-08-06&duration=60
Résultat attendu :

HTTP 200

Liste des équipements libres à la date donnée
Statut : OK / KO
Tests liés : AvailabilityController – available data from service, AvailabilityService – getAvailableEquipment

AVAIL-006 – Récupération des utilisateurs disponibles
Pré-requis : Données en base avec utilisateurs occupés et libres
Étapes :

Appeler GET /availableUsers?date=2025-08-06&duration=60
Résultat attendu :

HTTP 200

Liste des utilisateurs libres à la date donnée
Statut : OK / KO
Tests liés : AvailabilityController – available data from service, AvailabilityService – getAvailableUsers

AVAIL-007 – Erreur service (tous endpoints)
Pré-requis : Forcer une erreur dans le service (ex. indisponibilité DB)
Étapes :

Appeler un des endpoints /available... avec paramètres corrects
Résultat attendu :

HTTP 500

JSON : { "message": "<erreur renvoyée par le service>" }
Statut : OK / KO
Tests liés : AvailabilityController – should return 500 on service error

Cahier de Recettes – Boat
Modules concernés : BoatController, BoatService
Fonctionnalités couvertes : CRUD complet sur les bateaux (création, lecture, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

BOAT-001 – Création d’un bateau – Succès
Pré-requis : Backend démarré
Étapes :

Envoyer une requête POST /boats avec un body valide, ex. { "name": "Test Boat" }
Résultat attendu :

HTTP 201

JSON contenant les infos du bateau créé
Statut : OK / KO
Tests liés : BoatController – createBoat (success), BoatService – createBoat

BOAT-002 – Création d’un bateau – Erreur service
Pré-requis : Backend démarré, service indisponible ou erreur simulée
Étapes :

Envoyer une requête POST /boats avec un body valide
Résultat attendu :

HTTP 500

JSON { "message": "DB error" }
Statut : OK / KO
Tests liés : BoatController – createBoat (error)

BOAT-003 – Récupération de tous les bateaux
Pré-requis : Backend démarré, base contenant au moins un bateau
Étapes :

Envoyer une requête GET /boats
Résultat attendu :

HTTP 200

JSON : tableau de bateaux
Statut : OK / KO
Tests liés : BoatController – getAllBoats, BoatService – getAllBoats

BOAT-004 – Récupération d’un bateau par ID – Succès
Pré-requis : Bateau existant avec ID connu
Étapes :

Envoyer une requête GET /boats/{id}
Résultat attendu :

HTTP 200

JSON contenant les infos du bateau correspondant
Statut : OK / KO
Tests liés : BoatController – getBoatById (found), BoatService – getBoatById

BOAT-005 – Récupération d’un bateau par ID – Non trouvé
Pré-requis : Aucun bateau avec l’ID demandé
Étapes :

Envoyer une requête GET /boats/{id}
Résultat attendu :

HTTP 404

JSON { "message": "Boat not found" }
Statut : OK / KO
Tests liés : BoatController – getBoatById (not found)

BOAT-006 – Mise à jour d’un bateau – Succès
Pré-requis : Bateau existant avec ID connu
Étapes :

Envoyer une requête PUT /boats/{id} avec un body valide, ex. { "name": "Updated Boat" }
Résultat attendu :

HTTP 200

JSON contenant les nouvelles infos du bateau
Statut : OK / KO
Tests liés : BoatController – updateBoat (success), BoatService – updateBoat

BOAT-007 – Mise à jour d’un bateau – Non trouvé
Pré-requis : Aucun bateau avec l’ID demandé
Étapes :

Envoyer une requête PUT /boats/{id} avec un body valide
Résultat attendu :

HTTP 404

JSON { "message": "Boat not found" }
Statut : OK / KO
Tests liés : BoatController – updateBoat (not found)

BOAT-008 – Suppression d’un bateau – Succès
Pré-requis : Bateau existant avec ID connu
Étapes :

Envoyer une requête DELETE /boats/{id}
Résultat attendu :

HTTP 200

JSON { "message": "Boat deleted successfully" }
Statut : OK / KO
Tests liés : BoatController – deleteBoat (success), BoatService – deleteBoat

BOAT-009 – Suppression d’un bateau – Non trouvé
Pré-requis : Aucun bateau avec l’ID demandé
Étapes :

Envoyer une requête DELETE /boats/{id}
Résultat attendu :

HTTP 404

JSON { "message": "Boat not found" }
Statut : OK / KO
Tests liés : BoatController – deleteBoat (not found)

Cahier de Recettes – Dashboard
Modules concernés : DashboardController, DashboardService
Fonctionnalités couvertes : Récap “Aujourd’hui” et “Semaine” (plongées, matériel à réviser, bateaux à réviser)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

DASH-001 – Récupérer le tableau de bord du jour – Succès
Pré-requis : Backend démarré
Étapes :

Appeler GET /dashboard/today (ou l’endpoint équivalent exposé par le contrôleur)

Observer la réponse JSON
Résultat attendu :

HTTP 200 (implicite si non spécifié)

JSON contenant trois clés :

dives : liste d’objets de plongée (ex. [{ id: "d1" }])

equipmentToReview : liste d’équipements à réviser (ex. [{ id: "e1" }])

boatsToReview : liste de bateaux à réviser (ex. [{ id: "b1" }])
Statut : OK / KO
Tests liés : DashboardController – getTodayDashboard (success), DashboardService – getTodayDashboardData (assemble data)

DASH-002 – Récupérer le tableau de bord du jour – Erreur service
Pré-requis : Simuler une erreur côté service (ex. rejet de promesse)
Étapes :

Appeler GET /dashboard/today

Observer la réponse
Résultat attendu :

HTTP 500

JSON : { "message": "Erreur serveur" }
Statut : OK / KO
Tests liés : DashboardController – getTodayDashboard (service error)

DASH-003 – Récupérer le tableau de bord de la semaine – Succès
Pré-requis : Backend démarré
Étapes :

Appeler GET /dashboard/weekly (ou l’endpoint équivalent)

Observer la réponse JSON
Résultat attendu :

HTTP 200 (implicite si non spécifié)

JSON contenant trois clés :

dives : liste d’objets de plongée (ex. [{ id: "dW" }])

equipmentToReview : liste d’équipements à réviser (ex. [{ id: "eW" }])

boatsToReview : liste de bateaux à réviser (ex. [{ id: "bW" }])
Statut : OK / KO
Tests liés : DashboardController – getWeeklyDashboard (success), DashboardService – getWeeklyDashboardData (assemble data)

DASH-004 – Récupérer le tableau de bord de la semaine – Erreur service
Pré-requis : Simuler une erreur côté service (ex. rejet de promesse)
Étapes :

Appeler GET /dashboard/weekly

Observer la réponse
Résultat attendu :

HTTP 500

JSON : { "message": "Erreur serveur" }
Statut : OK / KO
Tests liés : DashboardController – getWeeklyDashboard (service error)

DASH-SVC-001 – Agrégation des données “Aujourd’hui” (service)
Pré-requis : Aucune donnée spécifique requise ; mocks des modèles Dive, Equipment, Boat configurés
Étapes :

Appeler la fonction getTodayDashboardData() du service

Vérifier les appels effectués :

Dive.find() avec enchaînement de populate (boat/driver/divingGroups…)

Equipment.find()

Boat.find()
Résultat attendu :

Retour d’un objet : { dives: [...], equipmentToReview: [...], boatsToReview: [...] }
Statut : OK / KO
Tests liés : DashboardService – should fetch today dashboard data

DASH-SVC-002 – Agrégation des données “Semaine” (service)
Pré-requis : Mêmes mocks que ci-dessus
Étapes :

Appeler la fonction getWeeklyDashboardData() du service

Vérifier les appels effectués :

Dive.find() + populate

Equipment.find()

Boat.find()
Résultat attendu :

Retour d’un objet : { dives: [...], equipmentToReview: [...], boatsToReview: [...] }
Statut : OK / KO
Tests liés : DashboardService – should fetch weekly dashboard data

Suite non-régression – Dashboard

DASH-001 / DASH-002

DASH-003 / DASH-004

DASH-SVC-001 / DASH-SVC-002


Cahier de Recettes – Dive
Modules concernés : DiveController, DiveService
Fonctionnalités couvertes : validations de création de plongée, disponibilité, niveaux, capacité bateau, CRUD complet (création, liste, détail, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

DIVE-CRT-001 – Refus si endDate < date
Pré-requis : aucun
Étapes : créer une plongée avec endDate antérieure à date
Attendu : HTTP 400 ; message « endDate must be after date »
Tests liés : DiveController – should return 400 if endDate is before date

DIVE-CRT-002 – Refus si bateau introuvable
Pré-requis : aucun bateau avec l’ID fourni
Étapes : créer une plongée avec boat inexistant
Attendu : HTTP 404 ; message « Boat not found »
Tests liés : DiveController – 404 if boat is not found

DIVE-CRT-003 – Refus si pilote (driver) introuvable
Pré-requis : aucun user avec l’ID driver
Étapes : créer une plongée avec driver inexistant
Attendu : HTTP 404 ; message « Driver not found »
Tests liés : DiveController – 404 if driver is not found

DIVE-CRT-004 – Refus si palanquées manquantes
Pré-requis : aucun DivingGroup correspondant aux IDs fournis
Étapes : créer une plongée avec des IDs de palanquées inexistants
Attendu : HTTP 404 ; message « One or more diving groups not found »
Tests liés : DiveController – 404 if diving groups are missing

DIVE-CRT-005 – Refus si le driver est dans une palanquée
Pré-requis : au moins une palanquée qui contient le driver dans ses divers
Étapes : créer une plongée avec ce driver
Attendu : HTTP 400 ; message « Driver cannot be part of a diving group »
Tests liés : DiveController – 400 if driver is part of a diving group

DIVE-CRT-006 – Refus si capacité bateau dépassée
Pré-requis : bateau avec numberMaxPlaces faible ; groupes contenant plus de personnes que la capacité (guide + divers + driver comptés)
Étapes : créer une plongée dépassant la capacité
Attendu : HTTP 400 ; message « The number of people exceeds the maximum capacity of the boat »
Tests liés : DiveController – 400 if too many people for the boat

DIVE-CRT-007 – Refus si niveau plongeur insuffisant
Pré-requis : au moins un Diver avec divingLvl trop bas pour maxDepth ; récupérer son prénom (ex. Jean)
Étapes : créer une plongée avec ce(s) plongeur(s)
Attendu : HTTP 400 ; message « Diver Jean does not have the required diving level for this depth »
Tests liés : DiveController – 400 if a diver has insufficient level

DIVE-CRT-008 – Refus si chevauchement horaire (indisponibilités)
Pré-requis : une autre plongée existante sur le créneau (même bateau/driver/groupe indisponibles)
Étapes : créer une plongée sur le même intervalle
Attendu : HTTP 400 ; message « Boat, driver, or diving groups are not available during this period »
Tests liés : DiveController – 400 if overlapping dive exists

DIVE-CRT-009 – Création de plongée réussie
Pré-requis : bateau existant et assez de places, driver existant et non présent dans une palanquée, palanquées existantes, aucun chevauchement, niveaux conformes
Étapes : créer une plongée valide (name, location, date, endDate, maxDepth, divingGroups, boat, driver)
Attendu : HTTP 201 ; corps JSON = plongée créée (ex. id/newDive)
Tests liés : DiveController – create dive if all checks pass ; DiveService – createDive

DIVE-SVC-001 – Service : création et sauvegarde d’une plongée
Pré-requis : aucun
Étapes : appeler DiveService.createDive(payload minimal valide)
Attendu : renvoie l’objet créé avec _id ; save() appelé
Tests liés : DiveService – create and save a new dive

DIVE-SVC-002 – Service : liste de toutes les plongées (populate)
Pré-requis : données en base
Étapes : appeler DiveService.getAllDives()
Attendu : appel Dive.find().populate('divingGroups boat driver') ; renvoie la liste
Tests liés : DiveService – return all dives with population

DIVE-SVC-003 – Service : détail d’une plongée (populate)
Pré-requis : id existant
Étapes : appeler DiveService.getDiveById(id)
Attendu : appel FindById(id).populate('divingGroups boat driver') ; renvoie la plongée
Tests liés : DiveService – return dive by ID with population

DIVE-SVC-004 – Service : mise à jour d’une plongée (populate, new:true)
Pré-requis : id existant
Étapes : appeler DiveService.updateDive(id, payload)
Attendu : appel findByIdAndUpdate(id, payload, { new: true }).populate('divingGroups boat driver') ; renvoie la version mise à jour
Tests liés : DiveService – update dive and return new one with population

DIVE-SVC-005 – Service : suppression d’une plongée
Pré-requis : id existant
Étapes : appeler DiveService.deleteDive(id)
Attendu : appel findByIdAndDelete(id) ; renvoie l’objet supprimé
Tests liés : DiveService – delete dive by ID

Suite non-régression – Dive
À rejouer à chaque release ou refactor des règles métier :

DIVE-CRT-001 à DIVE-CRT-009 (tous les refus + la création OK)

DIVE-SVC-001 à DIVE-SVC-005 (CRUD service + populate)

Cahier de Recettes – Diver
Modules concernés : DiverController, DiverService
Fonctionnalités couvertes : CRUD plongeurs + création multiple
Environnement : Backend Node/Express démarré, MongoDB opérationnel

DIVER-CRT-001 – Créer un plongeur (succès)
Pré-requis : aucun
Étapes : POST /divers avec un body valide (ex. { firstName: "Jean", lastName: "Dupont" })
Attendu : HTTP 201 ; JSON = plongeur créé
Tests liés : DiverController – createDiver (success) ; DiverService – createDiver (save called)

DIVER-CRT-002 – Créer plusieurs plongeurs (succès)
Pré-requis : aucun
Étapes : POST /divers/bulk avec { divers: [{...}, {...}] }
Attendu : HTTP 201 ; JSON = liste des plongeurs insérés
Tests liés : DiverController – createMultipleDivers ; DiverService – createMultipleDivers (insertMany)

DIVER-CRT-003 – Lister tous les plongeurs
Pré-requis : base avec au moins un enregistrement
Étapes : GET /divers
Attendu : HTTP 200 ; JSON = tableau des plongeurs
Tests liés : DiverController – getAllDivers ; DiverService – getAllDivers

DIVER-CRT-004 – Obtenir un plongeur par ID (succès)
Pré-requis : ID existant (ex. 123)
Étapes : GET /divers/123
Attendu : HTTP 200 ; JSON = plongeur correspondant
Tests liés : DiverController – getDiverById (found) ; DiverService – getDiverById

DIVER-CRT-005 – Obtenir un plongeur par ID (non trouvé)
Pré-requis : ID inexistant (ex. 404)
Étapes : GET /divers/404
Attendu : HTTP 404 ; JSON { "message": "Diver not found" }
Tests liés : DiverController – getDiverById (not found)

DIVER-CRT-006 – Mettre à jour un plongeur (succès)
Pré-requis : ID existant (ex. 123)
Étapes : PUT /divers/123 avec body valide (ex. { firstName: "Updated" })
Attendu : HTTP 200 ; JSON = document mis à jour
Tests liés : DiverController – updateDiver (success) ; DiverService – updateDiver (findByIdAndUpdate new:true)

DIVER-CRT-007 – Mettre à jour un plongeur (non trouvé)
Pré-requis : ID inexistant (ex. 404)
Étapes : PUT /divers/404 avec body quelconque
Attendu : HTTP 404 ; JSON { "message": "Diver not found" }
Tests liés : DiverController – updateDiver (not found)

DIVER-CRT-008 – Supprimer un plongeur (succès)
Pré-requis : ID existant (ex. 123)
Étapes : DELETE /divers/123
Attendu : HTTP 200 ; JSON { "message": "Diver deleted successfully" }
Tests liés : DiverController – deleteDiver (success) ; DiverService – deleteDiver

DIVER-CRT-009 – Supprimer un plongeur (non trouvé)
Pré-requis : ID inexistant (ex. 404)
Étapes : DELETE /divers/404
Attendu : HTTP 404 ; JSON { "message": "Diver not found" }
Tests liés : DiverController – deleteDiver (not found)

Suite non-régression – Diver

DIVER-CRT-001 à DIVER-CRT-009 (toutes les opérations CRUD + bulk)


Cahier de Recettes – DivingGroup
Modules concernés : DivingGroupController, DivingGroupService
Fonctionnalités couvertes : CRUD palanquées (création, liste, détail, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

DIVGRP-CRT-001 – Créer une palanquée (succès)
Pré-requis : aucun (IDs guide/divers valides)
Étapes : POST /diving-groups avec body minimal valide (ex. guide: "g1", divers: ["d1"], equipmentAssignments: [])
Attendu : HTTP 201 ; JSON = palanquée créée (id/obj renvoyé)
Tests liés : DivingGroupController – createDivingGroup (success) ; DivingGroupService – createDivingGroup (save)

DIVGRP-CRT-002 – Lister toutes les palanquées
Pré-requis : base avec au moins une palanquée
Étapes : GET /diving-groups
Attendu : HTTP 200 ; JSON = tableau de palanquées
Tests liés : DivingGroupController – getAllDivingGroups ; DivingGroupService – getAllDivingGroups (populate "guide divers")

DIVGRP-CRT-003 – Obtenir une palanquée par ID (succès)
Pré-requis : ID existant (ex. 1)
Étapes : GET /diving-groups/1
Attendu : HTTP 200 ; JSON = palanquée correspondante
Tests liés : DivingGroupController – getDivingGroupById (found) ; DivingGroupService – getDivingGroupById (populate "guide divers")

DIVGRP-CRT-004 – Obtenir une palanquée par ID (non trouvé)
Pré-requis : ID inexistant
Étapes : GET /diving-groups/{id-inexistant}
Attendu : HTTP 404 ; JSON { "message": "Diving group not found" }
Tests liés : DivingGroupController – getDivingGroupById (not found)

DIVGRP-CRT-005 – Mettre à jour une palanquée (succès)
Pré-requis : ID existant
Étapes : PUT /diving-groups/1 avec body valide (ex. changement de guide ou des divers)
Attendu : HTTP 200 ; JSON = palanquée mise à jour
Tests liés : DivingGroupController – updateDivingGroup (success) ; DivingGroupService – updateDivingGroup (populate "guide divers")

DIVGRP-CRT-006 – Supprimer une palanquée (succès)
Pré-requis : ID existant
Étapes : DELETE /diving-groups/1
Attendu : HTTP 200 ; JSON { "message": "Diving group deleted successfully" }
Tests liés : DivingGroupController – deleteDivingGroup (success) ; DivingGroupService – deleteDivingGroup

DIVGRP-SVC-001 – Service : création (save)
Pré-requis : aucun
Étapes : appeler createDivingGroup(payload)
Attendu : save() appelé ; retour de l’objet créé (id)
Tests liés : DivingGroupService – createDivingGroup

DIVGRP-SVC-002 – Service : liste (populate)
Pré-requis : aucun
Étapes : appeler getAllDivingGroups()
Attendu : DivingGroup.find().populate("guide divers") ; renvoie la liste
Tests liés : DivingGroupService – getAllDivingGroups

DIVGRP-SVC-003 – Service : détail (populate)
Pré-requis : ID existant
Étapes : appeler getDivingGroupById(id)
Attendu : findById(id).populate("guide divers") ; renvoie la palanquée
Tests liés : DivingGroupService – getDivingGroupById

DIVGRP-SVC-004 – Service : mise à jour (populate, new:true)
Pré-requis : ID existant
Étapes : appeler updateDivingGroup(id, payload)
Attendu : findByIdAndUpdate(..., { new: true }).populate("guide divers") ; renvoie la version mise à jour
Tests liés : DivingGroupService – updateDivingGroup

DIVGRP-SVC-005 – Service : suppression
Pré-requis : ID existant
Étapes : appeler deleteDivingGroup(id)
Attendu : findByIdAndDelete(id) ; renvoie l’objet supprimé
Tests liés : DivingGroupService – deleteDivingGroup

Suite non-régression – DivingGroup

DIVGRP-CRT-001 à 006 (CRUD contrôleur)

DIVGRP-SVC-001 à 005 (CRUD service + populate)

Cahier de Recettes – Equipment
Modules concernés : EquipmentController, EquipmentService
Fonctionnalités couvertes : CRUD matériel (création, création multiple, liste, détail, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

EQUIP-CRT-001 – Créer un équipement (succès)
Pré-requis : aucun
Étapes :

POST /equipment avec body valide (reference, nature, nextMaintenanceDate)
Attendu : HTTP 201 + JSON équipement créé
Tests liés :

Controller : createEquipment (success)

Service : createEquipment (save)

EQUIP-CRT-002 – Créer plusieurs équipements (succès)
Pré-requis : aucun
Étapes :

POST /equipment/multiple avec body { equipment: [...] }
Attendu : HTTP 201 + JSON tableau équipements créés
Tests liés :

Controller : createMultipleEquipment (success)

Service : createMultipleEquipment (insertMany)

EQUIP-CRT-003 – Lister tous les équipements
Pré-requis : base avec au moins un équipement
Étapes :

GET /equipment
Attendu : HTTP 200 + JSON tableau des équipements
Tests liés :

Controller : getAllEquipment (success)

Service : getAllEquipment (find)

EQUIP-CRT-004 – Obtenir un équipement par ID (succès)
Pré-requis : ID existant
Étapes :

GET /equipment/{id}
Attendu : HTTP 200 + JSON équipement correspondant
Tests liés :

Controller : getEquipmentById (found)

Service : getEquipmentById (findById)

EQUIP-CRT-005 – Obtenir un équipement par ID (non trouvé)
Pré-requis : ID inexistant
Étapes :

GET /equipment/{id-inexistant}
Attendu : HTTP 404 + { "message": "Equipment not found" }
Tests liés :

Controller : getEquipmentById (not found)

EQUIP-CRT-006 – Mettre à jour un équipement (succès)
Pré-requis : ID existant
Étapes :

PUT /equipment/{id} avec body { reference: "Updated" }
Attendu : HTTP 200 + JSON équipement mis à jour
Tests liés :

Controller : updateEquipment (success)

Service : updateEquipment (findByIdAndUpdate)

EQUIP-CRT-007 – Mettre à jour un équipement (non trouvé)
Pré-requis : ID inexistant
Étapes :

PUT /equipment/{id-inexistant}
Attendu : HTTP 404 + { "message": "Equipment not found" }
Tests liés :

Controller : updateEquipment (not found)

EQUIP-CRT-008 – Supprimer un équipement (succès)
Pré-requis : ID existant
Étapes :

DELETE /equipment/{id}
Attendu : HTTP 200 + { "message": "Equipment deleted successfully" }
Tests liés :

Controller : deleteEquipment (success)

Service : deleteEquipment (findByIdAndDelete)

EQUIP-CRT-009 – Supprimer un équipement (non trouvé)
Pré-requis : ID inexistant
Étapes :

DELETE /equipment/{id-inexistant}
Attendu : HTTP 404 + { "message": "Equipment not found" }
Tests liés :

Controller : deleteEquipment (not found)


Cahier de Recettes – Spot
Modules concernés : SpotController, SpotService
Fonctionnalités couvertes : CRUD spots de plongée (création, liste, détail, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

SPOT-CRT-001 – Créer un spot (succès)
Pré-requis : aucun
Étapes :

POST /spots avec body valide (name, coordinates.lat, coordinates.lng)
Attendu : HTTP 201 + JSON du spot créé
Tests liés :

Controller : createSpot (success)

Service : createSpot (save)

SPOT-CRT-002 – Créer un spot (erreur)
Pré-requis : aucun
Étapes :

POST /spots avec body invalide
Attendu : HTTP 500 + { "message": "Erreur création Spot" }
Tests liés :

Controller : createSpot (error)

SPOT-CRT-003 – Lister tous les spots (succès)
Pré-requis : au moins un spot en base
Étapes :

GET /spots
Attendu : HTTP 200 + tableau JSON des spots
Tests liés :

Controller : getAllSpots (success)

Service : getAllSpots (find)

SPOT-CRT-004 – Lister tous les spots (erreur)
Pré-requis : aucun
Étapes :

GET /spots (provoquer une erreur)
Attendu : HTTP 500 + { "message": "Erreur récupération Spots" }
Tests liés :

Controller : getAllSpots (error)

SPOT-CRT-005 – Obtenir un spot par ID (succès)
Pré-requis : ID existant
Étapes :

GET /spots/{id}
Attendu : HTTP 200 + JSON spot correspondant
Tests liés :

Controller : getSpotById (found)

Service : getSpotById (findById)

SPOT-CRT-006 – Obtenir un spot par ID (non trouvé)
Pré-requis : ID inexistant
Étapes :

GET /spots/{id-inexistant}
Attendu : HTTP 404 + { "message": "Spot non trouvée" }
Tests liés :

Controller : getSpotById (not found)

SPOT-CRT-007 – Obtenir un spot par ID (erreur)
Pré-requis : aucun
Étapes :

GET /spots/{id} (provoquer une erreur)
Attendu : HTTP 500 + { "message": "Erreur récupération Spot" }
Tests liés :

Controller : getSpotById (error)

SPOT-CRT-008 – Mettre à jour un spot (succès)
Pré-requis : ID existant
Étapes :

PUT /spots/{id} avec body { name: "Updated" }
Attendu : HTTP 200 + JSON du spot mis à jour
Tests liés :

Controller : updateSpot (success)

Service : updateSpot (findByIdAndUpdate)

SPOT-CRT-009 – Mettre à jour un spot (non trouvé)
Pré-requis : ID inexistant
Étapes :

PUT /spots/{id-inexistant}
Attendu : HTTP 404 + { "message": "Spot non trouvée" }
Tests liés :

Controller : updateSpot (not found)

SPOT-CRT-010 – Mettre à jour un spot (erreur)
Pré-requis : aucun
Étapes :

PUT /spots/{id} (provoquer une erreur)
Attendu : HTTP 500 + { "message": "Erreur mise à jour Spot" }
Tests liés :

Controller : updateSpot (error)

SPOT-CRT-011 – Supprimer un spot (succès)
Pré-requis : ID existant
Étapes :

DELETE /spots/{id}
Attendu : HTTP 204 sans corps de réponse
Tests liés :

Controller : deleteSpot (success)

Service : deleteSpot (findByIdAndDelete)

SPOT-CRT-012 – Supprimer un spot (erreur)
Pré-requis : aucun
Étapes :

DELETE /spots/{id} (provoquer une erreur)
Attendu : HTTP 500 + { "message": "Erreur suppression Spot" }
Tests liés :

Controller : deleteSpot (error)

Cahier de Recettes – Task
Modules concernés : TaskController, TaskService
Fonctionnalités couvertes : CRUD tâches (liste, création, mise à jour, suppression)
Environnement : Backend Node/Express démarré, MongoDB opérationnel

TASK-CRT-001 – Lister toutes les tâches (succès)
Pré-requis : au moins une tâche en base (facultatif)
Étapes : GET /tasks
Attendu : HTTP 200 ; JSON = tableau des tâches
Tests liés : TaskController – getAllTasks (success) ; TaskService – getAllTasks (find)

TASK-CRT-002 – Lister toutes les tâches (erreur service)
Pré-requis : simuler une erreur service
Étapes : GET /tasks
Attendu : HTTP 500 ; JSON { "message": "Erreur lors de la récupération des tâches" }
Tests liés : TaskController – getAllTasks (error)

TASK-CRT-003 – Créer une tâche (succès)
Pré-requis : aucun
Étapes : POST /tasks avec body valide (ex. { "title": "New Task" })
Attendu : HTTP 201 ; JSON = tâche créée
Tests liés : TaskController – createTask (success) ; TaskService – createTask (save)

TASK-CRT-004 – Créer une tâche (erreur service)
Pré-requis : simuler une erreur service
Étapes : POST /tasks (ex. body { "title": "fail" } dans le test)
Attendu : HTTP 500 ; JSON { "message": "Erreur lors de la création de la tâche" }
Tests liés : TaskController – createTask (error)

TASK-CRT-005 – Mettre à jour une tâche (succès)
Pré-requis : ID existant (ex. 1)
Étapes : PUT /tasks/1 avec body { "title": "Updated Task" }
Attendu : HTTP 200 ; JSON = tâche mise à jour
Tests liés : TaskController – updateTask (success) ; TaskService – updateTask (findByIdAndUpdate new:true)

TASK-CRT-006 – Mettre à jour une tâche (erreur service)
Pré-requis : simuler une erreur service
Étapes : PUT /tasks/1
Attendu : HTTP 500 ; JSON { "message": "Erreur lors de la mise à jour de la tâche" }
Tests liés : TaskController – updateTask (error)

TASK-CRT-007 – Supprimer une tâche (succès)
Pré-requis : ID existant (ex. 1)
Étapes : DELETE /tasks/1
Attendu : HTTP 204 ; réponse vide (fin de réponse end())
Tests liés : TaskController – deleteTask (204 success) ; TaskService – deleteTask (findByIdAndDelete)

TASK-CRT-008 – Supprimer une tâche (erreur service)
Pré-requis : simuler une erreur service
Étapes : DELETE /tasks/1
Attendu : HTTP 500 ; JSON { "message": "Erreur lors de la suppression de la tâche" }
Tests liés : TaskController – deleteTask (error)

TASK-SVC-001 – Service : lister toutes les tâches
Étapes : appeler TaskService.getAllTasks()
Attendu : Task.find() appelé ; renvoie le tableau de tâches
Tests liés : TaskService – getAllTasks

TASK-SVC-002 – Service : créer une tâche
Étapes : appeler TaskService.createTask({ title: "Test" })
Attendu : new Task(...).save() appelé ; renvoie { id, title }
Tests liés : TaskService – createTask

TASK-SVC-003 – Service : mettre à jour une tâche
Étapes : appeler TaskService.updateTask('1', { title: 'Updated' })
Attendu : findByIdAndUpdate('1', { title: 'Updated' }, { new: true }) ; renvoie la tâche mise à jour
Tests liés : TaskService – updateTask

TASK-SVC-004 – Service : supprimer une tâche
Étapes : appeler TaskService.deleteTask('1')
Attendu : findByIdAndDelete('1') ; renvoie l’objet supprimé
Tests liés : TaskService – deleteTask

Suite non-régression – Task

TASK-CRT-001 à 008 (contrôleur)

TASK-SVC-001 à 004 (service)


Cahier de Recettes – User
Modules concernés : UserController, UserService
Fonctionnalités couvertes : CRUD utilisateurs + gestion utilisateur courant via cookie
Environnement : Backend Node/Express démarré, MongoDB opérationnel

USER-CRT-001 – Créer un utilisateur (succès)
Pré-requis : aucun
Étapes : POST /users avec body { "name": "Test" }
Attendu : HTTP 201 ; JSON { "id": "1" }
Tests liés : UserController – createUser (success) ; UserService – createUser (save)

USER-CRT-002 – Récupérer tous les utilisateurs (succès)
Pré-requis : au moins un utilisateur en base
Étapes : GET /users
Attendu : HTTP 200 ; JSON tableau des utilisateurs
Tests liés : UserController – getAllUsers (success) ; UserService – getAllUsers (find)

USER-CRT-003 – Récupérer un utilisateur par ID (succès)
Pré-requis : utilisateur existant (id = "1")
Étapes : GET /users/1
Attendu : HTTP 200 ; JSON { "id": "1" }
Tests liés : UserController – getOneUser (success) ; UserService – getUserById (findById)

USER-CRT-004 – Récupérer un utilisateur par ID (non trouvé)
Pré-requis : ID inexistant
Étapes : GET /users/unknown
Attendu : HTTP 404 ; JSON { "message": "User not found" }
Tests liés : UserController – getOneUser (404)

USER-CRT-005 – Récupérer l’utilisateur courant via cookie (succès)
Pré-requis : cookie userId valide
Étapes : GET /users/me
Attendu : HTTP 200 ; JSON { "id": "<cookie-id>" }
Tests liés : UserController – getCurrentUser (success)

USER-CRT-006 – Récupérer l’utilisateur courant via cookie (non trouvé)
Pré-requis : cookie userId invalide
Étapes : GET /users/me
Attendu : HTTP 404 ; JSON { "message": "User not found" }
Tests liés : UserController – getCurrentUser (404)

USER-CRT-007 – Mettre à jour l’utilisateur courant (succès)
Pré-requis : cookie userId valide
Étapes : PUT /users/me avec body { "name": "New" }
Attendu : HTTP 200 ; JSON { "id": "updated" }
Tests liés : UserController – updateCurrentUser (success) ; UserService – updateUser

USER-CRT-008 – Mettre à jour l’utilisateur courant (non trouvé)
Pré-requis : cookie userId invalide
Étapes : PUT /users/me
Attendu : HTTP 404 ; JSON { "message": "User not found" }
Tests liés : UserController – updateCurrentUser (404)

USER-CRT-009 – Mettre à jour un utilisateur par ID (succès)
Pré-requis : ID existant (1)
Étapes : PUT /users/1 avec body { "name": "Updated" }
Attendu : HTTP 200 ; JSON { "id": "updated" }
Tests liés : UserController – updateUser (success) ; UserService – updateUser

USER-CRT-010 – Mettre à jour un utilisateur par ID (non trouvé)
Pré-requis : ID inexistant
Étapes : PUT /users/1
Attendu : HTTP 404 ; JSON { "message": "User not found" }
Tests liés : UserController – updateUser (404)

USER-CRT-011 – Supprimer un utilisateur par ID (succès)
Pré-requis : ID existant (1)
Étapes : DELETE /users/1
Attendu : HTTP 200 ; JSON { "message": "User deleted successfully" }
Tests liés : UserController – deleteUser (success) ; UserService – deleteUser

USER-CRT-012 – Supprimer un utilisateur par ID (non trouvé)
Pré-requis : ID inexistant
Étapes : DELETE /users/1
Attendu : HTTP 404 ; JSON { "message": "User not found" }
Tests liés : UserController – deleteUser (404)

USER-SVC-001 – Service : création utilisateur
Étapes : UserService.createUser({ name: "Lucas" })
Attendu : new User(...).save() ; renvoie { id, name }

USER-SVC-002 – Service : récupération de tous les utilisateurs
Étapes : UserService.getAllUsers()
Attendu : User.find() appelé ; renvoie tableau des utilisateurs

USER-SVC-003 – Service : récupération utilisateur par ID
Étapes : UserService.getUserById('1')
Attendu : User.findById('1') ; renvoie utilisateur

USER-SVC-004 – Service : mise à jour utilisateur
Étapes : UserService.updateUser('1', { name: 'Updated' })
Attendu : User.findByIdAndUpdate('1', { name: 'Updated' }, { new: true }) ; renvoie utilisateur MAJ

USER-SVC-005 – Service : suppression utilisateur
Étapes : UserService.deleteUser('1')
Attendu : User.findByIdAndDelete('1') ; renvoie utilisateur supprimé

Cahier de Recettes – Middleware d’authentification
Modules concernés : authenticateToken, checkAdminRole (authMiddleware)
Dépendances : AuthService.verifyToken, User (Mongo)
Environnement : Backend Node/Express démarré, cookies actifs

AUTHMW-001 – Requête sans token → 401
Pré-requis : aucun
Étapes : requête avec cookies vides vers une route protégée (middleware authenticateToken)
Attendu : HTTP 401 ; next() non appelé
Tests liés : authenticateToken should return 401 if no token

AUTHMW-002 – Token valide mais utilisateur inexistant → 401
Pré-requis : verifyToken renvoie { id: 'user-id' }, User.findById renvoie null
Étapes : requête avec cookie token présent
Attendu : HTTP 401 ; next() non appelé
Tests liés : authenticateToken should return 401 if user not found

AUTHMW-003 – Échec vérification du token → 403
Pré-requis : verifyToken lève une erreur (“Invalid token”)
Étapes : requête avec cookie token invalide
Attendu : HTTP 403 ; next() non appelé
Tests liés : authenticateToken should return 403 on token verification failure

AUTHMW-004 – Token valide + utilisateur trouvé → attacher l’utilisateur et next()
Pré-requis : verifyToken → { id: 'user-id' }, User.findById → objet user
Étapes : requête avec cookie token valide ; passer dans authenticateToken
Attendu : l’utilisateur est attaché à req.body.user ; next() appelé
Tests liés : authenticateToken should attach user and call next if valid

AUTHMW-005 – Vérification rôle admin : cookies absents → 401
Pré-requis : aucun
Étapes : requête sans userId/role dans cookies ; passer dans checkAdminRole
Attendu : HTTP 401 ; next() non appelé
Tests liés : checkAdminRole should return 401 if no userId or role

AUTHMW-006 – Vérification rôle admin : utilisateur non admin → 403
Pré-requis : cookies { userId: 'user-id', role: 'user' }, User.findById → { role: 'user' }
Étapes : passer dans checkAdminRole
Attendu : HTTP 403 ; next() non appelé
Tests liés : checkAdminRole should return 403 if user is not admin

AUTHMW-007 – Vérification rôle admin : utilisateur admin → next()
Pré-requis : cookies { userId: 'admin-id', role: 'admin' }, User.findById → { role: 'admin' }
Étapes : passer dans checkAdminRole
Attendu : next() appelé (pas d’erreur HTTP)
Tests liés : checkAdminRole should call next if user is admin

AUTHMW-008 – Vérification rôle admin : erreur base de données → 403
Pré-requis : cookies { userId: 'admin-id', role: 'admin' }, User.findById rejette (“DB error”)
Étapes : passer dans checkAdminRole
Attendu : HTTP 403 ; next() non appelé
Tests liés : checkAdminRole should return 403 on database error

Suite non-régression – Middleware

AUTHMW-001 à AUTHMW-004 (authentification par token)

AUTHMW-005 à AUTHMW-008 (contrôle de rôle admin)


Cahier de Recettes – Middleware Utilisateur
Modules concernés : encryptPassword, checkEmailUnique (userMiddleware)
Dépendances : bcrypt.hash, User.findOne
Environnement : Backend Node/Express démarré

USRMW-ENC-001 – Hachage du mot de passe (succès)
Pré-requis : body contient password: "plainPassword"
Étapes : passer la requête dans encryptPassword
Attendu : bcrypt.hash appelé avec "plainPassword", 10 ; req.body.password remplacé par "hashedPassword" ; next() appelé
Tests liés : encryptPassword should hash the password and call next

USRMW-ENC-002 – Mot de passe manquant → 400
Pré-requis : body sans password
Étapes : passer la requête dans encryptPassword
Attendu : HTTP 400 ; JSON { "message": "Password is required" } ; next() non appelé
Tests liés : encryptPassword should return 400 if no password provided

USRMW-ENC-003 – Erreur de hachage → next(err)
Pré-requis : bcrypt.hash rejette une erreur
Étapes : passer la requête dans encryptPassword
Attendu : next(error) appelé (propagation de l’erreur)
Tests liés : encryptPassword should call next with error on failure

USRMW-EMAIL-001 – Email unique → next()
Pré-requis : body email: "test@example.com" ; User.findOne renvoie null
Étapes : passer la requête dans checkEmailUnique
Attendu : User.findOne({ email }) appelé ; next() appelé
Tests liés : checkEmailUnique should call next if email is unique

USRMW-EMAIL-002 – Email déjà existant → 400
Pré-requis : body email: "test@example.com" ; User.findOne renvoie un document
Étapes : passer la requête dans checkEmailUnique
Attendu : HTTP 400 ; JSON { "message": "Email already exists" } ; next() non appelé
Tests liés : checkEmailUnique should return 400 if email already exists

USRMW-EMAIL-003 – Erreur base de données → next(err)
Pré-requis : User.findOne rejette une erreur
Étapes : passer la requête dans checkEmailUnique
Attendu : next(error) appelé (propagation de l’erreur)
Tests liés : checkEmailUnique should call next with error on failure

Suite non-régression – Middleware Utilisateur

USRMW-ENC-001 à 003 (chiffrement mot de passe)

USRMW-EMAIL-001 à 003 (unicité email)

Cahier de Recettes – Modèle DivingGroup
Modules concernés : Modèle Mongoose `DivingGroup` (hooks/validations)
Dépendances : Modèle `Equipment` (référence par IDs)
Environnement : MongoDB local (db de test), Mongoose connecté (tests E2E modèle)

---

DG-MDL-001 – Calcul automatique de la taille du groupe (groupSize)
Pré-requis : guide défini, deux divers dans la liste
Étapes : créer un document DivingGroup avec 1 guide et 2 divers puis save()
Attendu : groupSize = 3 (guide + 2 divers)
Tests liés : should calculate groupSize and save a valid group

DG-MDL-002 – Taille maximale du groupe (refus > 5)
Pré-requis : guide défini, 5 divers dans la liste (total 6)
Étapes : créer puis save()
Attendu : échec save avec erreur « Group size cannot exceed 5 members »
Tests liés : should throw if group size exceeds 5

DG-MDL-003 – Unicité des plongeurs (pas de doublons)
Pré-requis : même diverId présent deux fois dans divers
Étapes : créer puis save()
Attendu : échec save avec erreur « Divers must be unique »
Tests liés : should throw if there are duplicate divers

DG-MDL-004 – Références d’équipement valides (existence en base)
Pré-requis : aucun Equipment correspondant aux equipmentIds fournis (base vidée)
Étapes : ajouter rentedEquipment pour un diver avec un equipmentId inexistant, puis save()
Attendu : échec save avec erreur « Equipment with ID <id> not found »
Tests liés : should throw if equipment not found

DG-MDL-005 – Conflit de nature d’équipement entre deux plongeurs
Pré-requis : deux équipements en base avec même nature (ex. bottle), assignés à deux divers différents
Étapes : créer un groupe avec rentedEquipment où chaque diver loue un equipement de nature identique, puis save()
Attendu : échec save avec erreur « Equipment of nature bottle is already rented by another diver »
Tests liés : should throw if two divers have same equipment nature

---

Suite non-régression – Modèle DivingGroup

* DG-MDL-001 à DG-MDL-005 (calculs et validations critiques du schéma)

