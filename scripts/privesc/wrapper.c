#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        printf("Uso: %s <percorso_del_file_log>\n", argv[0]);
        return 1;
    }

    char command[512];
    snprintf(command, sizeof(command), "/usr/bin/python3 /var/opt/log_archiver.py %s", argv[1]);

    setuid(0);
    
    system(command);

    return 0;
}
