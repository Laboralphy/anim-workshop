/*

service de création de film

 */
const path = require('path');
const FsPlus = require('../fs-plus');


const fsp = new FsPlus();



const FILENAME_ROOT = 'frame-';
const PATH_HOME = fsp.home();
const PATH_CONFIG = path.resolve(PATH_HOME, '.anim-workshop');

class MovieMaker {


    constructor() {
        this.iFrame = 0;
    }

    /**
     * Définition du nom du projet, entraine la création des répertoires de travails.
     * @param sName {string}
     */
    async setProject(sName) {
        return new Promise(async resolve => {
            this.PATH_PROJECT = path.resolve(PATH_CONFIG, 'projects', sName);
            this.PATH_FRAMES = path.resolve(this.PATH_PROJECT, 'frames');
            await fsp.mkdirp(this.PATH_PROJECT);
            await fsp.mkdirp(this.PATH_FRAMES);
            // supprimer toutes les frames du répertoire
            let aFiles = await fsp.ls(this.PATH_FRAMES);
            aFiles = aFiles.map(f => path.resolve(this.PATH_FRAMES, f));
            await fsp.rm(aFiles);
            resolve();
        });
    }

    /**
     * Extration des donnée brute d'une image à partir de son content-url
     * @param sData {string}
     * @returns {*}
     */
    extractImageRawData(sData) {
        const SEPARATOR = ',';
        let nIndex = sData.indexOf(SEPARATOR);
        if (nIndex >= 0) {
            return sData.substr(nIndex + 1);
        } else {
            return sData;
        }
    }

    /**
     * sauvegarde de l'image dans le dossier de travail
     * @param sFilename {string}
     * @param src {string} contenue de l'image, encodé en base 64
     */
    writeImage(sFilename, src) {
        return new Promise((resolve, reject) => {
            let sExt = '';
            let r = src.match(/^data:image\/([a-z]+);/);
            if (r) {
                sExt = r[1];
            } else {
                reject('this image has no "data:image/***" header');
            }
            return fsp.b64fwrite(sFilename + '.' + sExt, this.extractImageRawData(src));
        });
    }


    /**
     * Sauvegarde la collection de frames spécifiée.
     * Nettoyage du répertoire "frames" au préalable.
     * @param aFrames {string[]}
     */
    async saveFrames(aFrames) {
        let nZeros = (aFrames.length - 1).toString().length;
        return Promise.all(aFrames.map((f, i) =>
            this.writeImage(
                path.resolve(this.PATH_FRAMES, FILENAME_ROOT + i.toString().padStart(nZeros, '0')),
                f
            ))
        );
    }
}


module.exports = MovieMaker;