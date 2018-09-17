<template>
    <v-tabs
            v-model="active"
            slider-color="#44FF44"
    >
        <v-tab :key="1" ripple>Caméra</v-tab>
        <v-tab :key="2" ripple>Snapshot</v-tab>
        <v-tab-item :key="1">
            <v-card flat>
                <v-card-text>Un écran Caméra</v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item :key="2">
            <v-card flat>
                <v-card-text>Un écran photo</v-card-text>
            </v-card>
        </v-tab-item>
    </v-tabs>
</template>

<script>
    export default {
        name: "MainScreen",
        data: function() {
            return {
            };
        }
    }
</script>

<style scoped>

</style>