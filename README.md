liens repo git : https://github.com/ElLuco6/crm-mateleau
liens de la prod : https://crm-mateleau-isvbf.ondigitalocean.app/dashboard



# Mateleau CRM — Environnement de développement (Docker)

Démarrez une stack locale complète **MongoDB + données de démo + Backend + Frontend** avec quelques commandes.

> Fonctionne sous **Windows / macOS / Linux**. Les données de démo proviennent d’un **dump Mongo** (fichiers `.bson` + `.metadata.json`) versionné dans le dépôt pour un setup reproductible.

---

## Prérequis

* **Docker Desktop** (inclut Docker Compose)
* *(Optionnel)* **Node.js 18+** si vous souhaitez aussi lancer les services hors Docker

---

## Arborescence (extrait utile)

```
Mateleau-crm/
├─ infra/
│  └─ docker-compose-dev.yml        # compose pour le dev local
├─ db/
│  └─ seed/
│     └─ mateleau-crm/             # dump BSON (.bson + .metadata.json)
├─ mateleau-crm-backend/
│  ├─ Dockerfile.dev
│  └─ .env.example                  # à copier en .env
└─ mateleau-crm-frontend/
   └─ Dockerfile.dev
```

---

## TL;DR — Démarrage rapide

Depuis le dossier **`infra/`** :

```bash
# 1) Créer l’ENV backend à partir du template
cp ../mateleau-crm-backend/.env.example ../mateleau-crm-backend/.env

# 2) Lancer toute la stack
docker compose -f docker-compose-dev.yml up -d --build

# 3) Ouvrir le front
# http://localhost:4200
```

> Au **premier run**, la base est restaurée à partir du dump dans le volume `mongo-data` (uniquement si la DB est vide). Les runs suivants réutilisent la même DB.

**Windows PowerShell** : mêmes commandes (remplacez `cp` par un copier-coller de fichier via l’Explorateur ou `copy`).

---

## Démarrage **sans Docker** (local pur)

Si vous préférez lancer le projet **sans Docker**, voici la procédure.

### 1) Prérequis

* **Node.js 18+** et **npm**
* **Angular CLI** (recommandé) :

  ```bash
  npm i -g @angular/cli
  ```
* **MongoDB Community Server** installé et démarré en local (par défaut sur `mongodb://localhost:27017`).
* *(Optionnel)* **MongoDB Compass** pour visualiser les données.

### 2) Restaurer les données de démo (dump BSON du repo)

Depuis la **racine** du dépôt, restaurez le dump `db/seed/mateleau-crm` dans votre Mongo local :

* **macOS / Linux**

  ```bash
  mongorestore --drop --db mateleau-crm ./db/seed/mateleau-crm
  ```
* **Windows PowerShell**

  ```powershell
  mongorestore --drop --db mateleau-crm .\db\seed\mateleau-crm
  ```

> Après restauration, vous devriez voir des collections (users, dives, etc.) dans la DB `mateleau-crm`.

### 3) Lancer le **backend** en local

```bash
cd mateleau-crm-backend
# créer l'env local
cp .env.example .env
# IMPORTANT: dans .env, utilisez la DB locale
# MONGO_URI=mongodb://localhost:27017/mateleau-crm
npm ci
npm run dev   # ou npm run start:dev selon votre package.json
```

Le backend écoute sur `http://localhost:5000`.

### 4) Lancer le **frontend** en local

```bash
cd ../mateleau-crm-frontend
npm ci
# assurez-vous que proxy.conf.json cible le backend local
# {
#   "/api": { "target": "http://localhost:5000", "secure": false, "changeOrigin": true, "logLevel": "debug" }
# }
ng serve 
# ou simplement
npm run start
```

Accès front : `http://localhost:4200`


## Services démarrés

* **mongo** : MongoDB 7, port `27017`, volume `mongo-data`
* **mongo-seed** : conteneur one‑shot qui **attend** Mongo puis exécute `mongorestore` depuis `../db/seed/mateleau-crm` **si** la DB est vide
* **backend** : Node (mode dev) sur `http://localhost:5000`

  * se connecte à `mongodb://mongo:27017/mateleau-crm`
* **frontend** : Angular dev server sur `http://localhost:4200`

  * utilise `proxy.conf.json` pour router `/api` vers `http://backend:5000`

---

## Variables d’environnement (backend)

Créez `mateleau-crm-backend/.env` à partir de `.env.example` et adaptez si besoin :

```dotenv
# DB (Docker)
MONGO_URI=mongodb://mongo:27017/mateleau-crm
PORT=5000

# JWT, Mail, etc. (placeholders)
JWT_SECRET=changeme
MJ_APIKEY_PUBLIC=changeme
MJ_APIKEY_PRIVATE=changeme
MAIL_FROM=dev@example.com
MAIL_FROM_NAME=Mateleau
MJ_TEMPLATE_DIVE_REMINDER=0
```

> **Ne commitez jamais de secrets réels.** Le fichier `.env.example` doit contenir uniquement des valeurs factices.

---

## Proxy Angular (dev)

Vérifiez que `mateleau-crm-frontend/proxy.conf.json` contient :

