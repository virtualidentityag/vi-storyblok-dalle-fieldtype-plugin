import axios from "axios";
import { ASSET_FOLDER_NAME, dataSourcesConstants } from "./constants";
import Storyblok from "./Storyblok-config";

/* eslint-disable */

export const uploadAsset = async (spaceId, signed_response_object, fileBlob) => {
	let form = new FormData();

	for (let key in signed_response_object.fields) {
		form.append(key, signed_response_object.fields[key]);
	}

	form.append('file', fileBlob);

	const response = await axios.post(signed_response_object.post_url, form)
		.then(async () => {
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
			return uploadAsset(spaceId, response.data, fileBlob)
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

export const fetchDataSources = async (spaceId, datasourceSlug) => {
	let datasource = await Storyblok.get(`spaces/${spaceId}/datasources`, { "slug": datasourceSlug })
		.then(response => {
			return response;
		}).catch(error => {
			console.log(error)
		})
	return datasource
}

export const getEntriesRequest = async (spaceId) => {
	let entry = await Storyblok.get(`spaces/${spaceId}/datasource_entries`, {
		"datasource_slug": dataSourcesConstants.APP_DATASOURCE_SLUG
	})
		.then(response => {
			return response;
		}).catch(error => {
			console.log(error)
		})
	return entry;
}

export const fetchDataSourceEntries = async (spaceId) => {
	let dataSourceEntryValues = null;
	let dataSourcesExistResult = undefined;

	let datasources = [{
		elementName: dataSourcesConstants.DALL_E_API_KEY_DATASOURCE_NAME,
		datasourceInitialValue: dataSourcesConstants.DALL_E_API_KEY_INITIAL_VALUE,
	}, {
		elementName: dataSourcesConstants.DALL_E_ORG_ID_DATASOURCE_NAME,
		datasourceInitialValue: dataSourcesConstants.DALL_E_ORG_ID_INITIAL_VALUE,
	}];

	let datasourceEntries = await getEntriesRequest(spaceId)

	if (!datasourceEntries || datasourceEntries.data.datasource_entries.length !== datasources.length)
		dataSourcesExistResult = await dataSourceAlreadyExists(datasourceEntries, dataSourcesConstants.APP_DATASOURCE_NAME, datasources, dataSourcesConstants.APP_DATASOURCE_SLUG, spaceId);

	if (dataSourcesExistResult && dataSourcesExistResult.length > 0)
		dataSourceEntryValues = dataSourcesExistResult;
	else
		dataSourceEntryValues = datasourceEntries && datasourceEntries.data && datasourceEntries.data.datasource_entries ? datasourceEntries.data.datasource_entries : null;

		// if (datasourceEntries) {
		// 	dataSourceEntryValues = datasourceEntries.data.datasource_entries ?? null;
		// }
		// dataSourceEntryValues = datasourceEntries?.data?.datasource_entries ?? null;
		// dataSourceEntryValues = datasourceEntries?.data?.datasource_entries ?? null;

	return dataSourceEntryValues;
}

const dataSourceAlreadyExists = async (entryKey, datasourceName, dataSourcesArray, datasourceSlug, spaceId) => {

	let dataSourceEntryValues = []

	if (!entryKey) {
		let dataSource = await createDataSource(spaceId, datasourceName, datasourceSlug);
		if (dataSource) {

			let requestsArray = dataSourcesArray.map(entry => createDataSourceEntry(spaceId, entry.elementName, entry.datasourceInitialValue, dataSource.data.datasource.id))

			await Promise.all(requestsArray)
				.then(res => {
					dataSourceEntryValues = res.map(entry => entry.data.datasource_entry)
				})
		}
	}
	else {

		let key = []

		if (entryKey.data.datasource_entries.length > 0)
			key = dataSourcesArray.filter(dataSourceElement => JSON.stringify(entryKey.data.datasource_entries).indexOf(dataSourceElement.elementName) === -1);
		else
			key = Array.from(dataSourcesArray)

		let datasource = await fetchDataSources(spaceId, datasourceSlug)

		if (datasource) {
			let dataSourceId = datasource.data.datasources.find(element => element.slug === datasourceSlug).id
			let requestsArray = key.map(entry => createDataSourceEntry(spaceId, entry.elementName, entry.datasourceInitialValue, dataSourceId))

			await Promise.all(requestsArray)
				.then(res => {
					dataSourceEntryValues = res.map(entry => entry.data.datasource_entry)
					dataSourceEntryValues = Array.from(entryKey.data.datasource_entries.concat(dataSourceEntryValues))
				})
		}
	}
	return dataSourceEntryValues
}


export const createDataSource = async (spaceId, name, slug) => {
	let newDataSource = await Storyblok.post(`spaces/${spaceId}/datasources`, {
		"datasource": {
			"name": name,
			"slug": slug,
		}
	}).then(response => {
		return response
	}).catch(error => {
		console.log(error)
	})
	return newDataSource
}

export const createDataSourceEntry = async (spaceId, name, value, dataSourceId) => {
	let newDataSource = await Storyblok.post(`spaces/${spaceId}/datasource_entries`, {
		"datasource_entry": {
			"name": name,
			"value": value,
			"datasource_id": dataSourceId
		}
	}).then(response => {
		return response
	}).catch(error => {
		console.log(error)
	})
	return newDataSource;
}
