// ==UserScript==
// @name         Media Player
// @version      1.1
// @description  Handle MP4 and MP3 links to download or play using Plyr
// @author       PianoNic
// @match        https://moodle.bbbaden.ch/*
// @grant        none
// @icon         https://github.com/BBBaden-Moodle-userscripts/MediaPlayer/blob/main/icon/playerIcon.png?raw=true
// @require      https://cdn.plyr.io/3.7.8/plyr.polyfilled.js
// ==/UserScript==

(function() {
    'use strict';

    // Add Plyr CSS
    const plyrCss = document.createElement('link');
    plyrCss.rel = 'stylesheet';
    plyrCss.href = 'https://cdn.plyr.io/3.7.8/plyr.css';
    document.head.appendChild(plyrCss);

    // Add Plyr JS
    const plyrScript = document.createElement('script');
    plyrScript.src = 'https://cdn.plyr.io/3.7.8/plyr.polyfilled.js';
    plyrScript.onload = initialize; // Call initialize function after Plyr is loaded
    document.head.appendChild(plyrScript);

    // Function to initialize the script after Plyr is loaded
    function initialize() {
        // Function to create the modal
        function createModal() {
            const modalHTML = `
                <div class="modal fade" id="mediaModal" tabindex="-1" aria-labelledby="mediaModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="mediaModalLabel">Media Player</h5>
                            </div>
                            <div class="modal-body">
                                <div id="mediaContainer" style="border-radius: 10px; overflow: hidden;">
                                    <audio id="player" controls></audio>
                                </div>
                                <button id="downloadButton" class="btn btn-primary" style="margin-top: 10px; width: 100%;">Download Media</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Function to handle the modal actions
        function handleModalActions(url) {
            document.getElementById('downloadButton').addEventListener('click', function() {
                window.location.href = url;
                document.getElementById('mediaModal').classList.remove('show');
            });
        }

        // Create the modal when the script loads
        createModal();

        // Initialize Plyr for the media player
        const player = new Plyr('#player');

        // Add event listener for MP4 and MP3 links with additional query parameters
        document.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'A' && target.getAttribute('href')) {
                const url = target.getAttribute('href');
                if (url.match(/\.(mp4|mp3)(\?.*)?$/)) {
                    event.preventDefault();
                    const isVideo = url.match(/\.mp4(\?.*)?$/);
                    player.source = {
                        type: isVideo ? 'video' : 'audio',
                        sources: [
                            {
                                src: url,
                                type: isVideo ? 'video/mp4' : 'audio/mp3'
                            }
                        ]
                    };
                    document.getElementById('mediaModal').classList.add('show');
                    handleModalActions(url);
                }
            }
        });
    }
})();
