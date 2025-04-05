const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const resultsContainer = document.getElementById('results-container');
const recommendedMotor = document.getElementById('recommended-motor');
const motorExplanation = document.getElementById('motor-explanation');
const restartBtn = document.getElementById('restart-btn');
const questionContainer = document.getElementById('question-container');

const questions = [
    {
        id: "initial",
        text: "What type of power supply is available?",
        options: ["Three-Phase AC", "Single-Phase AC"],
        outcome: (answer) => answer === "Three-Phase AC" ? "q_three_phase_torque" : "q_single_phase_torque"
    },
    {
        id: "q_three_phase_torque",
        text: "What level of starting torque is generally required for your application?",
        options: ["High", "Moderate to Low"],
        outcome: (answer) => answer === "High" ? "q_three_phase_speed_control" : "result_squirrel_cage_three_phase"
    },
    {
        id: "q_three_phase_speed_control",
        text: "Is speed control during operation a significant requirement?",
        options: ["Yes", "No"],
        outcome: (answer) => answer === "Yes" ? "result_slip_ring_three_phase_vfd" : "result_slip_ring_three_phase"
    },
    {
        id: "q_single_phase_torque",
        text: "What level of starting torque is generally required for your application?",
        options: ["High", "Moderate", "Low"],
        outcome: (answer) => {
            if (answer === "High") return "q_single_phase_efficiency";
            if (answer === "Moderate") return "result_split_phase";
            if (answer === "Low") return "result_shaded_pole";
            return null;
        }
    },
    {
        id: "q_single_phase_efficiency",
        text: "Is running efficiency and power factor important for continuous operation?",
        options: ["Yes", "No (Initial cost is more critical)"],
        outcome: (answer) => answer === "Yes" ? "result_capacitor_start_capacitor_run" : "result_capacitor_start"
    }
];

const recommendations = {
    squirrel_cage_three_phase: {
        name: "Squirrel Cage Three-Phase Induction Motor",
        explanation: "This motor is suitable for general industrial applications with moderate to low starting torque requirements, offering simplicity, robustness, and good efficiency."
    },
    slip_ring_three_phase: {
        name: "Slip-Ring Three-Phase Induction Motor",
        explanation: "This motor is preferred for applications requiring high starting torque and offers some speed control capability."
    },
    slip_ring_three_phase_vfd: {
        name: "Slip-Ring Three-Phase Induction Motor (Consider VFD with Squirrel Cage)",
        explanation: "This motor is best for high starting torque. For speed control, while Slip-Ring motors offer some, a Squirrel Cage motor with a Variable Frequency Drive (VFD) could also be considered."
    },
    capacitor_start: {
        name: "Capacitor-Start Induction Motor",
        explanation: "This single-phase motor provides high starting torque and is suitable for applications like compressors and pumps."
    },
    capacitor_start_capacitor_run: {
        name: "Capacitor-Start Capacitor-Run Induction Motor",
        explanation: "This single-phase motor offers both high starting torque and good running efficiency, ideal for larger appliances and equipment."
    },
    split_phase: {
        name: "Split-Phase (Resistance Start) Induction Motor",
        explanation: "A cost-effective single-phase option for applications with moderate starting torque requirements, such as small fans and grinders."
    },
    shaded_pole: {
        name: "Shaded-Pole Induction Motor",
        explanation: "A simple and inexpensive single-phase motor for very low power applications with very low starting torque, such as small fans and toys."
    }
};

let currentQuestionId = "initial";
let questionHistory = [];

function showQuestion() {
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    if (!currentQuestion) {
        console.error("Question not found:", currentQuestionId);
        return;
    }

    questionText.textContent = currentQuestion.text;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach((option) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.dataset.answer = option;
        button.addEventListener('click', handleAnswer);
        optionsContainer.appendChild(button);
    });

    prevBtn.style.display = questionHistory.length > 0 ? 'block' : 'none';
    nextBtn.style.display = 'none';
}

function handleAnswer(event) {
    const answer = event.target.dataset.answer;
    const currentQuestion = questions.find(q => q.id === currentQuestionId);
    
    questionHistory.push(currentQuestionId);
    const nextStep = currentQuestion.outcome(answer);

    if (nextStep.startsWith("q_")) {
        currentQuestionId = nextStep;
        showQuestion();
    } else if (nextStep.startsWith("result_")) {
        showResult(nextStep.substring(7));
    }
}

function showResult(resultKey) {
    const result = recommendations[resultKey];
    questionContainer.style.display = 'none';
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'none';
    resultsContainer.style.display = 'block';
    recommendedMotor.textContent = result.name;
    motorExplanation.textContent = result.explanation;
}

restartBtn.addEventListener('click', () => {
    currentQuestionId = "initial";
    questionHistory = [];
    questionContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
    showQuestion();
});

prevBtn.addEventListener('click', () => {
    if (questionHistory.length > 0) {
        currentQuestionId = questionHistory.pop();
        showQuestion();
    }
});

// Initial display
showQuestion();