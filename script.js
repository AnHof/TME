const soundRows = {
    row1: {
        sound1_1: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Animal_1 Render 0.mp3"), gainNode: null },
        sound1_2: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Animal_2 Render 0.mp3"), gainNode: null },
        sound1_3: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Animal_3 Render 0.mp3"), gainNode: null },
        sound1_4: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Butterfly Render 0.mp3"), gainNode: null },
        sound1_5: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Fire Render 0.mp3"), gainNode: null },
        sound1_6: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Soundbed Render 0.mp3"), gainNode: null },
        sound1_7: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Stream Render 0.mp3"), gainNode: null },
        sound1_8: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Wind_Ears Render 0.mp3"), gainNode: null },
        sound1_9: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Wind_High Render 0.mp3"), gainNode: null },
        sound1_10: { audio: new Audio("Audio/Act_1/TME_Act1 Edit 1 Export 1 Wind_Low Render 0.mp3"), gainNode: null }
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

            if (audio && button) {
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();
                const pannerNode = audioContext.createStereoPanner();

                gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start muted
                source.connect(pannerNode).connect(gainNode).connect(audioContext.destination);

                sound.gainNode = gainNode;
                sound.pannerNode = pannerNode;

                audio.pause();
                audio.currentTime = 0;
                button.style.backgroundColor = "rgb(255, 50, 50)";
            }
        });
    });
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
        // Turn all sounds on
        Object.entries(row).forEach(([soundId, sound]) => {
            const audio = sound.audio;
            const gainNode = sound.gainNode;
            const audioContext = gainNode.context;
            const toggleButton = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);

            gainNode.gain.cancelScheduledValues(audioContext.currentTime);
            gainNode.gain.setValueAtTime(1, audioContext.currentTime); // Unmute
            toggleButton.style.backgroundColor = "rgb(50, 255, 50)"; // Green

            audio.currentTime = 0;
            audio.play().catch(error => console.error("Audio playback error:", error));
        });

        button.textContent = "Restart";
        console.log(`Started all sounds in ${rowId}.`);
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
