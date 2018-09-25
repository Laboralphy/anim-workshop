/*

service de gestion de projet
assure 
* 1) sauvegarde, chargement de projet
* 2) creation de film

 */
const fs = require('fs');
const path = require('path');
const FsPlus = require('../fs-plus');
const cp = require('child_process');
const SFTPClient = require('ssh2-sftp-client');

const fsp = new FsPlus();



const FILENAME_ROOT = 'frame-';
const PATH_HOME = fsp.home();
const PATH_BASE = path.resolve(PATH_HOME, '.anim-workshop');
const MIME_ALIASES = {
	'jpeg': 'jpg',
};

class ProjectManager {


    constructor() {
        this.sName = '';
        this.sVideoFilename = '';
        this.iFrame = 0;
        this.PATH_PROJECTS = path.resolve(PATH_BASE, 'projects');
    }

    /**
     * Définition du nom du projet, entraine la création des répertoires de travails.
     * @param sName {string}
     */
    async setName(sName) {
        this.sName = sName;
        return new Promise(async resolve => {
            this.PATH_PROJECT = path.resolve(this.PATH_PROJECTS, sName);
            this.PATH_FRAMES = path.resolve(this.PATH_PROJECT, 'frames');
            this.PATH_MOVIE = path.resolve(this.PATH_PROJECT, 'movie');
            await fsp.mkdirp(this.PATH_PROJECT);
            await fsp.mkdirp(this.PATH_FRAMES);
            await fsp.mkdirp(this.PATH_MOVIE);
            resolve();
        });
    }

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
        return fsp.fwrite(path.resolve(this.PATH_PROJECT, 'state.json'), data);
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
				if (sExt in MIME_ALIASES) {
					sExt = MIME_ALIASES[sExt];
				}
            } else {
                reject('this image has no "data:image/***" header');
            }
            fsp.b64fwrite(sFilename + '.' + sExt, this.extractImageRawData(src));
            resolve();
        });
    }


    /**
     * Sauvegarde la collection de frames spécifiée.
     * Nettoyage du répertoire "frames" au préalable.
     * @param aFrames {string[]}
     */
    async saveFrames(aFrames) {
        // supprimer toutes les frames du répertoire
        let aFiles = await fsp.ls(this.PATH_FRAMES);
        aFiles = aFiles.map(f => path.resolve(this.PATH_FRAMES, f));
        await fsp.rm(aFiles);
        for (let i = 0, l = aFrames.length; i < l; ++i) {
            let f = aFrames[i];
            await this.writeImage(
                path.resolve(this.PATH_FRAMES, FILENAME_ROOT + i.toString()),
                f
            );
        }
    }

    /**
     * Renvoie le résultat d'une commande which
     * @param aCommands
     * @returns {Promise<void>}
     */
    async which(sCommand) {
        return new Promise((resolve, reject) => {
            cp.exec('which ' + sCommand, (error, stdout, stderr) => {
                if (error) {
                    resolve(false);
                }
                if (stdout.length > 0 && stdout.includes(sCommand)) {
                    resolve(sCommand)
                } else {
                    resolve(false);
                }
            });
        });
    }


    computeVideoFilename() {
        if (this.sName != '') {
            return path.resolve(this.PATH_MOVIE, this.sName + '.mp4');
        } else {
            return '';
        }
    }

    projectVideoExists() {
        return fsp.readable(this.computeVideoFilename());
    }

    /**
     * Renvoie true si le fichier video existe
     */
    videoFileExists() {

    }

    async makeFilm(sMusic, pProgress) {
        let sFF = await this.which('ffmpeg');
        let sAV = await this.which('avconv');
        let sCommand = sFF || sAV;
        let sVideoFilename = this.computeVideoFilename();
        return new Promise((resolve, reject) => {
            // avconv -r 5 -i $VIDEO_PATH/$project/${project}_%d.png -b:v 1000k $musicParam -acodec libmp3lame -shortest $VIDEO_PATH/$project.mp4
            let aArgsInput = [
                '-stats',
                '-y',
                '-r', 5,
                '-i',
                path.resolve(this.PATH_FRAMES, 'frame-%d.jpg'),
            ];
            let aArgsMusic = !!sMusic ? [
                    '-i',
                    sMusic,
                ] : [];
            let aArgsOutput = [
                '-vcodec', 'libx264',
                '-b:v', '1000k',
                '-shortest',
                sVideoFilename,
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
                    resolve(sVideoFilename);
                } else {
                    reject(code);
                }
            });
            p.stderr.on('data', data => {
                let r = data.toString().match(/^frame= *([0-9]+) /);
                if (r) {
                    if (pProgress) {
                        pProgress(parseInt(r[1]));
                    }
                }
            });
        });
    }

    async uploadFilm(pCallback) {
        return new Promise(async (resolve, reject) => {
            let localFile = this.computeVideoFilename();
            let bExists = await fsp.readable(localFile);
            if (!bExists) {
                reject('fichier video inexistant : ' + localFile.split('/').pop());
                return;
            }
            let sJson = await fsp.fread(path.resolve(PATH_BASE, 'upload.json'));
            let oCnx = JSON.parse(sJson);
            let remoteFile = path.resolve(oCnx.remotePath, this.sName + '.mp4');
            let sftp = new SFTPClient();
            await sftp.connect(oCnx);
            let nSize = await fsp.size(localFile);
            let nSent = 0;
            let rs = fs.createReadStream(localFile);
            if (pCallback) {
                pCallback('start', {filename: this.sName + '.mp4', size: nSize});
                rs.on('data', chunk => {
                    nSent += chunk.length;
                    pCallback('progress', {sent: nSent, size: nSize});
                });
                rs.on('end', () => {
                    nSent = nSize;
                    pCallback('end');
                });
            }
            await sftp.put(rs, remoteFile, {});
            resolve();
        });
    }

    async loadProject(sProject) {
        return new Promise(async (resolve, reject) => {
            let sFilename = path.resolve(this.PATH_PROJECTS, sProject, 'state.json');
            if (await fsp.readable(sFilename)) {
                await this.setName(sProject);
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
            let sFilename = path.resolve(this.PATH_PROJECTS, sProject, 'state.json');
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
            let aProjectNames = await fsp.ls(this.PATH_PROJECTS);
            // éliminer les projet qui n'ont pas de state.json
            let aProjects = [];
            for (let i = 0, l = aProjectNames.length; i < l; ++i) {
                let name = aProjectNames[i];
                let bReadable = await fsp.readable(path.resolve(this.PATH_PROJECTS, name));
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
