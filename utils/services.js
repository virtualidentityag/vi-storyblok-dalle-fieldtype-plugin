import axios from "axios";
import { ASSET_FOLDER_NAME } from "./constants";
import Storyblok from "./Storyblok-config";

/* eslint-disable */ 

export const uploadAsset = async (spaceId, signed_response_object, fileBlob) => {
	let form = new FormData();

	for (let key in signed_response_object.fields) {
		form.append(key, signed_response_object.fields[key]);
	}

	form.append('file', fileBlob);

	const response =  await axios.post(signed_response_object.post_url, form)
		.then( async () => {
					return await Storyblok.get(`spaces/${spaceId}/assets/` + signed_response_object.id + '/finish_upload').then(() => {
						return 'https://a.storyblok.com/' + signed_response_object.fields.key
					}).catch(error => {
						throw error
			})
		})

	return response;
}

export const signAsset = async (spaceId, form, fileBlob) => {
	const signedResponse = 
	
	await Storyblok.post(`spaces/${spaceId}/assets/`, form).then(response => {
			return uploadAsset(spaceId,response.data, fileBlob)
		}).catch(error => {
			console.log(error)
	})
	
	return signedResponse
}

export const getAssetsFolder = async (spaceId) => {
	const assetsFolder = await Storyblok.get(`spaces/${spaceId}/asset_folders/`, {})
		.then(response => {
			return response.data.asset_folders
		}).catch(error => {
			console.log(error)
		})

	console.log('assetsFolder', assetsFolder)

	return assetsFolder
}

export const createAssetsFolder = async (spaceId) => {
	const assetsFolder = await Storyblok.post(`spaces/${spaceId}/asset_folders/`, {
		"asset_folder": {
			"name": ASSET_FOLDER_NAME
		}
	}).then(response => {
			return response.data.asset_folder
		}).catch(error => {
			console.log(error)
	})
	return assetsFolder
}
