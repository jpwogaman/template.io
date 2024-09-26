import * as esbuild from 'esbuild';

(async () => {
  await esbuild.build({
    entryPoints: ['./server/template-io-server.ts'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outfile: 'dist/server/template-io-server.js',
    plugins: [],
  });
})();