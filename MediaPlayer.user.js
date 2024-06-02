// ==UserScript==
// @name         Media Player
// @version      2.5
// @description  Handle MP4 and MP3 links to download or play using Plyr
// @author       PianoNic
// @match        https://moodle.bbbaden.ch/*
// @grant        none
// @icon         https://github.com/BBBaden-Moodle-userscripts/MediaPlayer/blob/main/icon/playerIcon.png?raw=true
// @require      https://cdn.plyr.io/3.7.8/plyr.polyfilled.js
// @downloadURL  https://github.com/BBBaden-Moodle-userscripts/MediaPlayer/raw/main/MediaPlayer.user.js
// @updateURL    https://github.com/BBBaden-Moodle-userscripts/MediaPlayer/raw/main/MediaPlayer.user.js
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
                <style>
                    /* CSS to make the background black with 50% opacity */
                    .modal-open {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5); /* Black color with 50% opacity */
                        z-index: 9999;
                        display: none; /* Initially hidden */
                        justify-content: center;
                        align-items: center;
                        animation: fadeIn 0.3s ease; /* Fade-in animation */
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                </style>
                <div class="modal-open" id="mediaModal" role="dialog" aria-labelledby="mediaModalLabel">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="mediaModalLabel">Media Player</h5>
                                <button type="button" class="close" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
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

            // Attach event listener to the close button
            const closeButton = document.querySelector('.modal-open .close');
            if (closeButton) {
                closeButton.addEventListener('click', closeModal);
            }

            // Close the modal when clicking outside of it
            const modal = document.getElementById('mediaModal');
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }

        // Function to handle the modal actions
        function handleModalActions(url) {
            document.getElementById('downloadButton').addEventListener('click', function() {
                window.location.href = url;
                closeModal();
            });
        }

        // Function to close the modal
        function closeModal() {
            const modal = document.getElementById('mediaModal');
            if (modal) {
                modal.style.opacity = '0'; // Fade-out animation
                setTimeout(function() {
                    modal.style.display = 'none';
                }, 300); // Wait for the fade-out animation to finish before hiding
            }
        }

        // Close the modal when pressing the Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });

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
                    handleModalActions(url);
                    const modal = document.getElementById('mediaModal');
                    modal.style.display = 'flex'; // Show the modal
                    setTimeout(function() {
                        modal.style.opacity = '1'; // Fade-in animation
                    }, 80); // Delay the fade-in animation for smoother transition
                }
            }
        });
    }
})();
