# Working with two repos

With Enterprise, we'll have two repos in which to work from. At this moment, there's no git automation so pull requests and merging will work a little differently.

1. All development will take place in our Isobar (internal) repo, in this folder. Structure is the same as before.
2. You will still create a remote branch for the with the EHI Jira ticket ID in the Isobar repo.
3. Make sure you're running `grunt`, this will ensure that your files are copied into EHI repo.
4. Pull requests will be done in the Isobar repo, all feedback will be done here instead.
5. Once the code is approved, commit the changes in the EHI repo. Make sure you prefix with the Jira ticket ID.
6. You may push directly to master.


**Please keep in mind that we're working with two repos, each commit done in the EHI repo must relate to the specific ticket you're working on**
