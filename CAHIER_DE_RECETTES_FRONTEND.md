# Cahier de Recettes – Application Node/Express + Angular + MongoDB

## Contexte & périmètre général
- **Technologies** : Backend Node/Express, Frontend Angular, Base MongoDB
- **Modules couverts** : Authentification, Gestion des plongées, Gestion du matériel, Gestion des utilisateurs, Disponibilités, Spots, etc.
- **Type de tests** : Fonctionnels, Structurels, Sécurité
- **Source de scénarios** : dérivés des tests automatisés Jest (backend) + Karma/Jasmine (frontend)



Cahier de Recettes – Front (Angular) – AuthService
Modules concernés : `AuthService` (Angular)
Fonctionnalités couvertes : login, logout, register (HTTP + gestion `localStorage`)
Environnement : Angular + HttpClient, `environment.apiAuth`, `environment.apiUsers`, `withCredentials: true` pour auth

---

FRONT-AUTH-001 – Login : stocker token / userId / role
Pré-requis : backend accessible, `environment.apiAuth` configuré
Étapes :

1. Appeler `AuthService.login('test@example.com','password123')`
   Attendu :

* Requête HTTP : `POST ${environment.apiAuth}login` avec `withCredentials: true`
* Réponse JSON contient `{ token, userId, role }`
* `localStorage` mis à jour : `token`, `userId`, `role` présents et égaux à la réponse
  Statut : OK / KO
  Tests liés : `should login and store token, userId, and role in localStorage`

---

FRONT-AUTH-002 – Logout : vider le localStorage
Pré-requis : `localStorage` contient `token`, `userId`, `role`
Étapes :

1. Appeler `AuthService.logout()`
   Attendu :

* Requête HTTP : `POST ${environment.apiAuth}logout`
* `localStorage` ne contient plus `token`, `userId`, `role` (clefs supprimées)
* Réponse HTTP sans contenu (corps vide) acceptable
  Statut : OK / KO
  Tests liés : `should logout and clear localStorage`

---

FRONT-AUTH-003 – Register : créer un utilisateur
Pré-requis : objet `User` complet (ex : `_id, email, name, password, role, divingLvl`)
Étapes :

1. Appeler `AuthService.register(user)`
   Attendu :

* Requête HTTP : `POST ${environment.apiUsers}` avec le body = objet `user` fourni
* Réponse JSON = l’utilisateur créé (miroir du body ou avec `_id`)
  Statut : OK / KO
  Tests liés : `should register a new user`

---




Cahier de Recettes – Front (Angular) – AvailibilityService
Modules concernés : AvailibilityService (Angular)
Fonctionnalités couvertes : dispo bateaux, users, plongeurs, équipements, et récupération des plongées du mois
Environnement : Angular + HttpClientTestingModule, environment.apiAviability, withCredentials: true

AV-FRONT-001 – Récupérer les bateaux disponibles
Pré-requis : environment.apiAviability configuré
Étapes : appeler getAvailableBoat(date='2025-08-05', duration=2)
Attendu :

Requête : GET ${environment.apiAviability}/boats?date=2025-08-05&duration=2 avec withCredentials: true

Réponse : tableau Boat[] (ex. [ { _id:'1', name:'Titanic', numberMaxPlaces:100, revisionDate:Date } ])
Statut : OK / KO
Test lié : should fetch available boats

AV-FRONT-002 – Récupérer les utilisateurs disponibles
Pré-requis : environment.apiAviability configuré
Étapes : appeler getAvailableUsers(date: Date, duration: 1)
Attendu :

Requête : GET ${environment.apiAviability}/users?date=<date>&duration=1 avec withCredentials: true

Réponse : tableau User[] (ex. [ { _id:'u1', email:'a@a.com', name:'Alice', role:'admin', divingLvl:5, password:'password' } ])
Statut : OK / KO
Test lié : should fetch available users

AV-FRONT-003 – Récupérer les plongeurs disponibles
Pré-requis : environment.apiAviability configuré
Étapes : appeler getAvailableDivers(date: Date, duration: 1)
Attendu :

Requête : GET ${environment.apiAviability}/divers?date=<date>&duration=1 avec withCredentials: true

Réponse : tableau Diver[] (ex. [ { _id:'d1', firstName:'Bob', lastName:'Marley', divingLvl:5, age:30, phone:'123-456-7890', email:'aa@a.fr', additionalInfo:'like cool diving' } ])
Statut : OK / KO
Test lié : should fetch available divers

AV-FRONT-004 – Récupérer les plongées du mois
Pré-requis : environment.apiAviability configuré
Étapes : appeler getDiveMonth(date: Date)
Attendu :

Requête : GET ${environment.apiAviability}/dive/month?date=<date> avec withCredentials: true

Réponse : tableau Dive[] (ex. [ new Dive('d1','Morning Dive','Nice Bay',Date,2,30,[], new Boat(...), new User(...)) ])
Statut : OK / KO
Test lié : should fetch dive month data

AV-FRONT-005 – Récupérer le matériel disponible
Pré-requis : environment.apiAviability configuré
Étapes : appeler getAvailableEquipment(date: Date, duration: 2)
Attendu :

Requête : GET ${environment.apiAviability}/equipment?date=<date>&duration=2 avec withCredentials: true

Réponse : tableau Equipment[] (ex. [ new Equipment('e1','bouteille','REF123',Date,'Large') ])
Statut : OK / KO
Test lié : should fetch available equipment


Cahier de Recettes – Front (Angular) – BoatService
Modules concernés : BoatService (Angular)
Fonctionnalités couvertes : lire, créer, mettre à jour, supprimer des bateaux (HTTP + withCredentials)
Environnement : Angular + HttpClientTestingModule, environment.apiBoats, withCredentials: true

BOAT-FRONT-001 – Récupérer tous les bateaux
Pré-requis : environment.apiBoats configuré
Étapes : appeler BoatService.getAll()
Attendu :

Requête : GET ${environment.apiBoats} avec withCredentials: true

Réponse : tableau Boat[] (ex. [ new Boat('b1','Titanic',100,Date) ])
Statut : OK / KO
Test lié : should fetch all boats

BOAT-FRONT-002 – Créer un bateau
Pré-requis : objet Boat valide
Étapes : appeler BoatService.create(newBoat)
Attendu :

Requête : POST ${environment.apiBoats} avec body = newBoat et withCredentials: true

Réponse : l’objet Boat créé (miroir du body)
Statut : OK / KO
Test lié : should create a boat

BOAT-FRONT-003 – Mettre à jour un bateau
Pré-requis : objet Boat avec un _id/id (ex. b3)
Étapes : appeler BoatService.update(updatedBoat)
Attendu :

Requête : PUT ${environment.apiBoats}/b3 avec body = updatedBoat et withCredentials: true

Réponse : l’objet Boat mis à jour
Statut : OK / KO
Test lié : should update a boat

BOAT-FRONT-004 – Supprimer un bateau par id
Pré-requis : id de bateau existant (ex. b4)
Étapes : appeler BoatService.delete('b4')
Attendu :

Requête : DELETE ${environment.apiBoats}/b4 avec withCredentials: true

Réponse : succès (ex. { success: true })
Statut : OK / KO
Test lié : should delete a boat by id



Cahier de Recettes – Front (Angular) – DashboardService
Modules concernés : DashboardService (Angular)
Fonctionnalités couvertes : dashboard du jour, dashboard de la semaine, gestion des tâches (liste, création, mise à jour, suppression)
Environnement : Angular + HttpClientTestingModule, environment.apiDashboard, environment.apiTasks

DASH-FRONT-001 – Récupérer le dashboard du jour
Pré-requis : environment.apiDashboard configuré
Étapes : appeler getDashboardToday()
Attendu :

Requête : GET ${environment.apiDashboard} avec withCredentials: true

Réponse : objet stats (ex. { dives: 5, divers: 10 })
Statut : OK / KO
Test lié : should fetch today's dashboard data

DASH-FRONT-002 – Récupérer le dashboard de la semaine
Pré-requis : environment.apiDashboard configuré
Étapes : appeler getDashboardWeek()
Attendu :

Requête : GET ${environment.apiDashboard}/week avec withCredentials: true

Réponse : objet/array de stats (ex. { weekStats: [1,2,3] })
Statut : OK / KO
Test lié : should fetch week's dashboard data

DASH-FRONT-003 – Lister les tâches
Pré-requis : environment.apiTasks configuré
Étapes : appeler getTasks()
Attendu :

Requête : GET ${environment.apiTasks}

Réponse : tableau Task[] (ex. [ new Task('t1','Fix bug','todo',Date) ])
Statut : OK / KO
Test lié : should fetch tasks

