import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { prefixedLog } from './prefixed-log';
import { warnOnce } from './warn-once';

describe('warnOnce', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "warn" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warnOnce(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('warn', message);
  });

  it('should call prefixedLog with "warn" prefix & passed message only once', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    warnOnce(message);
    warnOnce(message);

    // then
    expect(prefixedLog).toHaveBeenCalledTimes(1);
  });
});
