let bStreaming = false;
let width = 640;
let height = 0;


/**
 * Renvoie la taille de la video
 * @return {{width: number, height: number}}
 */
function metrics() {
    return {width, height};
}

/**
 * Normalisation de la fonction getMedia
 */
function init(oConfig) {
    if (oConfig) {
        width = oConfig.width;
        height = oConfig.height;
    }
}

/**
 * Démarrage de la capture video,
 * rendu dans la balise video spécifiée
 * @param oVideo {HTMLVideoElement}
 */
async function start(oVideo) {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    width, height
                },
                audio: false
            }
        ).then(function(stream) {
            oVideo.addEventListener('loadedmetadata', function(event_md) {
                oVideo.play();
            });
            oVideo.srcObject = stream;
        }).catch(function(err) {
            reject(err);
        });
        oVideo.addEventListener('canplay', function(oEvent){
            const oVideo = oEvent.target;
            if (!bStreaming) {
                height = Math.round(oVideo.videoHeight / (oVideo.videoWidth / width));
                oVideo.setAttribute('width', width);
                oVideo.setAttribute('height', height);
                bStreaming = true;
            }
            resolve();
        }, false);
    });
}

/**
 * Capture le contenu de la video dans le canvas spécifié
 * Le canvas adopte la résolution de la video
 * @param oVideo {HTMLVideoElement}
 * @param oCanvas {HTMLCanvasElement}
 */
function capture(oVideo, oCanvas) {
    oCanvas.width = width;
    oCanvas.height = height;
    oCanvas.getContext('2d').drawImage(oVideo, 0, 0, width, height);
}



export default {
    init,
    start,
    capture,
    metrics
}