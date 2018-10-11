const path = require('path');
const fs = require('fs');
const SFTPClient = require('ssh2-sftp-client');
const fsp = require('../fs-plus');
const projectTree = require('../project-tree');
const config = require('../config');

class VideoUploader {
    async upload(pCallback) {
        return new Promise(async (resolve, reject) => {
            let localFile = projectTree.getOutputFilename();  // complete filename with path
            let sDisplayableName = localFile.split('/').pop(); // filename without path

            // testing local file existance
            let bExists = await fsp.readable(localFile);
            if (!bExists) {
                // video is not available (not created yet)
                reject('fichier vidéo inexistant : ' + sDisplayableName);
                return;
            }
            // creating remote filename
            let oCnx = config.upload;
            let remoteFile = oCnx.remotePath + '/' + projectTree.getName() + '.mp4';

            // opening sftp connection
            let sftp = new SFTPClient();
            await sftp.connect(oCnx);

            // calc file size
            let nSize = await fsp.size(localFile);
            let nSent = 0;

            // opening local file
            let rs = fs.createReadStream(localFile);
            if (pCallback) {
                // notifying start
                pCallback('start', {filename: sDisplayableName, size: nSize});

                // when data is transfered, add chunk size to accumulator
                rs.on('data', chunk => {
                    nSent += chunk.length;
                    pCallback('progress', {sent: nSent, size: nSize});
                });

                // when no more data, notify final
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