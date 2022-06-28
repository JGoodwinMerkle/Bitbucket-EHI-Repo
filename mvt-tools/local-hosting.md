## Locally host experiments
The following gist explains how to setup local hosting from your Chrome browser.  

*NOTE: There will be a timing difference between locally hosted code and code added to Adobe Target.  If the code works locally but not within Target you'll probably need to wait for elements (using elementLoaded or a mutation observer) that you may not have needed to wait for locally.*

### Local host experiment setup

#### 1. Add the Tampermonkey chrome extension
https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en

#### 2. Allow file access
Go to chrome://extensions and click **details** on the TamperMonkey card. On the page that opens, allow it access to file URLs.
![dkHgL](https://user-images.githubusercontent.com/7544582/150803440-6d8c51ac-b060-40c7-9757-7e13209322ec.png)

#### 3. Click the Tampermonkey extension and "Create a new script"
<img width="253" alt="Screen Shot 2022-01-24 at 8 41 27 AM" src="https://user-images.githubusercontent.com/7544582/150803815-dc1cc58f-e318-4506-abdd-e25c634f8c53.png">

#### 4. Paste and save the [tampermonkey.js file](https://gist.github.com/chasemarlow/763bdadeeafa8882591235bfeffa5bc3#file-1-tampermonkey-js) (added below) into the UserScript.  Leave this page open so you can update your file directory.
<img width="1153" alt="Screen Shot 2022-01-24 at 8 44 03 AM" src="https://user-images.githubusercontent.com/7544582/150804311-65ef58f6-7705-452a-8cb4-ddb873325804.png">

#### 5. NOTE: THIS IS ON THE MASTER BRANCH NOW - however, if you're working on an older branch: Add the following line into your Gruntfile.js (avoid committing this and the auto-generated currentFile.html)

```grunt.config('copy.main.dest', 'currentFile.html');```

<img width="525" alt="Screen Shot 2022-01-24 at 8 47 07 AM" src="https://user-images.githubusercontent.com/7544582/150805073-4c227188-941d-4e2c-a9e7-d3ed02b7d03c.png">

#### 6. Re-run `grunt` in the mvt-tools directory and save any of your experiment files to generate a new "currentFile.html" file.  Note: You'll probably have to re-run grunt after creating a new experiment or swap between branches.

#### 7. Adjust the "@resource html" line in your Tampermonkey UserScript to point to your new currentFile.html file
```@resource html file:///Users/yourusername/isobar-mvt/mvt-tools/currentFile.html```

#### 8. Visit and refresh your experiment page to see your experiment changes locally
<img width="1340" alt="Screen Shot 2022-01-24 at 8 52 32 AM" src="https://user-images.githubusercontent.com/7544582/150805994-aa7a8142-51a0-41c6-9158-dbbd379c326f.png">

### Additional notes
- The red icon with a [1] indicates that a script is active and running.
- The code will try to run on any page that matches the TamperMonkey `@include` regex.  This may need to be adjusted in the future if you're developing on a page that doesn't match the regex below.  Alternatively, if the red icon has a number greater than 1 you may need to limit the regex to prevent the code from running multiple times.
- Clicking the chrome extension icon will allow you to disable the local hosting (which you'll want to do after opening an Adobe Target preview link).