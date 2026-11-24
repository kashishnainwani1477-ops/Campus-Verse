document.addEventListener("DOMContentLoaded", function () {

    const myClubs = document.getElementById("myClubs");

    let joinedClubs = JSON.parse(
        localStorage.getItem("joinedClubs") || "[]"
    );

    function displayClubs() {
        myClubs.innerHTML = "";

        if (joinedClubs.length === 0) {
            myClubs.innerHTML = "<p>You have not joined any clubs yet.</p>";
            return;
        }

        joinedClubs.forEach(function(club) {
            const clubItem = document.createElement("p");
            clubItem.textContent = "✅ " + club;
            myClubs.appendChild(clubItem);
        });
    }

    window.joinClub = function(clubName) {

        if (joinedClubs.includes(clubName)) {
            alert("You have already joined this club!");
            return;
        }

        joinedClubs.push(clubName);

        localStorage.setItem(
            "joinedClubs",
            JSON.stringify(joinedClubs)
        );

        displayClubs();

        alert("Successfully joined " + clubName + "!");
    };

    displayClubs();

});