<?php

// Define assessment areas and recommendations based on risk score
$assessment_areas = [
    'identify-assets' => 'Asset Management',
    'identify-governance' => 'Data Governance',
    'protect-data' => 'Data Protection',
    'protect-access' => 'Data Access',
    'detect-anomalies' => 'Data Anomalies',
    'detect-monitoring' => 'Data Monitoring',
    'respond-planning' => 'Respond Plan',
    'respond-communication' => 'Communication Response',
    'recover-planning' => 'Recovery Plan',
    'recover-improvement' => 'Recovery Plan Review & Improvement',
];

$recommendations = [
    'high' => 'Immediate action required to strengthen this area. Consider enhancing encryption, MFA, and regular backups.',
    'medium' => 'Moderate risk level. Implement regular audits and employee training to maintain current security level.',
    'low' => 'Low risk. Ensure routine monitoring to prevent future vulnerabilities.'
];

$scores = [];
foreach($assessment_areas as $field => $name) {
    if(isset($_POST[$field])) {
        $score = $_POST[$field]; // Capture the high/medium/low value
        $scores[$name] = $score; // Store the score for each assessment area
    }
}

// Prepare results with recommendations
$results = ['scores' => $scores, 'recommendations' => []];
foreach($scores as $area => $score) {
    $results['recommendations'][$area] = $recommendations[$score];
}

// Send JSON response back to frontend
header('Content-Type: application/json');
echo json_encode($results);
?>
