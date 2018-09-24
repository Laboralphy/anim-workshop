<template>
    <v-snackbar
        v-model="snackbar"
        :color="color"
        :timeout="3000"
        top right
    >
        {{ text }}
        <v-btn
                dark
                flat
                @click="snackbar = false"
        >
            Fermer
        </v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: "FlashText",
        data: function() {
            return {
                snackbar: false,
                text: '',
                color: ''
            }
        },
        methods: {
            display: function(sText, sColor) {
                this.text = sText;
                this.color = sColor;
                this.snackbar = true;
            }
        }
    }
</script>

<style scoped>

</style>