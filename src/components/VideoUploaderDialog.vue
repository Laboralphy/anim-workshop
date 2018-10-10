<template>
    <v-dialog
            v-model="dialog"
            width="50%"
    >
        <v-card>
            <v-card-title
                    class="headline"
                    primary-title
            >
                Transmettre la vidéo au serveur
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="status() === 0">
                <v-container class="red--text">
                    <v-layout row>
                        <v-flex xs12>
                            <span>Le fichier vidéo n'a pas encore été créé.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-text v-else-if="status() === 1">
                <v-container>
                    <v-layout row>
                        <v-flex xs12>
                            <span>La vidéo est prête à être transmise au serveur.</span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-text v-else-if="status() === 2">
                <v-container>
                    <v-layout row>
                        <v-flex xs6>
                            <span>La video est en cours de transmission sur le serveur. Vous pouvez fermer cette fenêtre, la transmission s'effectuera en arrière plan.</span>
                        </v-flex>
                        <v-flex xs6>
                            <div class="text-xs-center">
                                <v-progress-circular
                                        ref="o_progress_circ"
                                        :rotate="-90"
                                        :size="100"
                                        :width="15"
                                        :value="x"
                                        color="accent"
                                >
                                    {{ x }}%
                                </v-progress-circular>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :color="status() === 1 ? 'accent' : ''"
                    :disabled="status() !== 1"
                    flat
                    @click="transmit"
                >
                    Transmettre
                </v-btn>
                <v-btn
                    flat
                    @click="dialog = false"
                >
                    Fermer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import * as types from '../store/action-types';
    import projectTree from '../services/project-tree';
    import VideoUploader from '../services/video-uploader';

    export default {
        name: "VideoUploaderDialog",

        data: function() {
            return {
                dialog: false
            };
        },

        computed: {
            ...mapGetters({
                status: 'getUploadingVideoStatus',
                vu: 'getUploadingVideo'
            }),
            x: function() {
                return this.status() === 2
                    ? Math.round(100 * this.vu().sent / this.vu().size)
                    : 0;
            }
        },

        methods: {
            ...mapActions({'uploadVideo': types.UPLOAD_VIDEO}),
            transmit: function() {
                if (!projectTree.getOutputFilename()) {
                    this.$emit('error', 'Video inexistante');
                    this.dialog = false;
                    return;
                }
                let vu = new VideoUploader();
                vu.upload((s, p) => {
                    switch (s) {
                        case 'start':
                            this.uploadVideo({filename: p.filename, sent: 0, size: p.size});
                            break;

                        case 'progress':
                            this.uploadVideo({sent: p.sent, size: p.size});
                            break;

                        case 'end':
                            this.dialog = false;
                            this.uploadVideo({filename: '', sent: 0, size: 0});
                            this.$emit('uploaded');
                            break;
                    }
                }).catch(e => {
                    this.$emit('error', e);
                });
            }
        }
    }
</script>

<style scoped>

</style>