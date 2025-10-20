import { render } from '@testing-library/react';

import PlentyHooks from './plenty-hooks';

describe('PlentyHooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PlentyHooks />);
    expect(baseElement).toBeTruthy();
  });
});
