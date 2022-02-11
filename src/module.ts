import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPluginTemplate } from '@nuxt/kit'
import consola from 'consola'
import { name, version } from '../package.json'

const logger = consola.withScope('nuxt:font-awesome')
const svgCorePackage = '@fortawesome/fontawesome-svg-core'

export type FontAwesomeSets =
  '@fortawesome/free-solid-svg-icons'
  | '@fortawesome/free-brand-svg-icons'
  | '@fortawesome/pro-thin-svg-icons'
  | '@fortawesome/pro-light-svg-icons'
  | '@fortawesome/pro-regular-svg-icons'
  | '@fortawesome/pro-solid-svg-icons'
  | '@fortawesome/pro-duotone-svg-icons'

export interface ImportSet {
  set: FontAwesomeSets;
  icons: Array<string>;
}

export interface ModuleOptions {
  component?: String;
  suffix?: String;
  imports: Array<ImportSet>;
  debug?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'fontawesome',
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '>=2.0.0',
      bridge: true
    }
  },
  defaults: {
    component: '',
    suffix: '',
    imports: [],
    debug: false
  },
  setup (options, nuxt) {
    const debug = (message: string, type: 'info' | 'log' | 'success' = 'info') => {
      if (options.debug === true) {
        logger[type](message)
      }
    }

    const maybeTranspilePackage = (packageName) => {
      debug(`Check if we need to transpile ${packageName}`)

      if (nuxt.options.build.transpile.includes(packageName) === false) {
        nuxt.options.build.transpile.push(packageName)

        debug(`Added ${packageName} to build.transpile in nuxt.config`, 'success')
      } else {
        debug(`${packageName} already present in build.transpile in nuxt.config`, 'info')
      }
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    nuxt.options.css.unshift('@fortawesome/fontawesome-svg-core/styles.css')
    nuxt.options.build.transpile.push(runtimeDir)

    // Needed because @fortawesome packages don't container type="module", which breaks SSR
    // Check if package isn't manually added in transpile property by user
    maybeTranspilePackage(svgCorePackage)

    // Dynamically transpile activated import sets
    options.imports.forEach(({ set }) => maybeTranspilePackage(set))

    if (!options.component || options.suffix) {
      options.suffix = '-icon'
    }

    options.component = options.component || 'font-awesome'

    addPluginTemplate({
      src: resolve(runtimeDir, 'plugin.mjs'),
      filename: 'nuxtFontAwesome.mjs',
      options
    })
  }
})
