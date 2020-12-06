CC 	= gcc
CFLAGS 	= -Wall -c -g

LIBS 	=
LIBDIR	= lib
INCLUDE	= include

TARGET 	= day5
SOURCES = main.c
OBJECTS	= $(SOURCES:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) -o $@ $(OBJECTS) -L$(LIBDIR) $(LIBS)
%.o: %.c
	$(CC) $(CFLAGS) -I$(INCLUDE) -o $@ $<

.PHONY: clean
clean: 
	rm -rf $(OBJECTS) $(TARGET)
