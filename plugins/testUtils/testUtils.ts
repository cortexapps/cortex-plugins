import { type Matcher } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';

export const waitForLoading = async (text: Matcher = 'loading') => {
  await waitFor(() => expect(screen.queryByLabelText(text)).not.toBeInTheDocument());
};
