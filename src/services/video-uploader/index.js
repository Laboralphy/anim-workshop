const path = require('path');
const fs = require('fs');
const SFTPClient = require('ssh2-sftp-client');
const fsp = require('../fs-plus');
const projectTree = require('../project-tree');
const config = require('../config');

class VideoUploader {
    async upload(pCallback) {
        return new Promise(async (resolve, reject) => {
            let localFile = projectTree.getOutputFilename();
            let sDisplayableName = localFile.split('/').pop();
            let bExists = await fsp.readable(localFile);
            if (!bExists) {
                reject('fichier video inexistant : ' + sDisplayableName);
                return;
            }
            let oCnx = config.upload;
            let remoteFile = oCnx.remotePath + '/' + projectTree.getName() + '.mp4';
            let sftp = new SFTPClient();
            await sftp.connect(oCnx);
            let nSize = await fsp.size(localFile);
            let nSent = 0;
            let rs = fs.createReadStream(localFile);
            if (pCallback) {
                pCallback('start', {filename: sDisplayableName, size: nSize});
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
}

module.exports = VideoUploader;