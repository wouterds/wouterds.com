import { describe, expect, it } from 'vitest';

import { humanReadableSize } from './utils';

describe('humanReadableSize', () => {
  it('should return null if size is not provided', () => {
    expect(humanReadableSize()).toBeNull();
  });

  it('should return null if undefined is provided', () => {
    expect(humanReadableSize(undefined)).toBeNull();
  });

  it("should return '0 B' for size 0", () => {
    expect(humanReadableSize(0)).toBe('0.0 B');
  });

  it("should return '1 B' for size 1", () => {
    expect(humanReadableSize(1)).toBe('1.0 B');
  });

  it("should return '1 KB' for size 1024", () => {
    expect(humanReadableSize(1024)).toBe('1.0 KB');
  });

  it("should return '1 MB' for size 1024 * 1024", () => {
    expect(humanReadableSize(1024 * 1024)).toBe('1.0 MB');
  });

  it("should return '1 GB' for size 1024 * 1024 * 1024", () => {
    expect(humanReadableSize(1024 * 1024 * 1024)).toBe('1.0 GB');
  });

  it("should return '1 TB' for size 1024 * 1024 * 1024 * 1024", () => {
    expect(humanReadableSize(1024 * 1024 * 1024 * 1024)).toBe('1.0 TB');
  });

  it("should return '1.5 KB' for size 1536", () => {
    expect(humanReadableSize(1536)).toBe('1.5 KB');
  });

  it("should return '1.5 MB' for size 1536 * 1024", () => {
    expect(humanReadableSize(1536 * 1024)).toBe('1.5 MB');
  });

  it("should return '1.5 GB' for size 1536 * 1024 * 1024", () => {
    expect(humanReadableSize(1536 * 1024 * 1024)).toBe('1.5 GB');
  });

  it("should return '1.5 TB' for size 1536 * 1024 * 1024 * 1024", () => {
    expect(humanReadableSize(1536 * 1024 * 1024 * 1024)).toBe('1.5 TB');
  });
});
