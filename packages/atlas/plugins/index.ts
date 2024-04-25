import { load as loadYaml } from 'js-yaml'
import fs from 'node:fs'
import path from 'node:path'
import { PluginOption, loadEnv } from 'vite'

// we need to use relative import from atlas-meta-server because of an issue in Vite: https://github.com/vitejs/vite/issues/5370
import { generateCommonMetaTags } from '../../atlas-meta-server/src/tags'
import { generateMetaHtml } from '../../atlas-meta-server/src/utils'
import { configSchema } from '../src/config/configSchema'

// read config file - we cannot use `@/config` since it relies on YAML plugin being already loaded and that's not done in this context
const rawConfigPath = path.resolve(__dirname, '..', 'atlas.config.yml')
const rawConfigText = fs.readFileSync(rawConfigPath, 'utf-8')
const rawConfig = loadYaml(rawConfigText)
const parsedConfig = configSchema.parse(rawConfig)

// This plugin fixes https://github.com/Joystream/atlas/issues/3005
// By default vite was transpiling `import.meta.url` (that you can find in `node_modules/@polkadot/api/packageInfo.js`)
// to the code which uses `document.baseURI`. `Document` is not available in workers and in the result we got reference errors.
// This plugin replace `document.baseURI` with `self.location.href` which should be available in the worker
export const PolkadotWorkerMetaFixPlugin: PluginOption = {
  name: 'resolve-import-meta-polkadot',
  resolveImportMeta(_, { chunkId }) {
    if (chunkId.includes('polkadot-worker')) {
      return 'self.location.href'
    }
  },
}

// This plugin overrides the name property in manifest.webmanifest file
export const AtlasWebmanifestPlugin: PluginOption = {
  name: 'atlas-webmanifest',
  buildStart() {
    const inputManifestPath = path.resolve('src/public/manifest.webmanifest')
    const manifestData = JSON.parse(fs.readFileSync(inputManifestPath, `utf-8`))

    Object.assign(manifestData, {
      name: parsedConfig.general.appName,
    })

    try {
      this.emitFile({
        type: 'asset',
        source: JSON.stringify(manifestData, null, 2),
        fileName: path.normalize('manifest.webmanifest'),
      })
    } catch (err) {
      throw new Error('Failed to emit asset file, possibly a naming conflict?')
    }
  },
}

// This plugin replaces <meta-tags /> in index.html with the actual meta tags
export const AtlasHtmlMetaTagsPlugin: PluginOption = {
  name: 'atlas-html-meta-tags',
  transformIndexHtml: {
    enforce: 'pre',
    transform: (html: string) => {
      const metaTags = generateCommonMetaTags(
        parsedConfig.general.appName,
        parsedConfig.general.appUrl,
        parsedConfig.general.appName,
        parsedConfig.general.appDescription,
        parsedConfig.general.appOgImgPath,
        parsedConfig.general.appTwitterId
      )
      const titleHtml = `<title>${parsedConfig.general.appName}</title>`
      const metaHtml = generateMetaHtml(metaTags, true)

      // include link to Orion GraphQL API so that atlas-meta-server can use it to fetch data for content previews
      const orionUrlEnvKey = 'VITE_PRODUCTION_ORION_URL'
      const orionUrl =
        process.env[orionUrlEnvKey] || loadEnv('production', path.join(process.cwd(), 'src'))[orionUrlEnvKey]

      const generateMetaTagHtml = (name: string, content: string) =>
        `<meta name="${name}" property="${name}" content="${content}">`

      const orionMetaHtml = generateMetaTagHtml('atlas:orion_url', orionUrl)

      const yppOgTitleMetaHtml =
        parsedConfig.features.ypp.landingPageOgTitle &&
        generateMetaTagHtml('atlas:ypp_og_title', parsedConfig.features.ypp.landingPageOgTitle)
      const yppOgDescriptionMetaHtml =
        parsedConfig.features.ypp.landingPageOgDescription &&
        generateMetaTagHtml('atlas:ypp_og_description', parsedConfig.features.ypp.landingPageOgDescription)
      const yppOgImageMetaHtml =
        parsedConfig.features.ypp.landingPageOgImgPath &&
        generateMetaTagHtml('atlas:ypp_og_image', parsedConfig.features.ypp.landingPageOgImgPath)

      const finalMetaHtml = [
        titleHtml,
        metaHtml,
        orionMetaHtml,
        yppOgTitleMetaHtml,
        yppOgDescriptionMetaHtml,
        yppOgImageMetaHtml,
      ]
        .filter((v) => v)
        .join('\n')
      return html.replace('<meta-tags />', finalMetaHtml)
    },
  },
}

