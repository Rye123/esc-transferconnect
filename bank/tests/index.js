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

const killAllProcesses = (e="") => {
    if (e !== "")
        console.log("Error encountered, killing all processes.");
    let clientKilled = clientProcess.kill();
    let serverKilled = serverProcess.kill();
    console.log(`Client killed: ${clientKilled}`);
    console.log(`Server killed: ${serverKilled}`);
    process.exit();
    //process.kill('SIGINT');
}

serverProcess.stdout.on("data", data => {
    if (data.toString().includes("Established connection to MongoDB.")) {
        console.log("BANK SERVER RUNNING");
        serverUp = true;
        Setup();
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
        Setup();
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


// ---------- DATABASE OPERATIONS ----------
const resetTestDb = require('./reset_test_db');


// ---------- PREPARE FOR TESTING ----------
const testLoginLogout = require('./testLoginLogout');
const Setup = () => {
    if (!(clientUp & serverUp))
        return;
    console.log("Both services running.");

    console.log("Setting Test Database to default...");
    resetTestDb()
    .then(() => {
        console.log("Test Database reset.");
        InitTests();
    })
    .catch(() => {
        console.log("Could not setup test database, exiting.");
        killAllProcesses("Database error");
    });
};

const InitTests = async () => {
    // Conduct Tests
    console.log("Testing Login/Logout");
    try {
        await testLoginLogout();
    } catch (error) {
        console.log("Error encountered, shutting down.");
        killAllProcesses();
    }

    console.log("Test Complete");

    // Restore DB to original state
    resetTestDb()
    .then(() => {
        console.log("Test Database reset.");
        console.log("Exiting.");
        killAllProcesses();
    })
    .catch(() => {
        console.log("Could not setup test database, exiting.");
        killAllProcesses("Database error");
    });
}