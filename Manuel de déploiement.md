# Mateleau — Manuel de déploiement (from scratch)

> Version : 1.0 — Dernière mise à jour : 11/08/2025
> Contexte cible : **DigitalOcean App Platform** (1 App = 2 components : Web Service Node + Static Site Angular) + **MongoDB Atlas** (prod)
> Repo : monorepo avec `mateleau-crm-backend/` et `mateleau-crm-frontend/`

---

## 0) Pré‑requis

* Comptes : **DigitalOcean**, **GitHub**, **MongoDB Atlas**.
* Branches : `master` (prod), `develop` (préprod), `feature/*`.
* Node LTS (dev local), Angular CLI installé.
* CI (recommandé) : tests front/back, build, Sonar (front & back).

0-bis) Récupérer le code (Git)
Local (dev)

git clone https://github.com/ElLuco6/crm-mateleau.git
cd <repo>
# branche de prod
git checkout master
# ou préprod
# git checkout pre-prod

DigitalOcean (prod)
Lors de la création de l’App, connecter le repo GitHub et sélectionner la branche master comme source de déploiement automatique.

---

## 1) Provisionner MongoDB Atlas

1. Créer un **cluster** (M0+), région proche (ex. *eu-west/central*).
2. Créer la base **`mateleau`** (ou `mateleau-crm`).
3. **Database User** dédié : `mateleau_app` (rôle `readWrite` sur la base).
4. **Network Access** :

   * Solution simple : `0.0.0.0/0` (temporaire) le temps du déploiement initial.
   * Recommandé : autoriser les **egress DO App Platform** (ou VPC peering si dispo).
5. Récupérer l’URI **SRV** et **URL‑encoder** le mot de passe.
   **Modèle (doc uniquement)** :
   `mongodb+srv://<DB_USER>:%3CDB_PASSWORD%3E@<CLUSTER_HOST>/<DB_NAME>?retryWrites=true&w=majority&appName=<APP_NAME>`

**Test local** :

```bash
# .env (non commité)
MONGO_URI="mongodb://localhost:27017/mateleau-dev"
JWT_SECRET="dev-only-long-random-string"
```

---

## 2) Créer l’App sur DigitalOcean (UI)

1. DO → **Apps** → **Create App** → Connecter le **repo GitHub**.
2. Déclarer **2 components** depuis le **même repo** :

   * **Web Service (API Node)**

     * **Source dir** : `mateleau-crm-backend`
     * **Build Command** : `bash -lc "cd mateleau-crm-backend && npm ci && npm run build"`
     * **Run Command** : `bash -lc "cd mateleau-crm-backend && node dist/server.js"`
     * **HTTP Port** : laissez DO fournir `$PORT` (ne rien hardcoder).
     * **Health Check** : `/api/health` (HTTP 200 attendu).
   * **Static Site (Angular)**

     * **Source dir** : `mateleau-crm-frontend`
     * **Build Command** :

       ```bash
       bash -lc '
         set -e
         node -v && npm -v
         cd mateleau-crm-frontend
         npm ci --no-audit --no-fund --loglevel=error
         npm run build -- --configuration=production
       '
       ```
     * **Output Directory** : `mateleau-crm-frontend/dist/mateleau-crm-frontend/browser`
3. **Auto‑deploy** : activer sur **`master`** (prod).
4. (Optionnel) **Preview Deployments** activés pour les PR.

---

## 3) Variables d’environnement & secrets (DO)

**App → Components → Settings → Environment Variables**

### 3.1 API (Web Service Node)

* `NODE_ENV=production`
* `CORS_ORIGIN=https://<APP_DEFAULT_DOMAIN>` *(ou votre domaine)*
* `JWT_SECRET` = *Encrypted Secret* (≥32 octets aléatoires)
* `MONGO_URI` = *Encrypted Secret* (URI SRV Atlas, **mot de passe encodé**)
* `MJ_APIKEY_PUBLIC`= *Encrypted Secret*
* `MJ_APIKEY_PRIVATE`= *Encrypted Secret*
* `MAIL_FROM` = *Encrypted Secret*
* `MAIL_FROM_NAME`= *Encrypted Secret*
* `MJ_TEMPLATE_DIVE_REMINDER` =*Encrypted Secret*


