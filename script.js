function exploreCampus() {
    document.getElementById("features").scrollIntoView({
        behavior: "smooth"
    });
}

function showLogin() {
    alert("Welcome to CampusVerse! Login feature coming soon.");
}
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email && password) {
        alert("Welcome to CampusVerse!");
        window.location.href = "dashboard.html";
    }
}
function signupUser(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value;
    const email = document.getElementById("signupEmail").value;
    const studentId = document.getElementById("studentId").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    alert("Welcome " + name + "! Your signup form is working.");

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Student ID:", studentId);
}
function showFeature(featureName) {
    alert(featureName + " section will be available soon!");
}

function logoutUser() {
    alert("You have logged out of CampusVerse!");
    window.location.href = "login.html";
}