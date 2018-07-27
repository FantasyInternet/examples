(module
  ;; import functions from the fantasy internet API, documented at https://fantasyinternet.github.io/api
  (import "env" "setDisplayMode" (func $setDisplayMode (param $mode i32) (param $width i32) (param $height i32)))
  (import "env" "pushFromMemory" (func $pushFromMemory (param $offset i32) (param $length i32)))
  (import "env" "print" (func $print ))

  ;; Setup memory.
  (memory $memory 1) ;; 1 page = 64KiB. 
    (data (i32.const 0) "Hello world!") ;; Put "Hello world!" at the beginning of memory.
    (export "memory" (memory $memory)) ;; Export memory so that the terminal can access it when we push stuff.

  ;; This function will be called at startup
  (func $init
    ;; Set the display to text mode. 13 columns, 1 line.
    (call $setDisplayMode (i32.const 0) (i32.const 13) (i32.const 1))
    ;; Push the first 12 bytes (the length of "Hello world!") from memory to the buffer stack.
    (call $pushFromMemory (i32.const 0) (i32.const 12))
    ;; Pop the string off the buffer stack and print it.
    (call $print)
  )
  ;; Export the init function so that the terminal can call it.
  (export "init" (func $init))
)