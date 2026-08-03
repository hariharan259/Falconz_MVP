FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite in host mode so it's accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
