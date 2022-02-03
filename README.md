# oc-languages

This repo is intended to allow the collaborative translation of [OpenChat](https://oc.app) into other languages.

If you can provide translations into a language that is not already covered and would like to help then please do the following:

- fork this repo
- create a copy of the en.json file with a name corresponding to the language you are implementing e.g. fr.json for French
- for language variations you can use the full four character code e.g. fr-ca.json for Canadian French.
- fill in the values for all of the keys defined in the file (replacing the copied English values).
- create a PR back to this repo

## Keeping things up to date

For the time being I will try to keep the en.json file in line with the OpenChat original. There is a script in the repo that can be used to find any keys that are defined in the English master file but not defined in any of the language variants.

To run this script just run `npm run missing` from the command line at the root of the repo.
