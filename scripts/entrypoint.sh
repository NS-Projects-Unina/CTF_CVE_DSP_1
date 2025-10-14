#!/bin/bash

# Avvia il demone SSH in background
/usr/sbin/sshd -D &

# Avvia l'applicazione Next.js come utente 'web'
echo "Avvio della webapp come utente 'web'..."
exec su -s /bin/bash -c "cd /app && npm start" web