DASH-FRONT-004 – Créer une tâche
Pré-requis : payload partiel valide (ex. { title:'New task', status:'todo' })
Étapes : appeler createTask(payload)
Attendu :

Requête : POST ${environment.apiTasks} avec body = payload

Réponse : Task créée (ex. new Task('t2','New task','todo',Date))
Statut : OK / KO
Test lié : should create a task

DASH-FRONT-005 – Mettre à jour une tâche
Pré-requis : id existant (ex. t3) et payload partiel (ex. { title:'Updated', status:'inProgress' })
Étapes : appeler updateTask('t3', payload)
Attendu :

Requête : PUT ${environment.apiTasks}/t3 avec body = payload

Réponse : Task mise à jour (ex. new Task('t3','Updated','inProgress',Date))
Statut : OK / KO
Test lié : should update a task

DASH-FRONT-006 – Supprimer une tâche
Pré-requis : id existant (ex. t2)
Étapes : appeler deleteTask('t2')
Attendu :

Requête : DELETE ${environment.apiTasks}/t2

Réponse : succès (ex. { success: true })
Statut : OK / KO
Test lié : should delete a task



Cahier de Recettes – Front (Angular) – DiverServiceService
Modules concernés : `DiverServiceService` (Angular)
Fonctionnalités couvertes : lire, créer, mettre à jour, supprimer des plongeurs
Environnement : Angular + HttpClientTestingModule, `environment.apiDiver`

---

**DIVER-FRONT-001 – Récupérer tous les plongeurs**
Pré-requis : `environment.apiDiver` configuré
Étapes : appeler `getAll()`
Attendu :

* Requête : `GET ${environment.apiDiver}` **avec** `withCredentials: true`
* Réponse : tableau `Diver[]` (ex. `[ new Diver('d1','Bob','Marley',5,30,'123-456-7890','aa@a.fr','like cool diving') ]`)
  Test lié : `should fetch all divers`

---

**DIVER-FRONT-002 – Créer un plongeur**
Pré-requis : instance `Diver` valide
Étapes : appeler `create(newDiver)`
Attendu :

* Requête : `POST ${environment.apiDiver}` avec body = `newDiver`
* Réponse : l’objet `Diver` créé (miroir du body)
  Test lié : `should create a diver`

---

**DIVER-FRONT-003 – Mettre à jour un plongeur**
Pré-requis : instance `Diver` avec id (ex. `d1`)
Étapes : appeler `update(updatedDiver)`
Attendu :

* Requête : `PUT ${environment.apiDiver}/d1` avec body = `updatedDiver`
* Réponse : l’objet `Diver` mis à jour
  Test lié : `should update a diver`

---

**DIVER-FRONT-004 – Supprimer un plongeur**
Pré-requis : id existant (ex. `d4`)
Étapes : appeler `delete('d4')`
Attendu :

* Requête : `DELETE ${environment.apiDiver}/d4`
* Réponse : succès (ex. `{ success: true }`)
  Test lié : `should delete a diver by ID`

---



Cahier de Recettes – Front (Angular) – DivingService
Modules concernés : `DivingService` (Angular)
Fonctionnalités couvertes : lire toutes les plongées, lire par id, créer une palanquée, mettre à jour une plongée, supprimer une plongée
Environnement : Angular + HttpClientTestingModule, `environment.apiDives`, `environment.apiDivingGroup`, `withCredentials: true`

---

**DIVE-FRONT-001 – Récupérer toutes les plongées**
Pré-requis : `environment.apiDives` configuré
Étapes : appeler `getAllDiving()`
Attendu :

* Requête : `GET ${environment.apiDives}` avec `withCredentials: true`
* Réponse : tableau `Dive[]` (ex. `[ createMockDive('d1') ]`)
  Test lié : `should get all dives`

---

**DIVE-FRONT-002 – Récupérer une plongée par id**
Pré-requis : id existant (ex. `d2`)
Étapes : appeler `getDiveById('d2')`
Attendu :

* Requête : `GET ${environment.apiDives}/d2` avec `withCredentials: true`
* Réponse : `Dive` correspondant (ex. `createMockDive('d2')`)
  Test lié : `should get a dive by id`

---

**DIVE-FRONT-003 – Créer une palanquée (diving group)**
Pré-requis : payload valide (ex. `{ name:'Group A', divers:['diver1','diver2'] }`)
Étapes : appeler `createDivingGroup(payload)`
Attendu :

* Requête : `POST ${environment.apiDivingGroup}` avec body = payload et `withCredentials: true`
* Réponse : succès (ex. `{ success: true }`)
  Test lié : `should create a diving group`

---

**DIVE-FRONT-004 – Mettre à jour une plongée**
Pré-requis : id existant (ex. `d3`) et objet `Dive` modifié
Étapes : appeler `updateDive('d3', updatedDive)`
Attendu :

* Requête : `PUT ${environment.apiDives}/d3` avec body = `updatedDive` et `withCredentials: true`
* Réponse : `Dive` mise à jour (ex. même objet renvoyé)
  Test lié : `should update a dive`

---

**DIVE-FRONT-005 – Supprimer une plongée**
Pré-requis : id existant (ex. `d4`)
Étapes : appeler `delete('d4')`
Attendu :

* Requête : `DELETE ${environment.apiDives}/d4` avec `withCredentials: true`
* Réponse : succès (ex. `{ success: true }` ou truthy)
  Test lié : `should delete a dive`

---




Cahier de Recettes – Front (Angular) – EquipmentServiceService
Modules concernés : EquipmentServiceService (Angular)
Fonctionnalités couvertes : lire, créer, mettre à jour, supprimer du matériel
Environnement : Angular + HttpClientTestingModule, environment.apiEquipment, withCredentials: true

EQUIP-FRONT-001 – Récupérer tout le matériel
Pré-requis : environment.apiEquipment configuré
Étapes : appeler getAll()
Attendu :

Requête : GET ${environment.apiEquipment} avec withCredentials: true

Réponse : tableau Equipment[] (ex. [ new Equipment('e1','bouteille','REF-1234',Date,'L') ])
Test lié : should fetch all equipment

EQUIP-FRONT-002 – Créer un équipement
Pré-requis : instance Equipment valide
Étapes : appeler create(newEquip)
Attendu :

Requête : POST ${environment.apiEquipment} avec body = newEquip et withCredentials: true

Réponse : l’objet Equipment créé (miroir du body)
Test lié : should create equipment

EQUIP-FRONT-003 – Mettre à jour un équipement
Pré-requis : instance Equipment avec id (ex. e3)
Étapes : appeler update(updatedEquip)
Attendu :

Requête : PUT ${environment.apiEquipment}/e3 avec body = updatedEquip et withCredentials: true

Réponse : l’objet Equipment mis à jour (ex. taille passée de L à XL)
Test lié : should update equipment

EQUIP-FRONT-004 – Supprimer un équipement
Pré-requis : id existant (ex. e4)
Étapes : appeler delete('e4')
Attendu :

Requête : DELETE ${environment.apiEquipment}/e4 avec withCredentials: true

Réponse : succès (ex. { success: true } ou truthy)
Test lié : should delete equipment


Cahier de Recettes – Front (Angular) – NotificationService
Modules concernés : `NotificationService` (Angular), `MatSnackBar`, `SnackbarComponent`
Fonctionnalités couvertes : affichage de notifications (success / info par défaut)

---

NOTIF-FRONT-001 – Afficher un message de succès
Pré-requis : `MatSnackBar` mocké, `SnackbarComponent` disponible
Étapes : appeler `service.show('Saved successfully!', 'success')`
Attendu :

* `MatSnackBar.openFromComponent(SnackbarComponent, {  
  data: { message: 'Saved successfully!', type: 'success' },  
  duration: 3000,  
  horizontalPosition: 'center',  
  verticalPosition: 'bottom',  
  panelClass: ['rounded-md','shadow-lg']  
  })` appelé
  Test lié : `should display a success message`

---

NOTIF-FRONT-002 – Type par défaut = info
Pré-requis : `MatSnackBar` mocké
Étapes : appeler `service.show('Info message')` sans type
Attendu :

* `MatSnackBar.openFromComponent(SnackbarComponent, {  
  data: { message: 'Info message', type: 'info' },  
  duration: 3000,  
  horizontalPosition: 'center',  
  verticalPosition: 'bottom',  
  panelClass: ['rounded-md','shadow-lg']  
  })` appelé
  Test lié : `should default to info type if not specified`

---





Cahier de Recettes – Front (Angular) – SpotService
Modules concernés : `SpotService` (Angular)
Fonctionnalités couvertes : lire tous les spots, lire par id, créer, mettre à jour, supprimer
Environnement : Angular + HttpClientTestingModule, `environment.apiSpots`, `withCredentials: true`

