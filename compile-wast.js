const
  wabt = require("wabt"),
  waquire = require("waquire"),
  fs = require("fs")

let
  srcDir = "./wast/",
  buildDir = "./build/"

function init() {
  let files = fs.readdirSync(srcDir)
  mkDirP(buildDir)
  files.forEach((filename) => {
    if (filename.substr(-5) === ".wast")
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
  let bundle = waquire("./" + srcDir + filename)
  fs.writeFileSync(buildDir + filename.replace(".wast", ".wasm"), new Uint8Array(wabt.parseWat(filename, bundle).toBinary({ write_debug_names: true }).buffer))
  console.log("oK")
}

init()
