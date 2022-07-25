const { spawn, exec } = require('child_process');
const path = require('path');
const bankDir = path.resolve(__dirname, "../");
console.log(`Directory: ${bankDir}`);


// ---------- SET UP BOTH SERVERS ----------
let serverUp = false;
let clientUp = false;

const serverProcess = spawn('npm', ['run', 'test'], {
    cwd: `${bankDir}/bank-server`,
    env: process.env,
    shell: true
});

const clientProcess = spawn('npm', ['start'], {
    cwd: `${bankDir}/bank-client`,
    env: {...process.env, BROWSER: "none"},
    shell: true
});

const killAllProcesses = (e="Unknown error") => {
    console.log("Error encountered, killing all processes.");
    let clientKilled = clientProcess.kill('SIGKILL');
    let serverKilled = serverProcess.kill('SIGKILL');
    console.log(`Client killed: ${clientKilled}`);
    console.log(`Server killed: ${serverKilled}`);
    //process.kill('SIGINT');
}

serverProcess.stdout.on("data", data => {
    if (data.toString().includes("Established connection to MongoDB.")) {
        console.log("BANK SERVER RUNNING");
        serverUp = true;
        InitTests();
    }
    if (data.toString().includes("Database Error")) {
        console.log(data.toString());
        killAllProcesses("DB error");
    }
    if (data.toString().includes("address already in use")) {
        console.log(data.toString());
        killAllProcesses("Server Port already in use -- check if existing process is running in port used by server.");
    }
});

serverProcess.stderr.on("data", data => {
    console.log(`bank-server: ${data}`);
    killAllProcesses(data.toString());
});

serverProcess.on('error', err => {
    console.log(`bank-server error: ${err.message}`);
    killAllProcesses(err.message);
});

serverProcess.on("close", code => {
    console.log(`bank-server exited with code ${code}`)
});

clientProcess.stdout.on("data", data => {
    if (data.toString().includes("You can now view bank-client in the browser.")) {
        clientUp = true;
        InitTests();
    }
    if (data.toString().includes("Something is already running on port")) {
        console.log(data.toString());
        killAllProcesses("Client port already in use -- check if existing process is running in port used by React's server.");
    }
});

clientProcess.stderr.on("data", data => {
    if (data.toString().toLowerCase().includes("warning")) { // log the warning and ignore it
        console.log(data.toString());
        return;
    }
    console.log(`bank-client: ${data}`);
    killAllProcesses(data.toString());
});

clientProcess.on('error', err => {
    console.log(`bank-client error: ${err.message}`);
    killAllProcesses(err.message);
});

clientProcess.on("close", code => {
    console.log(`bank-client exited with code ${code}`)
});



// ---------- RUN TESTS ----------
const testLoginLogout = require('./testLoginLogout');
const InitTests = () => {
    if (!(clientUp & serverUp))
        return;
    console.log("Both services running.");

    console.log("Testing Login/Logout");
    testLoginLogout();
}