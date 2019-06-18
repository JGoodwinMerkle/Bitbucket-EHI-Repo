#Mvt Template

##Using the template

Add the mvt executable file to your bin
Create a shortcut to the file

###Creating a new isoTest

Run `mvt [folderName] [options]`

You will be prompted to add a test name, which will be part of the file Name, account, and portfolio.

####Options
`-r` adds window hash change listener and function
`-j` adds jQuery dependency
`[number]` creates additional challenger files

##Automation with grunt
Test code clean-up and minification has been automated using grunt + strip_code + htmlmin. The files are watched for any changes to the file and will clean and minify on save.

###Install

###Using grunt watch
By default, the grunt task is watch, simply run `grunt` on the console.
