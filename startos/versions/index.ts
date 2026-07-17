import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v0_2_0 } from './v0_2_0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v0_2_0],
})
