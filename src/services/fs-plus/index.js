/*

 */
const util = require('util');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const os = require('os');

const promMkdirp = util.promisify(mkdirp);
const promReaddir = util.promisify(fs.readdir);
const promUnlink = util.promisify(fs.unlink);
const promReadFile = util.promisify(fs.readFile);
const promAccess = util.promisify(fs.access);
const promStat = util.promisify(fs.stat);

class FsPlus {
    /**
     * Renvoie le répertoire de l'utilisateur (home)
     * @returns {string}
     */
    home() {
        return os.homedir();
    }

    /**
     * Création bulldozer d'un chemin. Si les répertoire parent n'existent pas, il sont créés
     * @param sPath {string}
     */
    mkdirp(sPath) {
        return promMkdirp(sPath);
    }

    /**
     * liste des fichier d'un répertoire. Ignore . et ..
     * @param sPath {string}
     * @returns {Promise}
     */
    ls(sPath) {
        return promReaddir(sPath);
    }

    /**
     * Suppression d'une liste fichiers
     * @param files {string[]}
     * @returns {Promise}
     */
    rm(files) {
        if (Array.isArray(files)) {
            return Promise.all(files.map(f => promUnlink(f)));
        } else {
            return promUnlink(files);
        }
    }

    /**
     * Ecriture d'un fichier binaire encodé en base 64
     * Cette fonction se spécialise dans l'écriture d'un fichier binaire, à partir d'une chaine de caractère encodée
     * en base 64.
     * @param sFilename {string} nom du fichier
     * @param dataB64 {string} données binaires encodées dans un chaine base 64
     * @returns {Promise<any>}
     */
    b64fwrite(sFilename, dataB64) {
        return this.fwrite(sFilename, new Buffer(dataB64, 'base64'));
    }

    /**
     * Ecriture d'un fichier ascii
     * @param sFilename {string} nom du fichier
     * @param data {string} chaine de caractère
     * @return {Promise<any>}
     */
    fwrite(sFilename, data) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.mkdirp(path.dirname(sFilename));
                let ws = fs.createWriteStream(sFilename);
                let oData = Buffer.isBuffer(data) ? data : new Buffer(data);
                ws.on('finish', () => resolve());
                ws.write(oData);
                ws.end();
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * lecture d'un fichier ascii utf-8
     * @param sFilename {string} nom du fichier
     * @return {*|Promise<any>|Promise<void>|Promise<string | Buffer>}
     */
    fread(sFilename) {
        return promReadFile(sFilename, {encoding: 'utf-8'});
    }

    access(sFilename, c) {
        return new Promise(resolve => {
            promAccess(sFilename, c)
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    exists(sFilename) {
        return this.access(sFilename, fs.constants.F_OK);
    }

    readable(sFilename) {
        return this.access(sFilename, fs.constants.R_OK);
    }

    writeable(sFilename) {
        return this.access(sFilename, fs.constants.W_OK);
    }

    async size(sFilename) {
        return new Promise(async (resolve, reject) => {
            try {
                let oStat = await promStat(sFilename);
                resolve(oStat.size);
            } catch (e) {
                reject(e);
            }
        });
    }

}

module.exports = new FsPlus();