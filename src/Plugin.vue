<template>
	<div>
		<input class="uk-width-1-1" v-model="imageText" />
		<button @click="search">Search</button>
	</div>
</template>

<script>
import {signAsset} from './../utils/services'
import {openai} from './../utils/openai'

/* eslint-disable */ 
export default {
	mixins: [window.Storyblok.plugin],

	data() {
		return {
			imageText:'',
			url:'',
			imageSize:'1024x1024',
		};
	},
	
	methods: {
		initWith() {
			return {
				plugin: 'dall-e',
				filename:''
			}
		},
		
		dataURLtoFile(dataurl, filename) {
			let arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {type:mime});
		},

		async downloadImage(url) {
			let _url = 'data:image/png;base64,' + url
			let fileToUpload = this.dataURLtoFile(_url, 'image');
			let form = {filename: this.imageText+'.png', size: this.imageSize}
			this.model.filename  = await signAsset(this.spaceId,form, fileToUpload)
		},

		async search() {	
			const response = await openai.createImage({
				prompt: this.imageText,
				n: 1,
				size: this.imageSize,
				response_format:'b64_json'
			});
			this.downloadImage(response.data.data[0].b64_json)
		}
	},

	watch: {
		'model': {
			handler: function (value) {
				this.$emit('changed-model', value);
			},
			deep: true
		}
	}
}
</script>
