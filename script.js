import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

import { db } from "./firebase.js";
import { collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Teams List
const teams = [
    "Admin Coordination", "Event Management", "Inventory & Merchandise", "Marketing & Sponsorships",
    "Finance", "Security", "Protocols", "Socials", "Web & IT", "Decor",
    "Logistics", "Human Resources", "Training & Development", "Guest Relations"
];

// Available Slots
const slots = ["Tuesday: 1-2pm", "Tuesday: 2-3pm", "Tuesday: 4-5pm", 
               "Wednesday: 1-2pm", "Wednesday: 3-4pm", "Wednesday: 4-5pm"];

const teamList = document.getElementById("team-list");
const bookedSlotsTable = document.getElementById("booked-slots");

// Function to Load Teams
async function loadTeams() {
    teamList.innerHTML = "";

    teams.forEach(team => {
        const row = document.createElement("tr");

        const teamCell = document.createElement("td");
        teamCell.textContent = team;

        const slotCell = document.createElement("td");
        const select = document.createElement("select");

        const defaultOption = document.createElement("option");
        defaultOption.text = "Select Slot";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        slots.forEach(slot => {
            const option = document.createElement("option");
            option.text = slot;
            select.appendChild(option);
        });

        select.addEventListener("change", () => bookSlot(team, select.value));
        slotCell.appendChild(select);
        row.appendChild(teamCell);
        row.appendChild(slotCell);
        teamList.appendChild(row);
    });

    loadBookedSlots();
}

// Function to Load Booked Slots from Firebase
async function loadBookedSlots() {
    bookedSlotsTable.innerHTML = "";
    const snapshot = await getDocs(collection(db, "bookedSlots"));

    snapshot.forEach(doc => {
        const data = doc.data();
        addBookedSlotRow(data.team, data.slot);
    });
}

// Function to Add Booked Slot to Table
function addBookedSlotRow(team, slot) {
    const row = document.createElement("tr");

    const teamCell = document.createElement("td");
    teamCell.textContent = team;

    const slotCell = document.createElement("td");
    slotCell.textContent = slot;

    row.appendChild(teamCell);
    row.appendChild(slotCell);
    bookedSlotsTable.appendChild(row);
}

// Function to Book a Slot
async function bookSlot(team, slot) {
    // Check if Slot is Already Taken
    const snapshot = await getDocs(collection(db, "bookedSlots"));
    let slotTaken = false;

    snapshot.forEach(doc => {
        if (doc.data().slot === slot) slotTaken = true;
    });

    if (slotTaken) {
        alert("Slot already booked! Choose another.");
        loadTeams(); // Refresh the dropdowns
        return;
    }

    // Save to Firebase
    await setDoc(doc(db, "bookedSlots", team), { team, slot });

    loadTeams();
}

// Load Everything on Page Load
window.onload = loadTeams;
