// ==UserScript==
// @name           BrowserScriptsInstaller
// @author         dghaynes@
// @namespace      http://www.amazon.com
// @description    A script to install all browser scripts for TOC
// @downloadURL    //
// @updateURL      //
// @version        0.1.00
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_log
// @grant          GM_setClipboard
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @include        *t.corp.amazon.*
// ==/UserScript==

GM_addStyle(`
  /* The Modal (background) */
  .toc_modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */git
  }


  /* Modal Content/Box */
  .toc_modal_content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* Could be more or less, depending on screen size */
    font-size: 15px;
    color: black;
  }

  .toc_modal_button {
    width: 100%;
  }

  /* The Close Button */
  .toc_close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .toc_close:hover,
  .toc_close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
  .shake {
    /* Start the shake animation and make the animation last for 0.5 seconds */
    animation: shake 1s;
    /* When the animation is finished, start again */
    animation-iteration-count: infinite;
  }
  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
` );


var isBrowserVersionChecked = await GM.getValue("browser_script_version_checked");
var browserVersionCheckedTime = await GM.getValue("browser_script_version_checked_time");

unsafeWindow.open_windows = open_windows;

var currentVersion = GM_info.script.version;
var downloadUrl = GM_info.script.downloadURL;

function getLatestVersion() {
    let gmReq = GM.xmlHttpRequest;
    const response = gmReq({
        method: 'GET',
        url: downloadUrl,
        headers: {
            "Content-Encoding": "amz-1.0",
            "charset": "UTF-8",
        },
    }).then(response => {
        return response.response;
    }).then(data => {
        return data;
    }).catch(error => {
        console.log(error.message);
        return error;
    });
    return response;
};
function isCurrentVersionOld(latestVersion) {
    var latestVersionBits = latestVersion.split('.');
    var currentVersionBits = currentVersion.split('.');
    if (latestVersionBits.length != currentVersionBits.length)
        return false;
    for (var ind = 0; ind < latestVersionBits.length; ind++) {
        if (!isNaN(latestVersionBits[ind]) && !isNaN(currentVersionBits[ind]) && parseInt(latestVersionBits[ind]) > parseInt(currentVersionBits[ind]))
            return true;
    }
    return false;
}
function open_windows() {
    //window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/CreateDispatch.user.js?raw=1', '_blank');
    //window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/StoreMetadata.user.js?raw=1', '_blank');
    //window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/TicketEscalation.user.js?raw=1', '_blank');
    //window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/TOCTicketHandoff.user.js?raw=1', '_blank');
   // window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/CreateStoreOpsRequest.user.js?raw=1', '_blank');
    //window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/downtimeSessionsSelector.user.js?raw=1', '_blank');
    window.open('https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/TOCBrowserScriptsInstaller.user.js?raw=1', '_blank');
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// FOR TESTING ONLY
// console.log('--- --- ---');
// console.log(isBrowserVersionChecked);
// console.log(browserVersionCheckedTime);
// console.log('--- --- ---');
// END FOR TESTING ONLY

if (isBrowserVersionChecked === undefined
    || browserVersionCheckedTime === undefined
    || browserVersionCheckedTime === {}
    || JSON.stringify(browserVersionCheckedTime) === "{}"
    || isBrowserVersionChecked === 'undefined'
    || browserVersionCheckedTime === 'undefined'
    || ((new Date() - new Date(browserVersionCheckedTime)) / (1000 * 4 * 60 * 60)) > 1
) {
    const latestScript = await getLatestVersion();
    var latestVersion = latestScript.split('\n').filter(item => item.indexOf('version') > -1)[0].replace('// @version', '').replaceAll(' ', '');
    if (isCurrentVersionOld(latestVersion)) {
        var modalElement = document.createElement('div');
        modalElement.id = 'myModal';
        modalElement.classList.add('toc_modal');
        modalElement.style.display = 'none';
        var modalContent = `
                <!-- Modal content -->
                <div class="toc_modal_content">
                    <span class="toc_close" >&times;</span>
                    <p>
                        <button id="myButton" class="toc_modal_button" type="button" onclick="open_windows()">
                            TOC Browser Script Update. Click here!
                        </button>
                        <div id='check_popup' class='shake'>
                            * Check your browser and enable pop-ups so other scripts can be installed.
                        </div>
                        <br/>
                        To allow pop-ups in Chrome, type this <b>chrome://settings/content/popups</b> and allow pop-ups for https://t.corp.amazon.com and then refresh the page and install the scripts.<br/>
                        To allow pop-ups in Firefox, type this <b>about:preferences#privacy</b> and allow pop-ups for https://t.corp.amazon.com and then refresh the page and install the scripts<br/>
                        If the above fails, use this <a href='https://code.amazon.com/packages/JIHMTOCTools/blobs/mainline/--/configuration/userscripts/TOCBrowserScriptsInstaller.user.js?raw=1'>link</a> to install the script <b> <-- NOT RECOMMENDED</b>
                    </p>
                </div>
                `;
        modalElement.innerHTML = modalContent;
        document.body.prepend(modalElement);
        var modal = document.getElementById('myModal');
        $('body').css('z-index', 1);
        $('#myModal').css('z-index', 10);
        $('#myModal').css('top', '50%');
        $('#myModal').css('left', '50%');
        $('#myModal').css('transform', 'translate(-50%, -50%)');
        $('#myModal').css('width', '100%');
        $('#myModal').css('height', '100%');
        var span = document.getElementsByClassName('toc_close')[0];
        modal.style.display = 'block';
        span.onclick = function () {
            modal.style.display = 'none';
        }
        /*window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }*/
    }
    GM.setValue("browser_script_version_checked", true);
    GM.setValue("browser_script_version_checked_time", new Date());
}
// FOR TESTING ONLY
// GM.setValue("browser_script_version_checked", undefined);
// GM.setValue("browser_script_version_checked_time", undefined);
// END FOR TESTING