---

**SPOT-FRONT-001 – Récupérer tous les spots**
Pré-requis : `environment.apiSpots` configuré
Étapes : appeler `getAll()`
Attendu :

* Requête : `GET ${environment.apiSpots}` avec `withCredentials: true`
* Réponse : tableau `Spot[]` (ex. `[ { _id:'s1', name:'Calanque Bleue', coordinates:{ lat:43.2, lng:5.4 } } ]`)
  Test lié : `should fetch all spots`

---

**SPOT-FRONT-002 – Récupérer un spot par id**
Pré-requis : id existant (ex. `s2`)
Étapes : appeler `getById('s2')`
Attendu :

* Requête : `GET ${environment.apiSpots}/s2` avec `withCredentials: true`
* Réponse : `Spot` correspondant (ex. `{ _id:'s2', name:'Calanque Bleue', coordinates:{...} }`)
  Test lié : `should fetch a spot by id`

---

**SPOT-FRONT-003 – Créer un spot**
Pré-requis : objet `Spot` valide
Étapes : appeler `create(newSpot)`
Attendu :

* Requête : `POST ${environment.apiSpots}` avec body = `newSpot` et `withCredentials: true`
* Réponse : le `Spot` créé (miroir du body)
  Test lié : `should create a spot`

---

**SPOT-FRONT-004 – Mettre à jour un spot**
Pré-requis : id existant (ex. `s4`) et payload partiel (ex. `{ name:'Spot Modifié', coordinates:{ lat:43.3, lng:5.5 } }`)
Étapes : appeler `update('s4', payload)`
Attendu :

* Requête : `PUT ${environment.apiSpots}/s4` avec body = payload et `withCredentials: true`
* Réponse : `Spot` mis à jour (ex. `{ _id:'s4', ...payload }`)
  Test lié : `should update a spot`

---

**SPOT-FRONT-005 – Supprimer un spot**
Pré-requis : id existant (ex. `s5`)
Étapes : appeler `delete('s5')`
Attendu :

* Requête : `DELETE ${environment.apiSpots}/s5` avec `withCredentials: true`
* Réponse : succès (ex. `{ success: true }` ou truthy)
  Test lié : `should delete a spot by id`

---




Cahier de Recettes – Front (Angular) – UsersServiceService
Modules concernés : `UsersServiceService` (Angular)
Fonctionnalités couvertes : lire, créer, mettre à jour, supprimer des utilisateurs
Environnement : Angular + HttpClientTestingModule, `environment.apiUsers`, `withCredentials: true`

---

**USER-FRONT-001 – Récupérer tous les utilisateurs**
Pré-requis : `environment.apiUsers` configuré
Étapes : appeler `getAll()`
Attendu :

* Requête : `GET ${environment.apiUsers}` avec `withCredentials: true`
* Réponse : tableau `User[]` (ex. `[ new User('u1','Alice','password','a@a.com','admin',5) ]`)
  Test lié : `should fetch all users`

---

**USER-FRONT-002 – Créer un utilisateur**
Pré-requis : instance `User` valide
Étapes : appeler `create(newUser)`
Attendu :

* Requête : `POST ${environment.apiUsers}` avec body = `newUser` et `withCredentials: true`
* Réponse : l’objet `User` créé (miroir du body)
  Test lié : `should create a user`

---

**USER-FRONT-003 – Mettre à jour un utilisateur**
Pré-requis : instance `User` avec id (ex. `u3`)
Étapes : appeler `update(updatedUser)`
Attendu :

* Requête : `PUT ${environment.apiUsers}/u3` avec body = `updatedUser` et `withCredentials: true`
* Réponse : l’objet `User` mis à jour (ex. `name` passé à `Jane Doe`)
  Test lié : `should update a user`

---

**USER-FRONT-004 – Supprimer un utilisateur**
Pré-requis : id existant (ex. `u4`)
Étapes : appeler `delete('u4')`
Attendu :

* Requête : `DELETE ${environment.apiUsers}/u4` avec `withCredentials: true`
* Réponse : succès (ex. `{ success: true }` ou truthy)
  Test lié : `should delete a user`

---




Cahier de Recettes – Front (Angular) – LoginComponent
Modules concernés : `LoginComponent`, `AuthService`, `Router`
Fonctionnalités couvertes : soumission du formulaire de login, redirection en cas de succès, gestion d’erreur

---

LOGIN-CMP-001 – Soumission réussie → appel service + redirection
Pré-requis :

* `AuthService.login` mocké pour renvoyer `of({ token: 'abc123' })`
* RouterTestingModule configuré, `spyOn(router, 'navigate')` actif
  Étapes :

1. Renseigner `email = 'test@example.com'`, `password = 'password123'` dans le composant
2. Appeler `component.onSubmit()`
   Attendu :

* `authService.login('test@example.com','password123')` appelé **une fois**
* `router.navigate(['/'])` appelé (redirection vers l’accueil)
  Test lié : `should call authService.login with email and password on submit`

---

LOGIN-CMP-002 – Erreur d’authentification → pas de redirection + log erreur
Pré-requis :

* `AuthService.login` mocké pour renvoyer `throwError(() => new Error('Unauthorized'))`
* `spyOn(console, 'error')` actif
  Étapes :

1. Renseigner `email = 'wrong@example.com'`, `password = 'badpass'`
2. Appeler `component.onSubmit()`
   Attendu :

* `authService.login(...)` appelé
* `console.error('Login failed', Error)` appelé
* **Aucune** redirection : `router.navigate` **non** appelé
  Test lié : `should handle login error`

---


Cahier de Recettes – Front (Angular) – RegisterComponent
Modules concernés : RegisterComponent, AuthService, Router
Fonctionnalités couvertes : initialisation du formulaire, inscription réussie, gestion d’erreur

REG-CMP-001 – Initialisation du formulaire
Pré-requis : Composant instancié (fixture.detectChanges() exécuté)
Étapes :

Récupérer component.registerForm
Attendu :

Formulaire défini

name = ""

email = ""

password = ""

role = "staff"

divingLvl = 0
Test lié : should create the form with default values

REG-CMP-002 – Inscription réussie → appel service + redirection
Pré-requis :

Valeurs du formulaire :

name: "Alice"
email: "alice@example.com"
password: "secure"
role: "admin"
divingLvl: 2
AuthService.register mocké pour renvoyer of({ _id: '123', ...formValues })

spyOn(router, 'navigate') actif
Étapes :

component.registerForm.setValue(formValues)

Appeler component.onSubmit()
Attendu :

authService.register(formValues) appelé une fois

router.navigate(['/login']) appelé
Test lié : should call authService.register and navigate on success

REG-CMP-003 – Erreur d’inscription → pas de redirection + log erreur
Pré-requis :

Valeurs du formulaire :

name: "Bob"
email: "bob@example.com"
password: "weak"
role: "manager"
divingLvl: 1
AuthService.register mocké pour renvoyer throwError(() => new Error('fail'))

spyOn(console, 'error') actif
Étapes :

component.registerForm.setValue(formValues)

Appeler component.onSubmit()
Attendu :

authService.register(formValues) appelé

console.error('Registration failed', Error) appelé

Aucune redirection (router.navigate non appelé)
Test lié : should handle registration error



Cahier de Recettes – Front (Angular) – CalendarComponent
Modules concernés : CalendarComponent, DivingService, Router, NotificationService
Fonctionnalités couvertes : chargement des plongées, interaction calendrier (clic date/événement), navigation, suppression avec feedback

CAL-CMP-001 – Chargement initial : récupération des plongées → events
Pré-requis : DivingService.getAllDiving renvoie une liste de Dive (ex. 1 élément)
Étapes : initialiser le composant (fixture.detectChanges() → ngOnInit)
Attendu :

getAllDiving() appelé

component.events.length = nombre de plongées renvoyées (ex. 1)
Test lié : should call loadDives on init

CAL-CMP-002 – Clic sur une date → ouverture du modal de création
Pré-requis : aucun
Étapes : handleDateClick({ dateStr: '2025-08-15' })
Attendu :

selectedDate = '2025-08-15'

showDateModal = true
Test lié : should handle date click and show modal

CAL-CMP-003 – Clic sur un événement → ouverture du modal de détail
Pré-requis : aucun
Étapes : handleEventClick({ event: { id:'1', title:'Dive 1', start: Date, extendedProps:{ description:'desc' }}})
Attendu :

selectedEvent.title = 'Dive 1'

showEventModal = true
Test lié : should handle event click and show modal

