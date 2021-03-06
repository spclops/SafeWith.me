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

var Menu = function(server, cache) {
	var self = this;
	
	/**
	 * Get login status and information from the server
	 */
	self.getLoginInfo = function(goal, callback) {
		// init Login anchor
		server.xhr({
			type: 'GET',
			uri: '/login?requestUri=' + goal,
			expected: 200,
			success: function(loginInfo) {
				// check if user logged in after already having generated keys	
				var lastLoginInfo = cache.readObject('lastLoginInfo');
				if (lastLoginInfo && lastLoginInfo.publicKeyId && !loginInfo.publicKeyId) {
					loginInfo.publicKeyId = lastLoginInfo.publicKeyId;
				}
				
				// remember last user in local storage
				cache.storeObject('lastLoginInfo', loginInfo);
				// got loginInfo from server
				callback(loginInfo);
			},
			error: function(e) {
				// get last user if server unreachable
				var loginInfo = cache.readObject('lastLoginInfo');
				callback(loginInfo);
			}
		});
	};
	
};