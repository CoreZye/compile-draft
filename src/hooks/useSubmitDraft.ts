import { useMutation } from '@tanstack/react-query';
import { type Draft } from '@/utils/types';

const submitDraftData = async (draft: Draft) => {
  const response = await fetch('/api/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Server error occurred');
  }

  return await response.json();
};

export const useSubmitDraft = () => {
  return useMutation({
    mutationFn: submitDraftData,
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error: Error) => {
      console.error('Draft submission failed:', error.message);
    },
  });
};