CAL-CMP-004 – Confirmer la création → navigation vers /create-dive avec la date
Pré-requis : selectedDate = '2025-08-20'
Étapes : confirmCreateDive()
Attendu :

router.navigate(['/create-dive'], { queryParams: { date: '2025-08-20' } }) appelé
Test lié : should navigate to /create-dive with date

CAL-CMP-005 – Aller au détail d’un event → navigation /edit-dive/:id
Pré-requis : selectedEvent = { id: '123' }
Étapes : goToEventDetail()
Attendu :

router.navigate(['/edit-dive', '123']) appelé
Test lié : should navigate to /edit-dive/:id

CAL-CMP-006 – Supprimer une plongée (succès) → liste mise à jour + notif succès
Pré-requis :

window.confirm() retourne true

DivingService.delete('123') renvoie of(void 0)

events = [{ id: '123' }] et selectedEvent = { id: '123' }
Étapes : deleteEvent()
Attendu :

delete('123') appelé

events ne contient plus l’élément (longueur 0)

NotificationService.show('...succès...', 'success') appelé
Test lié : should delete dive and update events list

CAL-CMP-007 – Supprimer une plongée (échec) → notif erreur
Pré-requis :

window.confirm() retourne true

DivingService.delete('123') renvoie throwError(new Error('fail'))

events et selectedEvent positionnés sur l’id concerné
Étapes : deleteEvent()
Attendu :

NotificationService.show('...Échec...', 'error') appelé

(La liste peut rester inchangée selon l’implémentation)
Test lié : should handle delete error



Cahier de Recettes – Front (Angular) – CrudBoatsComponent
Modules concernés : `CrudBoatsComponent`, `BoatService`, `MatDialog`
Fonctionnalités couvertes : chargement liste, création via dialog, édition via dialog, suppression avec confirmation

---

CRUDBOAT-CMP-001 – Chargement initial des bateaux
Pré-requis : `BoatService.getAll` renvoie une liste (ex. 2 bateaux)
Étapes : appeler `ngOnInit()`
Attendu :

* `BoatService.getAll()` appelé
* (optionnel) `component.boats` peuplé selon l’implémentation
  Test lié : `should call loadBoats on init`

---

CRUDBOAT-CMP-002 – Charger les bateaux dans le tableau
Pré-requis : `BoatService.getAll` → `of(mockBoats)`
Étapes : appeler `component.loadBoats()`
Attendu :

* `component.boats === mockBoats`
  Test lié : `should load boats into the array`

---

CRUDBOAT-CMP-003 – Création : ouvrir le formulaire → créer → recharger
Pré-requis :

* `MatDialog.open(...).afterClosed()` → `of(result)` (objet bateau sans `_id`)
* `BoatService.create(result)` → renvoie l’objet créé avec `_id`
* `BoatService.getAll()` → appelé pour rechargement
  Étapes : `component.openForm()`
  Attendu :
* `BoatService.create(jasmine.objectContaining(result))` appelé
* `BoatService.getAll()` rappelé pour rafraîchir la liste
  Test lié : `should call create on boatService and reload boats on dialog close with result (create)`

---

CRUDBOAT-CMP-004 – Édition : ouvrir le formulaire → update → recharger
Pré-requis :

* `existingBoat` avec `_id`
* `MatDialog.open(...).afterClosed()` → `of(updated)`
* `BoatService.update(updated)` → renvoie l’objet mis à jour
* `BoatService.getAll()` → appelé pour rechargement
  Étapes : `component.openForm(existingBoat)`
  Attendu :
* `BoatService.update(updated)` appelé
* `BoatService.getAll()` rappelé
  Test lié : `should call update on boatService and reload boats on dialog close with result (edit)`

---

CRUDBOAT-CMP-005 – Suppression confirmée
Pré-requis :

* `window.confirm()` → `true`
* `BoatService.delete('1')` → `of({})`
* `BoatService.getAll()` → `of([])`
  Étapes : `component.deleteBoat('1')`
  Attendu :
* `BoatService.delete('1')` appelé
* `BoatService.getAll()` rappelé (liste rafraîchie)
  Test lié : `should call delete on boatService if confirmed`

---

CRUDBOAT-CMP-006 – Suppression annulée
Pré-requis : `window.confirm()` → `false`
Étapes : `component.deleteBoat('1')`
Attendu :

* `BoatService.delete` **non** appelé
  Test lié : `should not call delete on boatService if not confirmed`

---

Cahier de Recettes – Front (Angular) – CrudDiversComponent
Modules concernés : `CrudDiversComponent`, `DiverServiceService`, `MatDialog`
Fonctionnalités couvertes : chargement liste, création via dialog, édition via dialog, suppression avec confirmation

---

**CRUDDIVER-CMP-001 – Chargement initial des plongeurs**
Pré-requis : `DiverServiceService.getAll` → `of(mockDivers)` (2 éléments)
Étapes : `fixture.detectChanges()` (déclenche `ngOnInit`)
Attendu :

* `getAll()` appelé
* `component.divers.length === 2`
  Test lié : `should call loadDivers on init`

---

**CRUDDIVER-CMP-002 – Création : ouvrir le formulaire → créer → recharger**
Pré-requis :

* `MatDialog.open(...).afterClosed()` → `of(result)` (diver à créer)
* `diverService.create(result)` → `of(result)`
* `diverService.getAll()` → `of(mockDivers)` (reload)
  Étapes : `component.openForm()`
  Attendu :
* `dialog.open` appelé
* `diverService.create(result)` appelé
* `diverService.getAll()` rappelé pour rafraîchir la liste
  Test lié : `should open dialog and create a diver`

---

**CRUDDIVER-CMP-003 – Édition : ouvrir le formulaire → update → recharger**
Pré-requis :

* `diverToUpdate` = un diver existant
* `MatDialog.open(...).afterClosed()` → `of(diverToUpdate)`
* `diverService.update(diverToUpdate)` → `of(diverToUpdate)`
* `diverService.getAll()` → `of(mockDivers)` (reload)
  Étapes : `component.openForm(diverToUpdate)`
  Attendu :
* `dialog.open` appelé
* `diverService.update(diverToUpdate)` appelé
* `diverService.getAll()` rappelé
  Test lié : `should open dialog and update a diver`

---

**CRUDDIVER-CMP-004 – Suppression confirmée**
Pré-requis :

* `window.confirm()` → `true`
* `diverService.delete('1')` → `of({})`
* `diverService.getAll()` → `of(mockDivers)`
  Étapes : `component.deleteDiver('1')`
  Attendu :
* `diverService.delete('1')` appelé
* `diverService.getAll()` rappelé
  Test lié : `should delete a diver after confirmation`

---

**CRUDDIVER-CMP-005 – Suppression annulée**
Pré-requis : `window.confirm()` → `false`
Étapes : `component.deleteDiver('1')`
Attendu :

* `diverService.delete` **non** appelé
  Test lié : `should not delete a diver if confirmation is cancelled`

---


Cahier de Recettes – Front (Angular) – CrudEquipmentsComponent
Modules concernés : `CrudEquipmentsComponent`, `EquipmentServiceService`, `MatDialog`
Fonctionnalités couvertes : affichage liste, création, édition, suppression

---

**CRUDEQ-CMP-001 – Chargement initial des équipements**
Pré-requis : `equipmentService.getAll()` → `of(mockEquipments)` (2 éléments)
Étapes : `fixture.detectChanges()` (ngOnInit)
Attendu :

* `getAll()` appelé
* `component.equipments.length === 2`
  Test lié : `should load equipments on init`

---

**CRUDEQ-CMP-002 – Création : ouverture du formulaire → création**
Pré-requis :

* `MatDialog.open(...).afterClosed()` → `of(result)` (équipement à créer)
* `equipmentService.create(result)` → `of(result)`
  Étapes : `component.openForm()`
  Attendu :
* `dialog.open` appelé
* `equipmentService.create(result)` appelé
  Test lié : `should open dialog and create equipment`

---

**CRUDEQ-CMP-003 – Édition : ouverture du formulaire → update**
Pré-requis :

* `equipmentToEdit` = équipement existant
* `MatDialog.open(...).afterClosed()` → `of(equipmentToEdit)`
* `equipmentService.update(equipmentToEdit)` → `of(equipmentToEdit)`
  Étapes : `component.openForm(equipmentToEdit)`
  Attendu :
* `dialog.open` appelé
* `equipmentService.update(equipmentToEdit)` appelé
  Test lié : `should open dialog and update equipment`

---

**CRUDEQ-CMP-004 – Suppression confirmée**
Pré-requis :

