import { defineNuxtPlugin } from '#app'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

config.autoAddCss = false

<% options.imports.forEach(({set, icons}) => { %>
  <% name = set.replace(/[^a-zA-z]/g, "") %>
  <% icons.forEach((icon) => { %>
    import { <%=icon%> as <%=name%>_<%=icon%> } from '<%=set%>'
    library.add(<%=name%>_<%=icon%>)
  <% }) %>
<% }) %>

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('<%=options.component%><%=options.suffix%>', FontAwesomeIcon)
  nuxtApp.vueApp.component('<%=options.component%>-layers', FontAwesomeLayers)
  nuxtApp.vueApp.component('<%=options.component%>-layers-text', FontAwesomeLayersText)
})
