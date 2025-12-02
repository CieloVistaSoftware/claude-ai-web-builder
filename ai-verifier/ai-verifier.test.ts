
import { test, expect } from '@playwright/test';
import { verifyAI, VerificationRequest, VerificationResult } from './ai-verifier';

test.describe('AI Verifier Platform', () => {
  test('should verify using Consistency Checker for Quick level', () => {
    const req: VerificationRequest = { input: 'Test input', level: 'Quick' };
    const res: VerificationResult = verifyAI(req);
    expect(res.algorithm).toBe('Consistency Checker');
    expect(res.passed).toBe(true);
  });

  test('should verify using Ensemble Validator for Standard level', () => {
    const req: VerificationRequest = { input: 'Test input', level: 'Standard' };
    const res: VerificationResult = verifyAI(req);
    expect(res.algorithm).toBe('Ensemble Validator');
    expect(res.passed).toBe(true);
  });

  test('should verify using Fact Checker for Thorough level', () => {
    const req: VerificationRequest = { input: 'Test input', level: 'Thorough' };
    const res: VerificationResult = verifyAI(req);
    expect(res.algorithm).toBe('Fact Checker');
    expect(res.passed).toBe(true);
  });

  test('should verify using Fact Checker for Critical level', () => {
    const req: VerificationRequest = { input: 'Test input', level: 'Critical' };
    const res: VerificationResult = verifyAI(req);
    expect(res.algorithm).toBe('Fact Checker');
    expect(res.passed).toBe(true);
  });
});
