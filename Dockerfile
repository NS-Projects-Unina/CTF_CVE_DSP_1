# Usa un'immagine base con Node.js e un sistema Debian
FROM node:22-bookworm-slim

# 1. INSTALLAZIONE DIPENDENZE DI SISTEMA
RUN apt-get update && apt-get install -y \
    openssh-server \
    gcc \
    python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. CONFIGURAZIONE SSH
# Permetti il login con password
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
# Crea la directory per il demone SSH
RUN mkdir -p /var/run/sshd

# 3. CREAZIONE UTENTI
# Utente 'web' a bassi privilegi per la reverse shell
RUN useradd -m -s /bin/bash web
# Utente 'simone' per la seconda fase (password: scoobydoo)
RUN useradd -m -s /bin/bash simone
RUN echo "simone:scoobydoo" | chpasswd

# 4. SETUP DELLA WEBAPP
WORKDIR /app
COPY ./nextjs-app .
# Imposta i permessi corretti per la cartella della webapp
RUN chown -R web:web /app
# Installa le dipendenze e builda l'app
RUN su -s /bin/bash -c "npm install && npm run build" web
# Copia il file di backup crittografato in una posizione trovabile
COPY ./scripts/backup/database_backup.aes /home/web

# 5. SETUP PRIVILEGE ESCALATION
# Copia i file necessari
COPY ./scripts/privesc /opt/tools
# Compila il wrapper SUID
RUN gcc /opt/tools/wrapper.c -o /opt/tools/archive-logs
# Imposta permessi e proprietari corretti
RUN chown root:root /opt/tools/log_archiver.py && chmod 644 /opt/tools/log_archiver.py
RUN chown root:root /opt/tools/archive-logs && chmod 4755 /opt/tools/archive-logs
# Pre-configura il PATH vulnerabile per simone
RUN echo 'export PATH=/home/simone/bin:$PATH' >> /home/simone/.bashrc
RUN mkdir /home/simone/bin && chown simone:simone /home/simone/bin

# 6. PIAZZA LE FLAG
RUN echo "ctf{flag_utente_simone_trovata!}" > /home/simone/user.txt && \
    chown simone:simone /home/simone/user.txt && \
    chmod 400 /home/simone/user.txt
RUN echo "ctf{privilege_escalation_completata!}" > /root/root.txt && \
    chmod 400 /root/root.txt

# 7. ENTRYPOINT
COPY ./scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ESPOSIZIONE PORTE
EXPOSE 3000
EXPOSE 22

# Comando di avvio
ENTRYPOINT ["/entrypoint.sh"]