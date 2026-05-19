import ErrorBoundary from '@components/ui/error-boundary';
import { Feedback, type FeedbackSubmitData, FeedbackValue } from '@components/ui/feedback';
import { useQuery } from '@tanstack/react-query';
import type { components } from '@typedefs/api/schema';
import { $api } from '@utils/fetch-client';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { queryClient } from '@/src/App';

type FeedbackOutcome = components['schemas']['Feedback']['outcome'];
type FeedbackResponse = components['schemas']['RespSAIVFeedback'];

const errorMessage = 'Error - Unable to submit feedback';

type SubmitFeedbackData = { value: FeedbackOutcome; comment?: string | null };

const context = 'default';
const thread = 'default';

const LeonFeedback = ({ id }: { id?: number }) => {
  const tenant_name = sessionStorage.getItem('active_tenant_name') ?? '';
  const queryOptions = useMemo(() => {
    return $api.queryOptions('get', '/leonidas/communicate/feedback', {
      params: {
        query: {
          context,
          thread,
          tenant_name,
        },
      },
    });
  }, [tenant_name]);

  const { data, isFetching, isError } = useQuery(queryOptions);
  const currentFeedback = useMemo(() => {
    return (
      data?.entries?.find((entry) => {
        return entry.id === id;
      })?.outcome ?? FeedbackValue.NEUTRAL
    );
  }, [data?.entries, id]);
  const mutation = $api.useMutation('post', '/leonidas/communicate/feedback');

  const isDisabled = mutation.isPending || !id || typeof id !== 'number';

  const submitFeedback = useCallback(
    ({ value, comment }: SubmitFeedbackData) => {
      if (typeof id !== 'number') {
        toast.error(errorMessage, { duration: 5_000 });
        return;
      }

      mutation.mutate(
        {
          params: {
            query: {
              id,
              context,
              thread,
              tenant_name,
            },
          },
          body: {
            outcome: value,
            comment,
          },
        },
        {
          onSuccess: (response) => {
            const updatedEntry = response.entry;
            if (updatedEntry) {
              queryClient.setQueryData<FeedbackResponse>(queryOptions.queryKey, (current) => {
                const entries = current?.entries ?? [];
                return {
                  time_total: current?.time_total ?? 0,
                  entries: [
                    updatedEntry,
                    ...entries.filter((entry) => {
                      return entry.id !== updatedEntry.id;
                    }),
                  ],
                };
              });
            }

            const nextOutcome = updatedEntry?.outcome ?? value;

            if (nextOutcome === FeedbackValue.NEUTRAL) {
              toast.success('Feedback cleared', { duration: 5_000 });
              return;
            }
            const translations = {
              like: 'Positive',
              dislike: 'Negative',
            };
            toast.success(`${translations[nextOutcome]} feedback submitted`, { duration: 5_000 });
          },
          onError: () => {
            return toast.error(errorMessage, { duration: 5_000 });
          },
        },
      );
    },
    [id, mutation, queryOptions.queryKey, tenant_name],
  );

  const handleValueChange = useCallback(
    ({ value, comment }: FeedbackSubmitData) => {
      submitFeedback({ value, comment });
    },
    [submitFeedback],
  );

  if (isError || isFetching) {
    return null;
  }

  return (
    <ErrorBoundary fallback={null}>
      <Feedback value={currentFeedback} onValueChange={handleValueChange} disabled={isDisabled} withComment>
        <Feedback.ThumbsUp tooltip="Mark as helpful" selectedTooltip="Clear feedback" />
        <Feedback.ThumbsDown tooltip="Mark as unhelpful" selectedTooltip="Clear feedback" />
      </Feedback>
    </ErrorBoundary>
  );
};
export default LeonFeedback;
