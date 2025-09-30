// C Program for Serial Port Communication (POSIX systems - Linux/macOS)
// This program opens a serial port, sets the baud rate, writes data, and reads data.

#include <stdio.h>    // Standard input/output functions
#include <string.h>   // String manipulation functions
#include <fcntl.h>    // File control options (open, close)
#include <errno.h>    // Error number definitions
#include <termios.h>  // POSIX terminal control definitions
#include <unistd.h>   // POSIX standard functions (read, write, close)

// Define the serial port device file path
// NOTE: Change this to your actual serial port (e.g., "/dev/ttyACM0" or "COM3" equivalent)
#define SERIAL_PORT "/dev/ttyUSB0"
#define BAUD_RATE B9600
#define BUFFER_SIZE 256

/**
 * @brief Opens the specified serial port.
 * @param port_path The path to the serial port device file.
 * @return The file descriptor of the opened port, or -1 on error.
 */
int open_serial_port(const char* port_path) {
    // O_RDWR: Open for reading and writing
    // O_NOCTTY: Terminal will not be the controlling terminal of the process
    // O_NDELAY: Non-blocking access, necessary for some drivers
    int fd = open(port_path, O_RDWR | O_NOCTTY | O_NDELAY);

    if (fd < 0) {
        perror("Error opening serial port");
    } else {
        // Clear the O_NDELAY flag after opening to restore blocking behavior
        fcntl(fd, F_SETFL, 0);
    }
    return fd;
}

/**
 * @brief Configures the serial port settings (baud rate, data bits, parity, stop bits).
 * @param fd The file descriptor of the opened serial port.
 * @return 0 on success, -1 on failure.
 */
int configure_port(int fd) {
    struct termios tty;

    // Get the current terminal attributes
    if (tcgetattr(fd, &tty) != 0) {
        perror("Error getting port attributes (tcgetattr)");
        return -1;
    }

    // --- Setting Control Modes ---
    // Set Baud Rate for input and output
    cfsetospeed(&tty, BAUD_RATE);
    cfsetispeed(&tty, BAUD_RATE);

    // CSIZE: 8 bits per byte (CS8)
    tty.c_cflag &= ~CSIZE;
    tty.c_cflag |= CS8;

    // IGNPAR: Ignore framing errors and parity errors
    tty.c_iflag |= IGNPAR;

    // CLOCAL: Ignore modem control lines (DCD, etc.)
    // CREAD: Enable receiver
    tty.c_cflag |= (CLOCAL | CREAD);

    // Disable parity (PARENB = Parity Enable, PARODD = Odd Parity)
    tty.c_cflag &= ~PARENB;
    tty.c_cflag &= ~PARODD;

    // Disable hardware flow control (RTS/CTS)
    tty.c_cflag &= ~CRTSCTS;

    // 1 stop bit
    tty.c_cflag &= ~CSTOPB;

    // --- Setting Local Modes ---
    // ICANON: Disable canonical mode (line-by-line input)
    // ECHO: Disable echo
    // ECHOE: Disable erase
    // ISIG: Disable interpretation of INTR, QUIT, and SUSP chars
    tty.c_lflag &= ~(ICANON | ECHO | ECHOE | ISIG);

    // --- Setting Input Modes ---
    // IXON/IXOFF: Disable software flow control (XON/XOFF)
    tty.c_iflag &= ~(IXON | IXOFF | IXANY);

    // ICRNL: Translate CR to NL (Disable this for raw data)
    tty.c_iflag &= ~(ICRNL);

    // --- Setting Output Modes ---
    // OPOST: Disable post-processing of output (raw output)
    tty.c_oflag &= ~OPOST;

    // --- Setting Control Characters (VMIN/VTIME) ---
    // VMIN = 0: Minimum number of characters to read (0 means don't wait for minimum)
    // VTIME = 10: Timeout in 10 * 0.1 seconds (1.0 second) for non-canonical read
    tty.c_cc[VMIN]  = 0;
    tty.c_cc[VTIME] = 10; // Timeout = 1.0 second

    // Flush pending data and apply the new configuration
    if (tcsetattr(fd, TCSANOW, &tty) != 0) {
        perror("Error applying port attributes (tcsetattr)");
        return -1;
    }

    printf("Serial port configured successfully at %d baud.\n", BAUD_RATE);
    return 0;
}

/**
 * @brief Writes data to the serial port.
 * @param fd The file descriptor.
 * @param data The string to write.
 * @return The number of bytes written, or -1 on error.
 */
int write_port(int fd, const char* data) {
    int len = strlen(data);
    int n = write(fd, data, len);

    if (n < 0) {
        perror("Error writing to serial port");
        return -1;
    }
    printf("Wrote %d bytes: '%s'\n", n, data);
    return n;
}

/**
 * @brief Reads data from the serial port.
 * @param fd The file descriptor.
 * @param buffer The buffer to store the read data.
 * @param max_len The maximum number of bytes to read.
 * @return The number of bytes read, or -1 on error.
 */
int read_port(int fd, char* buffer, size_t max_len) {
    // Wait for up to 1 second (set by VTIME) to read data
    int n = read(fd, buffer, max_len - 1);

    if (n < 0) {
        if (errno == EAGAIN || errno == EWOULDBLOCK) {
            // This is not necessarily an error, just means no data was available
            // but since we set VTIME, this should generally not happen unless timeout expires.
            printf("No data available (timeout).\n");
            return 0;
        }
        perror("Error reading from serial port");
        return -1;
    }

    // Null-terminate the string if data was read
    if (n > 0) {
        buffer[n] = '\0';
        printf("Read %d bytes: '%s'\n", n, buffer);
    } else {
        printf("Read 0 bytes.\n");
    }

    return n;
}

// Main function to demonstrate serial communication
int main(int argc, char *argv[]) {

    int fd;

    if (argc > 1) {
        fd = open_serial_port(argv[1]);
    } else {
        fd = open_serial_port(SERIAL_PORT);
    }
    
    if (fd < 0) {
        fprintf(stderr, "Failed to open port. Exiting.\n");
        return 1;
    }

    // Configure the port settings
    if (configure_port(fd) < 0) {
        close(fd);
        fprintf(stderr, "Failed to configure port. Exiting.\n");
        return 1;
    }

    // --- Communication Test ---
    const char* outgoing_message = ":Gt#";
    char incoming_buffer[BUFFER_SIZE];

    // 1. Write data
    if (write_port(fd, outgoing_message) < 0) {
        // If write fails, proceed to clean up
    }

    // Wait a moment for the device to process and potentially respond
    // NOTE: This sleep is crucial for allowing asynchronous devices to process the write
    // and prepare a response. Without it, the read might happen too fast.
    sleep(1);

    // 2. Read data
    printf("Attempting to read data...\n");
    if (read_port(fd, incoming_buffer, BUFFER_SIZE) < 0) {
        // If read fails, proceed to clean up
    }

    // 3. Close the port
    if (close(fd) < 0) {
        perror("Error closing serial port");
        return 1;
    }

    printf("Serial port closed.\n");

    return 0;
}
