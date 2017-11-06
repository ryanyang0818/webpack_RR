async: false,
changeto
async: true,
===
line54
return g},$.i18n.normaliseLanguageCode=function(e){return(!e||e.length<2)&&(e=navigator.languages?navigator.languages[0]:navigator.language||navigator.userLanguage||"en"),e=e.toLowerCase(),e=e.replace(/-/,"_"),e.length>3&&(e=e.substring(0,3)+e.substring(3).toUpperCase()),e}
changeto
return g},$.i18n.normaliseLanguageCode=function(e){return(!e||e.length<2)&&(e=navigator.languages.length?navigator.languages[0]:navigator.language||navigator.userLanguage||"en"),e=e.toLowerCase(),e=e.replace(/-/,"_"),e.length>3&&(e=e.substring(0,3)+e.substring(3).toUpperCase()),e}
