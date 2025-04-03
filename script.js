const soundRows = {
    row1: {
        sound1: { audio: new Audio("Audio/Dark_BASS.mp3"), gainNode: null },
        sound2: { audio: new Audio("Audio/Dark_DRUMS.mp3"), gainNode: null },
        sound3: { audio: new Audio("Audio/Dark_INSTRUMENTS.mp3"), gainNode: null },
        sound4: { audio: new Audio("Audio/Dark_MELODY.mp3"), gainNode: null }
    },
    row2: {
        sound5: { audio: new Audio("Audio/Elderly_BASS.mp3"), gainNode: null },
        sound6: { audio: new Audio("Audio/Elderly_DRUMS.mp3"), gainNode: null },
        sound7: { audio: new Audio("Audio/Elderly_INSTRUMENTS.mp3"), gainNode: null },
        sound8: { audio: new Audio("Audio/Elderly_MELODY.mp3"), gainNode: null }
    },
    row3: {
        sound9: { audio: new Audio("Audio/ACT3_Wind.mp3"), gainNode: null },
        sound10: { audio: new Audio("Audio/ACT3_Fire.mp3"), gainNode: null },
        sound11: { audio: new Audio("Audio/ACT3_Melody.mp3"), gainNode: null },
        sound12: { audio: new Audio("Audio/ACT3_Animals.mp3"), gainNode: null },
        sound13: { audio: new Audio("Audio/ACT3_Butterfly.mp3"), gainNode: null }
    }
};

// Initialize all buttons and sounds to start muted and red
function initializeSoundboard() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    Object.keys(soundRows).forEach(rowId => {
        const row = soundRows[rowId];
        Object.keys(row).forEach(soundId => {
            const sound = row[soundId];
            const audio = sound.audio;
            const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
            if (audio && button) {
                // Create a gainNode for smooth volume control
                const source = audioContext.createMediaElementSource(audio);
                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start muted
                source.connect(gainNode).connect(audioContext.destination);
                sound.gainNode = gainNode;

                audio.pause(); // Ensure the sound is not playing
                audio.currentTime = 0; // Reset to the beginning
                button.style.backgroundColor = "rgb(255, 50, 50)"; // Set button to red
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