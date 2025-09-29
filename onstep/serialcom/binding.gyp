{
    "targets": [{
        "target_name": "serialcom",
        "sources": ["serialcom.cpp"],
        "include_dirs": [ 
            "<!(node -p \"require('node-addon-api').include \")",
            "./node_modules/node-addon-api"
        ],
        "libraries": [
            "<!(node -p \"require('node-addon-api').lib \")"
        ],
        "defines": [
            "NAPI_DISABLE_CPP_EXCEPTIONS"
        ],
        "cflags": [
            "-fno-exceptions"
        ],
        "cflags_cc": [
            "-fno-exceptions"
        ]
    }]
}