const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");
const DEFAULT_BG = "#000000"

window.addEventListener("keyup", (e) => {
        if (e.key == "Escape")
        {
            const menu = document.getElementById("menu");
            if (menu.style.display != "flex")
            {
                menu.style.display = "flex";

            }
            else
                menu.style.display = "none";
        }
    }
    , true)

// function arrayBufferToBase64(buffer) {
//   let binary = '';
//   const bytes = new Uint8Array(buffer);
//   const len = bytes.byteLength;
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return window.btoa(binary);
// }

window.onload = () =>
{
    console.log("Loaded")
    document.getElementById("quit").addEventListener("click", quitApp);
    document.getElementById("resume").addEventListener("click", resumeApp);
    document.getElementById("run").addEventListener("click", runPy);
    // window.requestAnimationFrame(draw)
}

window.api.receive("message", (msg) => {
    console.log("got message from main process", msg)
    const encoded = btoa(String.fromCharCode.apply(null, msg));
    document.getElementById("receiver").innerHTML = msg;

    document.getElementById("image").src = "data:image/jpg;base64" + encoded
})

const runPy = () =>{

    window.api.send("get-data", "");
}

const quitApp = () =>
{
    console.log("trying to close")
    window.api.send("close", "");
}

const resumeApp = () =>
{
    console.log("trying to resume")
    document.getElementById("menu").style.display = "none";
}
//     ctx.fillStyle = DEFAULT_BG;
//     ctx.fillRect(0, 0, WIDTH, HEIGHT);

// const init = () =>
// {
// }

// const draw = () =>{
//     ctx.clearRect(0, 0, WIDTH, HEIGHT);
//     ctx.fillStyle = DEFAULT_BG;
//     ctx.fillRect(0, 0, WIDTH, HEIGHT);

//     window.requestAnimationFrame(draw)
// }

