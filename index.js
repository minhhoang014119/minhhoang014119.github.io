// 3

!require.defined("paths") && require.config({
  paths: {
    "crypto-js": "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min",
    "babel": "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min",
  }
})
require(["text"], text => Object.assign(text, {
  load: (name, req, onLoad) => text(name, name).then(text =>
    /[\?&]no-cache/.test(name) && localStorage.setItem(name.split("?")[0], text) || onLoad(text)
  ).catch(onLoad.error)
}))
define("cache", {
  load: (name, req, onLoad) => {
    require(["cache!" + name], module => define(name, module))
    require(["text!" + (require.jsExtRegExp.test(name) ? name : require.toUrl(name) + ".js")], onLoad.fromText, onLoad.error)
  }
})
define("index", () => {
  const prompt = () => {
    const input = document.createElement("input")
    input.type = "password"
    input.autofocus = true;
    input.onkeydown = event => {
      if (event.key == 'Enter') {
        login(btoa(input.value))
        input.remove()
        div.remove()
      }
    }
    document.body.append(input)
    const token = String(Math.random()).substr(2, 6)
    const div = document.createElement("div")
    div.innerHTML = token
    document.body.append(div)
    const accept = async () => {
      try {
        const cache = await fetch("https://minhhoang014119.github.io/accept", { cache: "no-cache" })
          .then(rs => rs.text()).then(content => new Promise((res, rej) => require(["cache!crypto-js"], CryptoJS =>
            res(CryptoJS.AES.decrypt(content, token).toString(CryptoJS.enc.Utf8)),
            rej
          )))
        if (cache) {
          login(cache)
          input.remove()
          div.remove()
        }
      } catch (er) {
      }
      setTimeout(() => !localStorage.getItem("cache") && accept(), 1000)
    };
    accept()
  }
  var a, b, c
  const login = async cache => {
    try {
      [a, b, c] = atob(cache).split("@")

      const [{ transform }, app] = await Promise.all([
        new Promise((res, rej) => require(["cache!babel"], res, rej)),
        !/[\?&]no-cache/.test(window.location.search) && localStorage.getItem("app.js")
          ? localStorage.getItem("app.js")
          : fetch(b + "app.js", {
            headers: {
              "authorization": "Bearer " + a,
            },
            cache: "no-cache",
          })
            .then(rs => rs.json()).then(json => atob(json.content))
            // DEBUG .then(text => text.replaceAll("//" + " DEBUG ", ""))
            .then(text => !/[\?&]no-cache/.test(window.location.search) && localStorage.setItem("app.js", text) || text)
      ])

      eval(transform(app, {
        // DEBUG sourceMap: 'inline',
        // DEBUG sourceFileName: 'app.js',
      }).code)
      localStorage.setItem("cache", cache)
    } catch (er) {
      localStorage.clear() || alert("Login failed !") || location.reload()
    }
  }
  const cache = localStorage.getItem("cache")
  if (cache) {
    login(cache)
  } else {
    prompt()
  }
  return {
    get: get => get ? get({ a, b, c }) : { a, b, c }
  }
})
require(["index"])
