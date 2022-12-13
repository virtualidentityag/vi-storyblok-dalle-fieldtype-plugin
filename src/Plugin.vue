<template>
	<div>
		<SbFormItem :grouped="true" :isRequired="false">
			<SbSelect
				:value="aspectRatio"
				v-model="aspectRatio"
				label="Aspect ratio"
				:options='aspectRatioOptions'
			/>
    </SbFormItem>
		<SbFormItem :grouped="true" :isRequired="false">
      <SbTextField name="imageText" v-model="imageText"/>
      <SbButton :isLoading="loading" size="small" variant="primary" @click="search">DALL-E it</SbButton>
    </SbFormItem>
		<footer>
			<span>
				Developed by
				<a href="https://www.virtual-identity.com/" target="_blank"
					>Virtual Identity AG,</a
				>
				a certified Storyblok Partner.
			</span>
			<div class="badge">
				<a
					href="https://github.com/virtualidentityag/vi-storyblok-dalle-fieldtype-plugin"
					target="_blank"
				>
					<!-- <img src="./../assets/badge.svg" alt="Open Source" /> -->
				</a>
			</div>
		</footer>
	</div>
</template>
<script>

import { SbTextField, SbButton, SbFormItem, SbSelect } from 'storyblok-design-system'
import {signAsset} from './../utils/services'
import {openai} from './../utils/openai'

/* eslint-disable */ 
export default {
	mixins: [window.Storyblok.plugin],
	components: {
    SbTextField,
		SbButton,
		SbFormItem,
		SbSelect
  },
	data() {
		return {
			imageText:'',
			url:'',
			imageSize:'1024x1024',
			loading: false,
			aspectRatio: "",
			aspectRatioOptions: [ {"label": "16:9","value": '16:9'},{"label": "1:1","value": '1:1'},{"label": "4:3","value": '4:3'}]
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
			this.model.filename = await signAsset(this.spaceId,form, fileToUpload)
			this.imageText = ""
			this.loading = false
		},

		async search() {	
			this.loading = true;
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
	font-size: 1.0em !important;
}
.sb-form-item {
  margin-bottom: 16px !important;
}

.sb-form-item:last-child {
  margin-bottom: 0px !important;
}

footer {
	padding: 5px 0px;
	box-sizing: border-box;
	margin-top: 2px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

footer span {
	font-size: 12px;
	color: #00000099;
	font-weight: 400;
	line-height: 16px;
}

footer img {
	width: 100px;
}

footer a {
	text-decoration: none;
	font-weight: 700;
	color: #00000099;
}

.badge {
	display: flex;
	align-items: flex-end;
	height: 6vh;
	margin-top: 5px;
}

.sb-select-list{
	padding: 11px 0 !important
}
</style>