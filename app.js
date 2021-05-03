const Hapi = require("@hapi/hapi")
const dotenv = require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: "localhost"
    });

    await server.start().then(() => {
        console.log(`Server is run at PORT ${process.env.port}`);
    }).catch();
}

init();