* `window.confirm()` → `true`
* `equipmentService.delete('1')` → `of({})`
  Étapes : `component.deleteEquipment('1')`
  Attendu :
* `equipmentService.delete('1')` appelé
  Test lié : `should delete equipment`



Cahier de Recettes – Front (Angular) – CrudUsersComponent
Modules concernés : `CrudUsersComponent`, `UsersServiceService`, `MatDialog`
Fonctionnalités couvertes : chargement liste, création via dialog, édition via dialog, suppression (confirmation)

---

**CRUDUSER-CMP-001 – Chargement initial des utilisateurs**
Pré-requis : `UsersServiceService.getAll()` → `of(mockUsers)` (2 éléments)
Étapes : `fixture.detectChanges()` (déclenche `ngOnInit()`)
Attendu :

* `getAll()` appelé
* `component.users.length === 2`
  Test lié : `should load users on init`

---

**CRUDUSER-CMP-002 – Création : ouverture du formulaire → create**
Pré-requis :

* `MatDialog.open(...).afterClosed()` → `of(result)` (utilisateur saisi)
* `userService.create(result)` → `of(result)`
* (optionnel) `userService.getAll()` → `of([...mockUsers, result])` pour reload
  Étapes : `component.openForm()`
  Attendu :
* `dialog.open` appelé
* `userService.create(result)` appelé avec l’objet `result`
  Test lié : `should open dialog and create user`

---

**CRUDUSER-CMP-003 – Édition : ouverture du formulaire → update**
Pré-requis :

* `userToEdit` = un user existant (ex. `mockUsers[0]`)
* `MatDialog.open(...).afterClosed()` → `of(userToEdit)`
* `userService.update(userToEdit)` → `of(userToEdit)`
  Étapes : `component.openForm(userToEdit)`
  Attendu :
* `dialog.open` appelé
* `userService.update(userToEdit)` appelé
  Test lié : `should open dialog and update user`

---

**CRUDUSER-CMP-004 – Suppression confirmée**
Pré-requis :

* `window.confirm()` → `true`
* `userService.delete('1')` → `of({})`
  Étapes : `component.deleteUser('1')`
  Attendu :
* `userService.delete('1')` appelé
  Test lié : `should delete user`

---




Cahier de Recettes – Front (Angular) – TodayComponent
Modules concernés : `TodayComponent`, `DashboardService` (+ `KanbanComponent` en template)
Fonctionnalités couvertes : chargement des données “Aujourd’hui” & “Semaine”, gestion des états (loading / error)

---

**TODAY-CMP-001 – Chargement réussi du dashboard (jour + semaine)**
Pré-requis :

* `DashboardService.getDashboardToday()` → `of(todayMock)`
* `DashboardService.getDashboardWeek()` → `of(weekMock)`
* (Facultatif) `DashboardService.getTasks()` → `of([])` si le composant l’appelle au init
  Étapes :

1. Appeler `component.fetchDashboardData()`
   Attendu :

* `todayDives.length === 1`
* `weekDives.length === 1`
* `todayEquipment.length === 1`, `todayBoats.length === 1`
* `weekEquipment.length === 1`, `weekBoats.length === 1`
* `isLoading === false`
* `hasError === false`
  Test lié : `should load dashboard data successfully`

---

**TODAY-CMP-002 – Erreur lors du chargement (jour en erreur)**
Pré-requis :

* `getDashboardToday()` → `throwError(new Error('fail'))`
* `getDashboardWeek()` → `of(mockWeek)`
  Étapes :

1. Appeler `component.fetchDashboardData()`
   Attendu :

* `hasError === true`
* `isLoading === false`
  Test lié : `should handle dashboard fetch error`

---


Cahier de Recettes – Front (Angular) – DashboardComponent
Modules concernés : `DashboardComponent`, `MatTabsModule`, sous-composant carte (`SpotComponent`/mock)
Fonctionnalités couvertes : création du composant, gestion du changement d’onglet, initialisation paresseuse de la carte

---

**DASH-CMP-001 – Instanciation du composant**
Pré-requis : TestBed avec `DashboardComponent`, `MatTabsModule`, `HttpClientTestingModule`, `NoopAnimationsModule`
Étapes : créer le composant puis `fixture.detectChanges()`
Attendu : le composant est truthy (`toBeTruthy()`)
Test lié : `should create the component`

---

**DASH-CMP-002 – Changement d’onglet ≠ 2 → ne pas initialiser la carte**
Pré-requis : `component.mapComponent = new MockSpotComponent()` avec `initMapSafely` espionné
Étapes : appeler `component.onTabChange({ index: 1 })`
Attendu : `mapComponent.initMapSafely` **non** appelé
Test lié : `should NOT call initMapSafely if tab index !== 2`

---

**DASH-CMP-003 – Changement d’onglet = 2 → initialiser la carte**
Pré-requis : `component.mapComponent = new MockSpotComponent()` avec `initMapSafely` espionné
Étapes : appeler `component.onTabChange({ index: 2 })`
Attendu : `mapComponent.initMapSafely` appelé **une fois**
Test lié : `should call initMapSafely if tab index is 2`

---


Cahier de Recettes – Front (Angular) – KanbanComponent
Modules concernés : `KanbanComponent`, `DashboardService`
Dépendances UI : `@angular/cdk/drag-drop` (DragDropModule), `NoopAnimationsModule`
Fonctionnalités : chargement & répartition des tâches, glisser-déposer (changement de colonne = changement de statut), ajout, suppression, édition inline

---

**KANBAN-CMP-001 – Création du composant**
Pré-requis : TestBed avec `KanbanComponent` + modules d’UI.
Étapes : création du composant.
Attendu : composant truthy.
Test lié : `should create`.

**KANBAN-CMP-002 – Chargement et répartition des tâches**
Pré-requis : `DashboardService.getTasks()` → `of([todo, inProgress, done])`.
Étapes : `ngOnInit()` puis distribution dans colonnes.
Attendu :

* colonne 0 (“todo”) = 1,
* colonne 1 (“inProgress”) = 1,
* colonne 2 (“done”) = 1.
  Test lié : `should load tasks and distribute them into columns`.

**KANBAN-CMP-003 – Drag & drop : changement de statut**
Pré-requis : une tâche en colonne 0 (todo).
Étapes : `drop(event, 1)` où `container.id = 'list-1'`.
Attendu : appel `updateTask('1', { status: 'inProgress' })`.
Remarque : mapping colonnes ↔ statuts : `list-0 → 'todo'`, `list-1 → 'inProgress'`, `list-2 → 'done'`.
Test lié : `should call updateTask when task is dropped to a new column`.

**KANBAN-CMP-004 – Ajout d’une tâche (prompt)**
Pré-requis : `window.prompt()` → `'Nouvelle tâche'`; `createTask()` → `of(newTask)`.
Étapes : `addTask(0)` (colonne todo).
Attendu : 1 tâche ajoutée en colonne 0, titre = `'Nouvelle tâche'`.
Test lié : `should add a new task`.

**KANBAN-CMP-005 – Suppression confirmée**
Pré-requis : `window.confirm()` → `true`; `deleteTask()` → `of(void 0)`; tâche présente col 0 index 0.
Étapes : `deleteTask(0, '1', 0)`.
Attendu : appel service `deleteTask('1')`, tâche retirée (longueur colonne décrémente).
Test lié : `should delete a task after confirmation`.

**KANBAN-CMP-006 – Suppression annulée**
Pré-requis : `window.confirm()` → `false`; une tâche présente.
Étapes : `deleteTask(...)`.
Attendu : aucune suppression, longueur de colonne inchangée.
Test lié : `should not delete a task if confirmation is canceled`.

**KANBAN-CMP-007 – Passer une tâche en mode édition**
Étapes : `startEditingTask(task)`.
Attendu : `task.editing === true`.
Test lié : `should set task to editing mode`.

**KANBAN-CMP-008 – Fin d’édition : titre modifié → update**
Pré-requis : `task.editing = true`; event `{ target: { value: 'New Title' } }`; `updateTask()` → `of(task)`.
Étapes : `finishEditingTask(task, event)`.
Attendu : `updateTask('1', { title: 'New Title' })` appelé ; `task.title` mis à jour.
Test lié : `should update task title if changed on finish editing`.

**KANBAN-CMP-009 – Fin d’édition : titre inchangé → pas d’update**
Pré-requis : `task.editing = true`; event.value identique au titre.
Étapes : `finishEditingTask(task, event)`.
Attendu : `DashboardService.updateTask` **non** appelé.
Test lié : `should not update task title if unchanged`.

---




