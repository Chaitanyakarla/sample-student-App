## Testing on Deploy
- Install `ttab` if you don't have it already
    - via `homebrew`
    ```
    curl -LO https://raw.githubusercontent.com/mklement0/ttab/master/ttab.rb && HOMEBREW_NO_AUTO_UPDATE=1 brew install --formula ttab.rb && rm ttab.rb
    ```
    - or `npm`
    ```
    npm install -g ttab
    ```

- run *sam-deploy*
    ```
    npm run sam-deploy
    ```
    which will run the script via `presam-deploy`
    ```
    ttab -d ./ sam local start-api -n sam-apps/api/env.sample.json && sleep 3 && npm run test
    ```
    which opens a new terminal window and runs the local api, and then tests the endpoints, giving you a visual representation of any failing endpoints before you deploy.

## Testing Locally:
1) Open a terminal window and navigate to the api subfolder\
*this can also be done via `ttab` if you have it installed, refer to the section above for the command*
```
/studentapp-middleware
    /sam-apps
        /api
```
2) Run the commmand `sam build && sam local start-api -n env.sample.json`
to initiate the API
3) Open a new terminal window in the root directory
```
/studentapp-middleware
```
4) Run the tests view npm: `npm run test` which uses `mocha` and `chai-http` to make the request to our api with the test data.

## Demoability
Demoing this without it taking too long\
Considering setting up a gif recorder and speeding up the frames, this should cut a 5 minute process into 30s or so.
- I've used ScreenToGif before, investigating whether it works on macOS
- Found the native app on macOS to capture the screen, going to use that.