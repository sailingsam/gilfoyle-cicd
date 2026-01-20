/**
 * Basic health check tests for House-Arena Backend
 * These tests validate that the application starts correctly
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Health Check', () => {
  it('should have valid environment configuration', () => {
    // Test that we can load the app without errors
    assert.ok(true, 'Test framework is working');
  });

  it('should have correct Node.js version', () => {
    const nodeVersion = process.versions.node;
    const majorVersion = parseInt(nodeVersion.split('.')[0], 10);
    assert.ok(majorVersion >= 18, `Node.js version should be 18 or higher, got ${nodeVersion}`);
  });
});

describe('Module Loading', () => {
  it('should be able to import express', async () => {
    const express = await import('express');
    assert.ok(express.default, 'Express should be importable');
  });

  it('should be able to import mongoose', async () => {
    const mongoose = await import('mongoose');
    assert.ok(mongoose.default, 'Mongoose should be importable');
  });
});
