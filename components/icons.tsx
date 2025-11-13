import React from 'react';

export const PlusIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const EditIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const TrashIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033C6.91 2.75 6 3.704 6 4.834v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export const SettingsIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l.429-.143c.594-.198 1.22.234 1.22.865v4.286c0 .63.626 1.058 1.22.865l.429-.143c.55-.183 1.02.285 1.11.827l.429 2.576c.09.542-.234 1.058-.795 1.227l-.429.143c-.594.198-1.22-.234-1.22-.865v-4.286c0-.63-.626-1.058-1.22-.865l-.429.143c-.55.183-1.02-.285-1.11-.827l-.429-2.576Zm-3.422 5.13c-.09.542.234 1.058.795 1.227l.429.143c.594.198 1.22-.234 1.22-.865V4.286c0-.63-.626-1.058-1.22-.865l-.429.143c-.55.183-1.02.285-1.11.827l-.429 2.576Zm10.079 3.863c.09.542.56 1.007 1.11 1.227l.429.143c.594.198 1.22.234 1.22.865v4.286c0 .63.626 1.058 1.22.865l.429.143c.55.183 1.02.285 1.11.827l.429 2.576c.09.542-.234 1.058-.795 1.227l-.429.143c-.594.198-1.22-.234-1.22-.865v-4.286c0-.63-.626-1.058-1.22-.865l-.429.143c-.55.183-1.02-.285-1.11-.827l-.429-2.576Zm-12.046 0c-.09.542.234 1.058.795 1.227l.429.143c.594.198 1.22-.234 1.22-.865v4.286c0 .63.626 1.058 1.22.865l.429.143c.55.183 1.02.285 1.11.827l.429 2.576c.09.542-.234 1.058-.795 1.227l-.429.143c-.594.198-1.22-.234-1.22-.865v-4.286c0-.63-.626-1.058-1.22-.865l-.429.143c-.55.183-1.02-.285-1.11-.827l-.429-2.576Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.363c.273.18.52.412.72.682A4.5 4.5 0 0 1 15.75 12a4.5 4.5 0 0 1-3.03 4.272.742.742 0 0 0-.03.033.75.75 0 0 0-.72.682A4.5 4.5 0 0 1 9 16.5a4.5 4.5 0 0 1-2.72-8.25.75.75 0 0 0-.682-.72A4.5 4.5 0 0 1 9 4.5c1.331 0 2.517.544 3.363 1.413.273.18.52.412.72.682Z" />
  </svg>
);

export const ReportIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
  </svg>
);

export const BoltIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
);

export const CurrencyDollarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.95-.754 2.11-.754 3.061 0 .951.754 1.625 2.25 1.625 3.182V15.75" />
    </svg>
);

export const DocumentTextIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const CheckCircleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
