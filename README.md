# licen

> Generate license files for your projects.

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/bubkoo/licen/blob/master/LICENSE)
 
[![NPM](https://nodei.co/npm/licen.png)](https://nodei.co/npm/licen/)


## Install

```
$ npm install licen -g
```

## Usage

```
$ licen [options]
```

The available options are:

```
  -g, --generate ................. Generate license/header.
  -s, --show ..................... Print license/header.
  -i, --introduce ................ Print license introduction.
  -H, --header ................... Generate/Print a license header.
  -l, --license ??? .............. Specify a license.
  -p, --path ??? ................. Specify the license file path.
  -n, --filename ??? ............. Specify the generated license file name.
  -f, --fullname ??? ............. Specify the owner's fullname.
  -e, --email ??? ................ Specify the email.
  -y, --year ??? ................. Specify the year.
  --list ......................... List available licenses.
  -o, --overwrite ................ Overwrite when a license file exist.
  -c, --config ................... Set the default value of variables.
  -V, --version .................. Print the current version.
  -h, --help ..................... You're looking at it.
  -h, --help [command] ........... Show details for the specified command.
```

Available licenses:

```
  apache-2.0     Apache License 2.0
  mit            MIT License
  gpl-3.0        GNU General Public License v3.0
  gpl-2.0        GNU General Public License v2.0
  agpl-3.0       GNU Affero General Public License v3.0
  artistic-2.0   Artistic License 2.0
  epl-1.0        Eclipse Public License 1.0
  isc            ISC License
  bsd-3-clause   BSD 3-clause “New” or “Revised” License
  bsd-2-clause   BSD 2-clause “Simplified” License
  lgpl-3.0       GNU Lesser General Public License v3.0
  lgpl-2.1       GNU Lesser General Public License v2.1
  mpl-2.0        Mozilla Public License 2.0
  cc0-1.0        Creative Commons Zero v1.0 Universal
  unlicense      The Unlicense
```

## Examples

```
  $ licen
  $ licen -gol mit -n LICENSE -f yourName
  $ licen --list
  $ licen --config key1=value1 [key2=value2 ...]
  $ licen --help config
  $ licen --help
  $ licen --version
```
