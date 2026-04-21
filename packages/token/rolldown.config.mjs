import path from 'node:path'
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: {
    main: 'src/main.ts',
  },
  platform: 'node',
  external: (id) => !id.startsWith('.') && !id.startsWith('~') && !path.isAbsolute(id),
  plugins: [
    {
      name: 'externalize-local',
      resolveId(source) {
        if (source === '~/model' || source.startsWith('~/model/')) {
          return { id: source.replace('~/model', './model'), external: true }
        }
        if (source === '~/server-extension' || source.startsWith('~/server-extension/')) {
          return { id: source.replace('~/server-extension', './server-extension'), external: true }
        }
      },
    },
  ],
  tsconfig: true,
  output: {
    dir: 'lib',
    format: 'cjs',
    sourcemap: true,
  },
})
