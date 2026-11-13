# Closio: Clothing Store

A server-rendered clothing storefront built with Node.js, Express, EJS, and MongoDB, deployed on Vercel.

**Live site:** [closio-clothing-store-dish-dudhats-projects.vercel.app](https://closio-clothing-store-dish-dudhats-projects.vercel.app/)  
**Repository:** [dudhat52/Closio-Clothing_store](https://github.com/dudhat52/Closio-Clothing_store)

```text
$ closio --stack

runtime     Node.js
framework   Express 4
views       EJS (+ express-ejs-layouts)
database    MongoDB via Mongoose
sessions    express-session (MongoDB session store listed in dependencies)
styling     Tailwind CSS 4, Bootstrap 5
hosting     Vercel
```

| | |
| --- | --- |
| **Primary language** | EJS / JavaScript |
| **History** | 41 commits on `main` |
| **Status** | Published and deployed |

---

## Overview

Closio is a full-stack web application for browsing and managing a clothing catalogue. It is the clearest example in my public work of building a complete server-side application: routing, controllers, data models, authentication, templates, configuration, and deployment.

I include it in this portfolio because it shows software development fundamentals that sit underneath my automation work: handling HTTP requests, validating input, persisting data, managing sessions, and keeping secrets out of source control.

> The `package.json` is named `web322-assignment-5`, which suggests the project began as a web programming course assignment. If that's accurate, say so here. Being upfront about a project's origin is more credible than leaving a reviewer to discover it.

---

## Architecture

The repository follows a conventional MVC layout:

```text
Closio-Clothing_store/
├── server.js          application entry point
├── routes/            URL → controller mapping
├── controllers/       request handling and business logic
├── models/            Mongoose schemas
├── middlewares/       cross-cutting request logic
├── utils/             shared helpers
├── views/             EJS templates
├── public/            static assets
├── vercel.json        Vercel deployment configuration
├── .env_sample        template for required environment variables
└── package.json
```

```text
Browser
   │  HTTP request
   ▼
server.js ──► middlewares ──► routes ──► controllers ──► models ──► MongoDB
                                              │
                                              ▼
                                        views (EJS) ──► HTML response
```

**Why this structure matters.** Separating routes, controllers, and models keeps each layer small enough to change independently. Adding a new page means a route, a controller function, and a view, without touching unrelated code.

---

## Capabilities

### Confirmed from the repository

- Express server with `npm start` and `npm run dev` (nodemon) scripts
- MVC folder structure, as listed above
- Environment configuration through a committed `.env_sample`, with `.gitignore` present
- Deployment configuration for Vercel (`vercel.json`, `.vercel` folder)
- A public live deployment linked from the repository

### Indicated by dependencies (confirm against your code)

The installed packages suggest the following capabilities. Each is plausible but unconfirmed until checked against the source.

| Capability | Suggested by |
| --- | --- |
| Password hashing | `bcrypt` / `bcryptjs` |
| Session-based login, persisted in MongoDB | `express-session`, `connect-mongo` |
| One-time messages such as "Login failed" | `connect-flash` |
| Product image uploads | `multer`, `express-fileupload` |
| Transactional email | `nodemailer`, `mailgun.js` |
| Server-rendered layouts | `ejs`, `express-ejs-layouts` |
| Responsive styling | `tailwindcss`, `bootstrap` |
| Performance telemetry on Vercel | `@vercel/speed-insights` |

---

## Run it locally

```bash
git clone https://github.com/dudhat52/Closio-Clothing_store.git
cd Closio-Clothing_store
npm install
cp .env_sample .env     # then fill in your own values
npm run dev             # or: npm start
```

The `.env_sample` file lists the environment variables the app expects. Use your own MongoDB connection string and credentials, and never commit a real `.env`.

---

## Engineering notes

Observations from reviewing the dependency list. These are the kind of cleanup a maintainer does after an application has grown.

| Observation | Suggested action |
| --- | --- |
| Both `bcrypt` and `bcryptjs` are installed | Keep one; they do the same job |
| Both `connect-mongo` and `connect-mongodb-session` are installed | Keep whichever the app actually uses |
| Both `ejs` and `express-handlebars` are installed | Remove the unused templating engine |
| `path` is listed as a dependency | `path` is built into Node.js; the npm package is unnecessary |
| `gitignore` and `pat` appear as dependencies | These look accidental; remove if unused |
| `.DS_Store` is committed | Delete it and add it to `.gitignore` |

Trimming unused dependencies reduces install time and the surface area for security advisories. Running `npm ls` and `npm audit` is a good first step.

---

## Potential improvements

- Add a `README` section with screenshots of the catalogue, login, and admin views.
- Add automated tests for the controllers and authentication flow.
- Add input validation and rate limiting on login routes.
- Add a seed script that loads sample products into a fresh database.
- Document the data model with a short entity diagram.
- Add a CI workflow that runs `npm audit` and tests on every push.

---

## What this project demonstrates

- Building and deploying a complete server-rendered web application
- Structuring code in layers (routes, controllers, models, views)
- Working with a document database through an ODM
- Handling configuration and secrets with environment variables
- Shipping to a hosted platform and keeping it running
