const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const {model_data} = require("./data");
const tf = require("@tensorflow/tfjs");
const { build_model, train_model, predict } = require('./tf_model');
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
    });

    win.loadFile('index.html');
}

require('electron-reloader')(module, {
            debug: true,
            watchRenderer: true
});

app.whenReady().then(() => {

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            app.quit();
    })

})

ipcMain.on("close", (e, args) => {
    app.quit();
})

ipcMain.on("get-data", async (e, args) => {

    const image_data = new model_data();
    const model = build_model();

    await image_data.build();
    await train_model(model, image_data);

    const results = predict(model, image_data)

    console.log("results", results)
    results.pred.print()
    results.real.print()
    // const {data, labels} = test.get_next_train_batch(10)
    // // fs.open("test", 'r', readFile)

    // // data.print()
    // labels.print()

})
