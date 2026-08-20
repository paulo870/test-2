/* ==========================================================
   AUTONOMOUS COURSE
   LEARNING ENGINE
========================================================== */


/* ==========================================================
   COURSE DATA
========================================================== */

const COURSE_DATA = {

    title: "English Course",

    units: [

        {
            id: 1,

            title: "Unit 1",

            lessons: [

                {
                    id: 1,

                    title: "Getting Started",

                    description:
                        "Learn the key language and practise the first concepts.",

                    activities: [

                        {
                            id: "welcome",

                            type: "explanation",

                            title: "Welcome to the lesson",

                            icon: "◆",

                            description:
                                "Your AI teacher introduces today's lesson.",

                            text:
                                "Welcome! In this lesson you will learn the key language you need to introduce yourself and talk about basic personal information.",

                            duration: "5–10 min"

                        },


                        {
                            id: "vocabulary",

                            type: "explanation",

                            title: "Key vocabulary",

                            icon: "Aa",

                            description:
                                "Learn the vocabulary you will use in this lesson.",

                            text:
                                "Here you will provide the vocabulary explanation for the lesson. Add examples, images, audio or an AI teacher video whenever the lesson is ready.",

                            duration: "5 min"

                        },


                        {
                            id: "exercise-1",

                            type: "multiple-choice",

                            title: "Choose the correct answer",

                            icon: "✓",

                            description:
                                "Check your understanding.",

                            question:
                                "She ___ from Angola.",

                            options: [

                                "am",

                                "is",

                                "are"

                            ],

                            answer: 1,

                            explanation:
                                "We use 'is' with he, she and it."

                        },


                        {
                            id: "exercise-2",

                            type: "text",

                            title: "Complete the sentence",

                            icon: "⌨",

                            description:
                                "Type the missing word.",

                            question:
                                "My name ___ Paulo.",

                            answer:
                                "is",

                            explanation:
                                "The correct sentence is: My name is Paulo."

                        },


                        {
                            id: "listening",

                            type: "listening",

                            title: "Listening practice",

                            icon: "♫",

                            description:
                                "Listen carefully and answer the question.",

                            audio:
                                "",

                            question:
                                "What is the speaker's name?",

                            options: [

                                "John",

                                "Michael",

                                "Peter"

                            ],

                            answer: 0,

                            explanation:
                                "The speaker says that his name is John."

                        },


                        {
                            id: "speaking",

                            type: "speaking",

                            title: "Speaking practice",

                            icon: "◉",

                            description:
                                "Have a conversation with your AI teacher.",

                            aiOpening:
                                "Hello! My name is Alex. What's your name?",

                            instructions:
                                "Introduce yourself and tell me your name, where you are from and what you do."

                        },


                        {
                            id: "review",

                            type: "multiple-choice",

                            title: "Lesson review",

                            icon: "★",

                            description:
                                "Final check before completing the lesson.",

                            question:
                                "Which sentence is correct?",

                            options: [

                                "I are from Angola.",

                                "I am from Angola.",

                                "I is from Angola."

                            ],

                            answer: 1,

                            explanation:
                                "The correct sentence is 'I am from Angola.'"

                        }

                    ]

                }

            ]

        }

    ]

};


/* ==========================================================
   APPLICATION STATE
========================================================== */

let currentUnit = 0;

let currentLesson = 0;

let currentActivity = 0;

let lessonScore = 0;

let answeredActivities = {};

let recognition = null;

let isRecording = false;

const STORAGE_KEY =
    "autonomousCourseProgress";


/* ==========================================================
   DOM
========================================================== */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebar-overlay");

const mobileMenuBtn =
    document.getElementById("mobile-menu-btn");

const closeSidebar =
    document.getElementById("close-sidebar");

const unitNavigation =
    document.getElementById("unit-navigation");

const lessonHome =
    document.getElementById("lesson-home");

const lessonCards =
    document.getElementById("lesson-cards");

const activityArea =
    document.getElementById("activity-area");

const activityContent =
    document.getElementById("activity-content");

const completionScreen =
    document.getElementById("completion-screen");

const currentUnitLabel =
    document.getElementById("current-unit-label");

const currentLessonTitle =
    document.getElementById("current-lesson-title");

const welcomeTitle =
    document.getElementById("welcome-title");

const welcomeDescription =
    document.getElementById("welcome-description");

const lessonProgressText =
    document.getElementById("lesson-progress-text");

const lessonProgressBar =
    document.getElementById("lesson-progress-bar");

const courseProgressText =
    document.getElementById("course-progress-text");

