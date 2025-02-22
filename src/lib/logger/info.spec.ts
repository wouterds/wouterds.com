import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prefixed-log');

import { info } from './info';
import { prefixedLog } from './prefixed-log';

describe('info', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prefixedLog with "info" prefix & passed message', () => {
    // given
    const message = faker.lorem.sentence();

    // when
    info(message);

    // then
    expect(prefixedLog).toHaveBeenCalledWith('info', message);
  });
});
