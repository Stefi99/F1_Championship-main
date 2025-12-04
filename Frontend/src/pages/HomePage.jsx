// Startseite der Anwendung
// allgemeine Übersicht oder Begrüßung.
// Seite ist öffentlich zugänglich (kein Login nötig).

function HomePage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>F1 Championship</h1>
      <p>Willkommen zur offiziellen F1 Championship Applikation.</p>
      <p>Bitte melde dich an, um fortzufahren.</p>
    </div>
  );
}

export default HomePage;
