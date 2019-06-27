# Isobar MVT Tools

## Using the template
Copy the mvt executable file to your bin ~/bin

Add the path to your .bash_profile

```
PATH=$PATH:$HOME/bin
export PATH
```


### Creating a new isoTest
Run `mvt [folderName] [options]`

You will be prompted to add a test name, which will be part of the file Name, account, and portfolio.


#### Options
`-r` adds window hash change listener and function

`-j` adds jQuery dependency

`[number]` creates additional challenger files


## Automation with grunt
Test code clean-up and minification has been automated using grunt + strip_code + htmlmin. The files are watched for any changes to the file and will clean and minify on save.


### Install
Install node & npm, you can do a pkg install or use brew

Install grunt cli

`npm install -g grunt-cli`

Install all dependecies in the mvt-tools folder

`npm install`

### Update your source files path
Depending on how your files are organized you'll have to update the path of the files being watched in Gruntfile.js. **Do not commit this change**

```
watch: {
  files: ['/path/to/your/working/folder'],
  tasks: ['strip_code','htmlmin'],
  options: {
    event: ['changed'],
    spawn: false
  }
}
```

### Using grunt watch
By default, the grunt task is watch, simply run `grunt` on the console. This will run the tasks to remove debug code and minify the file whenever you save your file. It'll create a new folder under your test folder with the production-ready file(s).

### Running grunt from working directory
If you want to run the grunt tasks from a different folder, grunt gives you the option to run it from where your current path is at.

`grunt --base path/to/isobar-mvt/mvt-tools/`

You can always add this an an alias in your bash_profile, so you don't have to worry about the path anymore

`alias runGrunt="grunt --base $HOME/path/to/isobar-mvt/mvt-tools/"`
