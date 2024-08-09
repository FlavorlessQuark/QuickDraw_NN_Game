const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const {model_data} = require("./data");
const tf = require("@tensorflow/tfjs-node");
const { build_model, train_model, predict } = require('./tf_model');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let win;

// const handler = tf.io.fileSystem("./model/model.json");
let loaded_model;


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

app.whenReady().then(async() => {

    createWindow();
    // loaded_model = await tf.loadLayersModel(handler);
    loaded_model = await tf.loadLayersModel('file://./model/model.json');
    loaded_model.compile()
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

ipcMain.on("eval", async (e, args) => {
    console.log("got", args)
    try {
        // const model =
        // loaded_model.compile()
        const img_tensor = tf.tensor(args).reshape([28,28, 1])
        const res = await loaded_model.evaluate(img_tensor)
        console.log("Image is ", res)

    }
    catch(err) {
        console.log("filed to fetch model", err)
    }

})
