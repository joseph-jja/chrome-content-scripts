#include <napi.h>
#include <iostream>
#include <string>

// --- Module State (Simulated File System) ---

// Global buffer to simulate the content of the file
static std::string g_content_buffer = "";
// Global state to track if the "file" is open
static bool g_is_open = false;

// --- Utility Functions for Error Reporting ---

/**
 * @brief Helper to create a generic error and throw it in the JS environment.
 */
void ThrowError(napi_env env, const std::string& message) {
    napi_throw_error(env, nullptr, message.c_str());
}

// --- N-API Wrapper Implementations ---

/**
 * @brief C-side implementation for: int open(String path, String mode)
 * @details Simulates opening a file.
 * @return napi_value - N-API value representing an integer (0 for failure, 1 for success).
 */
napi_value OpenWrapper(napi_env env, napi_callback_info info) {
    size_t argc = 2;
    napi_value argv[2];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

    // 1. Argument Validation
    if (argc < 2) {
        ThrowError(env, "Open requires two string arguments: path and mode.");
        return nullptr;
    }

    napi_valuetype type0, type1;
    napi_typeof(env, argv[0], &type0);
    napi_typeof(env, argv[1], &type1);

    if (type0 != napi_string || type1 != napi_string) {
        ThrowError(env, "Open requires both arguments to be strings.");
        return nullptr;
    }

    // 2. Extract Arguments (Path and Mode)
    // In a real app, you would use these strings to open the actual file.
    char path_buf[128];
    char mode_buf[16];
    size_t str_len;

    napi_get_value_string_utf8(env, argv[0], path_buf, sizeof(path_buf), &str_len);
    napi_get_value_string_utf8(env, argv[1], mode_buf, sizeof(mode_buf), &str_len);

    std::cout << "[C++ Module] Attempting to open file: " << path_buf << " with mode: " << mode_buf << std::endl;

    // 3. Simulated Operation
    if (g_is_open) {
        std::cout << "[C++ Module] File already open. Returning failure (0)." << std::endl;
        napi_value result;
        napi_create_int32(env, 0, &result);
        return result;
    }

    g_is_open = true;
    std::cout << "[C++ Module] File successfully 'opened'. Returning success (1)." << std::endl;

    // 4. Return Integer Status (1 for success)
    napi_value result;
    napi_create_int32(env, 1, &result);
    return result;
}

/**
 * @brief C-side implementation for: void close()
 * @details Simulates closing the file.
 * @return napi_value - N-API value representing undefined (void).
 */
napi_value CloseWrapper(napi_env env, napi_callback_info info) {
    if (g_is_open) {
        g_is_open = false;
        std::cout << "[C++ Module] File successfully 'closed'." << std::endl;
    } else {
        std::cout << "[C++ Module] Attempted to close, but file was not open." << std::endl;
    }

    // Return 'undefined' for a 'void' return type
    napi_value undefined;
    NAPI_CALL(env, napi_get_undefined(env, &undefined));
    return undefined;
}

/**
 * @brief C-side implementation for: String read()
 * @details Simulates reading the file content from the buffer.
 * @return napi_value - N-API value representing the content string.
 */
napi_value ReadWrapper(napi_env env, napi_callback_info info) {
    // 1. Check Simulated State
    if (!g_is_open) {
        ThrowError(env, "Cannot read: The simulated file is not open.");
        return nullptr;
    }

    std::cout << "[C++ Module] Reading content: '" << g_content_buffer << "'" << std::endl;

    // 2. Return the String Content
    napi_value result;
    NAPI_CALL(env, napi_create_string_utf8(env, g_content_buffer.c_str(), NAPI_AUTO_LENGTH, &result));
    return result;
}

/**
 * @brief C-side implementation for: int write(String content)
 * @details Simulates writing content to the buffer.
 * @return napi_value - N-API value representing an integer (0 for success).
 */
napi_value WriteWrapper(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value argv[1];
    NAPI_CALL(env, napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

    // 1. Argument Validation
    if (argc < 1) {
        ThrowError(env, "Write requires one string argument: content.");
        return nullptr;
    }
    napi_valuetype type0;
    napi_typeof(env, argv[0], &type0);
    if (type0 != napi_string) {
        ThrowError(env, "Write requires the argument to be a string.");
        return nullptr;
    }

    // 2. Check Simulated State
    if (!g_is_open) {
        ThrowError(env, "Cannot write: The simulated file is not open.");
        return nullptr;
    }

    // 3. Extract Argument (Content String)
    size_t buffer_size;
    NAPI_CALL(env, napi_get_value_string_utf8(env, argv[0], nullptr, 0, &buffer_size));
    
    // Allocate space for the content string
    std::string content_str(buffer_size, 0);
    NAPI_CALL(env, napi_get_value_string_utf8(env, argv[0], content_str.data(), buffer_size + 1, &buffer_size));

    // 4. Simulated Operation (Write to buffer)
    g_content_buffer = content_str;
    std::cout << "[C++ Module] Successfully wrote " << buffer_size << " bytes to buffer." << std::endl;

    // 5. Return Integer Status (0 for success)
    napi_value result;
    napi_create_int32(env, 0, &result);
    return result;
}

// --- Module Initialization ---

/**
 * @brief The main function called when the module is loaded by Node.js.
 * @details Creates the JavaScript function wrappers and adds them to the exports object.
 */
napi_value Init(napi_env env, napi_value exports) {
    // Expose the 'open' function
    napi_value open_fn;
    NAPI_CALL(env, napi_create_function(env, "open", NAPI_AUTO_LENGTH, OpenWrapper, nullptr, &open_fn));
    NAPI_CALL(env, napi_set_named_property(env, exports, "open", open_fn));

    // Expose the 'close' function
    napi_value close_fn;
    NAPI_CALL(env, napi_create_function(env, "close", NAPI_AUTO_LENGTH, CloseWrapper, nullptr, &close_fn));
    NAPI_CALL(env, napi_set_named_property(env, exports, "close", close_fn));

    // Expose the 'read' function
    napi_value read_fn;
    NAPI_CALL(env, napi_create_function(env, "read", NAPI_AUTO_LENGTH, ReadWrapper, nullptr, &read_fn));
    NAPI_CALL(env, napi_set_named_property(env, exports, "read", read_fn));

    // Expose the 'write' function
    napi_value write_fn;
    NAPI_CALL(env, napi_create_function(env, "write", NAPI_AUTO_LENGTH, WriteWrapper, nullptr, &write_fn));
    NAPI_CALL(env, napi_set_named_property(env, exports, "write", write_fn));

    return exports;
}

// Register the module with the provided initialization function.
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
