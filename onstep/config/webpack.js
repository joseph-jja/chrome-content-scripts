import path from "path";

const baseDir = process.cwd()

const babelTargets = {
    "edge": "120",
    "chrome": "120",
    "firefox": "120",
    "safari": "15"
};
//const eslintConfig = fs.readFileSync( path.resolve( "./config/eslint.json" ) ).toString();

/*const esJSON = JSON.parse( eslintConfig ),
    esJSONWP = Object.keys( esJSON.globals );

esJSON.globals = esJSONWP;*/
let development = false;
try {
    development = JSON.parse(process.env['DEVELOPMENT']);
} catch(_e) { }

export default {
    "mode": "production",
    "entry": {
        "renderer": "./js/main"
    },
    context: path.resolve(baseDir),
    //devtool: development ? 'source-map' : 'none',
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
                    loader: 'babel-loader',
                    options: {
                        targets: babelTargets,
                        presets: ['@babel/preset-env', '@babel/preset-react']
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
