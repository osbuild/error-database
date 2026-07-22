import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CategoryBadge from './CategoryBadge';
import EditOnGitHub from './EditOnGitHub';
import db from '../data/db.json';
import lineMap from '../data/lineMap.json';

interface Occurrence {
  date: string;
  pipeline_id: number;
  job_ids: number[];
  group: string;
}

interface ErrorEntry {
  id: string;
  signal: string;
  description: string;
  category: string;
  component: string | null;
  first_seen: string;
  last_seen: string;
  occurrences: Occurrence[];
  resolution: string | null;
}

export default function ErrorDetailPage({errorId}: {errorId: string}) {
  const error = (db as {errors: ErrorEntry[]}).errors.find(
    (e) => e.id === errorId,
  );
  const line = (lineMap as Record<string, number>)[errorId];

  if (!error) {
    return (
      <Layout title="Not Found">
        <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
          <h1>Error not found: {errorId}</h1>
          <Link to="/">Back to dashboard</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={error.id}>
      <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
        <div style={{marginBottom: '1rem'}}>
          <Link to="/">&larr; Back to dashboard</Link>
        </div>

        <h1>
          {error.id}
          <EditOnGitHub lineNumber={line} />
        </h1>

        <table>
          <tbody>
            <tr>
              <th style={{whiteSpace: 'nowrap', verticalAlign: 'top'}}>
                Description
              </th>
              <td>{error.description || '\u2014'}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>
                <CategoryBadge category={error.category} />
              </td>
            </tr>
            <tr>
              <th>Component</th>
              <td>
                {error.component ? <code>{error.component}</code> : '\u2014'}
              </td>
            </tr>
            <tr>
              <th>Signal</th>
              <td>
                <code style={{wordBreak: 'break-all'}}>{error.signal}</code>
              </td>
            </tr>
            <tr>
              <th>First seen</th>
              <td>{error.first_seen}</td>
            </tr>
            <tr>
              <th>Last seen</th>
              <td>{error.last_seen}</td>
            </tr>
            <tr>
              <th>Resolution</th>
              <td>{error.resolution || 'Unresolved'}</td>
            </tr>
          </tbody>
        </table>

        <h2>Occurrences ({error.occurrences.length})</h2>
        {error.occurrences.length === 0 ? (
          <p>No occurrences recorded yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Pipeline</th>
                <th>Jobs</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {error.occurrences.map((occ, i) => (
                <tr key={i}>
                  <td>{occ.date}</td>
                  <td>{occ.pipeline_id}</td>
                  <td>{occ.job_ids.join(', ')}</td>
                  <td>{occ.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
