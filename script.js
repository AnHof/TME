const soundRows = {
    row1: {
        sound1_1: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Bird_1 Render 0.mp3"), gainNode: null },
        sound1_2: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Bird_2 Render 0.mp3"), gainNode: null },
        sound1_3: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Crickets Render 0.mp3"), gainNode: null },
        sound1_4: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Butterfly Render 0.mp3"), gainNode: null },
        sound1_5: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Fire Render 0.mp3"), gainNode: null },
        sound1_7: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Stream Render 0.mp3"), gainNode: null },
        sound1_8: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Wind_Ears Render 0.mp3"), gainNode: null },
        sound1_9: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Wind_High Render 0.mp3"), gainNode: null },
        sound1_10: { audio: new Audio("/Act_1/TME_Act1 Edit 1 Export 1 Wind_Low Render 0.mp3"), gainNode: null }
    },
    row2: {
        sound2_1: { audio: new Audio("Audio/Elderly_BASS.mp3"), gainNode: null },
        sound2_2: { audio: new Audio("Audio/Elderly_DRUMS.mp3"), gainNode: null },
        sound2_3: { audio: new Audio("Audio/Elderly_INSTRUMENTS.mp3"), gainNode: null },
        sound2_4: { audio: new Audio("Audio/Elderly_MELODY.mp3"), gainNode: null }
    },
    row3: {
        sound3_1: { audio: new Audio("Audio/ACT3_Wind.mp3"), gainNode: null },
        sound3_2: { audio: new Audio("Audio/ACT3_Fire.mp3"), gainNode: null },
        sound3_3: { audio: new Audio("Audio/ACT3_Melody.mp3"), gainNode: null },
        sound3_4: { audio: new Audio("Audio/ACT3_Animals.mp3"), gainNode: null },
        sound3_5: { audio: new Audio("Audio/ACT3_Butterfly.mp3"), gainNode: null }
    }
};



function initializeSoundboard() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    Object.keys(soundRows).forEach(rowId => {
        const row = soundRows[rowId];
        Object.keys(row).forEach(soundId => {
            const sound = row[soundId];
            const audio = sound.audio;
            const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
            const volumeSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="volume"]`);
            const panSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="pan"]`);

            if (audio && button) {
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();
                const pannerNode = audioContext.createStereoPanner();

                // Set initial gain and pan values from sliders
                const initialGain = volumeSlider ? parseFloat(volumeSlider.value) : 1;
                const initialPan = panSlider ? parseFloat(panSlider.value) : 0;

                gainNode.gain.setValueAtTime(initialGain, audioContext.currentTime);
                pannerNode.pan.setValueAtTime(initialPan, audioContext.currentTime);

                source.connect(pannerNode).connect(gainNode).connect(audioContext.destination);

                sound.gainNode = gainNode;
                sound.pannerNode = pannerNode;

                audio.pause();
                audio.currentTime = 0;
                button.style.backgroundColor = "rgb(255, 50, 50)"; // Red
            }
        });
    });
    console.log("Soundboard initialized with slider values.");
}

// Show the soundboard and hide the start button
document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startButton").style.display = "none"; // Hide the start button
    document.getElementById("soundboard").style.display = "block"; // Show the soundboard
    initializeSoundboard(); // Initialize the soundboard state
    console.log("Soundboard is now visible.");
});

// Function to stop all sounds in a row
function stopRow(row) {
    Object.values(row).forEach(sound => {
        const audio = sound.audio;
        const gainNode = sound.gainNode;
        const audioContext = gainNode.context;
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        audio.pause();
        audio.currentTime = 0; // Reset to the beginning
    });
}

// Function to set the state of a sound (mute/unmute) with fade effect
function setSoundState(sound, button, isMuted) {
    const fadeDuration = 1.5; // Duration of fade effect in seconds
    const gainNode = sound.gainNode;
    const audioContext = gainNode.context;

    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    if (isMuted) {
        // Fade out
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
        button.style.backgroundColor = "rgb(255, 50, 50)"; // Set button to red
    } else {
        // Fade in
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
        button.style.backgroundColor = "rgb(50, 255, 50)"; // Set button to green
    }
}

