const
  walt = require("walt-compiler").default,
  fs = require("fs")

let
  srcDir = "./walt/",
  buildDir = "./build/"

function init() {
  let files = fs.readdirSync(srcDir)
  mkDirP(buildDir)
  files.forEach((filename) => {
    if (filename.substr(-5) === ".walt")
      compile(filename)
  })
}

function mkDirP(path) {
  try {
    fs.mkdirSync(path)
  } catch (error) {
    if (error.code === "ENOENT") {
      mkDirP(path.substr(0, path.lastIndexOf("/")))
      mkDirP(path)
    } else if (error.code === "EEXIST") {
    } else {
      console.error(error)
    }
  }
}

function compile(filename) {
  console.log("Compiling ", filename, "...")

  let srcCode = "" + fs.readFileSync(srcDir + filename)
  let binary = walt(srcCode)
  fs.writeFileSync(buildDir + filename.replace(".walt", ".wasm"), new Uint8Array(binary))

  console.log("oK")
}

init()
