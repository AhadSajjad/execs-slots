// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzJ6malLm2EebqRm021jxqhGMxv4TegjU",
    authDomain: "execs-bookings.firebaseapp.com",
    projectId: "execs-bookings",
    storageBucket: "execs-bookings.firebasestorage.app",
    messagingSenderId: "1033240684866",
    appId: "1:1033240684866:web:e71e5b30004cf9edc240db",
    measurementId: "G-MR00QK8B0J"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Slot and team data
const teams = [
    "Admin Coordination", "Event Management", "Inventory & Merchandise", "Marketing & Sponsorships",
    "Finance", "Security", "Protocols", "Socials", "Web & IT", "Decor", "Logistics", "Human Resources",
    "Training & Development", "Guest Relations"
];

const availableSlots = [
    "Tuesday: 1-2pm", "Tuesday: 2-3pm", "Tuesday: 4-5pm",
    "Wednesday: 1-2pm", "Wednesday: 3-4pm", "Wednesday: 4-5pm"
];

// Load booked slots from Firestore
let bookedSlots = [];

function populateTeams() {
    const teamList = document.getElementById('team-list');
    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            <td>
                <select class="slot-select" onchange="handleSlotSelect(event, '${team}')">
                    <option value="">Select a slot</option>
                    ${availableSlots.map(slot => `<option value="${slot}" ${bookedSlots.includes(slot) ? 'disabled' : ''}>${slot}</option>`).join('')}
                </select>
            </td>
        `;
        teamList.appendChild(row);
    });
}

// Handle slot selection
function handleSlotSelect(event, team) {
    const selectedSlot = event.target.value;
    if (!selectedSlot) return;

    if (bookedSlots.includes(selectedSlot)) {
        alert("This slot is already taken. Please choose another slot.");
        event.target.value = "";
        return;
    }

    // Add selected slot to Firestore and update local state
    db.collection("bookedSlots").add({
        team: team,
        slot: selectedSlot
    }).then(() => {
        // Update local bookedSlots state
        bookedSlots.push(selectedSlot);
        updateAvailableSlots();
        // Add the team to the booked teams table
        const bookedTeamsTable = document.getElementById('booked-teams');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            <td>${selectedSlot}</td>
        `;
        bookedTeamsTable.appendChild(row);

        // Disable the selected slot
        event.target.disabled = true;
    }).catch(error => {
        console.error("Error adding document: ", error);
    });
}

// Update available slots based on booked slots
function updateAvailableSlots() {
    const selectElements = document.querySelectorAll('.slot-select');
    selectElements.forEach(select => {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
            if (bookedSlots.includes(option.value)) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });
    });
}

// Load booked slots from Firestore on page load
window.onload = () => {
    db.collection("bookedSlots").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const data = doc.data();
            bookedSlots.push(data.slot);  // Add to local booked slots array
            // Add to booked teams table
            const bookedTeamsTable = document.getElementById('booked-teams');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.team}</td>
                <td>${data.slot}</td>
            `;
            bookedTeamsTable.appendChild(row);
        });

        updateAvailableSlots();  // Update the dropdowns based on booked slots
        populateTeams();         // Populate teams dropdown with available slots
    }).catch(error => {
        console.log("Error getting documents: ", error);
    });
};
