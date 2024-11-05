const scenarios = {
    ransomware: {
        purpose: "Evaluate readiness for a ransomware attack and data recovery. Focusing on containment and data recovery procedures.",
        objectives: [
            "Test data backup processes",
            "Evaluate containment procedures",
            "Assess restoration capabilities",
            "Review communication strategies",
            "Check employee adherence to security training on identifying phishing threats"
        ],
        threatHazard: "Unauthorized encryption of critical data by ransomware.",
        scenarioDescription: " An employee within your organization received an email with a seemingly innocent attachment labeled 'Urgent Invoice' from an unknown source. Curious, the employee opened the attachment, which contained a malicious payload which initiates ransomware that encrypts the organization's servers, and a ransom demand appears with instructions for payment.",
        activities: [
            "00:00 - Briefing on ransomware and attack trends.",
            "00:15 - Simulate infection; notify IT team.",
            "00:45 - Execute containment; communicate to stakeholders."
        ]
    },
    dos: {
        purpose: "Prepare for a DoS attack targeting customer-facing services.",
        objectives: [
            "Evaluate DoS detection and mitigation tools.",
            "Review the escalation process for prolonged outages.",
            "Ensure that communication strategies effectively reach customers during an outage."
        ],
        threatHazard: "Network and service unavailability from high-volume traffic caused by a DoS attack.",
        scenarioDescription: "The organization's website experiences a surge in traffic, causing the site to slow down and eventually become inaccessible, resulting in customer complaints and operational disruptions.",
        activities: [
            "00:00 - Briefing on DoS risks.",
            "00:10 - Simulate traffic overload and server response.",
            "00:30 - IT tests rate limiting and load balancing."
        ]
    },
    mitm: {
        purpose: "To simulate a MitM attack and evaluate the organization’s security posture and encryption practices.",
        objectives: [
            "Test secure communication protocols.",
            "Evaluate detection methods for unusual network activity.",
            "Review response procedures for communication breaches.",

        ],
        threatHazard: "Data interception via compromised communication channels.",
        scenarioDescription: "An attacker intercepts login credentials over a compromised Wi-Fi network accessing the organization's internal system without authorization..",
        activities: [
            "00:00 - Briefing on MitM attack risk and impacts.",
            "00:20 - Simulate unauthorized access detection triggers..",
            "00:40 - Review affected accounts and response steps.",
            "00:50 - Execute recovery and reinforce encryption standards."
        ]
    },
    phishing: {
        purpose: "To examine the organization's defenses against phishing attacks and assess employee awareness.",
        objectives: [
            "Test employee ability to identify and report phishing emails.",
            "Evaluate the organization's procedures for disabling compromised accounts.",
            "Confirm the incident communication and containment strategy."
        ],
        threatHazard: "Unauthorized access via compromised credentials from a phishing attack.",
        scenarioDescription: "A well-crafted phishing email impersonates the CEO and asks employees to provide login details through a spoofed login page. Some employees unknowingly comply, compromising their accounts.",
        activities: [
            "00:00 - Briefing on phishing risks; overview of phishing methods and common indicators.",
            "00:20 - Initiate phishing scenario; assess employee responses.",
            "00:40 - Execute incident response, disable accounts, and notify employees.",
            "00:50 - Post-incident review and re-emphasize phishing detection training."
        ]
    },
    insider: {
        purpose: "To assess the organization's ability to monitor and respond to potential insider threats.",
        objectives: [
            "Test monitoring capabilities for suspicious insider activity.",
            "Evaluate access control measures and incident reporting.",
            "Ensure legal and HR compliance in investigating insider threats."
        ],
        threatHazard: "Data theft or sabotage by an authorized user with elevated privileges.",
        scenarioDescription: "A contracted DevOps engineer, responsible for managing software on your organization's cloud infrastructure and holding a position of trust, engages in malicious activity. This engineer, motivated by personal gain, decides to leak sensitive company information. Leveraging their extensive access privileges, they intentionally download confidential data before contract termination.",
        activities: [
            "00:00 - Briefing on insider threat indicators.",
            "00:15 - Simulate unusual data access patterns; trigger alerts.",
            "00:40 - Contain breach; involve HR and legal.",
            "00:50 - Post-incident review and strengthen access policies."
        ]
    },
    sqlInjection: {
        purpose: "To examine vulnerabilities in web applications and assess response to SQL injection attempts.",
        objectives: [
            "Test detection and containment of database injection attempts.",
            "Review database monitoring and log analysis."
        ],
        threatHazard: "Unauthorized database manipulation via SQL injection.",
        scenarioDescription: "An attacker injects SQL code in the customer portal form field, gaining unauthorized access to sensitive data.",
        activities: [
            "00:00 - Overview of SQL injection detection.",
            "00:10 - Simulate abnormal query alerts.",
            "00:30 - Secure database and code review."
        ]
    }
};

// Populate form fields based on selected scenario
function populateFields() {
    const selectedScenario = document.getElementById("scenarioSelect").value;
    if (selectedScenario && scenarios[selectedScenario]) {
        const scenarioData = scenarios[selectedScenario];

        document.getElementById("purpose").value = scenarioData.purpose;
        document.getElementById("objectives").value = scenarioData.objectives;
        document.getElementById("threatHazard").value = scenarioData.threatHazard;
        document.getElementById("scenarioDescription").value = scenarioData.scenarioDescription;

        // Populate activities
        document.getElementById("activity1").value = scenarioData.activities[0];
        document.getElementById("activity2").value = scenarioData.activities[1];
        document.getElementById("activity3").value = scenarioData.activities[2];
    }
}

function downloadPDF() {
    const form = document.getElementById('exerciseForm');
    const downloadButton = document.querySelector('button[onclick="downloadPDF()"]'); 

    downloadButton.classList.add('hidden');

    const options = {
        margin: 0.5,
        filename: 'Cybersecurity_Exercise.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { format: 'a4', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf().from(form).set(options).save().then(() => {
        
        downloadButton.classList.remove('hidden');
    });
}

