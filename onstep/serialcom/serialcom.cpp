#include <napi.h>
#include <iostream>
#include <fstream>
#include <string>

// Global file stream (for simplicity; real apps might manage this per-instance or context)
std::fstream global_file_stream;

// --- Function Implementations ---

// void open(string path, string mode)
Napi::Value Open(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1. Check arguments
    if (info.Length() != 2 || !info[0].IsString() || !info[1].IsString()) {
        Napi::TypeError::New(env, "Expected two string arguments: path and mode").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // 2. Extract arguments
    std::string path = info[0].As<Napi::String>().Utf8Value();
    std::string mode_str = info[1].As<Napi::String>().Utf8Value();

    // 3. Convert mode string to fstream flags (simplified)
    std::ios_base::openmode mode = std::ios_base::in | std::ios_base::out; // Default: read/write
    
    // Simple mode parsing (can be expanded)
    if (mode_str == "r") {
        mode = std::ios_base::in;
    } else if (mode_str == "w") {
        mode = std::ios_base::out | std::ios_base::trunc; // Truncate for 'w'
    } else if (mode_str == "a") {
        mode = std::ios_base::app; // Append mode
    }

    // 4. Open the file
    global_file_stream.open(path, mode);

    if (!global_file_stream.is_open()) {
        Napi::Error::New(env, "Failed to open file: " + path).ThrowAsJavaScriptException();
    }

    return env.Undefined();
}

// void close()
Napi::Value Close(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (global_file_stream.is_open()) {
        global_file_stream.close();
    } else {
        // Optional: warn or throw if trying to close a file that isn't open
    }

    return env.Undefined();
}

// int read() - simplified to return a single byte/character as an int
Napi::Value Read(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (!global_file_stream.is_open()) {
        Napi::Error::New(env, "File is not open for reading").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    char ch;
    if (global_file_stream.get(ch)) {
        // Return the character as a JavaScript number (its ASCII/UTF-8 code)
        return Napi::Number::New(env, (int)ch);
    } else {
        // End of file or error
        if (global_file_stream.eof()) {
            return Napi::Number::New(env, -1); // Common convention for EOF
        } else {
            // Error during read
            Napi::Error::New(env, "Error during file read").ThrowAsJavaScriptException();
            return env.Undefined();
        }
    }
}

// void write(string data)
Napi::Value Write(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1. Check arguments
    if (info.Length() != 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected one string argument: data to write").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    if (!global_file_stream.is_open()) {
        Napi::Error::New(env, "File is not open for writing").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // 2. Extract argument
    std::string data = info[0].As<Napi::String>().Utf8Value();

    // 3. Write data
    global_file_stream << data;

    if (global_file_stream.fail()) {
        Napi::Error::New(env, "Error during file write").ThrowAsJavaScriptException();
    }

    return env.Undefined();
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