Cahier de Recettes – Front (Angular) – SpotComponent
Modules concernés : `SpotComponent` (standalone), `SpotService`, `NotificationService`, Leaflet (`L.map`, `L.marker`, `L.tileLayer`)
Fonctionnalités couvertes : création composant, chargement/affichage des spots sur carte, création spot, annulation d’édition

---

**SPOT-CMP-001 – Création du composant**
Pré-requis : TestBed avec `SpotComponent` + mocks Leaflet (`L.map`, `L.marker`, `L.tileLayer`).
Étapes : instancier le composant.
Attendu : composant truthy.
Test lié : `should create`.

---

**SPOT-CMP-002 – Charger les spots et rendre les marqueurs**
Pré-requis :

* `spotService.getAll()` → `of([{ _id:'1', name:'Spot 1', coordinates:{ lat:45, lng:5 } }])`
* `component.map` déjà initialisée (mock `MockMap`)
* `component.cleanIcon` défini (icône pour `marker`)
  Étapes : appeler `component.loadSpots()`.
  Attendu :
* `spotService.getAll()` appelé
* `component.Spots.length === 1`
* Les marqueurs sont créés et ajoutés (vérifié indirectement via mocks).
  Test lié : `should load spots and render markers`.

---

**SPOT-CMP-003 – Créer un spot (succès)**
Pré-requis :

* `component.newSpot = { name:'Test Spot', coordinates:{ lat:10, lng:10 } }`
* `spotService.create()` → `of({ _id:'42', name:'Test Spot', coordinates:{ lat:10, lng:10 } })`
  Étapes : appeler `component.createSpot()`.
  Attendu :
* `spotService.create(...)` appelé
* `notificationService.show('Spot ajouté avec succès', 'success')` appelé
* (optionnel) rafraîchissement de la liste/carte selon implémentation.
  Test lié : `should create a new spot if name is valid`.

---

**SPOT-CMP-004 – Annuler l’édition**
Pré-requis :

* `component.editIndex = 1`
* `component.editingSpot` défini (ex. `{ _id:'1', name:'Edit', coordinates:{ lat:0, lng:0 } }`)
  Étapes : appeler `component.cancelEdit()`.
  Attendu :
* `component.editIndex === null`
* `component.editingSpot === null`
* `notificationService.show('Modification annulée', 'info')` appelé
  Test lié : `should cancel editing`.

---




Cahier de Recettes – Front (Angular) – NavbarComponent
Modules concernés : `NavbarComponent` (standalone), `AuthService`, `Router`
Fonctionnalités couvertes : création composant, déconnexion (logout → redirection), état d’auth (isLoggedIn)

---

**NAV-CMP-001 – Création du composant**
Pré-requis : TestBed avec `NavbarComponent`, `AuthService` et `Router` mockés
Étapes : instancier le composant puis `fixture.detectChanges()`
Attendu : composant truthy
Test lié : `should create`

---

**NAV-CMP-002 – Déconnexion → redirection /login**
Pré-requis :

* `AuthService.logout()` mocké → `of({})`
* `Router.navigate` espionné
  Étapes : appeler `component.login()` (qui déclenche le logout dans ce composant)
  Attendu :
* `authService.logout()` appelé
* `router.navigate(['/login'])` appelé
  Test lié : `should call logout and navigate to /login`

---

**NAV-CMP-003 – isLoggedIn : sans token → false**
Pré-requis : `localStorage.removeItem('token')`
Étapes : appeler `component.isLoggedIn()`
Attendu : `false`
Test lié : `should return false if no token`

**NAV-CMP-004 – isLoggedIn : avec token → true**
Pré-requis : `localStorage.setItem('token','123abc')`
Étapes : appeler `component.isLoggedIn()`
Attendu : `true`
Test lié : `should return true if token exists`

---

Cahier de Recettes – Front (Angular) – GenericFormDialogComponent
Module testé : GenericFormDialogComponent (standalone)
Dépendances mockées :

MatDialogRef (méthode close)

MAT_DIALOG_DATA (données d’initialisation du formulaire)

GEN-FORM-001 – Création du composant
Pré-requis : Injection de MAT_DIALOG_DATA avec un jeu de champs et de valeurs valides (userFields(false)).
Étapes :

Instancier le composant avec TestBed.

Appeler fixture.detectChanges() et ngOnInit().
Attendu :

Le composant est truthy (créé correctement).
Test lié : should create

GEN-FORM-002 – Initialisation des contrôles
Pré-requis : Données MAT_DIALOG_DATA contenant name, email, role, etc.
Étapes :

Vérifier avec form.contains() que les champs principaux (name, email, role) existent.
Attendu :

Tous les champs requis sont présents dans le FormGroup.
Test lié : should initialize form with controls

GEN-FORM-003 – Bouton désactivé si formulaire invalide
Pré-requis : Formulaire réinitialisé avec .reset().
Étapes :

Vérifier dans le DOM que le bouton [color="primary"] est désactivé.
Attendu :

disabled = true
Test lié : should disable submit button if form is invalid

GEN-FORM-004 – Bouton activé si formulaire valide
Pré-requis :

Tous les champs renseignés (name, email, password, role, divingLvl).
Étapes :

Affecter les valeurs via .setValue().

Vérifier que le bouton [color="primary"] est activé.
Attendu :

disabled = false
Test lié : should enable submit button when form is valid

GEN-FORM-005 – Soumission : fermeture avec valeurs
Pré-requis : Formulaire complet et valide.
Étapes :

Appeler submit().
Attendu :

MatDialogRef.close() appelé avec l’objet des valeurs du formulaire.
Test lié : should call dialogRef.close with form data on submit

GEN-FORM-006 – Annulation
Étapes :

Appeler cancel().
Attendu :

MatDialogRef.close() est appelé sans données spécifiques (annulation simple).
Test lié : should close dialog on cancel

GEN-FORM-007 – Mode édition : masquer le champ mot de passe
Pré-requis :

data.values renseigné (mode édition).

Ajout manuel d’un champ password dans data.fields.
Étapes :

Appeler ngOnInit().

Vérifier que processedFields contient le champ password avec hidden = true.
Attendu :

Le champ mot de passe est masqué en mode édition.
Test lié : should hide password field in edit mode



Cahier de Recettes – Front (Angular) – SnackbarComponent
Modules concernés : `SnackbarComponent` (standalone), `MAT_SNACK_BAR_DATA`
Fonctionnalités couvertes : rendu du message, sélection d’icône et de couleur selon le type (success / error / info / défaut)

---

**SNACKBAR-CMP-001 – Création du composant**
Pré-requis : TestBed avec `SnackbarComponent` importé et `MAT_SNACK_BAR_DATA` fourni (`{ message: 'Test message', type: 'success' }`).
Étapes : créer le composant, `fixture.detectChanges()`.
Attendu : composant truthy.
Test lié : `should create`

---

**SNACKBAR-CMP-002 – Affichage du message**
Pré-requis : data fournie avec `message: 'Test message'`.
Étapes : récupérer le `<span>` du template.
Attendu : le texte contient `'Test message'`.
Test lié : `should display the correct message`

---

**SNACKBAR-CMP-003 – Style & icône pour type "success"**
Pré-requis : `data.type = 'success'`.
Étapes : lire `component.colorClass` et `component.icon`.
Attendu :

* `colorClass === 'bg-green-600'`
* `icon === 'check_circle'`
  Tests liés :
* `should apply the correct color class for success`
* `should return correct icon for success`

---

**SNACKBAR-CMP-004 – Style & icône pour type "error"**
Pré-requis : `component.data = { message: 'Test', type: 'error' }`.
Étapes : vérifier propriétés calculées.
Attendu :

* `icon === 'error'`
* `colorClass === 'bg-red-600'`
  Test lié : `should change icon and color for type "error"`

---

**SNACKBAR-CMP-005 – Style & icône pour type "info"**
Pré-requis : `component.data.type = 'info'`.
Étapes : vérifier propriétés calculées.
Attendu :

* `icon === 'info'`
* `colorClass === 'bg-blue-600'`
  Test lié : `should change icon and color for type "info"`

---

**SNACKBAR-CMP-006 – Type inconnu → valeurs par défaut**
Pré-requis : `component.data.type = 'unknown' as any`.
Étapes : vérifier propriétés calculées.
Attendu :

* `icon === 'notifications'`
* `colorClass === 'bg-gray-800'`
  Test lié : `should fallback to default class and icon for unknown type`

---


Cahier de Recettes – Front (Angular) – AppComponent
Modules concernés : `AppComponent`, `NavbarComponent`, `RouterOutlet`
Dépendances : `HttpClientTestingModule`, `ActivatedRoute` mock (params/queryParams/data vides)

---

