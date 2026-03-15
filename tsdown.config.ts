import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist',
  format: ['cjs', 'esm'],
  treeshake: true,
  sourcemap: true,
  clean: true,
  dts: true
})