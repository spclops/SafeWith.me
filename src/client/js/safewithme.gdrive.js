/*
 * SafeWith.me - store and share your files with OpenPGP encryption on any device via HTML5
 *
 * Copyright (c) 2012 Tankred Hase
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 */

'use strict';

/**
 * A wrapper for Google Drive communication
 */
var GoogleDrive = function(util, server) {
	var self = this;
	
	var driveBaseUri = 'https://www.googleapis.com/drive/v1/files';
	
	/**
	 * Upload a new file blob to Google Drive by first allocating a
	 * new file resource (POST) and then uploading the file contents (PUT)
	 */
	self.uploadBlob = function(blob, oauthParams, md5, callback, errCallback) {
		// first POST new drive file to allocate resource
		server.xhr({
			type: 'POST',
			uri: driveBaseUri,
			contentType: 'application/json',
			auth: oauthParams.token_type + ' ' + oauthParams.access_token,
			body: JSON.stringify({
				title: 'encrypted_blob_' + md5,
				mimeType: blob.type
			}),
			expected: 200,
			success: function(created) {
				uploadBlob(created.id);
			},
			error: function(e) {
				errCallback(e);
			}
		});

		// then PUT the file contents
		function uploadBlob(fileId) {
			var formData = new FormData();	// multipart/form-data
			formData.append('file', blob);

			server.xhr({
				type: 'PUT',
				uri: driveBaseUri + '/' + fileId,
				auth: oauthParams.token_type + ' ' + oauthParams.access_token,
				body: formData,
				expected: 200,
				success: function(resp) {
					callback(fileId);
				},
				error: function(e) {
					errCallback(e);
				}
			});
		}
	};
	
	/**
	 * Download a blob from Google Drive
	 */
	self.downloadBlob = function(fileId, oauthParams, callback, errCallback) {
		server.xhr({
			type: 'GET',
			uri: driveBaseUri + '/' + fileId,
			auth: oauthParams.token_type + ' ' + oauthParams.access_token,
			responseType: 'arraybuffer',
			expected: 200,
			success: function(resp) {
				var blob = util.arrBuf2Blob(resp, 'application/octet-stream');
				callback(blob);
			},
			error: function(e) {
				errCallback(e);
			}
		});
	};
	
	/**
	 * Deletes a blob from Google Drive
	 */
	self.deleteBlob = function(fileId, oauthParams, callback, errCallback) {
		server.xhr({
			type: 'DELETE',
			uri: driveBaseUri + '/' + fileId,
			auth: oauthParams.token_type + ' ' + oauthParams.access_token,
			expected: 200,
			success: function(resp) {
				callback(resp);
			},
			error: function(e) {
				errCallback(e);
			}
		});
	};
	
};