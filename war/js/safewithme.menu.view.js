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
 * This class contains all logic that makes changes to the DOM
 */
var MENUVIEW = (function ($, menu) {
	var self = {};

	/**
	 * init UI
	 */
	self.init = function(goal, callback) {
		menu.getLoginInfo(goal, function(loginInfo) {
			self.updateLogin(loginInfo);
			callback(loginInfo);
		});
	};
	
	/**
	 * Changes the login anchor archording to the login status
	 */
	self.updateLogin = function(loginInfo) {
		if (loginInfo.loggedIn) {
			$('#loginStatus').attr({ href: loginInfo.logoutUrl });
		} else {
			window.location.href = loginInfo.loginUrl;
		}
	};
	
	return self;
}($, MENU));