// This plugin enables /embedded path in development mode.
// Without this, dev server will always try to serve main index.html file
export const EmbeddedFallbackPlugin: PluginOption = {
  name: 'embedded-fallback',
  configureServer(server) {
    server.middlewares.use('/embedded', (req, res, next) => {
      if (req.url?.includes('.')) {
        next()
        return
      }
      req.url = '/index.html'
      req.originalUrl = '/embedded/index.html'
      next()
    })
  },
}

export const OptimizePlugin: PluginOption = {
  name: 'optimize-init-plugin',
  transformIndexHtml: {
    enforce: 'pre',
    transform: (html) => {
      const optimizeEnv = 'VITE_OPTIMIZE_ID'
      const optimizeId = process.env[optimizeEnv] || loadEnv('production', path.join(process.cwd(), 'src'))[optimizeEnv]
      const optimizeScript = optimizeId
        ? `<script src="https://www.googleoptimize.com/optimize.js?id=${optimizeId}"></script>`
        : ''

      return html.replace('<optimize-script />', optimizeScript)
    },
  },
}

export const VwoScriptPlugin: PluginOption = {
  name: 'vwo-script-plugin',
  transformIndexHtml: {
    enforce: 'pre',
    transform: (html) => {
      const accountIdEnv = 'VITE_VWO_ACCOUNT_ID'
      const accountId =
        process.env[accountIdEnv] || loadEnv('production', path.join(process.cwd(), 'src'))[accountIdEnv]
      const vwoScript = accountId
        ? `<!-- Start VWO Async SmartCode -->
<link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
<script type='text/javascript' id='vwoCode'>
window._vwo_code || (function() {
var account_id=${accountId},
version=2.1,
settings_tolerance=2000,
hide_element='body',
hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
/* DO NOT EDIT BELOW THIS LINE */
f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){if(performance.getEntriesByName('first-contentful-paint')[0]){return''}return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById('_vis_opt_path_hides');if(t)t.parentNode.removeChild(t);if(e)(new Image).src='https://dev.visualwebsiteoptimizer.com/ee.gif?a='+account_id+e}},finished:function(){return f},addScript:function(e){var t=d.createElement('script');t.type='text/javascript';if(e.src){t.src=e.src}else{t.text=e.text}d.getElementsByTagName('head')[0].appendChild(t)},load:function(e,t){var i=this.getSettings(),n=d.createElement('script'),r=this;t=t||{};if(i){n.textContent=i;d.getElementsByTagName('head')[0].appendChild(n);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open('GET',e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||'text';o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200){_vwo_code.addScript({text:o.responseText})}else{_vwo_code.finish('&e=loading_failure:'+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}_vwo_code.finish('&e=loading_failure:'+e)};o.send()}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=='body'){t=d.createElement('style');var i=this.hide_element(),n=i?i+this.hide_element_style():'',r=d.getElementsByTagName('head')[0];t.setAttribute('id','_vis_opt_path_hides');v&&t.setAttribute('nonce',v.nonce);t.setAttribute('type','text/css');if(t.styleSheet)t.styleSheet.cssText=n;else t.appendChild(d.createTextNode(n));r.appendChild(t)}else{t=d.getElementsByTagName('head')[0];var n=d.createElement('div');n.style.cssText='z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;';n.setAttribute('id','_vis_opt_path_hides');n.classList.add('_vis_hide_layer');t.parentNode.insertBefore(n,t.nextSibling)}var o='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&vn='+version;if(w.location.search.indexOf('_vwo_xhr')!==-1){this.addScript({src:o})}else{this.load(o+'&x=true')}}};w._vwo_code=code;code.init();})();
</script>
<!-- End VWO Async SmartCode -->`
        : ''

      return html.replace('<vwo-script />', vwoScript)
    },
  },
}
