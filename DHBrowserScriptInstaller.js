// ==UserScript==
// @name           DHBrowserScriptsInstaller
// @author         dghaynes
// @description    A script to install all browser scripts for Derek
// @downloadURL    https://github.com/dghaynes/BrowserScriptInstaller/blob/main/DHBrowserScriptInstaller.js?raw=1
// @updateURL      https://github.com/dghaynes/BrowserScriptInstaller/blob/main/DHBrowserScriptInstaller.js?raw=1
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
// @include        *localhost*
// ==/UserScript==

GM_addStyle(`
  /* The Modal (background) */
  .modal {
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
  .modal_content {
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 50%; /* Could be more or less, depending on screen size */
    font-size: 15px;
    color: black;
  }

  .modal_button {
    width: 100%;
  }

  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
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


let isBrowserVersionChecked = await GM.getValue("browser_script_version_checked");
let browserVersionCheckedTime = await GM.getValue("browser_script_version_checked_time");

unsafeWindow.open_windows = open_windows;

let currentVersion = GM_info.script.version;
let downloadUrl = GM_info.script.downloadURL;    // points to my git repository where the latest version can be found

function getLatestVersion() {
    let gmReq = GM.xmlHttpRequest;
    const response = gmReq({
        method: 'GET',
        url: downloadUrl,
        headers: {
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
    let latestVersionBits = latestVersion.split('.');
    let currentVersionBits = currentVersion.split('.');
    if (latestVersionBits.length != currentVersionBits.length)
        return false;
    for (let ind = 0; ind < latestVersionBits.length; ind++) {
        if (!isNaN(latestVersionBits[ind]) && !isNaN(currentVersionBits[ind]) && parseInt(latestVersionBits[ind]) > parseInt(currentVersionBits[ind]))
            return true;
    }
    return false;
};

//These point to all my current browser scripts
function open_windows() {
    window.open('https://github.com/dghaynes/BrowserScriptInstaller/blob/main/DHBrowserScriptInstaller.js?raw=1', '_blank');
    window.open('https://github.com/dghaynes/TamperMonkeyStarter/blob/main/Boilerplate.js?raw=1', '_blank');
    let modal = document.getElementById('myModal');
    modal.style.display = 'none';
}

// FOR TESTING ONLY
 console.log('--- --- ---');
 console.log(isBrowserVersionChecked);
 console.log(browserVersionCheckedTime);
 console.log('--- --- ---');
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
        modalElement.classList.add('modal');
        modalElement.style.display = 'none';
        var modalContent = `
                <!-- Modal content -->
                <div class="modal_content">
                    <span class="close" >&times;</span>
                    <p>
                        <button id="myButton" class="modal_button" type="button" onclick="open_windows()">
                            DH Browser Script Update. Click here!
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
        var span = document.getElementsByClassName('close')[0];
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