<template>
	<div>
		<input class="uk-width-1-1" v-model="imageText" />
		<button @click="search">Search</button>
	</div>
</template>

<script>
import axios from 'axios';
import Storyblok from "./../utils/Storyblok-config";
import {openai} from './../config/openai'
/* eslint-disable */ 
export default {
	mixins: [window.Storyblok.plugin],
	data() {
		return {
			imageText:'',
			url:'',
			imageSize:'1024x1024'
		};
	},
	methods: {
		initWith() {
			return {
				plugin: 'dall-e',
				filename:''
			}
		},

		uploadAsset (signed_response_object, fileBlob) {
			let form = new FormData();

			for (let key in signed_response_object.fields) {
				form.append(key, signed_response_object.fields[key]);
			}

			form.append('file', fileBlob);

			axios.post(signed_response_object.post_url,form)
			.then((res) => {
				Storyblok.get(`spaces/${this.spaceId}/assets/` + signed_response_object.id + '/finish_upload').then(response => {
					this.model.filename = 'https://a.storyblok.com/' + signed_response_object.fields.key
				}).catch(error => { 
					throw error
				})
			})
		},

		signAsset(form, fileBlob){
			Storyblok.post(`spaces/${this.spaceId}/assets/`, form).then(response => {
				this.uploadAsset(response.data, fileBlob)
			}).catch(error => { 
				console.log(error)
			})
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

		downloadImage(url) {
			let _url = 'data:image/png;base64,' + url
			let fileToUpload = this.dataURLtoFile(_url, 'image');
			let form = {filename: this.imageText+'.png', size: this.imageSize}
			this.signAsset(form, fileToUpload)
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
