document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("lostFoundForm");
    const reportsList = document.getElementById("reportsList");

    if (!form || !reportsList) {
        alert("Form connection error! Check HTML IDs.");
        return;
    }

    let reports = JSON.parse(
        localStorage.getItem("lostFoundReports") || "[]"
    );

    function displayReports() {
        reportsList.innerHTML = "";

        reports.forEach(function(report,index) {
            const card = document.createElement("div");
            card.className = "event-card";

            card.innerHTML = `
                <h3>${report.itemName}</h3>
                <p>Type: ${report.itemType}</p>
                <p>Description: ${report.description}</p>
                <p>Location: ${report.location}</p>
                <p>Contact: ${report.contact}</p>
                <p>Date: ${report.date || "Not available"}</p>
                <button onclick="deleteReport(${index})">Delete Report</button>
            `;

            reportsList.appendChild(card);
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const newReport = {
            itemName: document.getElementById("itemName").value.trim(),
            itemType: document.getElementById("itemType").value,
            description: document.getElementById("itemDescription").value.trim(),
            location: document.getElementById("itemLocation").value.trim(),
            contact: document.getElementById("itemContact").value.trim(),
            date: new Date().toISOString()
        };

        reports.push(newReport);

        localStorage.setItem(
            "lostFoundReports",
            JSON.stringify(reports)
        );

        displayReports();

        const message = document.getElementById("successMessage");
        if (message) {
            message.textContent = "Your report has been submitted successfully!";
        } else {
            alert("Your report has been submitted successfully!");
        }

        form.reset();
    });

    displayReports();
    window.deleteReport = function(index) {
        if (confirm("Are you sure you want to delete this report?")) {
            reports.splice(index, 1);
    
            localStorage.setItem(
                "lostFoundReports",
                JSON.stringify(reports)
            );
    
            displayReports();
            alert("Report deleted successfully!");
        }
    };
});