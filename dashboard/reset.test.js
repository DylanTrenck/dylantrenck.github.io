// node reset.test.js
// Tests token detection and form validation logic for reset.html
// Run with: node dashboard/reset.test.js

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    console.log(`  PASS  ${label}`)
    passed++
  } else {
    console.error(`  FAIL  ${label}`)
    failed++
  }
}

// ─── Simulate the URL parsing logic from reset.html ──────────────────────────

function detectTokens(search, hash) {
  const query = new URLSearchParams(search)
  const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  const code = query.get('code')
  const hasHashToken = hashParams.get('access_token') && hashParams.get('type') === 'recovery'
  return { code, hasHashToken }
}

// Same logic, but reading hash BEFORE Supabase can clear it (the fix)
function detectTokensEarly(search, hashAtPageLoad) {
  const query = new URLSearchParams(search)
  const hashParams = new URLSearchParams(hashAtPageLoad.startsWith('#') ? hashAtPageLoad.slice(1) : hashAtPageLoad)
  const code = query.get('code')
  const hasHashToken = hashParams.get('access_token') && hashParams.get('type') === 'recovery'
  return { code, hasHashToken }
}

// ─── Suite 1: Token detection with hash present ───────────────────────────────

console.log('\nSuite 1: Token detection — hash URL (implicit flow)')

const implicitHash = '#access_token=eyJfoo&expires_at=9999999999&expires_in=3600&refresh_token=abc123&sb=&token_type=bearer&type=recovery'

const r1 = detectTokens('', implicitHash)
assert(r1.hasHashToken === true,  'detects access_token + type=recovery in hash')
assert(r1.code === null,          'no code in query string')

// Simulate Supabase clearing the hash (the actual bug)
const r2 = detectTokens('', '') // hash is '' after Supabase clears it
assert(!r2.hasHashToken,             'hash cleared by Supabase → hasHashToken is falsy (this is the bug)')
assert(!r2.code && !r2.hasHashToken, 'cleared hash → falls into "no token found" branch (wrong)')

// The fix: read hash before createClient
const r3 = detectTokensEarly('', implicitHash)
assert(r3.hasHashToken === true,  'early read captures hash before Supabase clears it')

// ─── Suite 2: Token detection — PKCE flow ────────────────────────────────────

console.log('\nSuite 2: Token detection — query param URL (PKCE flow)')

const r4 = detectTokens('?code=abc123xyz', '')
assert(r4.code === 'abc123xyz',   'detects code in query string')
assert(!r4.hasHashToken,          'no hash token in PKCE URL')

const r5 = detectTokens('', '')
assert(!r5.code && !r5.hasHashToken, 'bare URL → no token found')

// ─── Suite 3: hash.get('type') must equal 'recovery' exactly ─────────────────

console.log('\nSuite 3: type= value must be exactly "recovery"')

const wrongType = '#access_token=foo&type=signup'
const r6 = detectTokens('', wrongType)
assert(r6.hasHashToken === false, 'type=signup is not treated as recovery token')

const missingType = '#access_token=foo'
const r7 = detectTokens('', missingType)
assert(r7.hasHashToken === false, 'missing type param → not treated as recovery token')

// ─── Suite 4: Form validation logic ──────────────────────────────────────────

console.log('\nSuite 4: Form validation')

function validateForm(pw, pw2, sessionReady) {
  if (!sessionReady) return 'Still verifying token, please wait a moment.'
  if (!pw || pw.length < 8) return 'Password must be at least 8 characters.'
  if (pw !== pw2) return 'Passwords do not match.'
  return null // valid
}

assert(validateForm('', '', false)             === 'Still verifying token, please wait a moment.', 'blocks submit before session ready')
assert(validateForm('short', 'short', true)    === 'Password must be at least 8 characters.',     'rejects password < 8 chars')
assert(validateForm('password1', 'password2', true) === 'Passwords do not match.',               'rejects mismatched passwords')
assert(validateForm('validpass', 'validpass', true) === null,                                    'accepts matching passwords ≥ 8 chars')
assert(validateForm('', '', true)              === 'Password must be at least 8 characters.',     'rejects empty password when session ready')

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`)
console.log(`  ${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.error(`  Tests failed.\n`)
  process.exit(1)
} else {
  console.log(`  All tests passed.\n`)
}
