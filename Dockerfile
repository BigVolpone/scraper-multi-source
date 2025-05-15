# Utiliser une image Playwright officielle compatible avec Node.js
FROM mcr.microsoft.com/playwright:v1.40.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Installer les navigateurs Playwright (Chromium, Firefox, WebKit)
RUN npx playwright install

# Copier le reste du code source de votre projet
COPY . .

# Exposer le port sur lequel votre application tourne
EXPOSE 8080

# Démarrer l'application
CMD ["npm", "start"]
