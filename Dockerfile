# Utiliser une image Playwright officielle compatible avec Node.js
FROM mcr.microsoft.com/playwright:v1.40.0

# Installer xvfb
RUN apt-get update && apt-get install -y xvfb

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer les navigateurs Playwright
RUN npx playwright install

# Copier le reste du code source
COPY . .

# Exposer le port de l'application
EXPOSE 8080

# Lancer l'application avec xvfb
CMD ["xvfb-run", "--server-args=-screen 0 1024x768x24", "npm", "start"]
