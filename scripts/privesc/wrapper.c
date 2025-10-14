// Contenuto di /scripts/privesc/wrapper.c
#include <unistd.h>

int main(int argc, char **argv) {
    char *new_argv[argc + 1];
    new_argv[0] = "/opt/tools/log_archiver.py";
    for (int i = 1; i < argc; i++) {
        new_argv[i] = argv[i];
    }
    new_argv[argc] = NULL;
    
    execv("/usr/bin/python3", new_argv);
    return 0;
}