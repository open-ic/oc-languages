// this is a little script to help us find keys that are defined in the master English resource file but not defined in the language variants

const en = require("./en.json");
const cn = require("./cn.json");
const es = require("./es.json");
const it = require("./it.json");
const jp = require("./jp.json");
const vi = require("./vi.json");
const ru = require("./ru.json");
const de = require("./de.json");
const fr = require("./fr.json");

function allKeys(map) {
  const keys = new Set();
  function traverse(map, keys, prefix) {
    Object.keys(map).forEach((k) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof map[k] === "string") {
        keys.add(key);
      }
      if (typeof map[k] === "object") {
        traverse(map[k], keys, key);
      }
    });
  }
  traverse(map, keys);
  return keys;
}

function missing(master, variant) {
  const keys = new Set();
  for (const k of master) {
    if (!variant.has(k)) {
      keys.add(k);
    }
  }
  return keys;
}

const enKeys = allKeys(en);
const cnKeys = allKeys(cn);
const esKeys = allKeys(es);
const itKeys = allKeys(it);
const jpKeys = allKeys(jp);
const viKeys = allKeys(vi);
const ruKeys = allKeys(ru);
const frKeys = allKeys(fr);
const deKeys = allKeys(de);

console.log("Missing chinese keys: ", missing(enKeys, cnKeys));
console.log("Missing spanish keys: ", missing(enKeys, esKeys));
console.log("Missing italian keys: ", missing(enKeys, itKeys));
console.log("Missing japanese keys: ", missing(enKeys, jpKeys));
console.log("Missing vietnamese keys: ", missing(enKeys, viKeys));
console.log("Missing russian keys: ", missing(enKeys, ruKeys));
console.log("Missing french keys: ", missing(enKeys, frKeys));
console.log("Missing german keys: ", missing(enKeys, deKeys));
