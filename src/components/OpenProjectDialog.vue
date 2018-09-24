<template>
    <v-dialog
		v-model="dialog"
		width="50%"
        scrollable
    >
        <v-card>
            <v-card-title
                    class="headline"
                    primary-title
            >
                Ouvrir un projet
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text height="70%">
                <v-list two-line>
                    <v-list-tile
                            v-for="(p, i) in projects"
                            :key="p.name + '/' + p.entropy"
                            @click="loadClicked(p.name)"
                    >
                        <v-list-tile-content>
                            <v-list-tile-title>{{ p.name }}</v-list-tile-title>
                            <v-list-tile-sub-title>
                                <span>{{ p.frames + ' image' + (p.frames > 1 ? 's' : '') }}</span>
                                - <span class="caption font-weight-thin font-italic">{{ p.date }}</span>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-spacer></v-spacer>
                </v-list>
            </v-card-text>
        </v-card>
	</v-dialog>
</template>

<script>
    export default {
        name: "OpenProjectDialog",
		props: ['projects'],
        data: function() {
			return {
				dialog: false
			};
		},

		methods: {
            loadClicked: function(name) {
                this.dialog = false;
                this.$emit('load', {name});
			}
		}
    }
</script>

<style scoped>

</style>
