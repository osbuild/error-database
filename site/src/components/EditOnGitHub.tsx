import React from 'react';

const GITHUB_BLOB_URL =
  'https://github.com/osbuild/error-database/blob/main/ci-error-db.json';

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{verticalAlign: 'text-bottom'}}>
      <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25a1.75 1.75 0 0 1 .445-.758l8.61-8.61zm1.414 1.06a.25.25 0 0 0-.354 0L3.462 11.1a.25.25 0 0 0-.064.108l-.631 2.21 2.21-.631a.25.25 0 0 0 .108-.064l8.61-8.61a.25.25 0 0 0 0-.354l-1.086-1.086z" />
    </svg>
  );
}

export default function EditOnGitHub({lineNumber}: {lineNumber?: number}) {
  const url = lineNumber ? `${GITHUB_BLOB_URL}#L${lineNumber}` : GITHUB_BLOB_URL;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Edit on GitHub"
      style={{marginLeft: '8px', color: 'inherit', textDecoration: 'none'}}>
      <PencilIcon />
    </a>
  );
}
