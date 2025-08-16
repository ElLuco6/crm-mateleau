# Mateleau — Manuel de déploiement (from scratch)

> Version : **1.1** — Dernière mise à jour : 11/08/2025
> Cible : **DigitalOcean App Platform** (1 App = 2 components : Web Service Node + Static Site Angular) + **MongoDB Atlas**
> **Région DO** : `fra1` (EU)
> **Domaine prod** : [https://crm-mateleau-isvbf.ondigitalocean.app/](https://crm-mateleau-isvbf.ondigitalocean.app/)
> Repo : monorepo avec `mateleau-crm-backend/` et `mateleau-crm-frontend/`

---

## 0) Pré‑requis

* Comptes : **DigitalOcean**, **GitHub**, **MongoDB Atlas**.
* Branches : `master` (prod), `develop` (préprod), `feature/*`.
* Node LTS (local), Angular CLI.
* CI recommandée : tests front/back + build + Sonar (front & back) — **pas** de déploiement depuis la CI.

---

## 1) Provisionner MongoDB Atlas

1. Créer un **cluster** (M0+), région EU proche.
2. Créer la base **`mateleau-crm`**.
3. **Database User** dédié : `mateleau_app` (rôle `readWrite` sur **mateleau-crm**).
4. **Network Access** :

   * Simple (temporaire) : `0.0.0.0/0` le temps du premier déploiement.
   * Recommandé : autoriser les **egress** de DO App Platform (ou VPC peering si dispo).
5. Récupérer l’URI **SRV** et **URL‑encoder** le mot de passe.
   **Modèle (doc uniquement)** :
   `mongodb+srv://<DB_USER>:%3CDB_PASSWORD%3E@<CLUSTER_HOST>/mateleau-crm?retryWrites=true&w=majority&appName=<APP_NAME>`

**Test local** :

```bash
# .env (non commité)
MONGO_URI="mongodb://localhost:27017/mateleau-dev"
JWT_SECRET="dev-only-long-random-string"
```

---

## 2) Créer l’App sur DigitalOcean (UI)

1. DO → **Apps** → **Create App** → connecter le **repo GitHub**.
2. Déclarer **2 components** depuis le **même repo** :

   * **Web Service (API Node)**

     * **Source dir** : `mateleau-crm-backend`
     * **Build Command** : `bash -lc "cd mateleau-crm-backend && npm ci && npm run build"`
     * **Run Command** : `bash -lc "cd mateleau-crm-backend && node dist/server.js"`
     * **HTTP Port** : laisser DO fournir `$PORT` (ne rien hardcoder).
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
4. **Preview Deployments** : **désactivés** (à activer plus tard si besoin).

---

## 3) Variables d’environnement & secrets (DO)

**App → Components → Settings → Environment Variables**

### 3.1 API (Web Service Node)

* `NODE_ENV=production`
* `CORS_ORIGIN=https://crm-mateleau-isvbf.ondigitalocean.app`
* `JWT_SECRET` = *Encrypted Secret* (≥32 octets aléatoires)
* `MONGO_URI` = *Encrypted Secret* (URI SRV Atlas, **mot de passe encodé**)
* `MJ_APIKEY_PUBLIC`= *Encrypted Secret*
* `MJ_APIKEY_PRIVATE`= *Encrypted Secret*
* `MAIL_FROM` = *Encrypted Secret*
* `MAIL_FROM_NAME`= *Encrypted Secret*
* `MJ_TEMPLATE_DIVE_REMINDER` =*Encrypted Secret*

> **Ne jamais** inscrire de valeurs réelles dans la doc/dépôt. Utiliser des **placeholders** ici et dans la doc.

### 3.2 Front (Static Site Angular)

L’URL API est fixée **au build** via `environment.prod.ts` :

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://crm-mateleau-isvbf.ondigitalocean.app/api'
};
```


---

## 4) Domaines & TLS

* Utiliser le **domaine DO par défaut** :
  `https://crm-mateleau-isvbf.ondigitalocean.app/` (pas de domaine custom pour l’instant).
* (Optionnel, plus tard) Ajouter un **custom domain** → CNAME vers le domaine DO → TLS géré automatiquement.

---

## 5) Premier déploiement

1. Pousser sur `master` (ou cliquer **Deploy**).
2. Suivre **Activity** jusqu’à l’état **Healthy** pour les 2 components.
3. Vérifier :

   * Front accessible
   * `/api/health` → 200
   * Connexion → Dashboard
   * Création/suppression d’une **plongée**
   * Calendrier + Export CSV

---

## 6) Compte admin (initialisation)


2. Dans **Atlas → Data Explorer**, insérer dans `users` (adapter au schéma réel) :

   ```json
   {
     "name": "John Doe",
     "email": "admin@mateleau.app",
     "password": "<HASH_BCRYPT>",
     "role": "admin",
     "divingLvl": 0| 1 | 2 | 3 | 4 | 5,
   }
   ```




## 7) Sécurité & bonnes pratiques

* Variables marquées **Encrypted** dans DO ; rotation `JWT_SECRET` et mot de passe Atlas tous les 90 jours.
* Atlas : utilisateur **dédié** et **IP allowlist** restreinte (éviter `0.0.0.0/0` en prod).
* API : écouter sur `process.env.PORT` (pas de port hardcodé).
* **CORS** : whitelist explicite du front.
* **Logs** : surveiller erreurs 5xx après chaque déploiement.

---

## 8) Dépannage (rapide)

* **Build Angular échoue** : version Node/Angular, chemin `Output Directory`.
* **CORS** : vérifier `CORS_ORIGIN` côté API.
* **Erreur DB** : `MONGO_URI` mal encodée / mauvais user / IP non autorisée.
* **Health KO** : `/api/health` doit rester **sans ping DB** (évite faux négatifs).
* **404 front en refresh** : SPA fallback sur `index.html` (config par défaut DO Static Site).

---



## 9) Check‑list déploiement initial

* [ ] Cluster Atlas + user dédié + allowlist OK
* [ ] Repo GitHub connecté à DO
* [ ] 2 components configurés (API + Static Site)
* [ ] Variables d’env **Encrypted** (JWT\_SECRET, MONGO\_URI)
* [ ] Health check `/api/health`
* [ ] Premier déploiement **Healthy**
* [ ] Admin initial créé

---

### Annexe — Différence avec le **Manuel de mise à jour**

* **Ce document** explique **comment déployer depuis zéro** (création du cluster Atlas, création de l’App DO, variables d’env, premier admin…).
* Le **Manuel de mise à jour** explique **comment livrer une nouvelle version** sur une infra **déjà en place** (branches, CI/qualité, déclenchement DO, backups, smoke tests, rollback).

---

### Historique des changements

* 11/08/2025 : v1.1 — alignement sur `fra1`, `mateleau-crm`, domaine DO, Angular `mateleau-crm-frontend`, Preview Deployments off.
