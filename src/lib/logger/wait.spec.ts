import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { prefixedLog } from './prefixed-log';
import { wait } from './wait';

describe('wait', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "wait" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    wait(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('wait', message);
  });

  it('should handle multiple arguments', () => {
    // when
    wait('test', 123, { key: 'value' });

    // then
    expect(prefixedLog).toHaveBeenCalledWith('wait', 'test', 123, { key: 'value' });
  });
});
