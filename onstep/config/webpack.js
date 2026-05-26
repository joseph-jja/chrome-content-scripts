import path from "path";

const baseDir = process.cwd()

//const eslintConfig = fs.readFileSync( path.resolve( "./config/eslint.json" ) ).toString();

/*const esJSON = JSON.parse( eslintConfig ),
    esJSONWP = Object.keys( esJSON.globals );

esJSON.globals = esJSONWP;*/
let development = false;
try {
    development = JSON.parse(process.env['DEVELOPMENT']);
} catch (_e) {}

const CONFIG = {
    "mode": "production",
    "entry": {
        "renderer": "./js/main"
    },
    context: path.resolve(baseDir),
    output: {
        "path": `${baseDir}/js`,
        "filename": "renderer.js",
        "chunkFilename": "renderer.bundle.js",
        "sourceMapFilename": "renderer.source.map"
    },
    optimization: {
        minimize: false
    },
    resolve: {
        modules: [
            "node_modules",
            path.join(baseDir, "js")
        ],
        alias: {
            'js': `${baseDir}/js`
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'ecmascript', // Use 'ecmascript' for JS only
                                jsx: true,
                                dynamicImport: true
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic', // Use modern JSX transform
                                    refresh: true // Optional: Enable for Fast Refresh
                                }
                            }
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: []
};

if (development) {
    CONFIG.devtool = 'source-map';
}

export default CONFIG;


