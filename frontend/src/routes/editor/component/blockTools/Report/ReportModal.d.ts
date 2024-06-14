import { FC } from 'react';

interface AnalystReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  createIframe?: () => JSX.Element;
}

declare const AnalystReportModal: FC<AnalystReportModalProps>;

export default AnalystReportModal;