/*

service de gestion de projet
assure 
* 1) sauvegarde, chargement de projet
* 2) creation de film

 */
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const SFTPClient = require('ssh2-sftp-client');
const fsp = require('../fs-plus');
const projectTree = require('../project-tree')



const FILENAME_ROOT = 'frame-';
const MIME_ALIASES = {
	'jpeg': 'jpg',
};

class ProjectManager {
    /**
     * sauvegarde du contenu du projet
     * @param state
     * @return {Promise}
     */
    saveProject(state) {
        let dNow = new Date();
        let oStruct = {
            ...state,
            date: dNow.getTime()
        };
        let data = JSON.stringify(oStruct);
        return fsp.fwrite(projectTree.getStateFilename(), data);
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
            try {
                let sExt = '';
                let r = src.match(/^data:image\/([a-z]+);/);
                if (r) {
                    sExt = r[1];
                    if (sExt in MIME_ALIASES) {
                        sExt = MIME_ALIASES[sExt];
                    }
                } else {
                    reject('this image has no "data:image/***" header');
                }
                fsp.b64fwrite(sFilename + '.' + sExt, this.extractImageRawData(src))
                    .then(() => resolve())
            } catch (e) {
                console.error(src);
                reject(e);
            }
        });
    }


    /**
     * Sauvegarde la collection de frames spécifiée.
     * Nettoyage du répertoire "frames" au préalable.
     * @param aFrames {string[]}
     */
    async saveFrames(aFrames) {
        // supprimer toutes les frames du répertoire
        let sFramePath = projectTree.getFramesPath();
        let aFiles = await fsp.ls(sFramePath);
        aFiles = aFiles.map(f => path.resolve(sFramePath, f));
        await fsp.rm(aFiles);
        let iFrame = 0;
        for (let i = 0, l = aFrames.length; i < l; ++i) {
            let f = aFrames[i];
            await this.writeImage(
                path.resolve(sFramePath, FILENAME_ROOT + iFrame.toString()),
                f
            );
            ++iFrame;
        }
    }


    async loadProject(sProject) {
        return new Promise(async (resolve, reject) => {
            await projectTree.setName(sProject);
            let sFilename = projectTree.getStateFilename();
            if (await fsp.readable(sFilename)) {
				let sData = await fsp.fread(sFilename);
				let data = JSON.parse(sData);
                resolve(data);
            } else {
                reject('le projet n\'est pas lisible');
            }
        });
    }
    
    async getProjectPreview(sProject) {
        return new Promise(async (resolve, reject) => {
            let sFilename = projectTree.getStateFilename(sProject);
            if (await fsp.readable(sFilename)) {
				let sData = await fsp.fread(sFilename);
                let data = JSON.parse(sData);
                let thumbnail = false;
				if (data.frames.length > 0) {
					thumbnail = data.frames[data.frames.length >> 1].src;
				}
				let oDate = new Date(data.date);
				resolve({
					name: sProject,
					thumbnail,
					frames: data.frames.length,
					date: oDate.toLocaleDateString() + ' ' + oDate.toLocaleTimeString(),
                    entropy: Math.random()
				});
            } else {
                reject('le projet n\'est pas lisible');
            }
        });
	}
    
   
	/**
	 * Renvoie la liste des projets précédement sauvegardés
	 * @return {Promise}
	 */
    getProjectList() {
        return new Promise(async resolve => {
            let aProjectNames = await fsp.ls(projectTree.PATH_PROJECTS);
            // éliminer les projet qui n'ont pas de state.json
            let aProjects = [];
            for (let i = 0, l = aProjectNames.length; i < l; ++i) {
                let name = aProjectNames[i];
                let bReadable = await fsp.readable(path.resolve(projectTree.PATH_PROJECTS, name));
                if (bReadable) {
                    let preview = await this.getProjectPreview(name);
                    aProjects.push(preview);
                }
            }
            resolve(aProjects);
        });
    }

}

module.exports = new ProjectManager();
