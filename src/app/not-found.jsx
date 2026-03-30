export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#666' }}>
        Page not found
      </p>
      <a href="/" style={{
        backgroundColor: '#222',
        color: 'white',
        padding: '0.75rem 1.5rem',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '600'
      }}>
        Go back home
      </a>
    </div>
  );
}
