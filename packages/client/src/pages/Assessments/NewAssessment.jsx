import React, { useEffect, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { AssessmentService } from '../../services/AssessmentService';

export const NewAssessment = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm();

  const [ calculatedScore, setCalculatedScore ] = useState(0);
  const [ riskLevel, setRiskLevel ] = useState(`LOW`);
  // Watch all form fields that contribute to scoring
  const watchedFields = watch([
    `previousContact`,
    `catAltercations`,
    `ownerAltercations`,
    `playsWithDogs`,
    `hissesAtStrangers`,
  ]);

  // Calculate risk level based on score (same logic as backend)
  const calculateRiskLevel = (score) => {
    if (score >= 4) {
      return `high`;
    }
    if (score >= 2) {
      return `medium`;
    }
    return `low`;
  };

  // Calculate total score whenever form fields change
  useEffect(() => {
    const score = watchedFields.reduce((total, field) => {
      const value = parseInt(field) || 0;
      return total + value;
    }, 0);

    setCalculatedScore(score);
    setRiskLevel(calculateRiskLevel(score));
  }, [ watchedFields ]);

  // Get risk level color for display
  const getRiskLevelColor = (level) => {
    switch (level) {
      case `HIGH`: return `danger`;
      case `MEDIUM`: return `warning`;
      case `LOW`: return `success`;
      default: return `secondary`;
    }
  };

  const onSubmit = async (data) => {
    // Validate score is within expected range
    if (calculatedScore < 0 || calculatedScore > 5) {
      alert(`Assessment score must be between 0 and 5. Current score: ${calculatedScore}`);
      return;
    }

    // Add calculated values to the submission data
    data.instrumentType = `cat`;
    data.score = calculatedScore;
    data.riskLevel = riskLevel;

    console.log(`Submitting assessment:`, data);

    try {
      const allowedKeys = [
        `catName`,
        `catDateOfBirth`,
        `instrumentType`,
        `riskLevel`,
        `score`,
      ];
      const filtered = Object.fromEntries(
        Object.entries(data).filter(([ key ]) => allowedKeys.includes(key)),
      );
      await AssessmentService.submit(filtered);
    } catch (error) {
      console.error(`Error submitting assessment:`, error);
      alert(`Error submitting assessment. Please try again.`);
    }
  };

  return <Form onSubmit={handleSubmit(onSubmit)}>
    {/* Basic Fields */}
    <Form.Group controlId="catName">
      <Form.Label>First Name</Form.Label>
      <Form.Control {...register(`catName`)} />
    </Form.Group>

    <Form.Group controlId="age">
      <Form.Label>Age</Form.Label>
      <Form.Control {...register(`age`, { pattern: /\d+/ })} />
      {errors.age && <p>Please enter number for age.</p>}
    </Form.Group>

    {/* New Fields */}
    <Form.Group controlId="catDateOfBirth">
      <Form.Label>Cat Date of Birth</Form.Label>
      <Form.Control type="date" {...register(`catDateOfBirth`, { required: true })} />
      {errors.catDateOfBirth && <p>Date of Birth is required.</p>}
    </Form.Group>

    <Form.Group controlId="previousContact">
      <Form.Label>Previous contact with the Cat Judicial System</Form.Label>
      <Form.Check
        type="radio"
        label="No"
        value="0"
        {...register(`previousContact`, { required: true })}
      />
      <Form.Check
        type="radio"
        label="Yes"
        value="1"
        {...register(`previousContact`, { required: true })}
      />
    </Form.Group>

    <Form.Group controlId="catAltercations">
      <Form.Label>Physical altercations with other cats</Form.Label>
      <Form.Check
        type="radio"
        label="0–3 altercations"
        value="0"
        {...register(`catAltercations`, { required: true })}
      />
      <Form.Check
        type="radio"
        label="3+ altercations"
        value="1"
        {...register(`catAltercations`, { required: true })}
      />
    </Form.Group>

    <Form.Group controlId="ownerAltercations">
      <Form.Label>Physical altercations with owner</Form.Label>
      <Form.Check
        type="radio"
        label="0–10 altercations"
        value="0"
        {...register(`ownerAltercations`, { required: true })}
      />
      <Form.Check
        type="radio"
        label="10+ altercations"
        value="1"
        {...register(`ownerAltercations`, { required: true })}
      />
    </Form.Group>

    <Form.Group controlId="playsWithDogs">
      <Form.Label>Plays well with dogs</Form.Label>
      <Form.Check
        type="radio"
        label="Yes"
        value="0"
        {...register(`playsWithDogs`, { required: true })}
      />
      <Form.Check
        type="radio"
        label="No"
        value="1"
        {...register(`playsWithDogs`, { required: true })}
      />
    </Form.Group>

    <Form.Group controlId="hissesAtStrangers">
      <Form.Label>Hisses at strangers</Form.Label>
      <Form.Check
        type="radio"
        label="Yes"
        value="1"
        {...register(`hissesAtStrangers`, { required: true })}
      />
      <Form.Check
        type="radio"
        label="No"
        value="0"
        {...register(`hissesAtStrangers`, { required: true })}
      />
    </Form.Group>

    {/* Score and Risk Level Display */}
    <div className="mt-4 mb-3">
      <Alert variant="info">
        <h6>Assessment Results:</h6>
        <p>
          <strong>Total Score:</strong>
          {` `}
          {calculatedScore}
          /5
        </p>
        <p>
          <strong>Risk Level:</strong>
          {` `}
          <span className={`text-${getRiskLevelColor(riskLevel)}`}>{riskLevel}</span>
        </p>
      </Alert>
    </div>

    <Button type="submit">Submit Assessment</Button>
  </Form>;
};
