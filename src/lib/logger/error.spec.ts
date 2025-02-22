import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { error } from './error';
import { prefixedLog } from './prefixed-log';

describe('error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "error" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    error(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('error', message);
  });
});
