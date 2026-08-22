export type ShowcaseStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ShowcaseProps {
  isParentActive?: boolean;
}

export interface ParseItemProps {
  label: string;
  value: string;
  isResolved: boolean;
}

export interface TaskItemProps {
  icon: any;
  title: string;
  impact: string;
  isDone: boolean;
}
