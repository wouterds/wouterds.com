import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { prefixedLog } from './prefixed-log';
import { trace } from './trace';

describe('trace', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "trace" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    trace(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('trace', message);
  });
});
