#include <napi.h>
#include <iostream>
#include <fstream>
#include <string>
#include <fcntl.h>   // For open, fcntl, O_*, F_*
#include <unistd.h>  // For close (good practice to include when using file descriptors)
#include <cstring>   // For strerror/perror
#include <errno.h>    // Error number definitions
#include <termios.h>  // POSIX terminal control definitions
#include <unistd.h>   // POSIX standard functions (read, write, close)

// Define the serial port device file path
// NOTE: Change this to your actual serial port (e.g., "/dev/ttyACM0" or "COM3" equivalent)
#define SERIAL_PORT "/dev/ttyUSB0"
#define BAUD_RATE B9600
#define BUFFER_SIZE 128

// Global file stream (for simplicity; real apps might manage this per-instance or context)
int fd;

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


// void open(string path, string mode)
Napi::Number Open(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 2. Extract arguments
    std::string path;
    std::string baud_rate;

    if (info.Length() < 1 || !info[0].IsString()) {
        path = SERIAL_PORT;
    } else {
        path = info[0].As<Napi::String>().Utf8Value();
    }
        
    // 1. Check arguments
    if (info.Length() < 2 || !info[1].IsString()) {
        baud_rate = BAUD_RATE;
    } else {
        baud_rate = info[1].As<Napi::String>().Utf8Value();
    }

    fd = open(path.c_str(), O_RDWR | O_NOCTTY | O_NDELAY);

    if (fd < 0) {
        // perror is a standard C function that prints a descriptive error message 
        // to stderr, based on the current value of 'errno'.
        perror("Error opening serial port");
        return Napi::Number::New(env, -2.0);
    } else {
        // Clear the O_NDELAY flag after opening to restore blocking behavior
        // fcntl(fd, F_SETFL, 0) sets the file status flags to 0 (blocking).
        if (fcntl(fd, F_SETFL, 0) == -1) {
            perror("Error clearing O_NDELAY flag");
            // Although the port is open, a failure here might warrant closing it or logging
            // a more severe error. For simplicity, we just log the fcntl error.
            return Napi::Number::New(env, -3.0);
        }
        if (configure_port(fd) < 0) {
            perror("Error configuring port");
            return Napi::Number::New(env, -4.0);
        }
    }
    
    return Napi::Number::New(env, 0.0);
}

// void close()
Napi::Number Close(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (close(fd) < 0) {
        perror("Error closing serial port");
        return Napi::Number::New(env, -1.0);
    }

    return Napi::Number::New(env, 0.0);
}

// int read() - simplified to return a single byte/character as an int
// read in data from the serial port
Napi::Value Read(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    //Napi::Number returnCode = Napi::Number::New(env, -2);

    if (fd < 0) {
        Napi::Error::New(env, "File is not open for reading").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    
    // Check if the first argument is a boolean
    if (!info[0].IsBoolean()) {
        Napi::TypeError::New(env, "Argument 1 must be a boolean").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    
    Napi::Value value = info[1];
    bool hasEnding = value.IsNull() ? false : true;
    
    bool isBinaryReply = info[0].As<Napi::Boolean>().Value(); 
    std::string endingType = info[1].As<Napi::String>().Utf8Value();
    
    // output buffer
    char buffer[BUFFER_SIZE + 1];
    memset(buffer, '\0', BUFFER_SIZE + 1);

    // temp storage space
    char incomingByte[2];
    memset(incomingByte, '\0', 2);
    long max_len = 1;
    bool foundEnd = false;
    int i = 0;
    int n = read(fd, incomingByte, max_len);
    while (!foundEnd) {
        if (errno == EAGAIN || errno == EWOULDBLOCK) {
            // This is not necessarily an error, just means no data was available
            // but since we set VTIME, this should generally not happen unless timeout expires.
            printf("No data available (timeout).\n");
        }
        // we have data so lets make sure it is something ascii
        if (n > 0 && strlen(incomingByte) > 0) {
            bool isCharacter = ((int)incomingByte[0] >= 32 && (int)incomingByte[0] < 127);
            bool isAck = (int)incomingByte[0] == 6;
            if (isAck || isCharacter) {
                buffer[i] = incomingByte[0];
                if (isBinaryReply && (incomingByte[0] == '0' 
                    || incomingByte[0] == '1'
                    || incomingByte[0] == '6')) 
                {
                    foundEnd = true;
                } else if (hasEnding && endingType[0] == incomingByte[0]) {
                    foundEnd = true;
                }
                i++;
            }
        }
        // we are not at the end of the data so keep going
        if (!foundEnd) {
           n = read(fd, incomingByte, max_len);
        }
    }
    
    if (strlen(buffer) > 0) {
        return Napi::String::New(env, buffer);
    }
    
    return env.Undefined();
}

// void write(string data)
// write data out the usb port 
Napi::Number Write(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1. Check arguments
    if (info.Length() != 1 || (!info[0].IsString() || !info[0].IsNumber())) {
        Napi::TypeError::New(env, "Expected one string argument: data to write").ThrowAsJavaScriptException();
        return Napi::Number::New(env, -2.0);
    }

    if (fd < 0) {
        Napi::Error::New(env, "File is not open for writing").ThrowAsJavaScriptException();
        return Napi::Number::New(env, -3.0);
    }

    // 2. Extract argument
    std::string data = info[0].As<Napi::String>().Utf8Value();


    int len = strlen(data.c_str());
    int n = write(fd, data.c_str(), len);

    if (n < 0) {
        perror("Error writing to serial port");
        Napi::Error::New(env, "Error during file write").ThrowAsJavaScriptException();
        return Napi::Number::New(env, -4.0);
    }
    printf("Wrote %d bytes: '%s'\n", n, data.c_str());
    
    double rc = n;
    
    return Napi::Number::New(env, rc);
}

// --- Module Initialization ---
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        "open", 
        Napi::Function::New(env, Open, "open")
    );
    exports.Set(
        "close", 
        Napi::Function::New(env, Close, "close")
    );
    exports.Set(
        "read", 
        Napi::Function::New(env, Read, "read")
    );
    exports.Set(
        "write", 
        Napi::Function::New(env, Write, "write")
    );
    return exports;
}

// Register the module
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
