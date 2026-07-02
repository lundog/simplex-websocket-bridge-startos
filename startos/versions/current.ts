import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.3.0:0',
  releaseNotes: {
    en_US: [
      'Bundles simplex-chat v6.5.5 and improves connection reliability and the file-exchange contract.',
      '',
      '- Bundles simplex-chat v6.5.5 (previously v6.5.4).',
      '- More reliable connections: large SimpleX events (for example, when a new contact connects) are no longer split into invalid WebSocket frames.',
      '- File exchange reworked for consumer packages: received files are shared via the .simplex/files subpath (mounted read-only, resolved by name) and outgoing files via a neutral /tmp/simplex-outbound mount. See the README.',
    ].join('\n'),
    es_ES: [
      'Incluye simplex-chat v6.5.5 y mejora la fiabilidad de las conexiones y el contrato de intercambio de archivos.',
      '',
      '- Incluye simplex-chat v6.5.5 (antes v6.5.4).',
      '- Conexiones más fiables: los eventos grandes de SimpleX (por ejemplo, cuando un nuevo contacto se conecta) ya no se dividen en tramas WebSocket no válidas.',
      '- Intercambio de archivos rediseñado para paquetes consumidores: los archivos recibidos se comparten mediante la subruta .simplex/files (montada en solo lectura, resuelta por nombre) y los archivos salientes mediante un montaje neutral /tmp/simplex-outbound. Consulte el README.',
    ].join('\n'),
    de_DE: [
      'Enthält simplex-chat v6.5.5 und verbessert die Verbindungszuverlässigkeit sowie den Dateiaustausch-Vertrag.',
      '',
      '- Enthält simplex-chat v6.5.5 (zuvor v6.5.4).',
      '- Zuverlässigere Verbindungen: Große SimpleX-Ereignisse (zum Beispiel, wenn ein neuer Kontakt eine Verbindung herstellt) werden nicht mehr in ungültige WebSocket-Frames aufgeteilt.',
      '- Dateiaustausch für konsumierende Pakete überarbeitet: Empfangene Dateien werden über den Unterpfad .simplex/files (schreibgeschützt eingebunden, anhand des Namens aufgelöst) und ausgehende Dateien über eine neutrale Einbindung /tmp/simplex-outbound geteilt. Siehe README.',
    ].join('\n'),
    pl_PL: [
      'Zawiera simplex-chat v6.5.5 oraz poprawia niezawodność połączeń i kontrakt wymiany plików.',
      '',
      '- Zawiera simplex-chat v6.5.5 (poprzednio v6.5.4).',
      '- Bardziej niezawodne połączenia: duże zdarzenia SimpleX (na przykład gdy łączy się nowy kontakt) nie są już dzielone na nieprawidłowe ramki WebSocket.',
      '- Przebudowano wymianę plików dla pakietów konsumujących: pliki odebrane są udostępniane przez podścieżkę .simplex/files (montowaną tylko do odczytu, rozwiązywaną po nazwie), a pliki wychodzące przez neutralny montaż /tmp/simplex-outbound. Zobacz README.',
    ].join('\n'),
    fr_FR: [
      "Inclut simplex-chat v6.5.5 et améliore la fiabilité des connexions ainsi que le contrat d'échange de fichiers.",
      '',
      '- Inclut simplex-chat v6.5.5 (auparavant v6.5.4).',
      "- Connexions plus fiables : les événements SimpleX volumineux (par exemple lorsqu'un nouveau contact se connecte) ne sont plus fractionnés en trames WebSocket invalides.",
      '- Échange de fichiers repensé pour les paquets consommateurs : les fichiers reçus sont partagés via le sous-chemin .simplex/files (monté en lecture seule, résolu par nom) et les fichiers sortants via un montage neutre /tmp/simplex-outbound. Voir le README.',
    ].join('\n'),
  },
  migrations: {
    // No data migration: the SimpleX profile DB and API keys keep their paths
    // under .simplex/. Received files move from .simplex/media/inbound to
    // .simplex/files (the new image default); any files left in the old
    // .simplex/media tree are orphaned but harmless and can be removed manually.
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
