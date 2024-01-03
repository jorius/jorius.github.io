(this["webpackJsonpjorius-dot-me"]=this["webpackJsonpjorius-dot-me"]||[]).push([[0],{11:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return l}));var n=a(57),o=a(73),i=a(74),r=a(49);const c={en_US:n.a.en_US,es_LA:n.a.es_LA};function s(e){const t=this;t.language=c[e],t.languageList=Object.keys(c).map((e=>({label:t.language.languages[e],languageCode:e})))}const l=(()=>{if(e.config)return e.config;const t=o.map((e=>({component:e.component,exact:null===e||void 0===e?void 0:e.exact,path:e.path})));const a=(e=>{let{github:t}=e;return{github:JSON.parse(JSON.stringify(t).replace(new RegExp("{root}","g"),"https://api.github.com"))}})({github:i}),n={applyLanguage:s,initialState:r,routes:t,services:a};return n.applyLanguage(n.initialState.settings.languageCode),e.config=n,n})()}).call(this,a(44))},123:function(e,t,a){},124:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),i=a(9),r=a.n(i),c=a(70),s=a.n(c),l=a(174),g=a(56),u=a(22),d=a(173),p=a(13),m=a(165),h=a(162);const b=Object(h.a)((()=>({background:{backgroundColor:"rgba(0, 0, 0, 0.4)",bottom:0,left:0,position:"fixed",right:0,top:0},centerPanel:{left:"50%",position:"fixed",textAlign:"center",top:"50%",transform:"translate(-50%, -50%)"}})));var j=a(4);var f=e=>{let{visible:t}=e;const a=b();return t?Object(j.jsxs)("div",{className:a.loadingPage,children:[Object(j.jsx)("div",{className:a.background}),Object(j.jsx)("div",{className:a.centerPanel,children:Object(j.jsx)(m.a,{color:"secondary",size:50})})]}):null},x=a(11),O=a(172),v=a(167),y=a(171),w=a(127),S=a(28),k=a.p+"static/media/avatar.24736147.jpg",C=a(168),P=a(169),F=a(170);const N=Object(h.a)((e=>({aboutMe:{},avatarContainer:{display:"flex",justifyContent:"center"},avatar:{borderRadius:4,height:200,width:200},aboutMeCard:{padding:15,backgroundColor:e.palette.custom.white.main,boxShadow:"2px 3px 4px 1px ".concat(e.palette.custom.blue.light),height:"100%",width:"100%"},title:{[e.breakpoints.up("lg")]:{fontSize:"2.125rem"},[e.breakpoints.down("md")]:{fontSize:"1.5rem"},[e.breakpoints.down("xs")]:{fontSize:"1.25rem"},"&>small":{color:e.palette.text.secondary,fontSize:"1rem"},fontWeight:"bold",marginBottom:25}})));var L=e=>{let{avatar:t,caption:a,description:n,name:o}=e;const i=N();return Object(j.jsx)(v.a,{container:!0,className:i.aboutMe,children:Object(j.jsx)(C.a,{className:i.aboutMeCard,children:Object(j.jsxs)(v.a,{alignContent:"space-between",alignItems:"center",container:!0,direction:"row",justify:"center",children:[Object(j.jsx)(v.a,{item:!0,lg:10,sm:9,xs:12,children:Object(j.jsxs)(P.a,{children:[Object(j.jsxs)(w.a,{className:i.title,children:[o,Object(j.jsx)("small",{children:a})]}),Object(j.jsx)(w.a,{color:"textPrimary",variant:"body1",children:n})]})}),Object(j.jsx)(v.a,{className:i.avatarContainer,item:!0,lg:2,sm:3,xs:12,children:Object(j.jsx)(F.a,{className:i.avatar,image:t,title:"avatar"})})]})})})};const _=Object(h.a)((e=>({description:{color:e.palette.custom.white.dark},githubRepo:{backgroundColor:e.palette.custom.black.dark,borderBottom:"1px solid ".concat(e.palette.custom.white.light),boxShadow:"2px 5px 10px 4px ".concat(e.palette.custom.black.dark),marginBottom:15},title:{color:e.palette.custom.blue.main,fontWeight:"bold"}}))),E=e=>{let{description:t,name:a,url:n}=e;const o=_();return Object(j.jsx)(C.a,{className:o.githubRepo,children:Object(j.jsxs)(P.a,{children:[Object(j.jsx)(w.a,{gutterBottom:!0,children:Object(j.jsx)(y.a,{className:o.title,href:n,children:a})}),Object(j.jsx)(w.a,{className:o.description,variant:"body1",children:t})]})})};E.defaultProps={description:""};var B=E;const M=e=>({[e.breakpoints.up("lg")]:{fontSize:"2.125rem"},[e.breakpoints.down("md")]:{fontSize:"1.5rem"},[e.breakpoints.down("xs")]:{fontSize:"1.25rem"}}),A=Object(h.a)((e=>({aboutMe:{marginBottom:25,marginTop:25},footer:{"&>p>a":{color:e.palette.custom.yellow.dark},color:e.palette.custom.yellow.main,marginTop:100,textAlign:"center"},githubTitle:{...M(e),marginBottom:25,marginTop:25},homePage:{[e.breakpoints.up("lg")]:{paddingLeft:"25%",paddingRight:"25%"},backgroundColor:e.palette.custom.black.dark,color:e.palette.custom.white.light,height:e=>"".concat(e.repos?"auto":"100vh"),padding:25,width:"100%"},homePageLanguages:{},homePageTitle:{...M(e)},languageButton:{textTransform:"none"}})));var T=()=>{const e=Object(u.b)(),{repos:t}=Object(u.c)((e=>e.github)),a=A({repos:Boolean(t.length)});return Object(n.useEffect)((()=>{e(Object(S.a)("jorius"))}),[]),Object(j.jsxs)(v.a,{className:a.homePage,container:!0,justify:"center",children:[Object(j.jsx)(w.a,{className:a.homePageTitle,children:x.a.language.homePage.title}),Object(j.jsxs)(v.a,{className:a.homePageLanguages,children:[Object(j.jsx)(O.a,{className:a.languageButton,color:"primary",onClick:()=>{e(Object(S.c)("es_LA"))},size:"small",children:x.a.language.languages.es_LA}),"|",Object(j.jsx)(O.a,{className:a.languageButton,color:"secondary",onClick:()=>{e(Object(S.c)("en_US"))},size:"small",children:x.a.language.languages.en_US})]}),Object(j.jsx)(v.a,{className:a.aboutMe,container:!0,direction:"column",children:Object(j.jsx)(L,{avatar:k,caption:x.a.language.aboutMe.caption,description:x.a.language.aboutMe.description,name:x.a.language.aboutMe.name})}),Object(j.jsx)(w.a,{className:a.githubTitle,children:t.length?x.a.language.homePage.githubTitle:null}),Object(j.jsx)(v.a,{children:t.length?t.map((e=>Object(j.jsx)(v.a,{item:!0,children:Object(j.jsx)(B,{...e})},e.id))):null}),Object(j.jsxs)(v.a,{className:a.footer,children:[Object(j.jsx)(w.a,{variant:"caption",children:x.a.language.common.footer}),Object(j.jsx)(w.a,{variant:"body2",children:Object(j.jsx)(y.a,{target:"_blank",href:"https://icons8.com/icons/set/pixel-cat",children:"Favicon Pixel Cat Icon by Icons8"})})]})]})};var I=()=>Object(j.jsx)(v.a,{alignContent:"center",alignItems:"center",container:!0,justify:"center",children:Object(j.jsx)(w.a,{variant:"h4",children:x.a.language.notFoundPage.title})}),z=a(176),J=a(175);const R=Object(h.a)((e=>({settingsPage:{backgroundColor:e.palette.custom.black.main,color:e.palette.custom.white.light,height:"100vh",paddingTop:25},textField:{marginTop:50,width:"100%"}})));const U={HomePage:T,NotFoundPage:I,SettingsPage:()=>{const e=R(),t=Object(u.b)(),a=Object(u.c)((e=>e.settings.languageCode));return Object(j.jsx)(v.a,{className:e.settingsPage,container:!0,justify:"center",children:Object(j.jsxs)(v.a,{item:!0,children:[Object(j.jsx)(w.a,{variant:"h4",children:x.a.language.settingsPage.title}),Object(j.jsx)(J.a,{className:e.textField,label:x.a.language.common.changeLanguage,onChange:e=>{let{target:{value:a}}=e;t(Object(S.c)(a))},placeholder:x.a.language.common.changeLanguage,select:!0,value:a,children:x.a.languageList.map((e=>Object(j.jsx)(z.a,{value:e.languageCode,children:e.label},e.languageCode)))})]})})}};var q=()=>{const{languageCode:e}=Object(u.c)((e=>e.settings)),{loading:t}=Object(u.c)((e=>e));x.a.applyLanguage(e);return Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)(f,{visible:t}),Object(j.jsx)(p.c,{children:x.a.routes.map(((e,t)=>{return Object(j.jsx)(p.a,{component:(a=e.component,U[a]),exact:e.exact,path:e.path},"".concat(e.path,"-").concat(t));var a}))})]})},D=a(78),G=a(80);const H={black:{dark:"#272727",light:"#59636A",main:"#414348"},blue:{dark:"#052F5F",light:"#4F9FFF",main:"#2088FF"},green:{},grey:{dark:"#8E8597",light:"#A4A5AE",main:"#9895A3"},orange:{dark:"#C45B00",light:"#FF8E5C",main:"#EC7C23"},red:{dark:"#840003",light:"#D79087",main:"#cb3837"},yellow:{dark:"#E7BB51",light:"#FFEECA",main:"#FFD166"},white:{dark:"#B1BDC5",light:"#FFFFFF",main:"#DADDE2"}},W=Object(G.a)({overrides:{MuiFormLabel:{root:{"&.Mui-focused":{color:H.white.light}}},MuiInput:{underline:{"&:after":{borderBottom:"2px solid ".concat(H.white.light)},"&.MuiInput-underline:hover:not(.Mui-disabled):before":{borderBottom:"2px solid ".concat(H.white.dark)},borderBottom:"1px solid ".concat(H.white.dark)}},MuiInputLabel:{formControl:{color:H.white.light}},MuiSelect:{icon:{color:H.white.dark},root:{color:H.white.light}}},palette:{custom:{...H},primary:{...H.blue},secondary:{...H.yellow}},typography:{fontFamily:["Oxygen Mono","monospace"].join(",")}});var V=()=>Object(j.jsx)(u.a,{store:D.a,children:Object(j.jsxs)(d.a,{theme:W,children:[Object(j.jsx)(l.a,{}),Object(j.jsx)(g.a,{children:Object(j.jsx)(q,{})})]})});a(123);s.a.config(),r.a.render(Object(j.jsx)(o.a.StrictMode,{children:Object(j.jsx)(V,{})}),document.getElementById("root"))},19:function(e,t,a){"use strict";a.d(t,"a",(function(){return r})),a.d(t,"d",(function(){return c})),a.d(t,"c",(function(){return s})),a.d(t,"f",(function(){return l})),a.d(t,"b",(function(){return g})),a.d(t,"e",(function(){return u}));var n=a(35),o=a.n(n),i=a(11);const r="GET_GITHUB_USER_REPOS",c=e=>t=>o.a.get(function(e){let t=e;for(var a=arguments.length,n=new Array(a>1?a-1:0),o=1;o<a;o++)n[o-1]=arguments[o];return n.forEach(((e,a)=>{for(;t.indexOf("{".concat(a,"}"))>=0;)t=t.replace("{".concat(a,"}"),e)})),t}(i.a.services.github.repos,e)).then((e=>{const a=e.map((async e=>{let t=await o.a.get(e.languages_url);return t=Object.keys(t).map((e=>e)),{defaultBranch:e.defaultBranch,description:e.description,id:e.id,language:e.language,languages:t,name:e.name,url:e.html_url}}));Promise.all(a).then((e=>t({payload:{repos:e},type:r})))})).catch(Promise.reject),s="TOGGLE_LOADING_PAGE_VISIBILITY",l=e=>({type:s,payload:e}),g="SET_LANGUAGE_CODE",u=e=>({payload:{languageCode:e},type:g})},28:function(e,t,a){"use strict";a.d(t,"a",(function(){return n.d})),a.d(t,"c",(function(){return n.e})),a.d(t,"b",(function(){return m}));var n=a(19),o=a(77),i=a(75),r=a(76),c=a(23),s=a(11);const l=Object(c.combineReducers)({repos:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.a.initialState.github.repos,t=arguments.length>1?arguments[1]:void 0;return t.type===n.a?t.payload.repos.sort(((e,t)=>e.name-t.name)):e}}),g=Object(c.combineReducers)({languageCode:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.a.initialState.settings.languageCode,t=arguments.length>1?arguments[1]:void 0;return t.type===n.b?t.payload.languageCode:e}}),u=Object(c.combineReducers)({github:l,loading:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s.a.initialState.loading,t=arguments.length>1?arguments[1]:void 0;return t.type===n.c?t.payload:e},settings:g}),d=(e,t)=>u(e,t);var p=a(49);var m=(()=>{const e=[Object(r.createLogger)(),o.a],t=p;return Object(c.createStore)(d,t,Object(i.composeWithDevTools)(Object(c.applyMiddleware)(...e)))})()},49:function(e){e.exports=JSON.parse('{"github":{"repos":[]},"loading":{"visible":false},"settings":{"languageCode":"en_US"}}')},57:function(e,t,a){"use strict";var n=a(71),o=a(72);t.a={en_US:n,es_LA:o}},71:function(e){e.exports=JSON.parse('{"aboutMe":{"caption":"(and my cat Mantequillo).","description":"I am a software developer with a little more than 5 years of experience wanting to continue learning a little bit of everything every day and wanting to continue specializing in the expertise that I already have, in one way or another, like everyone else on the planet, wanting to change the world, I made this page as the beginning of a portfolio where to upload, show and share small projects and other useful content for any type of programmer.","name":"Hi, I am Jose R\xedos C, "},"common":{"changeLanguage":"Change language","footer":"This page is still under construction, wait for some major upgrades and new content soon!"},"homePage":{"githubTitle":"Some of my repositories","title":"Welcome to Jorius dot me, "},"languages":{"en_US":"English","es_LA":"Spanish"},"notFoundPage":{"title":"Error 404, Page not found."},"settingsPage":{"title":"Change it some stuff"}}')},72:function(e){e.exports=JSON.parse('{"aboutMe":{"caption":"(y mi gato Mantequillo).","description":"Soy un desarrollador de software con un poco m\xe1s de 5 a\xf1os de experiencia queriendo seguir aprendiendo d\xeda a d\xeda de todo un poco y queriendo seguir especializandome en las experticias que ya poseo, de una u otra manera, como todos en el planeta, queriendo cambiar el mundo, hice esta p\xe1gina como el inicio de un portafolio donde subir, mostrar y compartir peque\xf1os proyectos y otro contenido \xfatil para cualquier tipo de programador.","name":"Hola, soy Jose R\xedos C, "},"common":{"changeLanguage":"Cambiar idioma","footer":"Esta p\xe1gina todav\xeda est\xe1 bajo desarrollo y construcci\xf3n, por favor espere por actualizaciones grandes y nuevo contenido!"},"homePage":{"githubTitle":"Algunos de mis repositorios","title":"Bienvenido a Jorius dot me, "},"languages":{"en_US":"Ingl\xe9s","es_LA":"Espa\xf1ol"},"notFoundPage":{"title":"Error 404, P\xe1gina no encontrada."},"settingsPage":{"title":"Cambia algunas cosas"}}')},73:function(e){e.exports=JSON.parse('[{"component":"HomePage","name":"homePage","path":"/"},{"component":"NotFoundPage","name":"notFoundPage","path":"*"},{"component":"SettingsPage","name":"settingsPage","path":"/settings"}]')},74:function(e){e.exports=JSON.parse('{"repos":"{root}/users/{0}/repos"}')},78:function(e,t,a){"use strict";(function(e){a.d(t,"a",(function(){return i}));var n=a(79),o=a(28);const{store:i}=(()=>{if(e.core)return e.core;const t={store:o.b};return Object(n.a)({store:t.store}),e.core=t,e.core})()}).call(this,a(44))},79:function(e,t,a){"use strict";a.d(t,"a",(function(){return c}));var n=a(35),o=a.n(n),i=a(19);const r=e=>{let{show:t,store:a}=e;a.dispatch(Object(i.f)(!1)),!a.getState().loading.visible&&t&&a.dispatch(Object(i.f)(!0)),a.getState().loading.visible&&!t&&a.dispatch(Object(i.f)(!1))},c=e=>{let{store:t}=e;(e=>{let{store:t}=e;o.a.interceptors.request.use((e=>(r({show:!0,store:t}),e)),(e=>Promise.reject(e)))})({store:t}),(e=>{let{store:t}=e;o.a.interceptors.response.use((e=>(r({show:!1,store:t}),e.data)),(e=>(r({show:!1,store:t}),Promise.reject(e))))})({store:t})}}},[[124,1,2]]]);
//# sourceMappingURL=main.55daec1e.chunk.js.map