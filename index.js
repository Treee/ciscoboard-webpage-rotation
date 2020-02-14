const path = require('path');
const express = require('express');
const fs = require('fs');
const Shell = require('node-powershell');
var app = express();
// config generated using https://appdynamics.github.io/dexter-ui/#/
const dexterConfigPath = './appdynamics.dexter/DefaultJob.json';
const applicationsToScrape = ['AD-Financial', 'AD-Financial-Next', 'AD-Fraud-Detection', 'Java ECommerce'];
const minutesToWait = 15;
var config = require(dexterConfigPath);

var dir = path.join(__dirname, 'screenshots');
app.use(express.static(dir));

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
    <html>
    
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    </head>
    
    <body>
        <iframe id="main-frame" style="border: none; width:1920px; height: 1080px;"></iframe>
    </body>
    <script type="text/javascript">
        const secondsToWaitBeforeChange = 10;
        const urls = [${getDashboardUrls()}];
    
        let counter = 0;
        changeUrl = () => {
            document.getElementById('main-frame').setAttribute('src', urls[counter % urls.length]);
            counter++;
        };
    
        changeUrl();
    
        setInterval(() => {
            changeUrl();
        }, secondsToWaitBeforeChange * 1000)

        setInterval(() => {
            document.location.href="/"
        }, 5 * 60 * 1000);
    </script>
    
    </html>`);
});

app.listen(3000, () => {
    // run once
    kickoffNewScreenScrape();
    // if minutesToWait is greater than 0 then run it that interval
    setInterval(() => {
        kickoffNewScreenScrape();
    }, minutesToWait * 60 * 1000);
});

getDashboardUrls = () => {
    const urls = [];
    fs.readdirSync('screenshots').forEach((appFolder) => {
        urls.push(`'./${appFolder}/dashboard.png'`);
    });
    return urls;
}

kickoffNewScreenScrape = () => {
    let timestamp = new Date();
    config.Input.TimeRange.From = timestamp;
    config.Input.TimeRange.To = timestamp;
    config.Target.Application = applicationsToScrape.join('|');
    writeToDexterConfig(dexterConfigPath, config);
    runDexterReport().then((output) => {
        // console.log(output);
        moveAllScreenshots();
        deleteReportData('./DefaultJob');
    }, (error) => {
        moveAllScreenshots();
        deleteReportData('./DefaultJob');
    });
};


// given a configuration file path, write the contents of the config to that file
writeToDexterConfig = (filename, dexterConfig) => {
    fs.writeFileSync(filename, JSON.stringify(dexterConfig));
};

// move the screenshots from the dexter report folder to a folder express.static is listening on
moveAllScreenshots = () => {
    const controllerFolder = 'DefaultJob/Data/wwt.saas';
    const screenshotFolder = 'SCRN/APP';
    if (fs.existsSync(controllerFolder)) {
        fs.readdirSync(controllerFolder).forEach((folder) => {
            const localFolder = folder;
            // ignore configuration and entity files we are not scraping.
            if (folder === 'CFG' || folder === 'ENT') {
                return;
            }
            fs.readdirSync(`${controllerFolder}/${localFolder}/${screenshotFolder}`).forEach((images) => {
                if (!fs.existsSync(`screenshots/${localFolder}`)) {
                    fs.mkdirSync(`screenshots/${localFolder}`);
                }
                moveScreenShot(`${controllerFolder}/${localFolder}/${screenshotFolder}/dashboard.png`, `screenshots/${localFolder}/dashboard.png`);
            });
        });
    }
}

// moves a single screenshot from an old path to a new path
moveScreenShot = (oldPath, newPath) => {
    fs.renameSync(oldPath, newPath);
}

// powershell script to run dexter 
runDexterReport = () => {
    const command = './appdynamics.dexter/core-linux/AppDynamics.Dexter --job-file ./appdynamics.dexter/DefaultJob.json -o .';
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(err)
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

// given a filepath, delete that folder recursively, synchronously
deleteReportData = (path) => {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteReportData(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

// calculate if daylight savings is being observed
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1); // 360
    var jul = new Date(this.getFullYear(), 6, 1); // 300
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

// because humans cannot agree on how to track time, we must have arbirary logic to determine if we are on daylight savings time
Date.prototype.isDstObserved = function () {
    // values with a timezone offset greater than 300 are on DST
    return this.getTimezoneOffset() >= this.stdTimezoneOffset();
}