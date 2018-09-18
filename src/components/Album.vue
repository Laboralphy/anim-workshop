<template>
    <v-card>
        <v-layout row wrap>
            <v-card-title primary-title>
                <div class="text-uppercase">Images</div>
            </v-card-title>
        </v-layout>
        <v-container grid-list-sm fluid>
            <v-layout row wrap>
                <v-flex xs4 v-for="f in getFrames()" :key="f.id">
                    <v-card flat tile>
                        <v-img
                                :src="f.src"
                                height="128px"
                        ></v-img>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "Album",
        computed: {
            ...mapGetters(['getFrames'])
        }
    }
</script>

<style scoped>

</style>