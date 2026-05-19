import opalRiv from '@assets/orb-1.2.riv';
import { useRive, useStateMachineInput } from '@rive-app/react-webgl2';
import { memo, useEffect } from 'react';
import { cn } from '@/src/utils';

export type PersonaState = 'tools' | 'writing' | 'idle';

interface PersonaProps {
  state: PersonaState;
  className?: string;
}

const stateMachine = 'default';

export const Persona = memo(({ state = 'idle', className }: PersonaProps) => {
  const { rive, RiveComponent } = useRive({
    src: opalRiv,
    stateMachines: stateMachine,
    autoplay: true,
  });

  const thinkingInput = useStateMachineInput(rive, stateMachine, 'thinking');

  useEffect(() => {
    if (thinkingInput) {
      thinkingInput.value = state === 'tools' || state === 'writing';
    }
  }, [state, thinkingInput]);

  return <RiveComponent className={cn('size-16 shrink-0', className)} />;
});

Persona.displayName = 'Persona';
