const cp = require('child_process');
const path = require('path');
const Events = require('events');
const os = require('os');

class VideoMaker {

    constructor() {
        this._emitter = new Events();
    }

    /**
     * Renvoie le résultat d'une commande which, et ceci dans le but de pouvoir
     * choisir entre ffmpeg et avconv
     * @param sCommand {string}
     * @returns {Promise<void>}
     * @private
     */
    async _which(sCommand) {
        return new Promise((resolve, reject) => {
            if (this.isOSWindows()) {
                cp.exec('where ' + sCommand, (error, stdout, stderr) => {
                    if (error) {
                        resolve(false);
                    }
                    if (stdout.length > 0 && stdout.includes(sCommand)) {
                        resolve(stdout);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                cp.exec('which ' + sCommand, (error, stdout, stderr) => {
                    if (error) {
                        resolve(false);
                    }
                    if (stdout.length > 0 && stdout.includes(sCommand)) {
                        resolve(sCommand);
                    } else {
                        resolve(false);
                    }
                });
            }
        });
    }

    /**
     * Proxy vers events.on
     * @param sEvent {string} nom de l'évenement
     * @param pHandler {function} gestionnaire
     */
    on(sEvent, pHandler) {
        this._emitter.on(sEvent, pHandler);
    }

    /**
     * Proxy vers events.off
     * @param sEvent {string} nom de l'évenement
     * @param pHandler {function} gestionnaire
     */
    off(sEvent, pHandler) {
        this._emitter.off(sEvent, pHandler);
    }

    isOSWindows() {
        return os.platform() === 'win32';
    }

    /**
     * Création de la video
     * @param sInputFramePath {string} chemin des frame input
     * @param sInputMusicFilename {string} fichier audio input
     * @param sOutputVideoFilename {string} fichier video output
     * @return {Promise<any>}
     */
    async render(
        sInputFramePath,
        sInputMusicFilename,
        sOutputVideoFilename
    ) {
        let bWindows = this.isOSWindows();
        let sCommand;
        if (bWindows) {
            sCommand = 'ffmpeg';
        } else {
            if (await this._which('ffmpeg')) {
                sCommand = 'ffmpeg';
            } else if (await this._which('avconv')) {
                sCommand = 'avconv';
            } else {
                throw new Error('pas de compresseur supporté disponible dans ce système (ffmpeg, avconv)');
            }
        }
        return new Promise((resolve, reject) => {
            let aArgsInput = [
                '-stats',   // une indication de progression lors de la compression video
                '-y', // répondre automatiquemùent "oui" lors de l'écrasement de fichier
                '-r', 5, // framerate : 5 images par secondes
                '-i', // fichiers image en entrée
                path.resolve(sInputFramePath, 'frame-%d.jpg'),
            ];
            let aArgsMusic = !!sInputMusicFilename ? [
                '-i', // fichier musical en entrée
                sInputMusicFilename,
            ] : [];
            let aArgsOutput = [
                '-acodec', 'libmp3lame',
                '-vcodec', 'libx264',  // on encode en x264
                '-b:v', '1000k', // bitrate de 1000k
                '-shortest', // on arrete la video en coupant la musique
                sOutputVideoFilename,
            ];
            let aArgs = [
                ...aArgsInput,
                ...aArgsMusic,
                ...aArgsOutput
            ];
            if (sCommand === '') {
                reject('neither "avconv" nor "ffmpeg" command available');
            }
            let p = cp.spawn(sCommand, aArgs, {});
            p.on('close', code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(code);
                }
            });
            p.stderr.on('data', data => {
                let r = data.toString().match(/^frame= *([0-9]+) /);
                if (r) {
                    this._emitter.emit('progress', parseInt(r[1]));
                }
            });
        });
    }

}

module.exports = VideoMaker;