{
    "targets": [{
        "target_name": "serialcom",
        "sources": ["serialcom.cpp"],
        "include_dirs": [ 
            "./include",
            "./",
            "./node_modules/node-addon-api"
        ],
        "libraries": [],
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
