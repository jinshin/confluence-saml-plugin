/**
 * Confluence SAML Plugin - a confluence plugin to allow SAML 2.0
 *  authentication. 
 *
 *  Copyright (C) 2014 Bitium, Inc.
 *  
 *  This file is part of Confluence SAML Plugin.
 *  
 *  Confluence SAML Plugin is free software: you can redistribute it 
 *  and/or modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation, either version 3 of
 *  the License, or (at your option) any later version.
 *  
 *  Confluence SAML Plugin is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with Pineapple. If not, see <http://www.gnu.org/licenses/>.
 */
AJS.$(function() {

    function setButtonText() {
              AJS.$.ajax({
                url: AJS.contextPath() + "/plugins/servlet/saml/getajaxconfig?param=buttonText",
                type: "GET",
                error: function() {},
                success: function(response) {
                    if (response != "") {
                       console.log(response);
                       logbutton = document.getElementById('idSSOButton');
                       logbutton.innerHTML=response;
                    }                 
		}
            });
     };

  //Avoid breaking admin panel
  if(location.pathname == '/authenticate.action') {
       //console.log("Admin panel, exiting");
       return;
  };

  //We might need local login
  if(location.search.startsWith('?uselocallogin')) {
       return;
  };

  if (AJS.$(".aui.login-form-container").length) {
    AJS.$(".aui.login-form-container").hide();

    var ButtonText = "SSO Login";

    AJS.$('<div class="field-group"><a id="idSSOButton" class="aui-button aui-style aui-button-primary" href="plugins/servlet/saml/auth" style="align:center;">' + ButtonText + '</a></div><h2 style="margin-top:10px"></h2>').insertAfter(AJS.$(".aui.login-form-container #action-messages"));

    setButtonText();

    var errorDetected = 0;
    
    var query = location.search.substr(1);
    query.split("&").forEach(function(part) {
      var item = part.split("=");
      if (item.length == 2 && item[0] == "samlerror") {
        var errorKeys = {};
        errorKeys["general"] = "No access. Contact your PM for Confluence account.";
        errorKeys["user_not_found"] = "No access. Contact your PM for Confluence account.";
        errorKeys["plugin_exception"] = "No access. Contact your PM for Confluence account.";
        //AJS.$(".aui.login-form-container").show();
        var message = '<div class="aui-message closeable error">' + errorKeys[item[1]] + '</div>';
        AJS.$(message).insertBefore(AJS.$(".aui.login-form-container"));
      }
    });

    if ( errorDetected == 1 ) { return; };

    if (location.search == '?logout=true') {
      $.ajax({
        url : AJS.contextPath() + "/plugins/servlet/saml/getajaxconfig?param=logoutUrl",
        type : "GET",
        error : function() {
        },
        success : function(response) {
          if (response != "") {
            AJS.$('<p>Please wait while we redirect you to your company log out page</p>').insertBefore(AJS.$(".aui.login-form-container"));
            window.location.href = response;
            return;
          }
          AJS.$(".aui.login-form-container").show();
        }
      });
      return;
    }

    $.ajax({
      url : AJS.contextPath() + "/plugins/servlet/saml/getajaxconfig?param=idpRequired",
      type : "GET",
      error : function() {
      },
      success : function(response) {
        if (response == "true") {
          // AJS.$('<img src="download/resources/com.bitium.confluence.SAML2Plugin/images/progress.png"/>').insertBefore(AJS.$(".aui.login-form-container"));
          AJS.$('<p>Please wait while we redirect you to your company log in page</p>').insertBefore(AJS.$(".aui.login-form-container"));
          window.location.href = 'plugins/servlet/saml/auth';

        } else {
          AJS.$(".aui.login-form-container").show();
        }
      }
    });
  }
});
