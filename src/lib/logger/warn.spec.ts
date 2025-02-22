import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { prefixedLog } from './prefixed-log';
import { warn } from './warn';

describe('warn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "warn" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warn(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('warn', message);
  });
});
