let availableHours = 3;
let studyPreference = "Morning";


// ------------------------------------
// SCROLL
// ------------------------------------

function scrollToPlanner() {

    document
        .getElementById("planner")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ------------------------------------
// HOW IT WORKS
// ------------------------------------

function showHowItWorks() {

    document
        .querySelector(".how-section")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ------------------------------------
// ADD SUBJECT
// ------------------------------------

function addSubject() {

    const subjectList =
        document.getElementById("subjectList");

    const row =
        document.createElement("div");

    row.className = "subject-row";

    row.innerHTML = `

        <div class="subject-color purple-color"></div>

        <input
            type="text"
            class="subject-name"
            placeholder="Subject name"
        >

        <input
            type="date"
            class="exam-date"
        >

        <select class="difficulty">

            <option value="1">
                Easy
            </option>

            <option value="2" selected>
                Medium
            </option>

            <option value="3">
                Hard
            </option>

        </select>

        <button
            class="delete-subject"
            onclick="removeSubject(this)"
        >
            ×
        </button>

    `;

    subjectList.appendChild(row);
}


// ------------------------------------
// REMOVE SUBJECT
// ------------------------------------

function removeSubject(button) {

    const rows =
        document.querySelectorAll(".subject-row");

    if (rows.length <= 1) {

        alert("You need at least one subject.");

        return;
    }

    button
        .parentElement
        .remove();
}


// ------------------------------------
// STUDY HOURS
// ------------------------------------

function setHours(hours, button) {

    availableHours = hours;

    document
        .querySelectorAll(".hours-selector button")
        .forEach(btn => {

            btn.classList.remove("selected");

        });

    button.classList.add("selected");
}


// ------------------------------------
// STUDY PREFERENCE
// ------------------------------------

function selectPreference(button) {

    document
        .querySelectorAll(".preference")
        .forEach(btn => {

            btn.classList.remove("selected");

        });

    button.classList.add("selected");

    studyPreference =
        button.innerText
            .replace(/[^\w\s]/g, "")
            .trim();
}


// ------------------------------------
// GET SUBJECTS
// ------------------------------------

function getSubjects() {

    const rows =
        document.querySelectorAll(".subject-row");

    const subjects = [];

    rows.forEach(row => {

        const name =
            row.querySelector(".subject-name").value.trim();

        const date =
            row.querySelector(".exam-date").value;

        const difficulty =
            Number(
                row.querySelector(".difficulty").value
            );

        if (name) {

            subjects.push({

                name: name,

                examDate: date,

                difficulty: difficulty

            });

        }

    });

    return subjects;
}


// ------------------------------------
// CALCULATE PRIORITY
// ------------------------------------

function calculatePriority(subject) {

    let urgency = 1;

    if (subject.examDate) {

        const today =
            new Date();

        const exam =
            new Date(subject.examDate);

        const difference =
            exam - today;

        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );

        if (days <= 1) {

            urgency = 5;

        } else if (days <= 3) {

            urgency = 4;

        } else if (days <= 7) {

            urgency = 3;

        } else {

            urgency = 2;

        }

    }

    return urgency + subject.difficulty;
}


// ------------------------------------
// GENERATE PLAN
// ------------------------------------

function generatePlan() {

    const subjects =
        getSubjects();

    if (subjects.length === 0) {

        alert(
            "Please add at least one subject."
        );

        return;
    }


    // Calculate priority

    subjects.forEach(subject => {

        subject.priority =
            calculatePriority(subject);

    });


    // Highest priority first

    subjects.sort(
        (a, b) =>
            b.priority - a.priority
    );


    // Create study sessions

    const sessions = [];

    let remainingHours =
        availableHours;


    // Each subject gets a session

    let index = 0;

    while (
        remainingHours > 0 &&
        index < subjects.length
    ) {

        const subject =
            subjects[index];

        let sessionLength;


        if (subject.priority >= 7) {

            sessionLength =
                Math.min(
                    1.5,
                    remainingHours
                );

        } else if (
            subject.priority >= 5
        ) {

            sessionLength =
                Math.min(
                    1,
                    remainingHours
                );

        } else {

            sessionLength =
                Math.min(
                    .75,
                    remainingHours
                );

        }


        sessions.push({

            subject:
                subject.name,

            duration:
                sessionLength,

            priority:
                subject.priority,

            difficulty:
                subject.difficulty

        });


        remainingHours -=
            sessionLength;


        index++;


        // Start again with high priority

        if (
            index >= subjects.length &&
            remainingHours > 0
        ) {

            index = 0;

        }

    }


    renderPlan(
        sessions,
        subjects
    );
}


// ------------------------------------
// RENDER PLAN
// ------------------------------------

function renderPlan(
    sessions,
    subjects
) {

    const empty =
        document.getElementById(
            "emptyPreview"
        );

    const result =
        document.getElementById(
            "planResult"
        );

    empty.classList.add("hidden");

    result.classList.remove("hidden");


    const schedule =
        document.getElementById(
            "scheduleList"
        );

    schedule.innerHTML = "";


    let startHour;


    if (
        studyPreference
            .toLowerCase()
            .includes("morning")
    ) {

        startHour = 7;

    } else if (
        studyPreference
            .toLowerCase()
            .includes("afternoon")
    ) {

        startHour = 14;

    } else if (
        studyPreference
            .toLowerCase()
            .includes("evening")
    ) {

        startHour = 18;

    } else {

        startHour = 9;

    }


    let currentMinutes =
        startHour * 60;


    sessions.forEach(
        (session, index) => {

            const hours =
                Math.floor(
                    currentMinutes / 60
                );

            const minutes =
                currentMinutes % 60;


            const endMinutes =
                currentMinutes +
                session.duration * 60;

            const endHours =
                Math.floor(
                    endMinutes / 60
                );

            const endMins =
                endMinutes % 60;


            const time =
                formatTime(
                    hours,
                    minutes
                )
                +
                " - "
                +
                formatTime(
                    endHours,
                    endMins
                );


            const icon =
                getSubjectIcon(
                    index
                );


            const priority =
                session.priority >= 7
                    ? "HIGH"
                    : session.priority >= 5
                        ? "MEDIUM"
                        : "LOW";


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "schedule-item";


            item.innerHTML = `

                <div class="schedule-time">
                    ${time}
                </div>

                <div class="schedule-icon">
                    ${icon}
                </div>

                <div class="schedule-content">

                    <strong>
                        ${session.subject}
                    </strong>

                    <small>
                        Focus session •
                        ${session.duration} hour
                        ${session.duration > 1 ? "s" : ""}
                    </small>

                </div>

                <div class="priority">
                    ${priority}
                </div>

            `;


            schedule.appendChild(
                item
            );


            // 15 minute break

            currentMinutes =
                endMinutes + 15;

        }
    );


    // Update title

    document.getElementById(
        "planTitle"
    ).innerText =
        "Today's Focus";


    // Optimization score

    const score =
        calculateScore(subjects);


    document.getElementById(
        "planPercent"
    ).innerText =
        score + "%";


    // AI recommendation

    const topSubject =
        subjects[0];


    document.getElementById(
        "aiRecommendation"
    ).innerText =
        `Prioritize ${topSubject.name} first because it has the highest combination of exam urgency and difficulty. Take a 15-minute break between focused sessions to maintain concentration.`;


    // Scroll

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// ------------------------------------
// FORMAT TIME
// ------------------------------------

function formatTime(
    hour,
    minute
) {

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    let displayHour =
        hour % 12;

    if (displayHour === 0) {
        displayHour = 12;
    }

    return (
        displayHour +
        ":" +
        String(minute).padStart(2, "0") +
        " " +
        suffix
    );
}


// ------------------------------------
// SUBJECT ICON
// ------------------------------------

function getSubjectIcon(index) {

    const icons = [
        "∑",
        "⚛",
        "⌘",
        "📖",
        "🧬",
        "🌐"
    ];

    return icons[
        index % icons.length
    ];
}


// ------------------------------------
// PLAN SCORE
// ------------------------------------

function calculateScore(subjects) {

    let score = 70;

    subjects.forEach(subject => {

        if (subject.examDate) {
            score += 4;
        }

        if (subject.difficulty >= 3) {
            score += 3;
        }

    });

    return Math.min(
        98,
        score
    );
}


// ------------------------------------
// DOWNLOAD PLAN
// ------------------------------------

function downloadPlan() {

    const result =
        document.getElementById(
            "planResult"
        );


    if (
        result.classList.contains(
            "hidden"
        )
    ) {

        alert(
            "Generate a plan first."
        );

        return;
    }


    const schedule =
        document.getElementById(
            "scheduleList"
        );


    let text =
        "STUDYFLOW AI - STUDY PLAN\n";

    text +=
        "==============================\n\n";


    const items =
        schedule.querySelectorAll(
            ".schedule-item"
        );


    items.forEach(item => {

        const time =
            item.querySelector(
                ".schedule-time"
            ).innerText;

        const subject =
            item.querySelector(
                ".schedule-content strong"
            ).innerText;

        const details =
            item.querySelector(
                ".schedule-content small"
            ).innerText;

        text +=
            `${time} | ${subject} | ${details}\n`;

    });


    text +=
        "\nGenerated by StudyFlow AI";


    const blob =
        new Blob(
            [text],
            {
                type: "text/plain"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );

    link.href = url;

    link.download =
        "my-study-plan.txt";

    link.click();

    URL.revokeObjectURL(url);

}