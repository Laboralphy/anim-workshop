const fsp = require('../fs-plus');
const path = require('path');

/**
 * gestion de toute l'arborescence du projet
 */


class ProjectTree {
    constructor() {
        this._name = '';
        this.PATH_HOME = fsp.home();
        this.PATH_BASE = path.resolve(this.PATH_HOME, '.anim-workshop');
        this.PATH_PROJECTS = path.resolve(this.PATH_BASE, 'projects');
    }

    /**
     * Définition du nom du projet
     * @param sName {string}
     */
    setName(sName) {
        this._name = sName;
        this.PATH_PROJECT = this.getProjectPath(sName);
        this.PATH_FRAMES = path.resolve(this.PATH_PROJECT, 'frames');
        this.PATH_MOVIE = path.resolve(this.PATH_PROJECT, 'movie');
        return this.buildTree();
    }

    /**
     * Renvoie le chemin dans lequel serai stocké un hypothétique projet
     * @param sProject {string}
     * @return {string}
     */
    getProjectPath(sProject) {
        return path.resolve(this.PATH_PROJECTS, sProject);
    }

    /**
     * renvoie le nom du projet précédement défini
     * @return {string}
     */
    getName() {
        return this._name;
    }

    /**
     * Construction au besoin de l'arborescence du projet
     * @return {Promise<void>}
     */
    async buildTree() {
        return new Promise(async resolve => {
            await fsp.mkdirp(this.PATH_PROJECT);
            await fsp.mkdirp(this.PATH_FRAMES);
            await fsp.mkdirp(this.PATH_MOVIE);
            resolve();
        });
    }

    /**
     * Renvoie le nom du fichier video de rendu final, pour le projet en cours
     * revoie false si le nom de projet n'est pas défini
     * @return {string|boolean}
     */
    getOutputFilename() {
        if (this.getName() != '') {
            return path.resolve(this.PATH_MOVIE, this.getName() + '.mp4');
        } else {
            return false;
        }
    }

    /**
     * Renvoie une promesse que sera résolue TRUE si le fichier de sortie video existe
     * @return {Promise<boolean>}
     */
    isOutputFileExists() {
        return fsp.readable(this.getOutputFilename());
    }

    /**
     * Renvoie le nom de fichier complet de sauvegarde du state
     * @return {string}
     */
    getStateFilename(sProject = '') {
        if (sProject !== '') {
            return path.resolve(this.PATH_PROJECTS, sProject, 'state.json');
        } else {
            return path.resolve(this.PATH_PROJECT, 'state.json');
        }
    }

    /**
     * Renvoie le nom du répertoire contenet les frames
     * @return {string}
     */
    getFramesPath() {
        return path.resolve(this.PATH_PROJECT, 'frames');
    }

    getConfigFilename() {
        return path.resolve(this.PATH_BASE, 'config.json');
    }


}

module.exports = new ProjectTree();