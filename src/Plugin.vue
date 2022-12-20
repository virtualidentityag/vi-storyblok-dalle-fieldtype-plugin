<template>
	<div>
		<!-- <SbFormItem :grouped="true" :isRequired="false">
			<SbSelect
				v-model="aspectRatio"
				label="Aspect ratio"
				:options='aspectRatioOptions'
			/>
    </SbFormItem> -->
		<SbFormItem :grouped="true">
      <SbTextField name="imageText" v-model="imageText" required errorMessage="Image keyword is required" :error="this.error"/>
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
				</a>
			</div>
		</footer>
	</div>
</template>
<script>

/* eslint-disable */ 

import { SbTextField, SbButton, SbFormItem, SbSelect } from 'storyblok-design-system'
import {createAssetsFolder, getAssetsFolder, signAsset} from './../utils/services'
import {openai} from './../utils/openai'
import { ASSET_FOLDER_NAME } from '../utils/constants'

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
			aspectRatioOptions: [ {"label": "16:9","value": '16:9'},{"label": "1:1","value": '1:1'},{"label": "4:3","value": '4:3'}],
			error: false
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
			let folders = await getAssetsFolder(this.spaceId)
      let assetFolder = folders.find(folder => folder.name === ASSET_FOLDER_NAME)

      if(!assetFolder)
        assetFolder = await createAssetsFolder(this.spaceId)

			let form = {filename: this.imageText+'.png', size: this.imageSize,  asset_folder_id: assetFolder.id}
			this.model.filename = await signAsset(this.spaceId,form, fileToUpload)
			// this.imageText = ""
			this.loading = false
		},

		async search() {	

			if(this.imageText.trim().length === 0 )
				this.error = true
			else{
				this.error = false
				this.loading = true;

				await openai.createImage({
					prompt: this.imageText,
					n: 1,
					size: this.imageSize,
					response_format:'b64_json'
				}).then(response => {
					this.downloadImage(response.data.data[0].b64_json)
					return response
				}).catch(error => {
					this.loading = false;
					return error
				})
			}
		},
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

.sb-textfield__input--error, .sb-textfield__textarea--error {
    border: 1px solid #ff6159 !important;
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


.sb-textfield {
	width: 69% !important
}
.sb-button--small {
	width: 32% !important;
	font-size: 1.0em !important;
	height: 42px !important;
}
.sb-form-item:last-child {
  margin-bottom: 0px !important;
}
.sb-select-list {
  padding: 0px !important;
}
.sb-textfield__message, .sb-select-list__create, .sb-select-list__item {
  font-size: 1.0em !important;
}
.sb-form-item--grouped .sb-form-item__body {
  display: flex;
  width: 98% !important;
}
.sb-select {
  margin-top: 2px !important;
}
.sb-select-inner {
  padding: 0px 0px 0px 10px !important;
  font-size: 1.0em !important;
}
.sb-select-list__create, .sb-select-list__item {
  padding: 5px 5px !important;
}
.sb-form-item {
  margin-bottom: 16px!important;
  padding: 0px 3px 0px 3px !important;
}
</style>