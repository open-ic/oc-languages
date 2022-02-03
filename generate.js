const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");
const en = JSON.parse(fs.readFileSync("./en.json"));
require("dotenv").config();

console.log(process.env.TRANSLATE_API_KEY);

const translate = new Translate({
  key: process.env.TRANSLATE_API_KEY,
});

const target = "de";

async function translateText() {
  const flat = flatten(en);
  const entries = Object.entries(flat);
  const size = 50;
  const chunks = [];

  for (let i = 0; i < entries.length; i += size) {
    chunks.push(entries.slice(i, i + size));
  }

  console.log(chunks.length);
  const translated = await Promise.all(
    chunks.map(async (chunk) => {
      const translatedChunk = await translateBatch(chunk.map(([, v]) => v));
      const translatedArr = translatedChunk.map((val, i) => {
        return [chunk[i][0], val];
      });
      return translatedArr.reduce((agg, [k, v]) => {
        agg[k] = v;
        return agg;
      }, {});
    })
  );

  const merged = translated.reduce((agg, chunk) => {
    return {
      ...agg,
      ...chunk,
    };
  }, {});

  return unflatten(merged);
}

async function translateBatch(values) {
  let [translations] = await translate.translate(values, target);
  return Array.isArray(translations) ? translations : [translations];
}

function unflatten(flat) {
  return Object.entries(flat).reduce((agg, [k, v]) => {
    const dot = k.indexOf(".");
    if (dot >= 0) {
      const prefix = k.slice(0, dot);
      const suffix = k.slice(dot + 1);
      if (agg[prefix] === undefined) {
        agg[prefix] = {};
      }
      agg[prefix][suffix] = v;
    } else {
      agg[k] = v;
    }
    return agg;
  }, {});
}

function flatten(map) {
  const flat = {};
  function traverse(map, flat, prefix) {
    Object.keys(map).forEach((k) => {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof map[k] === "string") {
        flat[key] = map[k];
      }
      if (typeof map[k] === "object") {
        traverse(map[k], flat, key);
      }
    });
  }
  traverse(map, flat);
  return flat;
}

translateText().then((translated) => {
  fs.writeFileSync(`./${target}.json`, JSON.stringify(translated, null, 2));
});
