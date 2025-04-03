const soundRows = {
    row1: {
        sound1: new Audio("Audio/Dark_BASS.mp3"),
        sound2: new Audio("Audio/Dark_DRUMS.mp3"),
        sound3: new Audio("Audio/Dark_INSTRUMENTS.mp3"),
        sound4: new Audio("Audio/Dark_MELODY.mp3")
    },
    row2: {
        sound5: new Audio("Audio/Elderly_BASS.mp3"),
        sound6: new Audio("Audio/Elderly_DRUMS.mp3"),
        sound7: new Audio("Audio/Elderly_INSTRUMENTS.mp3"),
        sound8: new Audio("Audio/Elderly_MELODY.mp3")
    },
    row3: {
        sound9: new Audio("Audio/Elderly_BASS.mp3"),
        sound10: new Audio("Audio/Elderly_DRUMS.mp3"),
        sound11: new Audio("Audio/Elderly_INSTRUMENTS.mp3"),
        sound12: new Audio("Audio/Elderly_MELODY.mp3")
    }
};

// Initialize all buttons and sounds to start muted and red
function initializeSoundboard() {
    Object.keys(soundRows).forEach(rowId => {
        const row = soundRows[rowId];
        Object.keys(row).forEach(soundId => {
            const audio = row[soundId];
            const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
            if (audio && button) {
                audio.volume = 0; // Mute the sound
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
    Object.values(row).forEach(audio => {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0; // Reset to the beginning
    });
}

function toggleSound(rowId, soundId) {
    const row = soundRows[rowId];
    if (row) {
        // Check if the row is already playing
        const isRowPlaying = Object.values(row).some(audio => !audio.paused);

        // If the row is not playing, stop all other rows and initialize this row
        if (!isRowPlaying) {
            // Stop all other rows
            Object.keys(soundRows).forEach(otherRowId => {
                if (otherRowId !== rowId) {
                    stopRow(soundRows[otherRowId]);
                    // Reset button colors for other rows
                    Object.keys(soundRows[otherRowId]).forEach(otherSoundId => {
                        const otherButton = document.querySelector(`button[onclick="toggleSound('${otherRowId}', '${otherSoundId}')"]`);
                        if (otherButton) {
                            otherButton.style.backgroundColor = "rgb(255, 50, 50)"; // Set to red
                        }
                    });
                }
            });

            // Start all sounds in the current row muted and buttons red
            Object.keys(row).forEach(soundKey => {
                const audio = row[soundKey];
                const button = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundKey}')"]`);
                if (audio.paused) {
                    audio.currentTime = 0; // Reset to the beginning
                    audio.play().catch(error => console.error("Audio playback error:", error));
                }
                audio.volume = 0; // Mute all sounds
                if (button) {
                    button.style.backgroundColor = "rgb(255, 50, 50)"; // Set all buttons to red
                }
            });
        }

        // Handle the clicked sound
        const clickedAudio = row[soundId];
        const clickedButton = document.querySelector(`button[onclick="toggleSound('${rowId}', '${soundId}')"]`);
        if (clickedAudio.volume > 0) {
            // Mute the clicked sound
            clickedAudio.volume = 0;
            clickedButton.style.backgroundColor = "rgb(255, 50, 50)"; // Set to red
            console.log(`${soundId} in ${rowId} is now muted.`);
        } else {
            // Unmute the clicked sound
            clickedAudio.volume = 1;
            clickedButton.style.backgroundColor = "rgb(50, 255, 50)"; // Set to green
            console.log(`${soundId} in ${rowId} is now unmuted.`);
        }
    } else {
        console.error(`Row with id "${rowId}" not found.`);
    }
}