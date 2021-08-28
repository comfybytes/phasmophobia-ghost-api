# Phasmophobia Ghost API
**Hosting for the API hasn't been figured out yet, so it's not in a completly usable state yet. Same for Readme**

A simple API to query Phasmophobia Ghosts and Evidence
Designed to be easily usable with the common chat bots in Twitch Chat

## Installation
You can add this to your stream by simply copy and pasting these commands to your chat

Command names can also be chosen freely

**Nightbot**
```
!commands add !ghost placeholder
```
```
!commands add !evidence placeholder
```
**Streamlabs**
```
!addcommand !ghost placeholder
```
```
!addcommand !evidence placeholder
```
**Streamelements**
```
!command add !ghost placeholder
```
```
!command add !evidence placeholder
```
## Usage
```
!evidence {evidence} {evidence} {evidence}
```
1 to 3 pieces of evidence need to be provided. Returns the possible Ghosts and the remaining co-responding evidence
```
!ghost {ghost type}
```
Returns the ghost type and it's three pieces of evidences

**Example**
```
!evidence finger dots
```
Returns `Possible Ghost(s): Banshee (Ghost Orb), Goryo (EMF Level 5), Phantom (Spirit Box)`

**Spelling**

* The text you provide must be unique enough so it isn't part of different evidence 
* Aliases for the evidence will be added in the future 
* You can check the spelling in [the Phasmophobia Wiki](https://phasmophobia.fandom.com/wiki/Evidence#Ghost_Evidence)
## Contact
* [witchdrop.dev@gmail.com](mailto:witchdrop.dev@gmail.com)
* [Twitter](https://twitter.com/witch_drop)
