/*
Current problems:

 1.) Build has to be triggered once before to make sure files are in dist folder an can be found by foundry
 2.) HMR works but reloads again an again
 3.) dev.js needs following code on handleRequest method:

        } else if (matchedRoute.src === '^/systems/fatex/.*$') {
            reqUrl = matchedRoute.dest(req, res);
        }

 */

const httpProxy = require("http-proxy");

var proxy = httpProxy.createServer({
    target: "http://localhost:30000",
});

module.exports = {
    mount: {
        src: "/",
        system: { url: "/", static: true, resolve: false },
    },
    plugins: ["@snowpack/plugin-sass", "./snowpack-foundry-plugin"],
    buildOptions: {
        out: "dist",
    },
    proxy: {
        "/socket.io": {
            target: "http://localhost:30000",
            ws: true,
        },
    },
    experiments: {
        /*optimize: {
            entrypoints: ["src/system.ts"],
            bundle: true,
            minify: true,
            target: "es2017",
        },*/
        routes: [
            {
                src: "/systems/fatex/.*",
                dest: (req, res) => {
                    return req.url.replace("/systems/fatex", "");
                },
                match: "all",
            },
            {
                src: "/(?!(systems|__snowpack__)).*",
                dest: (req, res) => {
                    return proxy.web(req, res);
                },
                match: "all",
            },
        ],
    },
};
