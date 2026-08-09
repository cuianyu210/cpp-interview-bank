import { bootstrap } from './app';
import type { QuestionBankController } from './controller/question-bank-controller';

export function startWhenReady(document: Document): () => void {
  let controller: QuestionBankController | undefined;
  const start = () => {
    controller ??= bootstrap(document);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }

  return () => {
    document.removeEventListener('DOMContentLoaded', start);
    controller?.dispose();
  };
}

export const stopApplication = startWhenReady(document);
