import { useState, useEffect } from 'react';
import { ShowcaseStage } from '../types';

export function useShowcaseTimer(isParentActive: boolean = true) {
  const [stage, setStage] = useState<ShowcaseStage>(0);
  const [wordStep, setWordStep] = useState<number>(0);
  const [checksResolved, setChecksResolved] = useState<number>(0);
  const [isStoryTypingDone, setIsStoryTypingDone] = useState<boolean>(false);
  const [taskCompletedCount, setTaskCompletedCount] = useState<number>(0);

  useEffect(() => {
    if (!isParentActive) return;

    let timer: ReturnType<typeof setTimeout>;

    if (stage === 0) {
      // Stage 0: Voice Recognition (2.4s)
      setWordStep(0);
      setChecksResolved(0);
      setIsStoryTypingDone(false);
      setTaskCompletedCount(0);
      timer = setTimeout(() => setStage(1), 2400);
    } else if (stage === 1) {
      // Stage 1: Text transition gray -> black word by word (2.8s)
      const w1 = setTimeout(() => setWordStep(1), 350);
      const w2 = setTimeout(() => setWordStep(2), 850);
      const w3 = setTimeout(() => setWordStep(3), 1450);
      const w4 = setTimeout(() => setWordStep(4), 2050);
      const nextStageTimer = setTimeout(() => setStage(2), 2800);

      return () => {
        clearTimeout(w1);
        clearTimeout(w2);
        clearTimeout(w3);
        clearTimeout(w4);
        clearTimeout(nextStageTimer);
      };
    } else if (stage === 2) {
      // Stage 2: Click Indication (1.4s)
      timer = setTimeout(() => setStage(3), 1400);
    } else if (stage === 3) {
      // Stage 3: Parsing indication - 3 sequential checks (2.8s total)
      const c1 = setTimeout(() => setChecksResolved(1), 400);
      const c2 = setTimeout(() => setChecksResolved(2), 1100);
      const c3 = setTimeout(() => setChecksResolved(3), 1800);
      const nextStageTimer = setTimeout(() => setStage(4), 2800);

      return () => {
        clearTimeout(c1);
        clearTimeout(c2);
        clearTimeout(c3);
        clearTimeout(nextStageTimer);
      };
    } else if (stage === 4) {
      // Stage 4: Expense Recorded confirmation (2.6s) -> transitions into Expense Story!
      timer = setTimeout(() => setStage(5), 2600);
    } else if (stage === 5) {
      // Stage 5: Expense Story with Typewriter animation (4.6s) -> transitions into Habit Tasks!
      timer = setTimeout(() => setStage(6), 4600);
    } else if (stage === 6) {
      // Stage 6: Actionable Habit Tasks (4.2s) -> transitions into Milestone Vault!
      const t1 = setTimeout(() => setTaskCompletedCount(1), 600);
      const t2 = setTimeout(() => setTaskCompletedCount(2), 1600);
      const nextStageTimer = setTimeout(() => setStage(7), 4200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(nextStageTimer);
      };
    } else if (stage === 7) {
      // Stage 7: Milestone Vault with Circular Progress (4.2s) -> transitions into Area Chart!
      timer = setTimeout(() => setStage(8), 4200);
    } else if (stage === 8) {
      // Stage 8: 6-Month Compounded Savings Area Chart (4.8s) -> loops back to 0!
      timer = setTimeout(() => {
        setStage(0);
      }, 4800);
    }

    return () => clearTimeout(timer);
  }, [stage, isParentActive]);

  return {
    stage,
    wordStep,
    checksResolved,
    isStoryTypingDone,
    setIsStoryTypingDone,
    taskCompletedCount,
  };
}
