import { sdk } from './sdk'
import { clientSettingsJson } from './fileModels/clientSettings.json'
import { SIMPLEX_SERVER_PACKAGE_ID } from './serverConfig'

/**
 * The bridge has no hard dependencies. When the user selects "My self-hosted
 * SimpleX Server" for relays (servers.mode === 'local') in the Configure
 * action, we flip the optional `simplex` package to a `running` dependency so
 * StartOS prompts for / tracks it. Reactive: re-runs whenever the settings file
 * changes, so toggling the relay mode adds or drops the dependency with no
 * explicit re-trigger.
 */
export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const mode = await clientSettingsJson
    .read((c) => c.servers.mode)
    .const(effects)

  if (mode !== 'local') return {}

  return {
    [SIMPLEX_SERVER_PACKAGE_ID]: {
      kind: 'running',
      versionRange: '*',
      healthChecks: [],
    },
  }
})