function toggleSound(rowId, soundId) {
    const row = soundRows[rowId];
    if (row) {
        const sound = row[soundId];
        const audio = sound.audio;
        const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
        if (audio && button) {
            const isMuted = sound.gainNode.gain.value > 0;
            setSoundState(sound, button, isMuted); // Toggle mute/unmute
            if (!isMuted && audio.paused) {
                audio.currentTime = 0; // Reset to the beginning
                audio.play().catch(error => console.error("Audio playback error:", error));
            }
            console.log(`${soundId} in ${rowId} is now ${isMuted ? "muted" : "unmuted"}.`);
        }
    } else {
        console.error(`Row with id "${rowId}" not found.`);
    }
}

function restartRow(rowId) {
    const row = soundRows[rowId];
    if (!row) {
        console.error(`Row "${rowId}" not found for restart.`);
        return;
    }

    Object.values(row).forEach(sound => {
        const audio = sound.audio;
        const gainValue = sound.gainNode.gain.value;

        audio.pause();
        audio.currentTime = 0;

        // Only play again if it’s currently unmuted
        if (gainValue > 0) {
            audio.play().catch(error => console.error("Audio playback error on restart:", error));
        }
    });

    console.log(`Restarted all sounds in ${rowId}.`);
}

function handleRowButton(rowId) {
    const row = soundRows[rowId];
    const button = document.getElementById(`btn-${rowId}`);

    if (!row || !button) {
        console.error(`Row or button for "${rowId}" not found.`);
        return;
    }

    if (button.textContent === "Start") {
        // Turn all sounds on with fade-in using initial slider values
        Object.entries(row).forEach(([soundId, sound]) => {
            const audio = sound.audio;
            const gainNode = sound.gainNode;
            const pannerNode = sound.pannerNode;
            const audioContext = gainNode.context;
            const toggleButton = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
            const volumeSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="volume"]`);
            const panSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="pan"]`);

            const fadeDuration = 1.5;

            // Get initial slider values
            const initialGain = volumeSlider ? parseFloat(volumeSlider.value) : 1;
            const initialPan = panSlider ? parseFloat(panSlider.value) : 0;

            gainNode.gain.cancelScheduledValues(audioContext.currentTime);
            gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start from 0
            gainNode.gain.linearRampToValueAtTime(initialGain, audioContext.currentTime + fadeDuration); // Fade in to slider value

            pannerNode.pan.setValueAtTime(initialPan, audioContext.currentTime); // Set initial pan value

            toggleButton.style.backgroundColor = "rgb(50, 255, 50)"; // Green

            audio.currentTime = 0;
            audio.play().catch(error => console.error("Audio playback error:", error));
        });

        button.textContent = "Restart";
        console.log(`Started all sounds in ${rowId} with fade-in using slider values.`);
    } else {
        restartRow(rowId);
    }
}


function stopAllInRow(rowId) {
    const row = soundRows[rowId];
    const controlButton = document.getElementById(`btn-${rowId}`);
    if (!row) return;

    const fadeDuration = 1; // seconds

    Object.entries(row).forEach(([soundId, sound]) => {
        const audio = sound.audio;
        const gainNode = sound.gainNode;
        const audioContext = gainNode.context;
        const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);

        // Schedule fade out
        gainNode.gain.cancelScheduledValues(audioContext.currentTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);

        // Delay pause until fade completes
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, fadeDuration * 1000);

        if (button) button.style.backgroundColor = "rgb(255, 50, 50)"; // Red
    });

    if (controlButton) controlButton.textContent = "Start"; // Reset button text
    console.log(`Stopped all sounds in ${rowId} with fade out.`);
}

function updatePan(rowId, soundId, value) {
    const sound = soundRows[rowId]?.[soundId];
    if (sound?.pannerNode) {
        sound.pannerNode.pan.setValueAtTime(parseFloat(value), sound.pannerNode.context.currentTime);
    }
}

function updateVolume(rowId, soundId, value) {
    const sound = soundRows[rowId]?.[soundId];
    if (sound?.gainNode) {
        sound.gainNode.gain.setValueAtTime(parseFloat(value), sound.gainNode.context.currentTime);
    }
}

function downloadSound(filePath) {
    const basePath = "/TME/Audio/"; // Adjusted base path for your GitHub Pages site
    const link = document.createElement('a');
    link.href = basePath + filePath; // Prepend the base path
    link.download = filePath.split('/').pop(); // Extract the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
