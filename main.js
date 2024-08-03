const { app, BrowserWindow, ipcMain} = require('electron')
const path = require('node:path')
const fs = require('fs')

let win;

const createWindow = () => {

    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation:true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

// const readFile = (err, file) => {
//     const buffer = new Buffer.alloc(28 * 28)

//     try {
//         fs.readFileSync(file, buffer, 0, buffer.length, 0, (err, len) => {
//                 if (len) {
//                     console.log(buffer)
//                     console.log("read" + len)
//                 }
//             })
//             console.log("here", len)
//     }
//     catch(err) {
//         console.log("error reading file", err)
//     }
//     // win.webContents.send("message", buffer);

// }


const read_file_stream =  async (path, idx) =>
{
    const promise = new Promise((resolve, reject) => {

    const readStream = fs.createReadStream(path,{ highWaterMark: 28 * 28, encoding: 'utf8' });
    const data = []
        readStream.on('data', function(chunk) {
            data.push({data: chunk, label: idx});

        }).on('end', function() {
            resolve(data)
        // here you see all data processed at end of file
        });
    })
    return promise
}

const get_filenames = () => {
    const names = []

    fs.readdirSync("data/training").forEach(file => names.push(file))

    names.sort()
    return names
    // readFile()

}

require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
});

app.whenReady().then(() => {

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            app.quit()
    })

})

ipcMain.on("close", (e, args) => {
    app.quit();
})

ipcMain.on("get-data", async (e, args) => {

    let train_data = []
    let test_data = []
    const names = get_filenames()

    for (const i = 0; i < names.length; i++) {
        const res_train = await read_file_stream("data/training/" + names[i], i)
        const res_test  = await read_file_stream("data/testing/" + names[i], i)
        train_data = data.concat(res_train)
        test_data  = data.concat(res_test)
    }

    // fs.open("test", 'r', readFile)


})