**APP-CMP-001 – Création du composant**
Pré-requis : TestBed configuré avec `AppComponent`, `NavbarComponent`, `RouterOutlet`.
Étapes : créer le composant puis `fixture.detectChanges()`.
Attendu : composant truthy.
Test lié : `should create the component`

**APP-CMP-002 – Propriété de titre**
Pré-requis : composant instancié.
Étapes : lire `component.title`.
Attendu : `title === 'mateleau-crm-frontend'`.
Test lié : `should have the correct title`

**APP-CMP-003 – Structure de layout**
Pré-requis : composant rendu.
Étapes : interroger le DOM.
Attendu : présence de `<app-navbar>` et `<router-outlet>`.
Test lié : `should contain <app-navbar> and <router-outlet>`

---

## Suite de non-régression – Frontend

### Environnement & données (commun)
- **Environnement** : Angular v19, Node 20, MongoDB 7, Chrome stable.
- **Jeux de données seed** :
  - 1 utilisateur **admin**
  - 1 utilisateur **staff**
  - 1 bateau (capacité = 8)
  - Spots de base
  - Équipements : quelques références (dont 2 de même nature pour tests de conflit).
  - Plongeurs / Palanquées : quelques docs de base.
  - Tokens **valide** et **expiré**
- **Critère de passage** : 100% des cas NR doivent être OK (bloquant sinon).

---

### AuthService

* FRONT-AUTH-001 (login + stockage LS)
* FRONT-AUTH-002 (logout + purge LS)
* FRONT-AUTH-003 (register POST apiUsers)


### AvailibilityService
- AV-FRONT-001 à 005 : toutes les méthodes HTTP + `withCredentials`
- *(Optionnel)* AV-FRONT-006 : réponses vides → pas de crash

---

### BoatService
- BOAT-FRONT-001 à 004 : GET / POST / PUT / DELETE + `withCredentials`

---

### DashboardService
- DASH-FRONT-001 à 006 : toutes les méthodes HTTP du service

---

### DiverServiceService
- DIVER-FRONT-001 à 004 : GET / POST / PUT / DELETE

---

### DivingService
- DIVE-FRONT-001 à 005 : GET / GET by id / POST / PUT / DELETE + `withCredentials`

---

### EquipmentServiceService
- EQUIP-FRONT-001 à 004 : GET / POST / PUT / DELETE + `withCredentials`

---


### AvailibilityService
- AV-FRONT-001 à 005 : toutes les méthodes HTTP + `withCredentials`
- *(Optionnel)* AV-FRONT-006 : réponses vides → pas de crash

---

### BoatService
- BOAT-FRONT-001 à 004 : GET / POST / PUT / DELETE + `withCredentials`

---

### DashboardService
- DASH-FRONT-001 à 006 : toutes les méthodes HTTP du service

---

### DiverServiceService
- DIVER-FRONT-001 à 004 : GET / POST / PUT / DELETE

---

### DivingService
- DIVE-FRONT-001 à 005 : GET / GET by id / POST / PUT / DELETE + `withCredentials`

---

### EquipmentServiceService
- EQUIP-FRONT-001 à 004 : GET / POST / PUT / DELETE + `withCredentials`

---

### DashboardComponent
- DASH-CMP-001 à 003 : création, logique d’onglets, init paresseuse de la carte

---

### KanbanComponent
- KANBAN-CMP-001 à 009 : création, load & split, drag & drop statut, ajout, suppression, édition inline

---

### SpotComponent
- SPOT-CMP-001 à 004 : init, chargement + markers, création, abandon d’édition

---

### NavbarComponent
- NAV-CMP-001 à 004 : init, logout + redirection, état d’auth via `localStorage`

---

### SnackbarComponent

* SNACKBAR-CMP-001 à 006 (création, message, mapping type→icône/couleur, fallback défaut)

---

### AppComponent
- APP-CMP-001 à 003 : instanciation, propriété métier, structure du shell d’app

---

### Sécurité (front transversal)
- **SEC-GUARD-001** : route protégée sans token → redirection `/login`
- **SEC-ROLE-001** : accès admin avec rôle `staff` → refus (redir + toast)
- **SEC-INTERCEPTOR-001** : ajout header `Authorization` + gestion 401 → `logout()` + redirection `/login`




### Matrice de traçabilité