const courseProgressBar =
    document.getElementById("course-progress-bar");

const activityType =
    document.getElementById("activity-type");

const activityCounter =
    document.getElementById("activity-counter");

const activityDots =
    document.querySelector(".activity-dots");

const previousActivity =
    document.getElementById("previous-activity");

const nextActivity =
    document.getElementById("next-activity");

const startLessonBtn =
    document.getElementById("start-lesson-btn");

const backToLesson =
    document.getElementById("back-to-lesson");

const finalScore =
    document.getElementById("final-score");

const completionCorrect =
    document.getElementById("completion-correct");

const completionActivities =
    document.getElementById("completion-activities");

const nextLessonBtn =
    document.getElementById("next-lesson-btn");

const reviewLessonBtn =
    document.getElementById("review-lesson-btn");

const lessonStatus =
    document.getElementById("lesson-status");

const heroProgress =
    document.getElementById("hero-progress");

const heroMiniProgress =
    document.getElementById("hero-mini-progress");

const heroActivityCount =
    document.getElementById("hero-activity-count");


/* ==========================================================
   SPEAKING DOM
========================================================== */

const speakingModal =
    document.getElementById("speaking-modal");

const closeSpeaking =
    document.getElementById("close-speaking");

const speakingTitle =
    document.getElementById("speaking-title");

const aiMessage =
    document.getElementById("ai-message");

const speakingIndicator =
    document.getElementById("speaking-indicator");

const speakingStatusText =
    document.getElementById("speaking-status-text");

const microphoneButton =
    document.getElementById("microphone-button");

const studentTranscript =
    document.getElementById("student-transcript");

const speakingSubmit =
    document.getElementById("speaking-submit");


/* ==========================================================
   MEDIA
========================================================== */

const mediaModal =
    document.getElementById("media-modal");

const closeMedia =
    document.getElementById("close-media");

const mediaContent =
    document.getElementById("media-content");


/* ==========================================================
   STORAGE
========================================================== */

function getProgress() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {};

    } catch (error) {

        console.error(error);

        return {};

    }

}


function saveProgress() {

    const progress =
        getProgress();

    const unit =
        COURSE_DATA.units[currentUnit];

    const lesson =
        unit.lessons[currentLesson];

    progress[
        `${unit.id}_${lesson.id}`
    ] = {

        completed:
            Object.keys(answeredActivities).length >=
            lesson.activities.length,

        score:
            lessonScore,

        answered:
            answeredActivities

    };


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
    );


    updateCourseProgress();

}


/* ==========================================================
   INITIALISE
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    renderUnitNavigation();

    openLesson(0, 0);

    setupEventListeners();

    updateCourseProgress();

}


/* ==========================================================
   EVENT LISTENERS
========================================================== */

function setupEventListeners() {

    startLessonBtn.addEventListener(
        "click",
        () => openActivity(0)
    );


    backToLesson.addEventListener(
        "click",
        showLessonHome
    );


    previousActivity.addEventListener(
        "click",
        () => {

            if (currentActivity > 0) {

                openActivity(
                    currentActivity - 1
                );

            }

        }
    );


    nextActivity.addEventListener(
        "click",
        handleNextActivity
    );


    reviewLessonBtn.addEventListener(
        "click",
        () => {

            openActivity(0);

        }
    );


    nextLessonBtn.addEventListener(
        "click",
        openNextLesson
    );


    mobileMenuBtn.addEventListener(
        "click",
        openMobileSidebar
    );


    closeSidebar.addEventListener(
        "click",
        closeMobileSidebar
    );


    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );


    closeSpeaking.addEventListener(
        "click",
        closeSpeakingModal
    );


    microphoneButton.addEventListener(
        "click",
        toggleRecording
    );


    speakingSubmit.addEventListener(
        "click",
        finishSpeaking
    );


    closeMedia.addEventListener(
        "click",
        closeMediaModal
    );

}


/* ==========================================================
   MOBILE SIDEBAR
========================================================== */

function openMobileSidebar() {

    sidebar.classList.add(
        "mobile-open"
    );

    sidebarOverlay.classList.add(
        "active"
    );

}


function closeMobileSidebar() {

    sidebar.classList.remove(
        "mobile-open"
    );

    sidebarOverlay.classList.remove(
        "active"
    );

}


/* ==========================================================
   NAVIGATION
========================================================== */

