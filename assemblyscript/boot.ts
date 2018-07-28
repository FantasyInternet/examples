// import memory allocator. Arena seems to be the only one that agrees with the Fantasy Internet API.
import "allocator/arena";

// import functions from the fantasy internet API, documented at https://fantasyinternet.github.io/api
declare namespace env {
  function pushFromMemory(offset: i32, length: i32): void;
  function setDisplayMode(mode: i32, width: i32, height: i32): void;
  function print(): void;
}

// strings will be stored as utf-16
let myStr: string = "Hello AssemblyScript!";

// This function will be exported and called at startup
export function init(): void {
  // Set the display to text mode. 22 columns, 1 line.
  env.setDisplayMode(0, 22, 1);
  // Convert utf-16 string to ascii
  let str8 = utf16toAscii(myStr);
  // Push the new string from memory to the buffer stack.
  env.pushFromMemory(<i32>str8 + 4, load<i32>(str8));
  // Pop the string off the buffer stack and print it.
  env.print();
}

// Native strings needs to be converted before they are passed to/from the API.
function utf16toAscii(str: string): usize {
  let out = memory.allocate(str.length + 4);
  //@ts-ignore
  let p16 = <i32>str;
  let p8 = <i32>out;
  store<i32>(p8, load<i32>(p16));
  p8 += 4; p16 += 4;
  for (let i = 0; i < str.length; i++) {
    store<i8>(p8, load<i16>(p16));
    p8 += 1; p16 += 2;
  }
  return out;
}
