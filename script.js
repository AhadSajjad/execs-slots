const teams = [
    "Admin Coordination", "Event Management", "Inventory & Merchandise", "Marketing & Sponsorships",
    "Finance", "Security", "Protocols", "Socials", "Web & IT", "Decor", "Logistics", "Human Resources",
    "Training & Development", "Guest Relations"
];

const availableSlots = [
    "Tuesday: 1-2pm", "Tuesday: 2-3pm", "Tuesday: 4-5pm",
    "Wednesday: 1-2pm", "Wednesday: 3-4pm", "Wednesday: 4-5pm"
];

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
                    ${availableSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}
                </select>
            </td>
        `;
        teamList.appendChild(row);
    });
}

function handleSlotSelect(event, team) {
    const selectedSlot = event.target.value;
    if (!selectedSlot) return;

    if (bookedSlots.includes(selectedSlot)) {
        alert("This slot is already taken. Please choose another slot.");
        event.target.value = "";
        return;
    }

    // Add the selected slot to the booked slots
    bookedSlots.push(selectedSlot);

    // Add the team to the booked teams table
    const bookedTeamsTable = document.getElementById('booked-teams');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${team}</td>
        <td>${selectedSlot}</td>
    `;
    bookedTeamsTable.appendChild(row);

    // Disable the selected option from the dropdown
    updateAvailableSlots();

    // Clear the dropdown for this team
    event.target.disabled = true;
}

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

// Initialize the page
window.onload = () => {
    populateTeams();
    updateAvailableSlots();
};
