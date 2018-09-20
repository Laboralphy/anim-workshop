/*

 */
const util = require('util');
const fs = require('fs');
const mkdirp = require('mkdirp');

const os = require('os');

const promMkdirp = util.promisify(mkdirp);
const promReaddir = util.promisify(fs.readdir);
const promUnlink = util.promisify(fs.unlink);


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
        return new Promise((resolve, reject) => {
            let ws = fs.createWriteStream(sFilename);
            let oBinData = new Buffer(dataB64, 'base64');
            ws.on('finish', () => resolve());
            ws.write(oBinData);
            ws.end();
        });
    }
}

module.exports = FsPlus;