function renderUnitNavigation() {

    unitNavigation.innerHTML = "";


    COURSE_DATA.units.forEach(
        (unit, unitIndex) => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "unit-navigation-item";


            const button =
                document.createElement("button");

            button.className =
                "unit-button";

            button.innerHTML = `

                <span>
                    ${escapeHTML(unit.title)}
                </span>

                <span class="unit-arrow">
                    ›
                </span>

            `;


            button.addEventListener(
                "click",
                () => {

                    wrapper.classList.toggle(
                        "open"
                    );

                }
            );


            const lessonList =
                document.createElement("div");

            lessonList.className =
                "unit-lessons";


            unit.lessons.forEach(
                (lesson, lessonIndex) => {

                    const lessonButton =
                        document.createElement("button");

                    lessonButton.className =
                        "lesson-nav-button";


                    if (
                        unitIndex === currentUnit &&
                        lessonIndex === currentLesson
                    ) {

                        lessonButton.classList.add(
                            "active"
                        );

                    }


                    lessonButton.textContent =
                        `Lesson ${lesson.id} — ${lesson.title}`;


                    lessonButton.addEventListener(
                        "click",
                        () => {

                            openLesson(
                                unitIndex,
                                lessonIndex
                            );

                            closeMobileSidebar();

                        }
                    );


                    lessonList.appendChild(
                        lessonButton
                    );

                }
            );


            wrapper.appendChild(button);

            wrapper.appendChild(lessonList);

            unitNavigation.appendChild(wrapper);

        }
    );


    const activeUnit =
        unitNavigation.children[currentUnit];

    if (activeUnit) {

        activeUnit.classList.add(
            "open"
        );

    }

}


/* ==========================================================
   OPEN LESSON
========================================================== */

function openLesson(
    unitIndex,
    lessonIndex
) {

    currentUnit =
        unitIndex;

    currentLesson =
        lessonIndex;

    currentActivity = 0;

    lessonScore = 0;

    answeredActivities = {};


    const unit =
        COURSE_DATA.units[currentUnit];

    const lesson =
        unit.lessons[currentLesson];


    const saved =
        getProgress()[
            `${unit.id}_${lesson.id}`
        ];


    if (saved) {

        lessonScore =
            saved.score || 0;

        answeredActivities =
            saved.answered || {};

    }


    currentUnitLabel.textContent =
        unit.title;

    currentLessonTitle.textContent =
        lesson.title;

    welcomeTitle.textContent =
        lesson.title;

    welcomeDescription.textContent =
        lesson.description;


    heroActivityCount.textContent =
        `${lesson.activities.length} activities`;


    renderLessonCards();

    updateLessonProgress();

    renderUnitNavigation();

    showLessonHome();

}


/* ==========================================================
   LESSON CARDS
========================================================== */

function renderLessonCards() {

    lessonCards.innerHTML = "";


    const lesson =
        COURSE_DATA
            .units[currentUnit]
            .lessons[currentLesson];


    lesson.activities.forEach(
        (activity, index) => {

            const card =
                document.createElement("article");

            card.className =
                "lesson-card";


            const completed =
                Boolean(
                    answeredActivities[
                        activity.id
                    ]
                );


            if (completed) {

                card.classList.add(
                    "completed"
                );

            }


            card.innerHTML = `

                <div class="card-number">
                    ${String(index + 1).padStart(2, "0")}
                </div>

                <div class="card-icon">
                    ${escapeHTML(
                        activity.icon ||
                        getActivityIcon(activity.type)
                    )}
                </div>

                <h3>
                    ${escapeHTML(activity.title)}
                </h3>

                <p>
                    ${escapeHTML(
                        activity.description || ""
                    )}
                </p>

                ${
                    completed
                    ?
                    `
                    <div class="card-status complete">
                        ✓ Completed
                    </div>
                    `
                    :
                    ""
                }

            `;


            card.addEventListener(
                "click",
                () => openActivity(index)
            );


            lessonCards.appendChild(card);

        }
    );


    updateLessonStatus();

}


/* ==========================================================
   ACTIVITY ICON
========================================================== */

function getActivityIcon(type) {

    const icons = {

        explanation: "◆",

        "multiple-choice": "✓",

        text: "⌨",

        listening: "♫",

        speaking: "◉",

        video: "▶",

        audio: "♫"

    };


    return icons[type] || "•";

}


/* ==========================================================
   LESSON HOME
========================================================== */

function showLessonHome() {

    lessonHome.classList.remove(
        "hidden"
    );

    activityArea.classList.add(
        "hidden"
    );

    completionScreen.classList.add(
        "hidden"
    );


    updateLessonProgress();

}


/* ==========================================================
   ACTIVITY
========================================================== */

function openActivity(index) {

    const lesson =
        COU
