const {Socket} = require('net');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const END = 'END';

const error = (message) => {
    console.log(message);
    process.exit(1);
};

const connect = (host, port) => {
    console.log(`Connecting to ${host}:${port}`)
    const socket = new Socket();
    socket.connect({ host, port});
    socket.setEncoding('utf-8');

    socket.on('connect', () => {
        console.log('Connected');

        readline.question('choose your username: ', (username) => {
            socket.write(username);
            console.log(`type any message to send it, type ${END} to finish`);
        });
        readline.on('line', (message) => {
            socket.write(message);
            if (message === 'END') {
                socket.end();
                console.log('Disconnected');
            }
    
        });
    
        socket.on('data', (data) => {
            console.log(data);
        });

    });
    socket.on('close', () => process.exit(0));

    socket.on('error', (err) =>error(err.message));
};

const main = () => {
    if (process.argv.length !== 4) {
        error(`Usage: node ${__filename} host port`);
    }

    let host = process.argv[2];
    let port = process.argv[3];
    if (host === null || host === undefined || host === '') {
        error(`Host not null`);
    } else {
        if (isNaN(port)) {
            error(`Invalid port ${port}`);
        };
        port =  Number(port);
        connect(host, port);
    }
};

main();