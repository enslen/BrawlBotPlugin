# BrawlBotPlugin
Brawl Bot Plugin For PhantomBot

Full details can be found here: https://docs.google.com/document/d/1_TcrOPbq7NEApIGhb64KQHU9p8K70otC9PbxRB4hAOA/edit?usp=sharing

# NOTICE: 
BrawlAPI went down before the last game update (from SC on 12/19) and...it's back up as of 12/31! I wasn't sure what was going on but turns out BrawlAPI (the unofficial API) is actually acting more like a game client on the backend instead of querying from the official API (from SC). SC changed aspects of the authentication for the game which ultimately broke BrawlAPI. The BrawlAPI team needs to reverse engineer the authentication and they have yet to do that. As that method of access is still broken for BrawlAPI, the BrawlAPI team has switched the backend to use the official API. This doesn't affect this plugin in any way (from what I can tell) but it does affect some of the objects you can query with BrawlAPI; it also supposedly affects the speed as BrawlAPI was faster (from what I have read) than the official API.

Ideally this plugin will continue to use BrawlAPI over the official API. I find the BrawlAPI process for generating authentication tokens to be simpler and it does not require you provide the IP address (which adds extra steps and can be problematic if your IP changes). The official API requires the IP address when generating their authentication tokens. If BrawlAPI has more problems in the future, I will likely add official API support and build in a configuration option to use either the BrawlAPI or the official API.
