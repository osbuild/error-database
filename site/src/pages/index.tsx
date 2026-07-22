import React, {useState, useMemo} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CategoryBadge from '../components/CategoryBadge';
import EditOnGitHub from '../components/EditOnGitHub';
import db from '../data/db.json';
import lineMap from '../data/lineMap.json';

interface ErrorEntry {
  id: string;
  signal: string;
  description: string;
  category: string;
  component: string | null;
  first_seen: string;
  last_seen: string;
  resolution: string | null;
}

const CATEGORIES = ['FLAKE', 'EXTERNAL', 'BUG', 'INFRASTRUCTURE', 'No category'];

export default function Home() {
  const errors = (db as {errors: ErrorEntry[]}).errors;

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = useMemo(() => {
    return errors.filter((e) => {
      if (categoryFilter && e.category !== categoryFilter) {
        if (!(e.category == '' && categoryFilter == 'No category')) {
          return false;
        }
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          e.id.toLowerCase().includes(q) ||
          e.signal.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          (e.component && e.component.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [errors, search, categoryFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) =>
      b.last_seen.localeCompare(a.last_seen),
    );
  }, [filtered]);

  return (
    <Layout title="CI Error Database">
      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        <h1>Composer CI Error Database</h1>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          <input
            type="text"
            placeholder="Search errors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '6px 12px',
              fontSize: '1em',
              flex: '1',
              minWidth: '200px',
            }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{padding: '6px 12px', fontSize: '1em'}}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <p>
          {sorted.length} error{sorted.length !== 1 ? 's' : ''}
        </p>

        {sorted.length === 0 ? (
          <p>No errors found.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Component</th>
                  <th>Last Seen</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <Link to={`/errors/${e.id}`}>{e.id}</Link>
                    </td>
                    <td>{e.description || '\u2014'}</td>
                    <td>
                      <CategoryBadge category={e.category} />
                    </td>
                    <td>
                      {e.component ? <code>{e.component}</code> : '\u2014'}
                    </td>
                    <td>{e.last_seen}</td>
                    <td>{e.resolution ? 'Resolved' : 'Unresolved'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
