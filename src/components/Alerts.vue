<template>
    <v-layout row>
        <v-flex xs12>
            <v-alert
                    v-for="a in getAlerts()"
                    value="true"
                    :type="a.type"
                    dismissible
                    :key="a.id"
            >
                {{ a.message }}
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import * as types from '../store/action-types';
    export default {
        name: "Alerts",
        computed: {
            ...mapGetters(['getAlerts'])
        }
    }
</script>

<style scoped>

</style>