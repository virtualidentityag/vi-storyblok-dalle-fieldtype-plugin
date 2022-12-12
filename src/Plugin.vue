<template>
	<div>
		<SbFormItem :grouped="true" :isRequired="false">
      <SbTextField name="imageText" v-model="imageText"/>
      <SbButton size="small" variant="primary" @click="search">DALL-E it</SbButton>
    </SbFormItem>
	</div>
</template>
<script>

import { SbTextField, SbButton, SbFormItem } from 'storyblok-design-system'
import {signAsset} from './../utils/services'
import {openai} from './../utils/openai'

/* eslint-disable */ 
export default {
	mixins: [window.Storyblok.plugin],
	components: {
    SbTextField,
		SbButton,
		SbFormItem
  },
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
<style>
.widget{
  display: flex;
	flex-direction: row;
	justify-content: space-around;
}
input{
	font-size: 14px !important;
}
.sb-textfield {
	width: 69% !important
}
.sb-button--small {
	width: 32% !important;
	font-size: 1.1em;
}
</style>