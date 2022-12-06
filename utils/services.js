import axios from "axios";
import Storyblok from "./Storyblok-config";

/* eslint-disable */ 

export const uploadAssetService = async (spaceId,signed_response_object, form) => {
	return await axios.post(signed_response_object.post_url, form)
		.then((res) => {
			Storyblok.get(`spaces/${spaceId}/assets/` + signed_response_object.id + '/finish_upload').then(response => {
				// this.model.filename = 'https://a.storyblok.com/' + signed_response_object.fields.key
			}).catch(error => {
				throw error
			})
		})
}

export const signAsset = async (spaceId, form, fileBlob) => {
	let signedResponse = Storyblok.post(`spaces/${spaceId}/assets/`, form).then(response => {
											this.uploadAsset(response.data, fileBlob)
									 }).catch(error => {
											console.log(error)
									})
	return signedResponse
}