```json
{
  "/api": {
    "target": "http://backend:5000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

Le serveur dev est lancé avec :

```bash
npm run start -- --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.json
```

---

## tâches courantes

### Voir les logs d’un service

Depuis `infra/` :

```bash
docker compose -f docker-compose-dev.yml logs -f backend
# ou
docker compose -f docker-compose-dev.yml logs -f frontend
```

### Remettre la base à zéro et reseed

```bash
docker compose -f docker-compose-dev.yml down -v   # supprime le volume mongo-data
docker compose -f docker-compose-dev.yml up -d --build
```

### Inspecter la DB avec mongosh

```bash
docker exec -it mateleau-crm-mongo mongosh --quiet --eval "db.runCommand({ ping: 1 })"
```

### Se connecter avec MongoDB Compass

* Hôte : `127.0.0.1`
* Port : `27017`
* DB : `mateleau-crm`

---

## Comment fonctionne le seed

Le service `mongo-seed` :

1. Attend que Mongo réponde (`ping`)
2. Si la base `mateleau-crm` a **0 collection**, restaure depuis le dump du repo

**Emplacement du dump dans le repo :** `db/seed/mateleau-crm/` avec `*.bson` et `*.metadata.json` (générés par `mongodump`).

**Arbo attendue par `mongorestore` :**

```
/seed/mateleau-crm/
  users.bson
  users.metadata.json
  ...
```

> Pour **mettre à jour** le dump, remplacez les fichiers dans ce dossier puis relancez avec `down -v` puis `up`.

---

## Mettre à jour le dump (depuis la DB locale en cours d’exécution)

> À lancer depuis la racine du repo ; adaptez les chemins selon votre OS.

**Créer un dump frais de la DB locale `mateleau-crm` :**

```bash
# macOS/Linux
docker exec mateleau-crm-mongo mongodump --db=mateleau-crm --out=/tmp/dump && \
  docker cp mateleau-crm-mongo:/tmp/dump/mateleau-crm ./db/seed/

# Windows PowerShell
docker exec mateleau-crm-mongo mongodump --db=mateleau-crm --out=/tmp/dump
docker cp mateleau-crm-mongo:/tmp/dump/mateleau-crm ./db/seed/
```

Commitez ensuite le dossier `db/seed/mateleau-crm/` mis à jour.

> **N’incluez jamais de données sensibles de prod** sans anonymisation. Pour l’équipe, privilégiez des données synthétiques/anonymisées.

---

## Tests
# Frontend (Angular + Karma)

# Hors Docker :
    cd mateleau-crm-frontend
    ng test # lance Karma en watch
    # ou
    npm run test
# Via Docker :
    cd infra
    docker compose -f docker-compose-dev.yml run --rm backend npm run test

Pour un mode CI, ajoutez par ex. --watch=false --browsers=ChromeHeadless dans la commande ou la config Karma.


# Backend (Node)

# Hors Docker :
    cd mateleau-crm-backend
    npm run test
# Via Docker :
    cd infra
    docker compose -f docker-compose-dev.yml run --rm backend npm run test

Si vos tests nécessitent la base, assurez-vous que le service mongo tourne (et éventuellement un MONGO_URI spécifique de test via .env.test)



## Dépannage

### Le front a des erreurs CORS

En dev, on appelle l’API via `/api` et le proxy Angular redirige vers `http://backend:5000`. Vérifiez que le proxy est actif (fichier ci‑dessus) et que vous ouvrez bien `http://localhost:4200`.

### Le backend se connecte mais la DB est vide

* Le seed ne s’exécute **que si** la DB est vide. Pour forcer un reseed : `docker compose -f docker-compose-dev.yml down -v` puis `up -d --build`.
* Vérifiez que les fichiers du dump existent et sont montés (dans le conteneur Mongo) :

  ```bash
  docker exec -it mateleau-crm-mongo sh -lc "ls -l /seed/mateleau-crm || true"
  ```

### `mongorestore` affiche « don't know what to do with file »

Placez les fichiers **dans un sous-dossier au nom de la DB**, ex. `/seed/mateleau-crm/users.bson`, et pointez `mongorestore` sur ce dossier avec `--db mateleau-crm` **ou** utilisez `--nsInclude 'mateleau-crm.*'`.

### Transactions / replica set

En dev on tourne en **standalone** (sans replica set). Si votre code utilise des transactions, désactivez-les via une variable d’env (ex. `USE_TRANSACTIONS=false`), ou activez un replica set mono‑noeud :

```
command: ["mongod","--replSet","rs0","--bind_ip_all"]
# puis une fois : rs.initiate({_id:'rs0',members:[{_id:0,host:'mongo:27017'}]})
# et utilisez MONGO_URI=...replicaSet=rs0
```

### Particularités Windows (chemins)

Les chemins de volumes dans Compose sont **relatifs à `infra/`**. Si le seed ne voit pas les fichiers, revérifiez `../db/seed/mateleau-crm` depuis `infra/`.

---

## Annexe — Ce que contient `docker-compose-dev.yml`

* **mongo** : base + volume
* **mongo-seed** : attend Mongo ; exécute `mongorestore` depuis le dump du repo si la DB est vide
* **backend** : serveur dev (`npm run dev`), exposé sur le port 5000
* **frontend** : serveur Angular dev avec proxy vers backend, exposé sur le port 4200

---

## Aide‑mémoire (one‑liners)

```bash
# Démarrer toute la stack
(cd infra && docker compose -f docker-compose-dev.yml up -d --build)

# Réinitialiser la DB et reseed
(cd infra && docker compose -f docker-compose-dev.yml down -v && docker compose -f docker-compose-dev.yml up -d)

# Logs backend
(cd infra && docker compose -f docker-compose-dev.yml logs -f backend)

# Lister les collections et leurs counts
docker exec -it mateleau-crm-mongo mongosh --quiet --eval "var d=db.getMongo().getDB('mateleau-crm'); d.getCollectionInfos().forEach(ci => print(ci.name, d.getCollection(ci.name).countDocuments()));"
```

## L’édition de plongée est temporairement désactivée sur master. Le développement continue sur la branche edit-dive
## Si aucune requete ne fonctionent vérifier que vous etent bien connecter ou logout -> login
