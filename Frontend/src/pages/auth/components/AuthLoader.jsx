export default function AuthLoader (){
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{
          width: 60,
          height: 60,
          margin: '0 auto',
          border: '4px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          borderTopColor: 'white',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ marginTop: 20, fontSize: 18 }}>Loading...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};