| Feature / US                                   | Scénario(s)                            | Test auto (fichier/spec)                 | Type         | Priorité |
|------------------------------------------------|----------------------------------------|------------------------------------------|--------------|----------|
| Auth – Login                                   | FRONT-AUTH-001                         | auth.service.spec.ts                     | Fonctionnel  | P1       |
| Auth – Logout                                  | FRONT-AUTH-002                         | auth.service.spec.ts                     | Fonctionnel  | P1       |
| Auth – Register                                | FRONT-AUTH-003                         | auth.service.spec.ts                     | Fonctionnel  | P2       |
| Availibility – Bateaux                         | AV-FRONT-001                           | availibility.service.spec.ts             | Fonctionnel  | P1       |
| Availibility – Utilisateurs                    | AV-FRONT-002                           | availibility.service.spec.ts             | Fonctionnel  | P1       |
| Availibility – Plongeurs                       | AV-FRONT-003                           | availibility.service.spec.ts             | Fonctionnel  | P1       |
| Availibility – Plongées du mois                | AV-FRONT-004                           | availibility.service.spec.ts             | Fonctionnel  | P2       |
| Availibility – Matériel                        | AV-FRONT-005                           | availibility.service.spec.ts             | Fonctionnel  | P2       |
| Bateaux CRUD – Lire tous                       | BOAT-FRONT-001                         | boat.service.spec.ts                     | Fonctionnel  | P1       |
| Bateaux CRUD – Créer                           | BOAT-FRONT-002                         | boat.service.spec.ts                     | Fonctionnel  | P1       |
| Bateaux CRUD – Mettre à jour                   | BOAT-FRONT-003                         | boat.service.spec.ts                     | Fonctionnel  | P1       |
| Bateaux CRUD – Supprimer                       | BOAT-FRONT-004                         | boat.service.spec.ts                     | Fonctionnel  | P1       |
| Dashboard – Jour                               | DASH-FRONT-001                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Dashboard – Semaine                            | DASH-FRONT-002                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Dashboard – Tâches – Lister                    | DASH-FRONT-003                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Dashboard – Tâches – Créer                     | DASH-FRONT-004                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Dashboard – Tâches – Mettre à jour             | DASH-FRONT-005                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Dashboard – Tâches – Supprimer                 | DASH-FRONT-006                         | dashboard.service.spec.ts                | Fonctionnel  | P2       |
| Plongeurs CRUD – Lire tous                     | DIVER-FRONT-001                        | diver.service.spec.ts                    | Fonctionnel  | P1       |
| Plongeurs CRUD – Créer                         | DIVER-FRONT-002                        | diver.service.spec.ts                    | Fonctionnel  | P1       |
| Plongeurs CRUD – Mettre à jour                 | DIVER-FRONT-003                        | diver.service.spec.ts                    | Fonctionnel  | P1       |
| Plongeurs CRUD – Supprimer                     | DIVER-FRONT-004                        | diver.service.spec.ts                    | Fonctionnel  | P1       |
| Plongées – Lire toutes                         | DIVE-FRONT-001                         | diving.service.spec.ts                   | Fonctionnel  | P1       |
| Plongées – Lire par id                         | DIVE-FRONT-002                         | diving.service.spec.ts                   | Fonctionnel  | P1       |
| Plongées – Créer palanquée                     | DIVE-FRONT-003                         | diving.service.spec.ts                   | Fonctionnel  | P1       |
| Plongées – Mettre à jour                       | DIVE-FRONT-004                         | diving.service.spec.ts                   | Fonctionnel  | P1       |
| Plongées – Supprimer                           | DIVE-FRONT-005                         | diving.service.spec.ts                   | Fonctionnel  | P1       |
| Matériel CRUD – Lire tous                      | EQUIP-FRONT-001                        | equipment.service.spec.ts                | Fonctionnel  | P1       |
| Matériel CRUD – Créer                          | EQUIP-FRONT-002                        | equipment.service.spec.ts                | Fonctionnel  | P1       |
| Matériel CRUD – Mettre à jour                  | EQUIP-FRONT-003                        | equipment.service.spec.ts                | Fonctionnel  | P1       |
| Matériel CRUD – Supprimer                      | EQUIP-FRONT-004                        | equipment.service.spec.ts                | Fonctionnel  | P1       |
| Notifications – Message succès                 | NOTIF-FRONT-001                        | notification.service.spec.ts             | Fonctionnel  | P2       |
| Notifications – Type par défaut info           | NOTIF-FRONT-002                        | notification.service.spec.ts             | Fonctionnel  | P2       |
| Spots CRUD – Lire tous                         | SPOT-FRONT-001                         | spot.service.spec.ts                      | Fonctionnel  | P1       |
| Spots CRUD – Lire par id                       | SPOT-FRONT-002                         | spot.service.spec.ts                      | Fonctionnel  | P1       |
| Spots CRUD – Créer                             | SPOT-FRONT-003                         | spot.service.spec.ts                      | Fonctionnel  | P1       |
| Spots CRUD – Mettre à jour                     | SPOT-FRONT-004                         | spot.service.spec.ts                      | Fonctionnel  | P1       |
| Spots CRUD – Supprimer                         | SPOT-FRONT-005                         | spot.service.spec.ts                      | Fonctionnel  | P1       |
| Utilisateurs CRUD – Lire tous                  | USER-FRONT-001                         | users.service.spec.ts                     | Fonctionnel  | P1       |
| Utilisateurs CRUD – Créer                      | USER-FRONT-002                         | users.service.spec.ts                     | Fonctionnel  | P1       |
| Utilisateurs CRUD – Mettre à jour              | USER-FRONT-003                         | users.service.spec.ts                     | Fonctionnel  | P1       |
| Utilisateurs CRUD – Supprimer                  | USER-FRONT-004                         | users.service.spec.ts                     | Fonctionnel  | P1       |
| Login – Flux succès                            | LOGIN-CMP-001                          | login.component.spec.ts                   | Fonctionnel  | P1       |
| Login – Flux erreur                            | LOGIN-CMP-002                          | login.component.spec.ts                   | Fonctionnel  | P1       |
| Register – Initialisation formulaire           | REG-CMP-001                            | register.component.spec.ts                | Fonctionnel  | P2       |
| Register – Succès                              | REG-CMP-002                            | register.component.spec.ts                | Fonctionnel  | P2       |
| Register – Erreur                              | REG-CMP-003                            | register.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Chargement initial                  | CAL-CMP-001                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Clic date                           | CAL-CMP-002                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Clic événement                      | CAL-CMP-003                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Créer plongée                       | CAL-CMP-004                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Détail événement                    | CAL-CMP-005                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Suppression succès                  | CAL-CMP-006                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| Calendar – Suppression échec                   | CAL-CMP-007                            | calendar.component.spec.ts                | Fonctionnel  | P2       |
| CrudBoats – Chargement initial                 | CRUDBOAT-CMP-001                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudBoats – Charger tableau                    | CRUDBOAT-CMP-002                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudBoats – Créer                              | CRUDBOAT-CMP-003                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudBoats – Éditer                             | CRUDBOAT-CMP-004                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudBoats – Supprimer confirmé                 | CRUDBOAT-CMP-005                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudBoats – Supprimer annulé                   | CRUDBOAT-CMP-006                       | crud-boats.component.spec.ts              | Fonctionnel  | P2       |
| CrudDivers – Chargement initial                | CRUDDIVER-CMP-001                      | crud-divers.component.spec.ts             | Fonctionnel  | P2       |
| CrudDivers – Créer                             | CRUDDIVER-CMP-002                      | crud-divers.component.spec.ts             | Fonctionnel  | P2       |
| CrudDivers – Éditer                            | CRUDDIVER-CMP-003                      | crud-divers.component.spec.ts             | Fonctionnel  | P2       |
| CrudDivers – Supprimer confirmé                | CRUDDIVER-CMP-004                      | crud-divers.component.spec.ts             | Fonctionnel  | P2       |
| CrudDivers – Supprimer annulé                  | CRUDDIVER-CMP-005                      | crud-divers.component.spec.ts             | Fonctionnel  | P2       |
| CrudEquipments – Chargement initial            | CRUDEQ-CMP-001                         | crud-equipments.component.spec.ts         | Fonctionnel  | P2       |
| CrudEquipments – Créer                         | CRUDEQ-CMP-002                         | crud-equipments.component.spec.ts         | Fonctionnel  | P2       |
| CrudEquipments – Éditer                        | CRUDEQ-CMP-003                         | crud-equipments.component.spec.ts         | Fonctionnel  | P2       |
| CrudEquipments – Supprimer confirmé            | CRUDEQ-CMP-004                         | crud-equipments.component.spec.ts         | Fonctionnel  | P2       |
| CrudUsers – Chargement initial                 | CRUDUSER-CMP-001                       | crud-users.component.spec.ts              | Fonctionnel  | P2       |
| CrudUsers – Créer                              | CRUDUSER-CMP-002                       | crud-users.component.spec.ts              | Fonctionnel  | P2       |
| CrudUsers – Éditer                             | CRUDUSER-CMP-003                       | crud-users.component.spec.ts              | Fonctionnel  | P2       |
| CrudUsers – Supprimer confirmé                 | CRUDUSER-CMP-004                       | crud-users.component.spec.ts              | Fonctionnel  | P2       |
| Today – Chargement succès                      | TODAY-CMP-001                          | today.component.spec.ts                   | Fonctionnel  | P2       |
| Today – Chargement erreur                      | TODAY-CMP-002                          | today.component.spec.ts                   | Fonctionnel  | P2       |
| DashboardComponent – Création                  | DASH-CMP-001                           | dashboard.component.spec.ts               | Fonctionnel  | P2       |
| DashboardComponent – Changement onglet ≠ 2     | DASH-CMP-002                           | dashboard.component.spec.ts               | Fonctionnel  | P2       |
| DashboardComponent – Changement onglet = 2     | DASH-CMP-003                           | dashboard.component.spec.ts               | Fonctionnel  | P2       |
| Kanban – Création                              | KANBAN-CMP-001                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Chargement + répartition              | KANBAN-CMP-002                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Drag & drop changement statut         | KANBAN-CMP-003                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Ajout tâche                           | KANBAN-CMP-004                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Suppression confirmée                 | KANBAN-CMP-005                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Suppression annulée                   | KANBAN-CMP-006                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Passer en mode édition                | KANBAN-CMP-007                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Fin édition + update                  | KANBAN-CMP-008                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| Kanban – Fin édition sans update               | KANBAN-CMP-009                         | kanban.component.spec.ts                  | Fonctionnel  | P2       |
| SpotComponent – Création                       | SPOT-CMP-001                           | spot.component.spec.ts                    | Fonctionnel  | P2       |
| SpotComponent – Chargement + markers           | SPOT-CMP-002                           | spot.component.spec.ts                    | Fonctionnel  | P2       |
| SpotComponent – Créer spot                     | SPOT-CMP-003                           | spot.component.spec.ts                    | Fonctionnel  | P2       |
| SpotComponent – Annuler édition                | SPOT-CMP-004                           | spot.component.spec.ts                    | Fonctionnel  | P2       |
| Navbar – Création                              | NAV-CMP-001                            | navbar.component.spec.ts                  | Fonctionnel  | P2       |
| Navbar – Déconnexion                           | NAV-CMP-002                            | navbar.component.spec.ts                  | Fonctionnel  | P2       |
| Navbar – isLoggedIn false                      | NAV-CMP-003                            | navbar.component.spec.ts                  | Fonctionnel  | P2       |
| Navbar – isLoggedIn true                       | NAV-CMP-004                            | navbar.component.spec.ts                  | Fonctionnel  | P2       |
| GenericFormDialog – Création                   | GEN-FORM-001                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Init contrôles             | GEN-FORM-002                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Btn désactivé si invalide  | GEN-FORM-003                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Btn activé si valide       | GEN-FORM-004                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Soumission fermeture       | GEN-FORM-005                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Annulation                 | GEN-FORM-006                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| GenericFormDialog – Masquer mot de passe       | GEN-FORM-007                           | generic-form-dialog.component.spec.ts     | Fonctionnel  | P2       |
| Snackbar – Création                            | SNACKBAR-CMP-001                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| Snackbar – Affichage message                   | SNACKBAR-CMP-002                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| Snackbar – Style & icône success               | SNACKBAR-CMP-003                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| Snackbar – Style & icône error                 | SNACKBAR-CMP-004                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| Snackbar – Style & icône info                  | SNACKBAR-CMP-005                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| Snackbar – Fallback défaut                     | SNACKBAR-CMP-006                       | snackbar.component.spec.ts                | Fonctionnel  | P2       |
| AppComponent – Création                        | APP-CMP-001                            | app.component.spec.ts                     | Fonctionnel  | P2       |
| AppComponent – Propriété titre                 | APP-CMP-002                            | app.component.spec.ts                     | Fonctionnel  | P2       |
| AppComponent – Structure layout                | APP-CMP-003                            | app.component.spec.ts                     | Fonctionnel  | P2       |
