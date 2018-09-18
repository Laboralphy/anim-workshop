const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');


const FILENAME_ROOT = 'frame-';
const PATH_HOME = require('os').homedir();

class MovieMaker {


    constructor() {
        this.iFrame = 0;
    }

    /**
     * Creation de répertoire en asynchrone
     * Si le dossier existe déja, ne fait rien
     * @param sDir
     * @returns {Promise<*>}
     */
    mkdirp(sDir) {
        return new Promise((resolve, reject) => {
            mkdirp(sDir, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }


    ls(sDir) {
        return new Promise((resolve, reject) => {
            fs.readdir(sDir, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }

    rm(files) {
        if (Array.isArray(files)) {
            return Promise.all(files.map(f => new Promise(resolve => {
                fs.unlink(f, err => resolve(f));
            })));
        } else {
            return new Promise(resolve => {
                fs.unlink(files, err => resolve(files));
            });
        }
    }


    /**
     * Définition du répoertoire de travail
     * @param dirs {string}
     */
    async setDirectory(...dirs) {
        return new Promise(async resolve => {
            this.PATH_BASE = path.resolve(this.getUserHome(), ...dirs);
            this.PATH_FRAMES = path.resolve(this.PATH_BASE, 'frames');
            await this.mkdirp(this.PATH_BASE);
            await this.mkdirp(this.PATH_FRAMES);
            // supprimer toutes les frames du répertoire
            let aFiles = await this.ls(this.PATH_FRAMES);
            aFiles = aFiles.map(f => path.resolve(this.PATH_FRAMES, f));
            await this.rm(aFiles);
            resolve();
        });
    }

    extractImageRawData(sData) {
        const SEPARATOR = ',';
        let nIndex = sData.indexOf(SEPARATOR);
        if (nIndex >= 0) {
            return sData.substr(nIndex + 1);
        } else {
            return sData;
        }
    }

    writeBinaryFile(sFilename, sData) {
        return new Promise((resolve, reject) => {
            let ws = fs.createWriteStream(sFilename);
            let oBinData = new Buffer(sData, 'base64');
            ws.on('finish', () => resolve());
            ws.write(oBinData);
            ws.end();
        });
    }

    /**
     * Réception du contenu d'une image
     * @param src
     */
    async addFrame(src) {
        return new Promise(async (resolve, reject) => {
            let sExt = '';
            let r = src.match(/^data:image\/([a-z]+);/);
            if (r) {
                sExt = r[1];
            } else {
                reject('this image has no "data:image/***" header');
            }
            ++this.iFrame;
            await this.writeBinaryFile(path.resolve(this.PATH_FRAMES, FILENAME_ROOT + this.iFrame + '.' + sExt), this.extractImageRawData(src));
            resolve();
        });
    }

    getUserHome() {
        return PATH_HOME;
    }
}


module.exports = MovieMaker;