const soundRows = {
    row1: {
        Act1_Butterfly_NoMagic: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Butterf_NoMagic.wav"), gainNode: null, busy: false },
        Act1_Fire: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Fire.wav"), gainNode: null, busy: false },
        Act1_Wind: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Wind.wav"), gainNode: null, busy: false },
        Act1_Window_Forest: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 SkogensLjud.wav"), gainNode: null, busy: false }
    },
    row1_fx: {
        Act1_Building_Rise1: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 BuildingRise_1.wav"), gainNode: null, busy: false },
        Act1_Building_Rise2: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 BuildingRise_2.wav"), gainNode: null, busy: false },
        Act1_Window_Grow: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 WindowGrow.wav"), gainNode: null, busy: false },
        Act1_Window_Shatter: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 WindowShatter.wav"), gainNode: null, busy: false },
        sound_fx_5: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 EFFECT_Breathing Render 0.mp3"), gainNode: null, busy: false }
    },
    row2: {
        sound2_1: { audio: new Audio("Audio/Elderly_BASS.mp3"), gainNode: null },
        sound2_2: { audio: new Audio("Audio/Elderly_DRUMS.mp3"), gainNode: null },
        sound2_3: { audio: new Audio("Audio/Elderly_INSTRUMENTS.mp3"), gainNode: null },
        sound2_4: { audio: new Audio("Audio/Elderly_MELODY.mp3"), gainNode: null }
    },
    row2_fx: {
        Act2_BuildingClash: { audio: new Audio("Audio/Act_2/TME_Act2 Edit 1 Export 1 StrukturernaKrockar.wav"), gainNode: null, busy: false },
        Act1_Building_Rise2: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 BuildingRise_2.wav"), gainNode: null, busy: false },
        Act1_Window_Grow: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 WindowGrow.wav"), gainNode: null, busy: false },
        Act1_Window_Shatter: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 WindowShatter.wav"), gainNode: null, busy: false },
        sound_fx_5: { audio: new Audio("Audio/FX/TME_Act1 Edit 1 Export 1 EFFECT_Breathing Render 0.mp3"), gainNode: null, busy: false }
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
            const button = document.querySelector(
                `button[onclick="toggleSound('${rowId}', '${soundId}')"]`
            );
            const volumeSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="volume"]`);
            const panSlider = document.querySelector(`input[data-row="${rowId}"][data-sound="${soundId}"][data-type="pan"]`);

            if (audio) {
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

                // Set button color to red initially
                if (button) {
                    button.style.backgroundColor = "rgb(255, 50, 50)"; // Red
                }
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
function setSoundState(sound, button, isMuted, targetVolume = 1) {
    const fadeDuration = 1.5; // Duration of fade effect in seconds
    const gainNode = sound.gainNode;
    const audioContext = gainNode.context;

    // Prevent toggling if the sound is busy
    if (sound.busy) {
        console.log("Sound is busy, ignoring toggle.");
        return;
    }

    // Mark the sound as busy
    sound.busy = true;

    // Disable the button and apply a greyed-out style
    button.disabled = true;
    button.style.opacity = "0.5"; // Grey out the button

    gainNode.gain.cancelScheduledValues(audioContext.currentTime);

    if (isMuted) {
        // Fade in (unmute)
        console.log(`Unmuting sound. Target volume: ${targetVolume}`);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start from 0
        gainNode.gain.linearRampToValueAtTime(targetVolume, audioContext.currentTime + fadeDuration); // Fade to slider value
        button.style.backgroundColor = "rgb(50, 255, 50)"; // Set button to green
    } else {
        // Fade out (mute)
        console.log("Muting sound.");
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
        button.style.backgroundColor = "rgb(255, 50, 50)"; // Set button to red
    }

    // Clear the busy state and re-enable the button after the fade effect completes
    setTimeout(() => {
        sound.busy = false;
        button.disabled = false;
        button.style.opacity = "1"; // Restore button opacity
    }, fadeDuration * 1000);
}

function toggleSound(rowId, soundId) {
    const row = soundRows[rowId];
    if (row) {
        const sound = row[soundId];
        const audio = sound.audio;
        const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
        const volumeSlider = document.querySelector(
            `input[data-row="${rowId}"][data-sound="${soundId}"][data-type="volume"]`
        );

        if (audio && button) {
            const isOneShot = rowId === "row1_fx" || rowId === "row2_fx";

            if (!sound.gainNode || !sound.pannerNode) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();
                const pannerNode = audioContext.createStereoPanner();

                source.connect(pannerNode).connect(gainNode).connect(audioContext.destination);

                sound.gainNode = gainNode;
                sound.pannerNode = pannerNode;
            }

            const gainNode = sound.gainNode;
            const audioContext = gainNode.context;

            if (isOneShot) {
                const targetVolume = volumeSlider ? parseFloat(volumeSlider.value) : 1;

                gainNode.gain.cancelScheduledValues(audioContext.currentTime);
                gainNode.gain.setValueAtTime(targetVolume, audioContext.currentTime);

                audio.pause();
                audio.currentTime = 0;
                audio.play().catch(error => console.error("Audio playback error:", error));

                button.style.backgroundColor = "rgb(50, 255, 50)"; // Green
                audio.onended = () => {
                    button.style.backgroundColor = "rgb(255, 50, 50)"; // Red
                };
            } else {
                const isMuted = gainNode.gain.value === 0;
                const targetVolume = volumeSlider ? parseFloat(volumeSlider.value) : 1;

                setSoundState(sound, button, isMuted, targetVolume);

                if (!isMuted && audio.paused) {
                    audio.currentTime = 0;
                    audio.play().catch(error => console.error("Audio playback error:", error));
                }
            }
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
    const basePath = "/TME/"; // Replace with your repository name
    const link = document.createElement('a');
    link.href = basePath + filePath; // Prepend the base path
    link.download = filePath.split('/').pop(); // Extract the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
