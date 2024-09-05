// ==UserScript==
// @name         Audio Player on Boot.dev
// @namespace    http://yourdomain.com/bootdev
// @version      1.7
// @description  Keeps the audio player fixed a few pixels to the left, resizes it, opens it with Alt+Z, allows play/pause with Alt+X, and seeks 10 seconds back with Alt+C
// @author       Arvin Doriani
// @match        https://www.boot.dev/lessons/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fix_audio_player() {
        const audio = document.querySelector('audio');

        if (audio) {
            const audio_container = audio.closest('div');

            if (audio_container) {
                // Apply styles to fix the container near the bottom left
                audio_container.style.position = 'fixed';
                audio_container.style.bottom = '10px'; // Adjust the distance from the bottom
                audio_container.style.left = '25%'; // Move it slightly to the left in order to view the solution field
                audio_container.style.transform = 'translateX(0)'; // No horizontal translation needed
                audio_container.style.zIndex = '1000'; // Ensure it’s on top of other elements
                audio_container.style.padding = '0'; // No extra padding

                // Ensure the container fits within the viewport
                const viewport_width = window.innerWidth;
                const container_width = Math.min(viewport_width - 20, 360); // Set max width

                audio_container.style.maxWidth = `${container_width}px`;
                audio_container.style.width = `${container_width}px`; // Set width to fit within viewport

                // Ensure no extra space is added
                audio_container.style.margin = '0';
                audio_container.style.right = 'auto';
                audio_container.style.top = 'unset'; // Clear any top positioning

                // Apply specific styles to increase button size
                audio_container.querySelector('audio').style.transform = 'scale(1.2)'; // Scale up the audio player
                audio_container.querySelector('audio').style.transformOrigin = 'bottom'; // Adjust transform origin if needed
            } else {
                console.warn('Parent container of the audio player not found.');
            }
        } else {
            console.warn('Audio player not found.');
        }
    }

    function click_audio_button() {
        // Find and click the button to open the audio player
        const button = document.querySelector('button.group.bg-opacity-0.p-2');
        
        if (button) {
            button.click();
            console.log('Audio player button clicked.');
        } else {
            console.warn('Audio player button not found.');
        }
    }

    function toggle_play_pause(event) {
        // Check if the pressed key is Alt+X
        if (event.code === 'KeyX' && event.altKey) {
            const audio = document.querySelector('audio');
            if (audio) {
                if (audio.paused) {
                    audio.play();
                    console.log('Audio played.');
                } else {
                    audio.pause();
                    console.log('Audio paused.');
                }
                event.preventDefault(); // Prevent any default action associated with Alt+X
            }
        }
    }

    function open_audio_player(event) {
        // Check if the pressed key is Alt+Z
        if (event.code === 'KeyZ' && event.altKey) {
            click_audio_button();
            event.preventDefault(); // Prevent any default action associated with Alt+Z
        }
    }

    function seek_back_10_seconds(event) {
        // Check if the pressed key is Alt+C
        if (event.code === 'KeyC' && event.altKey) {
            const audio = document.querySelector('audio');
            if (audio) {
                audio.currentTime = Math.max(0, audio.currentTime - 10); // Seek back 10 seconds, but not below 0
                console.log('Audio seeked back 10 seconds.');
                event.preventDefault(); // Prevent any default action associated with Alt+C
            }
        }
    }

    // Run the function to fix audio player after 1000ms
    setTimeout(() => {
        fix_audio_player();
    }, 1000);

    // Observe changes to the DOM
    const observer = new MutationObserver(() => {
        fix_audio_player();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Add event listeners for Alt+X, Alt+Z, and Alt+C
    window.addEventListener('keydown', (event) => {
        toggle_play_pause(event);
        open_audio_player(event);
        seek_back_10_seconds(event);
    });
})();
