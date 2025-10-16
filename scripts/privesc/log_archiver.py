# /opt/tools/log_archiver.py
import os
import sys
import datetime

def log_message(message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[*] [{timestamp}] {message}")

def main():
    log_message("Log Archiver Utility - Avviato.")
    if len(sys.argv) < 2:
        print("Uso: <programma> <percorso_del_file_log>")
        sys.exit(1)

    log_file = sys.argv[1]
    log_message(f"File target: {log_file}")

    if not os.path.exists(log_file):
        log_message(f"ERRORE: Il file '{log_file}' non esiste.")
        sys.exit(1)

    try:
        euid = os.geteuid()
        os.setuid(euid)
    except OSError as e:
        sys.exit(1)

    command_to_run = f"gzip {log_file}"
    os.system(command_to_run)

    log_message(f"Archiviazione completata.")

if __name__ == "__main__":
    main()
