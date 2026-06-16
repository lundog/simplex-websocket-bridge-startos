import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.2.0:0',
  releaseNotes: {
    en_US: [
      'Shared volume file exchange release.',
      '',
      'Features:',
      '- Shared volume file exchange — send and receive files through the /simplex/outbound and /simplex/inbound folders.',
      '- Updates upstream simplex-chat to v6.5.4.',
      '- The container image is now the standalone, multi-arch lundog/simplex-chat image, keeping Docker packaging separate from the StartOS package.',
    ].join('\n'),
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
