import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { event } from './event';
import { prefixedLog } from './prefixed-log';

describe('event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "event" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    event(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('event', message);
  });
});