**Ne jamais** écrire de valeurs réelles dans la doc/dépôt. Utiliser des **placeholders** ici et dans la doc.

### 3.2 Front (Static Site Angular)

* L’URL API est fixée **au build** via `environment.prod.ts` :

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://<APP_DEFAULT_DOMAIN>/api'
};
```

> Variante runtime : `assets/config.json` chargé au démarrage (évite rebuilds pour changer d’URL).

---

## 4) Domaines & TLS

1. Utiliser le **sous‑domaine DO** généré (ex. `https://<slug>.ondigitalocean.app`).
2. (Optionnel) **Custom domain** :

   * Ajouter le domaine dans DO → **Domains**.
   * Créer un **CNAME** vers le domaine DO.
   * Certificats **Let’s Encrypt** gérés automatiquement par DO.

---

## 5) Premier déploiement

1. Pousser sur `master` (ou cliquer **Deploy**).
2. Suivre **Activity** jusqu’à l’état **Healthy** pour les 2 components.
3. Vérifier :

   * Front accessible
   * `/api/health` → 200
   * Connexion → Dashboard
   * Création/suppression d’une **plongée**
   * Calendrier/Export CSV.

---

## 6) Compte admin (initialisation)

 créer un admin manuellement (endpoint d’admin, script mongo, ou insertion contrôlée).


---

## 7) Sécurité & bonnes pratiques

* Variables marquées **Encrypted** dans DO ; rotation `JWT_SECRET` et mot de passe Atlas tous les 90 jours.
* Atlas : utilisateur **dédié** et **IP allowlist** restreinte (éviter `0.0.0.0/0` en prod).
* `PORT` : toujours `process.env.PORT` côté API.
* **CORS** : whitelist explicite du front.
* **Logs** : surveiller erreurs 5xx après chaque déploiement.

---

## 8) Dépannage (rapide)

* **Build Angular échoue** : version Node/Angular, chemin `Output Directory`.
* **CORS** : vérifier `CORS_ORIGIN` côté API.
* **Erreur DB** : MONGO\_URI mal encodée / mauvais user / IP non autorisée.
* **Health KO** : `/api/health` doit rester **sans ping DB** (évite faux négatifs).
* **404 front en refresh** : s’assurer que le **Static Site** sert `index.html` (SPA routing par défaut sur DO).

---

## 9) (Option) Déploiement par CLI `doctl`

> Alternative scriptable ; utile pour répliquer l’app.

**Spec minimal (extrait)** :

```yaml
name: mateleau
region: fra1
services:
  - name: api
    source_dir: mateleau-crm-backend
    envs:
      - key: NODE_ENV
        value: production
      - key: CORS_ORIGIN
        value: https://<APP_DEFAULT_DOMAIN>
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
      - key: MONGO_URI
        scope: RUN_TIME
        type: SECRET
    run_command: bash -lc "cd mateleau-crm-backend && node dist/server.js"
    build_command: bash -lc "cd mateleau-crm-backend && npm ci && npm run build"
    http_port: 8080
    health_check:
      http_path: /api/health
static_sites:
  - name: front
    source_dir: mateleau-crm-frontend
    build_command: bash -lc "cd mateleau-crm-frontend && npm ci && npm run build -- --configuration=production"
    output_dir: mateleau-crm-frontend/dist/mateleau-crm-frontend/browser
```

> Commande : `doctl apps create --spec ./do-app.yaml`

---

## 10) Check‑list déploiement initial

* [ ] Cluster Atlas + user dédié + allowlist OK
* [ ] Repo GitHub connecté à DO
* [ ] 2 components configurés (API + Static Site)
* [ ] Variables d’env **Encrypted** (JWT\_SECRET, MONGO\_URI)
* [ ] Health check `/api/health`
* [ ] Premier déploiement **Healthy**
* [ ] Admin initial créé
* [ ] (Option) Domaine custom + TLS OK

---

### Historique des changements

* 11/08/2025 : version initiale (DO App Platform + Atlas, monorepo).
